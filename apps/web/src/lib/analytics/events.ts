/**
 * Single source of truth for every PostHog event name in the web app.
 *
 * Why this exists: events are fired via `captureEvent('some_string', …)`. A typo
 * in that string produces a silently-dropped event that no funnel will ever
 * show — and the bug is invisible until someone notices a funnel step is empty.
 * Routing every call site through this registry gives autocomplete, a grep-able
 * inventory, and one place to rename an event.
 *
 * Keep the VALUES stable: they are what PostHog stores. Renaming a value breaks
 * historical continuity of that event in dashboards.
 */
export const ANALYTICS_EVENTS = {
  // --- Acquisition / SEO ---
  SEO_PAGE_VIEW: 'seo_page_view',
  SEO_CTA_CLICKED: 'seo_cta_clicked',
  USER_SIGNED_UP: 'user_signed_up',
  /**
   * Fired once when a real account is created, with the path that produced it.
   * Distinct from USER_SIGNED_UP (which fires at first PostHog identify of any
   * session and can over-count on a new device for an existing user).
   */
  SIGNUP_COMPLETED: 'signup_completed',

  // --- Trial (guest) funnel ---
  TRIAL_STARTED: 'trial_started',
  TRIAL_SWIPE: 'trial_swipe',
  TRIAL_MATCH: 'trial_match',
  TRIAL_LOGIN_WALL_SHOWN: 'trial_login_wall_shown',
  TRIAL_LOGIN_WALL_DISMISSED: 'trial_login_wall_dismissed',
  TRIAL_LOGIN_WALL_SIGNIN_CLICKED: 'trial_login_wall_signin_clicked',
  TRIAL_LOGIN_WALL_EMAIL_CLICKED: 'trial_login_wall_email_clicked',
  TRIAL_MIGRATION_ATTEMPTED: 'trial_migration_attempted',
  TRIAL_MIGRATION_SUCCEEDED: 'trial_migration_succeeded',
  TRIAL_MIGRATION_FAILED: 'trial_migration_failed',
  TRIAL_CONVERTED: 'trial_converted',

  // --- Onboarding ---
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_ABANDONED: 'onboarding_abandoned',

  // --- Usage: rooms ---
  ROOM_CREATED: 'room_created',
  ROOM_JOINED: 'room_joined',
  ROOM_INVITE_SHARED: 'room_invite_shared',

  // --- Usage: swipes ---
  SWIPE: 'swipe',
  DISCOVER_SWIPE: 'discover_swipe',
  /** Deck exhausted during a session — surfaces dead-ends. */
  DECK_FINISHED: 'deck_finished',

  // --- Usage: matches ---
  MATCH_FOUND: 'match_found',
  MATCH_OPENED: 'match_opened',
  MATCH_SHARED: 'match_shared',
  /**
   * The group reached a final decision via the fortune wheel ("on regarde X ce
   * soir"). Closes the core promise — tracking it lets us measure how often a
   * session ends in an actual decision, not just a list of matches.
   */
  FINAL_DECISION_MADE: 'final_decision_made',
} as const;

/** Union of all valid event names. */
export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
