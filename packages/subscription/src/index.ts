// Re-export types from @swipe-movie/types
export {
  SubscriptionPlan,
  SubscriptionStatus,
  type SubscriptionPlanType,
  type SubscriptionStatusType,
  type FeatureLimits,
  type SubscriptionData,
} from '@swipe-movie/types';

// Export limits
export { FEATURE_LIMITS, getFeatureLimits } from './limits';

// Trial-specific config shared between web and api
export { TRIAL_CONFIG } from './trial';

// Export utilities
export {
  canPerformAction,
  getRequiredPlan,
  hasFeature,
  checkLimit,
  isPlanHigherOrEqual,
  getUpgradeOptions,
} from './utils';
