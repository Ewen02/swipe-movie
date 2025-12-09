import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  SubscriptionResponseDto,
  FeatureLimitsDto,
} from './dto';
import {
  SubscriptionPlan,
  SubscriptionStatus,
  FEATURE_LIMITS,
  isPlanHigherOrEqual,
  type SubscriptionPlanType,
  type SubscriptionStatusType,
} from '@swipe-movie/subscription';

// Re-export for backward compatibility
export { SubscriptionPlan, SubscriptionStatus, type SubscriptionPlanType, type SubscriptionStatusType };

/**
 * Subscription service handling subscription lifecycle and feature access
 *
 * Uses Better Auth Stripe for subscription management
 */
@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get feature limits based on subscription plan
   */
  getFeatureLimits(plan: string): FeatureLimitsDto {
    const normalizedPlan = plan.toLowerCase() as SubscriptionPlanType;
    // Use shared FEATURE_LIMITS from @swipe-movie/subscription
    return FEATURE_LIMITS[normalizedPlan] || FEATURE_LIMITS[SubscriptionPlan.FREE];
  }

  /**
   * Create a new subscription for a user
   */
  async createSubscription(
    dto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    const existingSubscription = await this.prisma.subscription.findFirst({
      where: { referenceId: dto.userId },
    });

    if (existingSubscription) {
      throw new BadRequestException('User already has a subscription');
    }

    const subscription = await this.prisma.subscription.create({
      data: {
        referenceId: dto.userId,
        plan: dto.plan,
        status: SubscriptionStatus.ACTIVE,
        stripeCustomerId: dto.stripeCustomerId,
      },
    });

    this.logger.log(
      `Created subscription for user ${dto.userId} with plan ${dto.plan}`,
    );

    return this.mapToResponseDto(subscription);
  }

  /**
   * Get subscription by user ID
   */
  async getSubscription(userId: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { referenceId: userId },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription not found for user ${userId}`);
    }

    return this.mapToResponseDto(subscription);
  }

  /**
   * Get subscription by user ID or return null if not found
   */
  async getSubscriptionOrNull(
    userId: string,
  ): Promise<SubscriptionResponseDto | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { referenceId: userId },
    });

    return subscription ? this.mapToResponseDto(subscription) : null;
  }

  /**
   * Update subscription (plan change, status change, etc.)
   */
  async updateSubscription(
    userId: string,
    dto: UpdateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    const subscription = await this.getSubscription(userId);

    const updated = await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        plan: dto.plan,
        status: dto.status,
        stripeCustomerId: dto.stripeCustomerId,
        stripeSubscriptionId: dto.stripeSubscriptionId,
      },
    });

    this.logger.log(`Updated subscription for user ${userId}`);

    return this.mapToResponseDto(updated);
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.getSubscription(userId);

    const cancelled = await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.CANCELED,
        cancelAtPeriodEnd: true,
      },
    });

    this.logger.log(`Cancelled subscription for user ${userId}`);

    return this.mapToResponseDto(cancelled);
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
  async getUserPlan(userId: string): Promise<string> {
    const subscription = await this.getSubscriptionOrNull(userId);
    return subscription?.plan || SubscriptionPlan.FREE;
  }

  /**
   * Check if user has minimum required plan
   */
  async hasMinimumPlan(
    userId: string,
    requiredPlan: string,
  ): Promise<boolean> {
    const userPlan = await this.getUserPlan(userId);
    // Use shared isPlanHigherOrEqual from @swipe-movie/subscription
    return isPlanHigherOrEqual(
      userPlan.toLowerCase() as SubscriptionPlanType,
      requiredPlan.toLowerCase() as SubscriptionPlanType,
    );
  }

  /**
   * Map Prisma subscription to response DTO
   */
  private mapToResponseDto(subscription: {
    id: string;
    plan: string;
    referenceId: string;
    status: string;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    periodStart: Date | null;
    periodEnd: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): SubscriptionResponseDto {
    return {
      id: subscription.id,
      userId: subscription.referenceId,
      plan: subscription.plan,
      status: subscription.status,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      periodStart: subscription.periodStart,
      periodEnd: subscription.periodEnd,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }
}
