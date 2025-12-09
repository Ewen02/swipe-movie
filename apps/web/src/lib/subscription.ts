/**
 * Subscription utilities for client-side feature gating
 * Re-exports from shared @swipe-movie/subscription package
 */

// Re-export everything from the shared package
export {
  SubscriptionPlan,
  SubscriptionStatus,
  FEATURE_LIMITS,
  getFeatureLimits,
  canPerformAction,
  getRequiredPlan,
  hasFeature,
  checkLimit,
  isPlanHigherOrEqual,
  getUpgradeOptions,
  type SubscriptionPlanType,
  type SubscriptionStatusType,
  type FeatureLimits,
  type SubscriptionData,
} from '@swipe-movie/subscription';

import { SubscriptionPlan, type SubscriptionPlanType } from '@swipe-movie/subscription';

/**
 * Phase 1: Get current user plan (always FREE)
 * Phase 2: Replace with API call
 */
export async function getCurrentPlan(): Promise<SubscriptionPlanType> {
  // TODO Phase 2: Fetch from /api/subscriptions/me
  return SubscriptionPlan.FREE;
}

/**
 * Legacy compatibility - Check if user has reached limit and needs upgrade
 * @deprecated Use checkLimit from @swipe-movie/subscription directly
 */
export async function checkLimitAsync(
  limitType: 'maxRooms' | 'maxParticipants' | 'maxSwipes',
  currentCount: number,
): Promise<{ allowed: boolean; limit: number; plan: SubscriptionPlanType }> {
  const plan = await getCurrentPlan();
  const { checkLimit } = await import('@swipe-movie/subscription');
  const result = checkLimit(plan, limitType, currentCount);

  return {
    allowed: result.allowed,
    limit: result.limit,
    plan,
  };
}
