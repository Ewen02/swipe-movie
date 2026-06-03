/**
 * Server-side PostHog event names. The string VALUES must stay identical to the
 * web client's registry (apps/web/src/lib/analytics/events.ts) so an event the
 * backend now owns keeps historical continuity in PostHog. Only the events the
 * server is the source of truth for live here.
 */
export const SERVER_ANALYTICS_EVENTS = {
  ROOM_CREATED: 'room_created',
  ROOM_JOINED: 'room_joined',
  MATCH_FOUND: 'match_found',
  GROUP_CREATED: 'group_created',
  GROUP_SESSION_STARTED: 'group_session_started',
  /**
   * A re-engagement notification was actually dispatched to a crew member when
   * a group session was launched. Captured per channel so we can finally see
   * the retention loop the product relies on — the "débranché" piece was that
   * nothing downstream of the send was ever measured.
   */
  REENGAGEMENT_SENT: 'reengagement_sent',
} as const;

export type ServerAnalyticsEvent =
  (typeof SERVER_ANALYTICS_EVENTS)[keyof typeof SERVER_ANALYTICS_EVENTS];
