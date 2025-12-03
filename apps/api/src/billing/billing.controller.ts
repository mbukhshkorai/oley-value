import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Headers,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CreatePortalSessionDto } from './dto/create-portal-session.dto';
import { PurchaseCreditsCheckoutDto } from './dto/purchase-credits-checkout.dto';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create checkout session for PRO plan upgrade' })
  @ApiResponse({ status: 200, description: 'Returns checkout session URL' })
  async createCheckoutSession(
    @Request() req,
    @Body() dto: CreateCheckoutSessionDto,
  ) {
    return this.billingService.createCheckoutSession(
      req.user.userId,
      dto.successUrl,
      dto.cancelUrl,
    );
  }

  @Post('portal')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create customer portal session for managing subscription' })
  @ApiResponse({ status: 200, description: 'Returns portal session URL' })
  async createPortalSession(
    @Request() req,
    @Body() dto: CreatePortalSessionDto,
  ) {
    return this.billingService.createPortalSession(
      req.user.userId,
      dto.returnUrl,
    );
  }

  @Post('credits/checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create checkout session for purchasing credits' })
  @ApiResponse({ status: 200, description: 'Returns checkout session URL' })
  async purchaseCredits(
    @Request() req,
    @Body() dto: PurchaseCreditsCheckoutDto,
  ) {
    return this.billingService.createCreditsPurchaseSession(
      req.user.userId,
      dto.credits,
      dto.successUrl,
      dto.cancelUrl,
    );
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel subscription (effective at period end)' })
  @ApiResponse({ status: 200, description: 'Subscription canceled' })
  async cancelSubscription(@Request() req) {
    return this.billingService.cancelSubscription(req.user.userId);
  }

  @Post('reactivate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reactivate canceled subscription' })
  @ApiResponse({ status: 200, description: 'Subscription reactivated' })
  async reactivateSubscription(@Request() req) {
    return this.billingService.reactivateSubscription(req.user.userId);
  }

  @Get('invoices')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get invoice history' })
  @ApiResponse({ status: 200, description: 'Returns list of invoices' })
  async getInvoices(@Request() req) {
    return this.billingService.getInvoices(req.user.userId);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    // Access raw body for signature verification
    const payload = request.rawBody;

    if (!payload) {
      throw new Error('No raw body found in request');
    }

    return this.billingService.handleWebhook(signature, payload);
  }
}
