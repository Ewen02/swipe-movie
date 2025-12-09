// Swipe direction
export const SwipeDirection = {
  LEFT: 'left',
  RIGHT: 'right',
} as const;

export type SwipeDirectionType = (typeof SwipeDirection)[keyof typeof SwipeDirection];

// Swipe data shape
export interface SwipeData {
  id: string;
  roomId: string;
  userId: string;
  movieId: string;
  value: boolean; // true = right (like), false = left (dislike)
  createdAt: Date;
}

// Create swipe input
export interface CreateSwipeInput {
  roomId: string;
  movieId: string;
  value: boolean;
}
