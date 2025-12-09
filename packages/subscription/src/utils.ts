import { SubscriptionPlan, type SubscriptionPlanType, type FeatureLimits } from '@swipe-movie/types';
import { getFeatureLimits, FEATURE_LIMITS } from './limits';

/**
 * Check if user can perform action based on current count and limit
 * Returns true if limit is -1 (unlimited) or currentCount < limit
 */
export function canPerformAction(currentCount: number, limit: number): boolean {
  if (limit === -1) return true; // unlimited
  return currentCount < limit;
}

/**
 * Get the minimum required plan for a specific feature
 */
export function getRequiredPlan(feature: keyof FeatureLimits): SubscriptionPlanType {
  // Boolean features
  if (feature === 'hasApiAccess') {
    return SubscriptionPlan.TEAM;
  }
  if (feature === 'hasAdvancedFilters') {
    return SubscriptionPlan.PRO;
  }
  if (feature === 'hasEmailNotifications') {
    return SubscriptionPlan.STARTER;
  }

  // Numeric features - return PRO as default for unlimited
  return SubscriptionPlan.PRO;
}

/**
 * Check if a plan has a specific boolean feature
 */
export function hasFeature(plan: SubscriptionPlanType, feature: keyof FeatureLimits): boolean {
  const limits = getFeatureLimits(plan);
  const value = limits[feature];

  if (typeof value === 'boolean') {
    return value;
  }

  // For numeric values, check if it's unlimited (-1)
  return value === -1;
}

/**
 * Check if user has reached limit and needs upgrade
 */
export function checkLimit(
  plan: SubscriptionPlanType,
  limitType: 'maxRooms' | 'maxParticipants' | 'maxSwipes',
  currentCount: number,
): { allowed: boolean; limit: number; needsUpgrade: boolean } {
  const limits = getFeatureLimits(plan);
  const limit = limits[limitType];

  return {
    allowed: canPerformAction(currentCount, limit),
    limit,
    needsUpgrade: !canPerformAction(currentCount, limit),
  };
}

/**
 * Compare two plans and return if plan A is higher than plan B
 */
export function isPlanHigherOrEqual(planA: SubscriptionPlanType, planB: SubscriptionPlanType): boolean {
  const planOrder: Record<SubscriptionPlanType, number> = {
    [SubscriptionPlan.FREE]: 0,
    [SubscriptionPlan.STARTER]: 1,
    [SubscriptionPlan.PRO]: 2,
    [SubscriptionPlan.TEAM]: 3,
  };

  return planOrder[planA] >= planOrder[planB];
}

/**
 * Get upgrade options for a given plan
 */
export function getUpgradeOptions(currentPlan: SubscriptionPlanType): SubscriptionPlanType[] {
  const allPlans = Object.values(SubscriptionPlan) as SubscriptionPlanType[];
  return allPlans.filter((plan) => !isPlanHigherOrEqual(currentPlan, plan));
}
