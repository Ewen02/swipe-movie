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
} as const;

export type ServerAnalyticsEvent =
  (typeof SERVER_ANALYTICS_EVENTS)[keyof typeof SERVER_ANALYTICS_EVENTS];
