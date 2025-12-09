// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Error response
export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// WebSocket events
export const SocketEvents = {
  // Room events
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  ROOM_JOINED: 'roomJoined',
  ROOM_LEFT: 'roomLeft',
  MEMBER_JOINED: 'memberJoined',
  MEMBER_LEFT: 'memberLeft',

  // Swipe events
  SWIPE: 'swipe',
  SWIPE_UPDATE: 'swipeUpdate',

  // Match events
  NEW_MATCH: 'newMatch',
  MATCH_SELECTED: 'matchSelected',

  // Status events
  ERROR: 'error',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
} as const;

export type SocketEventType = (typeof SocketEvents)[keyof typeof SocketEvents];
