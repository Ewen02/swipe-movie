/**
 * Shared constants across API and Web apps
 */

// ============================================
// Room Constants
// ============================================

/** Length of room codes */
export const ROOM_CODE_LENGTH = 6;

/** Characters used in room codes (excludes ambiguous: I, O, 0, 1) */
export const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Maximum length for room names */
export const ROOM_NAME_MAX_LENGTH = 100;

/** Minimum length for room names */
export const ROOM_NAME_MIN_LENGTH = 3;

// ============================================
// Validation Constraints
// ============================================

export const ValidationConstraints = {
  /** Rating range (0-10) */
  RATING_MIN: 0,
  RATING_MAX: 10,

  /** Release year minimum */
  RELEASE_YEAR_MIN: 1900,

  /** Runtime in minutes */
  RUNTIME_MIN: 0,

  /** ISO code length (country, language) */
  ISO_CODE_LENGTH: 2,
} as const;

// ============================================
// TMDB Constants
// ============================================

export const TMDB_IMAGE_BASE = {
  /** Poster image base URL */
  POSTER: 'https://image.tmdb.org/t/p/w500',
  /** Backdrop image base URL */
  BACKDROP: 'https://image.tmdb.org/t/p/w780',
  /** Fallback image for missing posters */
  FALLBACK: 'https://placehold.co/500x750?text=No+Poster',
  /** No poster placeholder */
  NO_POSTER: 'https://placehold.co/500x750?text=No+Poster',
} as const;

/** Default language for TMDB API */
export const TMDB_DEFAULT_LANG = 'fr-FR';

// ============================================
// Watch Providers
// ============================================

export interface WatchProvider {
  id: number;
  name: string;
  logo: string;
}

/** Streaming providers with their TMDb IDs */
export const WATCH_PROVIDERS: readonly WatchProvider[] = [
  { id: 8, name: 'Netflix', logo: '🎬' },
  { id: 119, name: 'Prime Video', logo: '📺' },
  { id: 337, name: 'Disney+', logo: '✨' },
  { id: 350, name: 'Apple TV+', logo: '🍎' },
  { id: 531, name: 'Paramount+', logo: '⭐' },
] as const;

/** Get a provider by its ID */
export function getProviderById(id: number): WatchProvider | undefined {
  return WATCH_PROVIDERS.find((p) => p.id === id);
}

/** Get multiple providers by their IDs */
export function getProvidersByIds(ids: number[]): WatchProvider[] {
  return ids
    .map((id) => getProviderById(id))
    .filter((p): p is WatchProvider => p !== undefined);
}

// ============================================
// HTTP Headers
// ============================================

export const HttpHeaders = {
  /** Header for user email authentication */
  USER_EMAIL: 'X-User-Email',
} as const;

// ============================================
// Cache TTL (in milliseconds)
// ============================================

export const CacheTTL = {
  /** Session cache TTL */
  SESSION: 5 * 60 * 1000, // 5 minutes
  /** User rooms cache TTL */
  USER_ROOMS: 5 * 60 * 1000, // 5 minutes
  /** Room by code cache TTL */
  ROOM_BY_CODE: 2 * 60 * 1000, // 2 minutes
  /** Room matches cache TTL */
  ROOM_MATCHES: 5 * 60 * 1000, // 5 minutes
} as const;
