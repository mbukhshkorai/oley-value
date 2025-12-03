import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpgradePlanDto } from './dto/upgrade-plan.dto';
import { PurchaseCreditsDto } from './dto/purchase-credits.dto';
import { UpdateSubscriptionStatusDto } from './dto/update-subscription-status.dto';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user subscription' })
  @ApiResponse({ status: 200, description: 'Returns subscription details' })
  async getSubscription(@Request() req) {
    return this.subscriptionsService.getSubscription(req.user.userId);
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get usage statistics' })
  @ApiResponse({ status: 200, description: 'Returns usage stats' })
  async getUsageStats(@Request() req) {
    return this.subscriptionsService.getUsageStats(req.user.userId);
  }

  @Post('upgrade')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upgrade to PRO plan' })
  @ApiResponse({ status: 200, description: 'Subscription upgraded' })
  @ApiResponse({ status: 400, description: 'Already on PRO plan' })
  async upgradeToPro(@Request() req, @Body() dto: UpgradePlanDto) {
    return this.subscriptionsService.upgradeToPro(
      req.user.userId,
      dto.stripeSubscriptionId,
    );
  }

  @Post('downgrade')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Downgrade to FREE plan' })
  @ApiResponse({ status: 200, description: 'Subscription downgraded' })
  @ApiResponse({ status: 400, description: 'Already on FREE plan' })
  async downgradeToFree(@Request() req) {
    return this.subscriptionsService.downgradeToFree(req.user.userId);
  }

  @Post('credits/purchase')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Purchase additional credits' })
  @ApiResponse({ status: 200, description: 'Credits purchased successfully' })
  @ApiResponse({ status: 400, description: 'Invalid credit amount' })
  async purchaseCredits(@Request() req, @Body() dto: PurchaseCreditsDto) {
    return this.subscriptionsService.purchaseAdditionalCredits(
      req.user.userId,
      dto.credits,
      dto.stripePaymentIntentId,
    );
  }

  @Post('credits/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manually reset monthly credits' })
  @ApiResponse({ status: 200, description: 'Credits reset successfully' })
  @ApiResponse({ status: 403, description: 'Subscription not active' })
  async resetCredits(@Request() req) {
    return this.subscriptionsService.resetMonthlyCredits(req.user.userId);
  }

  @Put('status')
  @ApiOperation({ summary: 'Update subscription status (for webhooks)' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateStatus(@Request() req, @Body() dto: UpdateSubscriptionStatusDto) {
    return this.subscriptionsService.updateSubscriptionStatus(
      req.user.userId,
      dto.status,
      dto.stripeSubscriptionId,
    );
  }

  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({ status: 200, description: 'Subscription canceled' })
  @ApiResponse({ status: 400, description: 'Cannot cancel FREE plan' })
  async cancelSubscription(@Request() req) {
    return this.subscriptionsService.cancelSubscription(req.user.userId);
  }

  @Post('reactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reactivate canceled subscription' })
  @ApiResponse({ status: 200, description: 'Subscription reactivated' })
  @ApiResponse({ status: 400, description: 'Subscription not canceled' })
  async reactivateSubscription(@Request() req, @Body() dto: UpgradePlanDto) {
    return this.subscriptionsService.reactivateSubscription(
      req.user.userId,
      dto.stripeSubscriptionId,
    );
  }
}
