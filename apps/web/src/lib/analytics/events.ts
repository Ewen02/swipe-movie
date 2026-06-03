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
  /**
   * Fired once per account (gated by a localStorage key), with the path that
   * produced it ('trial' | 'direct'). This is the reliable signup signal; the
   * old USER_SIGNED_UP was removed because it re-fired on every new device.
   */
  SIGNUP_COMPLETED: 'signup_completed',

  // --- Auth (email) ---
  EMAIL_AUTH_CODE_REQUESTED: 'email_auth_code_requested',
  EMAIL_AUTH_CODE_SUBMITTED: 'email_auth_code_submitted',
  EMAIL_AUTH_SIGNED_IN: 'email_auth_signed_in',

  // --- Trial (guest) funnel ---
  TRIAL_STARTED: 'trial_started',
  TRIAL_SWIPE: 'trial_swipe',
  // TRIAL_MATCH was removed: matches are now emitted server-side as a single
  // `match_found` carrying an `is_trial` property, so a trial match is just
  // `match_found { is_trial: true }`.
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
  /** Streaming providers picked (step 1). Fills a previously blind step. */
  ONBOARDING_PROVIDERS_SELECTED: 'onboarding_providers_selected',
  /** Favorite genres picked (step 2). Fills a previously blind step. */
  ONBOARDING_GENRES_SELECTED: 'onboarding_genres_selected',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_ABANDONED: 'onboarding_abandoned',

  // --- Usage: rooms ---
  // ROOM_CREATED and ROOM_JOINED are now emitted SERVER-SIDE (RoomCrudService /
  // RoomMembershipService) — the authoritative, ad-block-proof point. Kept here
  // as the canonical names; the client no longer captures them. The mirror
  // lives in apps/api/src/modules/analytics/analytics.events.ts.
  ROOM_CREATED: 'room_created',
  ROOM_JOINED: 'room_joined',
  ROOM_INVITE_SHARED: 'room_invite_shared',
  /**
   * The create-room dialog was auto-opened from a create-intent handoff (the
   * ?create=true param set by onboarding / the welcome email). Lets us measure
   * the activation handoff that used to silently break.
   */
  ROOM_CREATE_INTENT: 'room_create_intent',

  // --- Usage: persistent groups (retention) ---
  // GROUP_CREATED / GROUP_SESSION_STARTED are now emitted SERVER-SIDE from
  // GroupsService (which knows the real member count and email/push split).
  // The client no longer captures them.
  /** A persistent group was saved (e.g. from a finished session). */
  GROUP_CREATED: 'group_created',
  /** The host re-launched a fresh session from a saved group ("movie night?"). */
  GROUP_SESSION_STARTED: 'group_session_started',
  /**
   * SERVER-SIDE: a re-engagement notification was dispatched to a crew member
   * when a group session launched (one per recipient). The retention loop the
   * memory flagged as "débranché" — now measurable downstream of the send.
   */
  REENGAGEMENT_SENT: 'reengagement_sent',

  // --- Usage: sessions ---
  /** A user started actively swiping in a room (deck ready). */
  SESSION_STARTED: 'session_started',
  /**
   * The room session ended (leave / tab close), with duration, swipe count,
   * whether it matched, and an outcome (matched | deck_finished | left). Turns
   * isolated swipe/match events into a measurable "movie night".
   */
  SESSION_ENDED: 'session_ended',

  // --- Usage: swipes ---
  SWIPE: 'swipe',
  DISCOVER_SWIPE: 'discover_swipe',
  /** Deck exhausted during a session — surfaces dead-ends. */
  DECK_FINISHED: 'deck_finished',

  // --- Usage: matches ---
  // MATCH_FOUND is emitted SERVER-SIDE from MatchesService (the only place that
  // authoritatively knows a match happened), once per member, with an
  // `is_trial` property. The client no longer captures it.
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
