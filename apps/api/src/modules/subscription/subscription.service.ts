import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  SubscriptionResponseDto,
  FeatureLimitsDto,
} from './dto';

/**
 * Subscription service handling subscription lifecycle and feature access
 *
 * Phase 1: No Stripe integration (FREE tier only)
 * Phase 2: Full Stripe integration with webhooks
 */
@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get feature limits based on subscription plan
   */
  getFeatureLimits(plan: SubscriptionPlan): FeatureLimitsDto {
    const limits: Record<SubscriptionPlan, FeatureLimitsDto> = {
      [SubscriptionPlan.FREE]: {
        maxRooms: 3,
        maxParticipants: 4,
        maxSwipes: 20,
        roomExpiryDays: 7,
        hasAdvancedFilters: false,
        hasEmailNotifications: false,
        hasApiAccess: false,
      },
      [SubscriptionPlan.STARTER]: {
        maxRooms: -1, // unlimited
        maxParticipants: 8,
        maxSwipes: 50,
        roomExpiryDays: 30,
        hasAdvancedFilters: false,
        hasEmailNotifications: true,
        hasApiAccess: false,
      },
      [SubscriptionPlan.PRO]: {
        maxRooms: -1, // unlimited
        maxParticipants: -1, // unlimited
        maxSwipes: -1, // unlimited
        roomExpiryDays: -1, // no expiry
        hasAdvancedFilters: true,
        hasEmailNotifications: true,
        hasApiAccess: false,
      },
      [SubscriptionPlan.TEAM]: {
        maxRooms: -1, // unlimited
        maxParticipants: -1, // unlimited
        maxSwipes: -1, // unlimited
        roomExpiryDays: -1, // no expiry
        hasAdvancedFilters: true,
        hasEmailNotifications: true,
        hasApiAccess: true,
      },
    };

    return limits[plan];
  }

  /**
   * Create a new subscription for a user
   * Phase 1: Only creates FREE subscriptions
   */
  async createSubscription(
    dto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    const existingSubscription = await this.prisma.subscription.findUnique({
      where: { userId: dto.userId },
    });

    if (existingSubscription) {
      throw new BadRequestException('User already has a subscription');
    }

    const subscription = await this.prisma.subscription.create({
      data: {
        userId: dto.userId,
        plan: dto.plan,
        status: SubscriptionStatus.ACTIVE,
        stripeCustomerId: dto.stripeCustomerId,
        stripePriceId: dto.stripePriceId,
      },
    });

    this.logger.log(
      `Created subscription for user ${dto.userId} with plan ${dto.plan}`,
    );

    return subscription;
  }

  /**
   * Get subscription by user ID
   */
  async getSubscription(userId: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription not found for user ${userId}`);
    }

    return subscription;
  }

  /**
   * Get subscription by user ID or return null if not found
   */
  async getSubscriptionOrNull(
    userId: string,
  ): Promise<SubscriptionResponseDto | null> {
    return await this.prisma.subscription.findUnique({
      where: { userId },
    });
  }

  /**
   * Update subscription (plan change, status change, etc.)
   * Phase 2: Will integrate with Stripe for upgrades/downgrades
   */
  async updateSubscription(
    userId: string,
    dto: UpdateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    const subscription = await this.getSubscription(userId);

    const updated = await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: dto,
    });

    this.logger.log(`Updated subscription for user ${userId}`);

    return updated;
  }

  /**
   * Cancel subscription
   * Phase 2: Will cancel Stripe subscription
   */
  async cancelSubscription(userId: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.getSubscription(userId);

    const cancelled = await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.CANCELED,
      },
    });

    this.logger.log(`Cancelled subscription for user ${userId}`);

    return cancelled;
  }

  /**
   * Check if user has access to a specific feature
   */
  async checkFeatureAccess(
    userId: string,
    feature: keyof FeatureLimitsDto,
  ): Promise<boolean> {
    const subscription = await this.getSubscriptionOrNull(userId);

    // If no subscription, use FREE tier limits
    const plan = subscription?.plan || SubscriptionPlan.FREE;
    const limits = this.getFeatureLimits(plan);

    const value = limits[feature];

    // Boolean features: return directly
    if (typeof value === 'boolean') {
      return value;
    }

    // Numeric features: -1 means unlimited (true), 0 means no access (false)
    if (typeof value === 'number') {
      return value !== 0;
    }

    return false;
  }

  /**
   * Check if user can perform action based on limit
   * Returns true if allowed, false if limit reached
   */
  async checkLimit(
    userId: string,
    limitType: 'maxRooms' | 'maxParticipants' | 'maxSwipes',
    currentCount: number,
  ): Promise<{ allowed: boolean; limit: number }> {
    const subscription = await this.getSubscriptionOrNull(userId);
    const plan = subscription?.plan || SubscriptionPlan.FREE;
    const limits = this.getFeatureLimits(plan);

    const limit = limits[limitType];

    // -1 means unlimited
    if (limit === -1) {
      return { allowed: true, limit: -1 };
    }

    const allowed = currentCount < limit;

    return { allowed, limit };
  }

  /**
   * Get user's current plan
   */
  async getUserPlan(userId: string): Promise<SubscriptionPlan> {
    const subscription = await this.getSubscriptionOrNull(userId);
    return subscription?.plan || SubscriptionPlan.FREE;
  }

  /**
   * Check if user has minimum required plan
   */
  async hasMinimumPlan(
    userId: string,
    requiredPlan: SubscriptionPlan,
  ): Promise<boolean> {
    const userPlan = await this.getUserPlan(userId);

    // Plan hierarchy: FREE < STARTER < PRO < TEAM
    const planHierarchy = {
      [SubscriptionPlan.FREE]: 0,
      [SubscriptionPlan.STARTER]: 1,
      [SubscriptionPlan.PRO]: 2,
      [SubscriptionPlan.TEAM]: 3,
    };

    return planHierarchy[userPlan] >= planHierarchy[requiredPlan];
  }
}
