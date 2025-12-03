import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import Stripe from 'stripe';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private stripe: Stripe;
  private readonly proPlanPriceId: string;
  private readonly webhookSecret: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private subscriptionsService: SubscriptionsService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia',
    });

    // Get Stripe price ID for PRO plan ($29/month)
    this.proPlanPriceId = this.configService.get<string>('STRIPE_PRO_PLAN_PRICE_ID') || '';
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';

    this.logger.log('Stripe initialized successfully');
  }

  /**
   * Create or retrieve Stripe customer for a user
   */
  async getOrCreateCustomer(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If customer already exists, return it
    if (user.subscription?.stripeCustomerId) {
      return user.subscription.stripeCustomerId;
    }

    // Create new Stripe customer
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: {
        userId: user.id,
      },
    });

    // Update subscription with Stripe customer ID
    await this.prisma.subscription.update({
      where: { userId },
      data: {
        stripeCustomerId: customer.id,
      },
    });

    this.logger.log(`Created Stripe customer ${customer.id} for user ${userId}`);
    return customer.id;
  }

  /**
   * Create checkout session for upgrading to PRO plan
   */
  async createCheckoutSession(userId: string, successUrl: string, cancelUrl: string) {
    const customerId = await this.getOrCreateCustomer(userId);

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: this.proPlanPriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
    });

    this.logger.log(`Created checkout session ${session.id} for user ${userId}`);
    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  /**
   * Create customer portal session for managing subscription
   */
  async createPortalSession(userId: string, returnUrl: string) {
    const customerId = await this.getOrCreateCustomer(userId);

    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    this.logger.log(`Created portal session for user ${userId}`);
    return {
      url: session.url,
    };
  }

  /**
   * Purchase additional credits (one-time payment)
   */
  async createCreditsPurchaseSession(
    userId: string,
    credits: number,
    successUrl: string,
    cancelUrl: string,
  ) {
    if (credits <= 0) {
      throw new BadRequestException('Credits must be a positive number');
    }

    const customerId = await this.getOrCreateCustomer(userId);

    // Calculate price: $1 per credit
    const priceInCents = credits * 100;

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${credits} Additional Valuation Credits`,
              description: 'One-time purchase of additional property valuation credits',
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        credits: credits.toString(),
        type: 'credits_purchase',
      },
    });

    this.logger.log(`Created credits purchase session ${session.id} for ${credits} credits`);
    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription?.stripeSubscriptionId) {
      throw new BadRequestException('No active Stripe subscription found');
    }

    // Cancel at period end
    const stripeSubscription = await this.stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      },
    );

    // Update local subscription status
    await this.subscriptionsService.cancelSubscription(userId);

    this.logger.log(`Canceled subscription ${stripeSubscription.id} for user ${userId}`);
    return {
      message: 'Subscription will be canceled at the end of the billing period',
      cancelAt: new Date(stripeSubscription.cancel_at! * 1000),
    };
  }

  /**
   * Reactivate subscription
   */
  async reactivateSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription?.stripeSubscriptionId) {
      throw new BadRequestException('No Stripe subscription found');
    }

    // Remove cancellation
    const stripeSubscription = await this.stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: false,
      },
    );

    // Update local subscription status
    await this.subscriptionsService.reactivateSubscription(
      userId,
      stripeSubscription.id,
    );

    this.logger.log(`Reactivated subscription ${stripeSubscription.id} for user ${userId}`);
    return {
      message: 'Subscription reactivated successfully',
    };
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(signature: string, payload: Buffer) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret,
      );
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException('Invalid signature');
    }

    this.logger.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  /**
   * Handle checkout session completed
   */
  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    if (!userId) {
      this.logger.error('No userId in checkout session metadata');
      return;
    }

    // Check if this is a credits purchase
    if (session.metadata?.type === 'credits_purchase') {
      const credits = parseInt(session.metadata.credits || '0');
      if (credits > 0) {
        await this.subscriptionsService.purchaseAdditionalCredits(
          userId,
          credits,
          session.payment_intent as string,
        );
        this.logger.log(`Added ${credits} credits to user ${userId}`);
      }
      return;
    }

    // Handle subscription checkout
    if (session.subscription) {
      const subscription = await this.stripe.subscriptions.retrieve(
        session.subscription as string,
      );
      await this.handleSubscriptionUpdated(subscription);
    }
  }

  /**
   * Handle subscription created/updated
   */
  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const customer = await this.stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      this.logger.error(`Customer ${customerId} is deleted`);
      return;
    }

    const userId = customer.metadata?.userId;
    if (!userId) {
      this.logger.error('No userId in customer metadata');
      return;
    }

    // Determine status
    let status: SubscriptionStatus;
    switch (subscription.status) {
      case 'active':
        status = SubscriptionStatus.ACTIVE;
        break;
      case 'past_due':
        status = SubscriptionStatus.PAST_DUE;
        break;
      case 'canceled':
      case 'unpaid':
        status = SubscriptionStatus.CANCELED;
        break;
      default:
        status = SubscriptionStatus.ACTIVE;
    }

    // Update subscription
    if (subscription.status === 'active') {
      await this.subscriptionsService.upgradeToPro(userId, subscription.id);
    } else {
      await this.subscriptionsService.updateSubscriptionStatus(
        userId,
        status,
        subscription.id,
      );
    }

    this.logger.log(`Updated subscription for user ${userId} to status ${status}`);
  }

  /**
   * Handle subscription deleted
   */
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const customer = await this.stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      this.logger.error(`Customer ${customerId} is deleted`);
      return;
    }

    const userId = customer.metadata?.userId;
    if (!userId) {
      this.logger.error('No userId in customer metadata');
      return;
    }

    // Downgrade to free plan
    await this.subscriptionsService.downgradeToFree(userId);
    this.logger.log(`Downgraded user ${userId} to FREE plan`);
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;
    const customer = await this.stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      this.logger.error(`Customer ${customerId} is deleted`);
      return;
    }

    const userId = customer.metadata?.userId;
    if (!userId) {
      this.logger.error('No userId in customer metadata');
      return;
    }

    // Log successful payment in audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'PAYMENT_SUCCESS',
        entityType: 'Subscription',
        entityId: invoice.subscription as string || '',
        metadata: {
          invoiceId: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
        },
      },
    });

    this.logger.log(`Payment succeeded for user ${userId}: ${invoice.amount_paid / 100} ${invoice.currency}`);
  }

  /**
   * Handle failed payment
   */
  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;
    const customer = await this.stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      this.logger.error(`Customer ${customerId} is deleted`);
      return;
    }

    const userId = customer.metadata?.userId;
    if (!userId) {
      this.logger.error('No userId in customer metadata');
      return;
    }

    // Update subscription status to PAST_DUE
    if (invoice.subscription) {
      await this.subscriptionsService.updateSubscriptionStatus(
        userId,
        SubscriptionStatus.PAST_DUE,
        invoice.subscription as string,
      );
    }

    // Log failed payment
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'PAYMENT_FAILED',
        entityType: 'Subscription',
        entityId: invoice.subscription as string || '',
        metadata: {
          invoiceId: invoice.id,
          amount: invoice.amount_due,
          currency: invoice.currency,
        },
      },
    });

    this.logger.warn(`Payment failed for user ${userId}: ${invoice.amount_due / 100} ${invoice.currency}`);
  }

  /**
   * Get invoices for a user
   */
  async getInvoices(userId: string, limit = 10) {
    const customerId = await this.getOrCreateCustomer(userId);

    const invoices = await this.stripe.invoices.list({
      customer: customerId,
      limit,
    });

    return invoices.data.map((invoice) => ({
      id: invoice.id,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      status: invoice.status,
      date: new Date(invoice.created * 1000),
      pdfUrl: invoice.invoice_pdf,
      hostedUrl: invoice.hosted_invoice_url,
    }));
  }
}
