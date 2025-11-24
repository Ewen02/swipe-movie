import { MovieBasicDto, MoviesGenresDto, MovieDetailsDto } from '../dtos/movie-response.dto';

/**
 * Parameters for discovering movies/TV shows
 */
export interface DiscoverParams {
  type?: 'movie' | 'tv';
  genreId?: number;
  page?: number;
  minRating?: number;
  releaseYearMin?: number;
  releaseYearMax?: number;
  runtimeMin?: number;
  runtimeMax?: number;
  watchProviders?: number[];
  watchRegion?: string;
  originalLanguage?: string;
}

/**
 * Response from discover endpoint
 */
export interface DiscoverResponse {
  page: number;
  results: MovieBasicDto[];
  total_pages: number;
  total_results: number;
}

/**
 * Interface for movie data providers (TMDB, OMDb, etc.)
 * Allows easy switching between different movie APIs
 */
export interface IMovieProvider {
  /**
   * Discover movies or TV shows based on filters
   * @param params - Discovery parameters (genre, year, rating, etc.)
   * @returns Paginated list of movies/TV shows
   */
  discover(params: DiscoverParams): Promise<DiscoverResponse>;

  /**
   * Get detailed information about a specific movie/TV show
   * @param id - Movie/TV show ID (string for flexibility across providers)
   * @param type - Media type ('movie' or 'tv')
   * @returns Detailed movie/TV show information
   */
  getDetails(id: string, type: 'movie' | 'tv'): Promise<MovieDetailsDto>;

  /**
   * Search for movies/TV shows by query
   * @param query - Search query string
   * @param type - Media type ('movie' or 'tv')
   * @param page - Page number for pagination
   * @returns Paginated search results
   */
  search(query: string, type: 'movie' | 'tv', page?: number): Promise<DiscoverResponse>;

  /**
   * Get list of available genres
   * @param type - Media type ('movie' or 'tv')
   * @returns List of genres with IDs and names
   */
  getGenres(type: 'movie' | 'tv'): Promise<MoviesGenresDto[]>;

  /**
   * Get watch providers (streaming platforms) for a movie/TV show
   * @param id - Movie/TV show ID
   * @param type - Media type ('movie' or 'tv')
   * @param region - ISO 3166-1 region code (e.g., 'FR', 'US')
   * @returns List of watch providers with links
   */
  getWatchProviders?(id: string, type: 'movie' | 'tv', region: string): Promise<any>;
}
