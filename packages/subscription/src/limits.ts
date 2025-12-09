import { SubscriptionPlan, type SubscriptionPlanType, type FeatureLimits } from '@swipe-movie/types';

/**
 * Feature limits for each subscription plan
 */
export const FEATURE_LIMITS: Record<SubscriptionPlanType, FeatureLimits> = {
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
 * Get feature limits for a specific plan
 */
export function getFeatureLimits(plan: SubscriptionPlanType): FeatureLimits {
  return FEATURE_LIMITS[plan];
}
