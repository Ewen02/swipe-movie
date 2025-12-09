// Room Types
export const RoomType = {
  MOVIE: 'MOVIE',
  TV: 'TV',
} as const;

export type RoomTypeValue = (typeof RoomType)[keyof typeof RoomType];

// Room data shape
export interface RoomData {
  id: string;
  code: string;
  name: string;
  capacity: number;
  type: RoomTypeValue;
  genreId: number;
  selectedTmdbId?: number | null;

  // Advanced filters
  minRating?: number | null;
  releaseYearMin?: number | null;
  releaseYearMax?: number | null;
  runtimeMin?: number | null;
  runtimeMax?: number | null;
  watchProviders: number[];
  watchRegion?: string | null;
  originalLanguage?: string | null;

  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

// Room member data shape
export interface RoomMemberData {
  id: string;
  roomId: string;
  userId: string;
}

// Create room input
export interface CreateRoomInput {
  name?: string;
  capacity?: number;
  type?: RoomTypeValue;
  genreId?: number;
  minRating?: number;
  releaseYearMin?: number;
  releaseYearMax?: number;
  runtimeMin?: number;
  runtimeMax?: number;
  watchProviders?: number[];
  watchRegion?: string;
  originalLanguage?: string;
}
