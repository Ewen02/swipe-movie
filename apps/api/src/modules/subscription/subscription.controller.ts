import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

/**
 * Subscription controller
 *
 * Phase 1: Basic CRUD operations for FREE tier
 * Phase 2: Stripe integration for paid tiers
 */
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * Get current user's subscription
   */
  @Get('me')
  async getMySubscription(@Request() req: any) {
    return await this.subscriptionService.getSubscriptionOrNull(req.user.id);
  }

  /**
   * Get feature limits for current user
   */
  @Get('me/limits')
  async getMyLimits(@Request() req: any) {
    const plan = await this.subscriptionService.getUserPlan(req.user.id);
    return this.subscriptionService.getFeatureLimits(plan);
  }

  /**
   * Get feature limits for a specific plan
   */
  @Get('limits/:plan')
  async getPlanLimits(@Param('plan') plan: string) {
    return this.subscriptionService.getFeatureLimits(plan);
  }

  /**
   * Create subscription (admin or system use)
   * Phase 1: Only creates FREE subscriptions automatically
   */
  @Post()
  async createSubscription(@Body() dto: CreateSubscriptionDto) {
    return await this.subscriptionService.createSubscription(dto);
  }

  /**
   * Update subscription
   * Phase 2: Will trigger Stripe subscription update
   */
  @Patch(':userId')
  async updateSubscription(
    @Param('userId') userId: string,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return await this.subscriptionService.updateSubscription(userId, dto);
  }

  /**
   * Cancel subscription
   * Phase 2: Will trigger Stripe subscription cancellation
   */
  @Delete(':userId')
  async cancelSubscription(@Param('userId') userId: string) {
    return await this.subscriptionService.cancelSubscription(userId);
  }

  /**
   * Get subscription by user ID (admin only in production)
   */
  @Get(':userId')
  async getSubscription(@Param('userId') userId: string) {
    return await this.subscriptionService.getSubscription(userId);
  }
}
