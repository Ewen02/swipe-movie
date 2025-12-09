// Movie data from TMDB
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

// Genre data
export interface GenreData {
  id: number;
  name: string;
}

// Watch provider data
export interface WatchProviderData {
  providerId: number;
  providerName: string;
  logoPath: string;
  displayPriority: number;
}

// Movie filters for search
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
