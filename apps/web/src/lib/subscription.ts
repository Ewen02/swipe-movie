/**
 * Subscription utilities for client-side feature gating
 *
 * Phase 1: All users are on FREE tier
 * Phase 2: Fetch actual subscription from API
 */

export enum SubscriptionPlan {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  TEAM = 'TEAM',
}

export interface FeatureLimits {
  maxRooms: number; // -1 = unlimited
  maxParticipants: number;
  maxSwipes: number;
  roomExpiryDays: number; // -1 = no expiry
  hasAdvancedFilters: boolean;
  hasEmailNotifications: boolean;
  hasApiAccess: boolean;
}

export const FEATURE_LIMITS: Record<SubscriptionPlan, FeatureLimits> = {
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
    maxRooms: -1,
    maxParticipants: -1,
    maxSwipes: -1,
    roomExpiryDays: -1,
    hasAdvancedFilters: true,
    hasEmailNotifications: true,
    hasApiAccess: false,
  },
  [SubscriptionPlan.TEAM]: {
    maxRooms: -1,
    maxParticipants: -1,
    maxSwipes: -1,
    roomExpiryDays: -1,
    hasAdvancedFilters: true,
    hasEmailNotifications: true,
    hasApiAccess: true,
  },
};

/**
 * Get feature limits for a plan
 */
export function getFeatureLimits(plan: SubscriptionPlan): FeatureLimits {
  return FEATURE_LIMITS[plan];
}

/**
 * Check if user can perform action based on current count and limit
 */
export function canPerformAction(
  currentCount: number,
  limit: number,
): boolean {
  if (limit === -1) return true; // unlimited
  return currentCount < limit;
}

/**
 * Get minimum required plan for a feature
 */
export function getRequiredPlan(
  feature: keyof FeatureLimits,
): SubscriptionPlan {
  if (feature === 'hasAdvancedFilters' || feature === 'hasApiAccess') {
    return SubscriptionPlan.PRO;
  }
  if (feature === 'hasEmailNotifications') {
    return SubscriptionPlan.STARTER;
  }
  return SubscriptionPlan.PRO; // default for unlimited features
}

/**
 * Phase 1: Get current user plan (always FREE)
 * Phase 2: Replace with API call
 */
export async function getCurrentPlan(): Promise<SubscriptionPlan> {
  // TODO Phase 2: Fetch from /api/subscriptions/me
  return SubscriptionPlan.FREE;
}

/**
 * Check if user has reached limit and needs upgrade
 */
export async function checkLimit(
  limitType: 'maxRooms' | 'maxParticipants' | 'maxSwipes',
  currentCount: number,
): Promise<{ allowed: boolean; limit: number; plan: SubscriptionPlan }> {
  const plan = await getCurrentPlan();
  const limits = getFeatureLimits(plan);
  const limit = limits[limitType];

  return {
    allowed: canPerformAction(currentCount, limit),
    limit,
    plan,
  };
}
