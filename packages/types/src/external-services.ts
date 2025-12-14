// External Services Types (Trakt, AniList)

export const ExternalProviders = {
  TRAKT: 'trakt',
  ANILIST: 'anilist',
} as const;

export type ExternalProvider =
  (typeof ExternalProviders)[keyof typeof ExternalProviders];

export const MediaLibraryStatus = {
  WATCHED: 'watched',
  WATCHLIST: 'watchlist',
  RATED: 'rated',
} as const;

export type MediaLibraryStatusType =
  (typeof MediaLibraryStatus)[keyof typeof MediaLibraryStatus];

export interface ExternalConnection {
  provider: ExternalProvider;
  connected: boolean;
  username?: string;
  lastSync?: string;
  expiresAt?: string;
}

export interface MediaLibraryItem {
  id: string;
  tmdbId: string;
  mediaType: 'movie' | 'tv';
  status: MediaLibraryStatusType;
  rating?: number;
  source: ExternalProvider | 'manual';
  externalId?: string;
  watchedAt?: string;
  importedAt: string;
}

export interface SyncResult {
  imported: number;
  updated: number;
  skipped: number;
  errors: number;
}

// Trakt.tv Configuration
export const TraktConfig = {
  AUTH_URL: 'https://trakt.tv/oauth/authorize',
  TOKEN_URL: 'https://api.trakt.tv/oauth/token',
  API_URL: 'https://api.trakt.tv',
  API_VERSION: '2',
} as const;

// Trakt API Types
export interface TraktTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  created_at: number;
  token_type: string;
}

export interface TraktIds {
  trakt: number;
  slug?: string;
  tmdb?: number;
  imdb?: string;
  tvdb?: number;
}

export interface TraktMovie {
  title: string;
  year: number;
  ids: TraktIds;
}

export interface TraktShow {
  title: string;
  year: number;
  ids: TraktIds;
}

export interface TraktWatchedItem {
  plays: number;
  last_watched_at: string;
  last_updated_at: string;
  movie?: TraktMovie;
  show?: TraktShow;
}

export interface TraktWatchlistItem {
  rank: number;
  id: number;
  listed_at: string;
  notes?: string;
  type: 'movie' | 'show';
  movie?: TraktMovie;
  show?: TraktShow;
}

export interface TraktRating {
  rated_at: string;
  rating: number;
  type: 'movie' | 'show';
  movie?: TraktMovie;
  show?: TraktShow;
}

export interface TraktUser {
  username: string;
  private: boolean;
  name: string;
  vip: boolean;
  ids: {
    slug: string;
  };
}

// AniList Configuration
export const AniListConfig = {
  AUTH_URL: 'https://anilist.co/api/v2/oauth/authorize',
  TOKEN_URL: 'https://anilist.co/api/v2/oauth/token',
  GRAPHQL_URL: 'https://graphql.anilist.co',
} as const;

// AniList API Types
export interface AniListTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export interface AniListUser {
  id: number;
  name: string;
  avatar?: {
    medium?: string;
    large?: string;
  };
}

export interface AniListMediaTitle {
  romaji?: string;
  english?: string;
  native?: string;
}

export interface AniListMedia {
  id: number;
  idMal?: number;
  title: AniListMediaTitle;
  format?: string;
  status?: string;
  episodes?: number;
  averageScore?: number;
}

export interface AniListMediaListEntry {
  id: number;
  mediaId: number;
  status: string;
  score: number;
  progress: number;
  completedAt?: {
    year?: number;
    month?: number;
    day?: number;
  };
  media: AniListMedia;
}

export interface AniListMediaList {
  name: string;
  status: string;
  entries: AniListMediaListEntry[];
}

export interface AniListMediaListCollection {
  lists: AniListMediaList[];
}
