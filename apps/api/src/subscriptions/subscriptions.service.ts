import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get subscription details for a user
   */
  async getSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Calculate available credits
    const totalCredits =
      subscription.monthlyCredits + subscription.additionalCredits;
    const availableCredits = totalCredits - subscription.usedCredits;

    return {
      ...subscription,
      totalCredits,
      availableCredits,
    };
  }

  /**
   * Upgrade user plan from FREE to PRO
   */
  async upgradeToPro(userId: string, stripeSubscriptionId?: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.plan === SubscriptionPlan.PRO) {
      throw new BadRequestException('User is already on PRO plan');
    }

    // Update subscription to PRO
    const updated = await this.prisma.subscription.update({
      where: { userId },
      data: {
        plan: SubscriptionPlan.PRO,
        status: SubscriptionStatus.ACTIVE,
        monthlyCredits: 100,
        usedCredits: 0, // Reset credits on upgrade
        billingAnchorDate: new Date(),
        lastResetDate: new Date(),
        stripeSubscriptionId,
      },
    });

    return updated;
  }

  /**
   * Downgrade user plan from PRO to FREE
   */
  async downgradeToFree(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.plan === SubscriptionPlan.FREE) {
      throw new BadRequestException('User is already on FREE plan');
    }

    // Update subscription to FREE
    const updated = await this.prisma.subscription.update({
      where: { userId },
      data: {
        plan: SubscriptionPlan.FREE,
        status: SubscriptionStatus.ACTIVE,
        monthlyCredits: 5,
        usedCredits: 0, // Reset credits on downgrade
        additionalCredits: 0, // Clear additional credits
        billingAnchorDate: new Date(),
        lastResetDate: new Date(),
        stripeSubscriptionId: null,
      },
    });

    return updated;
  }

  /**
   * Purchase additional credits (one-time)
   */
  async purchaseAdditionalCredits(
    userId: string,
    credits: number,
    stripePaymentIntentId?: string,
  ) {
    if (credits <= 0) {
      throw new BadRequestException('Credits must be a positive number');
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Add to additional credits
    const updated = await this.prisma.subscription.update({
      where: { userId },
      data: {
        additionalCredits: subscription.additionalCredits + credits,
      },
    });

    // Log the purchase in audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'CREDIT_PURCHASE',
        entityType: 'Subscription',
        entityId: subscription.id,
        metadata: {
          credits,
          stripePaymentIntentId,
          totalAdditionalCredits: updated.additionalCredits,
        },
      },
    });

    return updated;
  }

  /**
   * Reset monthly credits on billing anniversary
   * This is called by a cron job and when manually triggered
   */
  async resetMonthlyCredits(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Only reset if status is ACTIVE
    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new ForbiddenException('Subscription is not active');
    }

    // Calculate next reset date (1 month from billing anchor)
    const billingAnchor = subscription.billingAnchorDate || new Date();
    const today = new Date();
    const dayOfMonth = billingAnchor.getDate();

    // Check if we're past the billing day this month
    const shouldReset =
      today.getDate() >= dayOfMonth &&
      (!subscription.lastResetDate ||
        subscription.lastResetDate.getMonth() !== today.getMonth() ||
        subscription.lastResetDate.getFullYear() !== today.getFullYear());

    if (!shouldReset) {
      return subscription; // Already reset this month
    }

    // Reset used credits to 0
    const updated = await this.prisma.subscription.update({
      where: { userId },
      data: {
        usedCredits: 0,
        lastResetDate: new Date(),
      },
    });

    // Log the reset
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'CREDIT_RESET',
        entityType: 'Subscription',
        entityId: subscription.id,
        metadata: {
          plan: subscription.plan,
          monthlyCredits: subscription.monthlyCredits,
          additionalCredits: subscription.additionalCredits,
        },
      },
    });

    return updated;
  }

  /**
   * Cron job to reset credits for all active subscriptions
   * Runs daily at 2 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async resetAllMonthlyCredits() {
    console.log('Running monthly credit reset cron job...');

    // Get all active subscriptions
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
      },
    });

    let resetCount = 0;

    for (const subscription of subscriptions) {
      try {
        const billingAnchor = subscription.billingAnchorDate || new Date();
        const today = new Date();
        const dayOfMonth = billingAnchor.getDate();

        // Check if we should reset this subscription
        const shouldReset =
          today.getDate() >= dayOfMonth &&
          (!subscription.lastResetDate ||
            subscription.lastResetDate.getMonth() !== today.getMonth() ||
            subscription.lastResetDate.getFullYear() !== today.getFullYear());

        if (shouldReset) {
          await this.resetMonthlyCredits(subscription.userId);
          resetCount++;
        }
      } catch (error) {
        console.error(
          `Failed to reset credits for user ${subscription.userId}:`,
          error,
        );
      }
    }

    console.log(`Credit reset complete. Reset ${resetCount} subscriptions.`);
  }

  /**
   * Update subscription status (for Stripe webhooks)
   */
  async updateSubscriptionStatus(
    userId: string,
    status: SubscriptionStatus,
    stripeSubscriptionId?: string,
  ) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const updated = await this.prisma.subscription.update({
      where: { userId },
      data: {
        status,
        stripeSubscriptionId,
      },
    });

    // Log status change
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'SUBSCRIPTION_STATUS_CHANGE',
        entityType: 'Subscription',
        entityId: subscription.id,
        metadata: {
          previousStatus: subscription.status,
          newStatus: status,
          stripeSubscriptionId,
        },
      },
    });

    return updated;
  }

  /**
   * Cancel subscription (sets to CANCELED, effective at period end)
   */
  async cancelSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.plan === SubscriptionPlan.FREE) {
      throw new BadRequestException('Cannot cancel FREE plan');
    }

    // Update status to CANCELED
    const updated = await this.prisma.subscription.update({
      where: { userId },
      data: {
        status: SubscriptionStatus.CANCELED,
      },
    });

    // Log cancellation
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'SUBSCRIPTION_CANCELED',
        entityType: 'Subscription',
        entityId: subscription.id,
        metadata: {
          plan: subscription.plan,
          canceledAt: new Date(),
        },
      },
    });

    return updated;
  }

  /**
   * Reactivate a canceled subscription
   */
  async reactivateSubscription(userId: string, stripeSubscriptionId?: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status !== SubscriptionStatus.CANCELED) {
      throw new BadRequestException('Subscription is not canceled');
    }

    // Reactivate subscription
    const updated = await this.prisma.subscription.update({
      where: { userId },
      data: {
        status: SubscriptionStatus.ACTIVE,
        stripeSubscriptionId,
      },
    });

    // Log reactivation
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'SUBSCRIPTION_REACTIVATED',
        entityType: 'Subscription',
        entityId: subscription.id,
        metadata: {
          plan: subscription.plan,
          reactivatedAt: new Date(),
        },
      },
    });

    return updated;
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Get valuation count for current billing period
    const billingAnchor = subscription.billingAnchorDate || new Date();
    const startOfPeriod = new Date(
      billingAnchor.getFullYear(),
      billingAnchor.getMonth(),
      billingAnchor.getDate(),
    );

    // If last reset was this month, use that date
    if (subscription.lastResetDate) {
      const lastReset = new Date(subscription.lastResetDate);
      if (
        lastReset.getMonth() === new Date().getMonth() &&
        lastReset.getFullYear() === new Date().getFullYear()
      ) {
        startOfPeriod.setTime(lastReset.getTime());
      }
    }

    const valuationsThisPeriod = await this.prisma.valuation.count({
      where: {
        userId,
        createdAt: {
          gte: startOfPeriod,
        },
      },
    });

    const totalCredits =
      subscription.monthlyCredits + subscription.additionalCredits;
    const availableCredits = totalCredits - subscription.usedCredits;
    const usagePercentage = (subscription.usedCredits / totalCredits) * 100;

    // Calculate days until next reset
    const today = new Date();
    const nextReset = new Date(billingAnchor);
    nextReset.setMonth(today.getMonth() + 1);
    const daysUntilReset = Math.ceil(
      (nextReset.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    return {
      plan: subscription.plan,
      status: subscription.status,
      monthlyCredits: subscription.monthlyCredits,
      additionalCredits: subscription.additionalCredits,
      usedCredits: subscription.usedCredits,
      totalCredits,
      availableCredits,
      usagePercentage: Math.round(usagePercentage),
      valuationsThisPeriod,
      billingAnchorDate: subscription.billingAnchorDate,
      lastResetDate: subscription.lastResetDate,
      daysUntilReset,
    };
  }
}
