/**
 * TypeScript enums for UserMediaLibrary fields.
 * These mirror the string values stored in the database.
 * Using enums instead of Prisma DB enums to avoid destructive migrations.
 */

export enum MediaType {
  movie = 'movie',
  tv = 'tv',
}

export enum MediaStatus {
  watched = 'watched',
  watchlist = 'watchlist',
  rated = 'rated',
  liked = 'liked',
  disliked = 'disliked',
}

export enum MediaSource {
  trakt = 'trakt',
  anilist = 'anilist',
  manual = 'manual',
  onboarding = 'onboarding',
  discover = 'discover',
}
