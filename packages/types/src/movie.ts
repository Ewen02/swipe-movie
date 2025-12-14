// ==========================================
// Movie Types - Source unique de vérité
// ==========================================

// Genre data
export interface MovieGenre {
  id: number;
  name: string;
}

// Alias pour compatibilité
export type GenreData = MovieGenre;

// Watch provider data (standardisé)
export interface MovieWatchProvider {
  id: number;
  name: string;
  logoPath: string;
}

// Ancienne interface pour compatibilité (deprecated)
export interface WatchProviderData {
  providerId: number;
  providerName: string;
  logoPath: string;
  displayPriority: number;
}

// Video data (trailers, etc.)
export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

// Cast member
export interface MovieCast {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

// Crew member
export interface MovieCrew {
  id: number;
  name: string;
  job: string;
  department: string;
}

// Production company
export interface ProductionCompany {
  id: number;
  name: string;
  origin_country: string;
}

// Production country
export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

// Spoken language
export interface SpokenLanguage {
  iso_639_1: string;
  english_name: string;
  name: string;
}

// ==========================================
// Movie DTOs - Utilisés par API et Frontend
// ==========================================

/**
 * Movie basic info - used in lists, swipe cards, etc.
 */
export interface MovieBasic {
  id: number;
  adult: boolean;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  genreIds: number[];
  originalLanguage: string;
  originalTitle: string;
  popularity: number;
  releaseDate: string;
  overview: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
  watchProviders?: MovieWatchProvider[];
  // Recommendation data (optional - from RecommendationsService)
  isWatched?: boolean;
  isInWatchlist?: boolean;
  watchlistMemberCount?: number;
}

/**
 * Movie detailed info - used in movie details page
 */
export interface MovieDetails extends MovieBasic {
  budget: number;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  homepage: string;
  imdbId: string;
  genres: MovieGenre[];
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  spokenLanguages: SpokenLanguage[];
  videos?: MovieVideo[];
  cast?: MovieCast[];
  crew?: MovieCrew[];
}

/**
 * Movie with recommendation metadata
 */
export interface RecommendedMovie extends MovieBasic {
  isWatched?: boolean;
  isInWatchlist?: boolean;
  watchlistMemberCount?: number;
  recommendationScore?: number;
  scoreBreakdown?: {
    watchlistScore: number;
    qualityScore: number;
    recencyScore: number;
    userRatingScore: number;
    penalties: number;
  };
}

// ==========================================
// Recommendation Types
// ==========================================

/**
 * User's media library status
 */
export interface UserMediaStatus {
  tmdbId: string;
  status: string;
  source: string;
}

/**
 * Context for room recommendations
 */
export interface RoomRecommendationContext {
  roomId: string;
  memberIds: string[];
  type: 'movie' | 'tv';
  genreId: number;
  filters?: MovieFilters;
}

// ==========================================
// Filters & Search
// ==========================================

/**
 * Movie filters for search/discovery
 */
export interface MovieFilters {
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

// ==========================================
// Legacy Types (for backward compatibility)
// ==========================================

/**
 * @deprecated Use MovieBasic instead
 * Raw movie data from TMDB (before transformation)
 */
export interface MovieData {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  adult: boolean;
  genreIds: number[];
  originalLanguage: string;
  runtime?: number | null;
}
