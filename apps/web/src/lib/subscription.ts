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
 * Get current user's subscription plan from the API
 * Returns FREE if no subscription exists or on error
 */
export async function getCurrentPlan(): Promise<SubscriptionPlanType> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      // 404 means no subscription - return FREE tier
      if (response.status === 404) {
        return SubscriptionPlan.FREE;
      }
      throw new Error(`Failed to fetch subscription: ${response.statusText}`);
    }

    const data = await response.json();
    const plan = data?.plan?.toLowerCase() as SubscriptionPlanType;

    // Validate plan is a known type
    if (Object.values(SubscriptionPlan).includes(plan)) {
      return plan;
    }

    return SubscriptionPlan.FREE;
  } catch (error) {
    console.error('[getCurrentPlan] Error fetching subscription:', error);
    return SubscriptionPlan.FREE;
  }
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
