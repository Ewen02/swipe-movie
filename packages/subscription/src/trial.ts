import { FEATURE_LIMITS } from './limits';
import { SubscriptionPlan } from '@swipe-movie/types';

// Single source of truth for trial UX constants. Both the web client (login
// wall thresholds, banner remaining count, recap trigger) and the API (swipe
// limit enforcement) read from here so they can't drift apart.
export const TRIAL_CONFIG = {
  // Hard ceiling: matches the backend swipe limit enforced by checkLimit().
  // When the user reaches it the API will reject further swipes with
  // SWIPE_LIMIT_REACHED, so the UI must surface the recap at the same value.
  hardSwipeLimit: FEATURE_LIMITS[SubscriptionPlan.TRIAL].maxSwipes,

  // Soft trigger: when the login wall starts pushing on its own (before the
  // user is hard-blocked). Tunable for the funnel.
  softSwipeLimit: 10,

  // Trial session lifetime in milliseconds. Must match the API JWT TTL.
  durationMs: 2 * 60 * 60 * 1000,

  // Max times the user can dismiss the login wall before it becomes a hard
  // block.
  maxDismissals: 2,

  // After a dismissal, the wall stays hidden until this many additional
  // swipes have happened.
  cooldownAfterDismiss: 5,
} as const;
