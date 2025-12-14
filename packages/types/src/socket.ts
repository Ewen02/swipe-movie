/**
 * Socket.io event types for real-time communication
 */

// ============================================
// Event Names
// ============================================

export const SocketEvents = {
  // Client -> Server
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  PING: 'ping',

  // Server -> Client
  CONNECTED: 'connected',
  ROOM_JOINED: 'roomJoined',
  ROOM_LEFT: 'roomLeft',
  PONG: 'pong',
  MATCH_CREATED: 'matchCreated',
  MATCH_DELETED: 'matchDeleted',
  USER_JOINED: 'userJoined',
  USER_LEFT: 'userLeft',
} as const;

export type SocketEventName = (typeof SocketEvents)[keyof typeof SocketEvents];

// ============================================
// Connection Configuration
// ============================================

export const SocketConfig = {
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY_BASE: 1000, // 1 second
  RECONNECT_DELAY_MAX: 30000, // 30 seconds
  CONNECTION_TIMEOUT: 20000, // 20 seconds
  PING_TIMEOUT: 60000, // 60 seconds
  PING_INTERVAL: 25000, // 25 seconds
} as const;

// ============================================
// Payload Types
// ============================================

/** Basic user info for socket events */
export interface SocketUser {
  id: string;
  name: string | null;
}

/** Match data in socket events */
export interface SocketMatch {
  id: string;
  roomId: string;
  movieId: string;
  createdAt: Date | string;
  voteCount?: number;
}

/** Basic movie data for match events */
export interface SocketMovie {
  id: string;
  tmdbId: number;
  title: string;
  posterPath?: string | null;
}

// ============================================
// Server -> Client Event Payloads
// ============================================

/** Payload when client connects */
export interface ConnectedPayload {
  clientId: string;
  timestamp: string;
}

/** Payload when room is joined/left */
export interface RoomEventPayload {
  roomId: string;
  timestamp: string;
}

/** Payload when a match is created */
export interface MatchCreatedPayload {
  roomId: string;
  match: SocketMatch;
  movie?: SocketMovie;
}

/** Payload when a match is deleted (undo) */
export interface MatchDeletedPayload {
  roomId: string;
  movieId: string;
  timestamp: string;
}

/** Payload when a user joins the room */
export interface UserJoinedPayload {
  roomId: string;
  user: SocketUser;
  timestamp: string;
}

/** Payload when a user leaves the room */
export interface UserLeftPayload {
  roomId: string;
  userId: string;
  timestamp: string;
}

// ============================================
// Connection State
// ============================================

export type ConnectionState = 'connected' | 'disconnected' | 'reconnecting' | 'error';

// ============================================
// Client -> Server Event Types
// ============================================

export interface ClientToServerEvents {
  [SocketEvents.JOIN_ROOM]: (roomId: string) => void;
  [SocketEvents.LEAVE_ROOM]: (roomId: string) => void;
  [SocketEvents.PING]: () => void;
}

// ============================================
// Server -> Client Event Types
// ============================================

export interface ServerToClientEvents {
  [SocketEvents.CONNECTED]: (payload: ConnectedPayload) => void;
  [SocketEvents.ROOM_JOINED]: (payload: RoomEventPayload) => void;
  [SocketEvents.ROOM_LEFT]: (payload: RoomEventPayload) => void;
  [SocketEvents.PONG]: (payload: { timestamp: string }) => void;
  [SocketEvents.MATCH_CREATED]: (payload: MatchCreatedPayload) => void;
  [SocketEvents.MATCH_DELETED]: (payload: MatchDeletedPayload) => void;
  [SocketEvents.USER_JOINED]: (payload: UserJoinedPayload) => void;
  [SocketEvents.USER_LEFT]: (payload: UserLeftPayload) => void;
}
