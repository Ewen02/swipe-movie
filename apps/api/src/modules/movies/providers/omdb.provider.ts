import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import {
  IMovieProvider,
  DiscoverParams,
  DiscoverResponse,
} from '../interfaces/movie-provider.interface';
import { MovieBasicDto, MoviesGenresDto, MovieDetailsDto } from '../dtos/movie-response.dto';

/**
 * OMDb API implementation of the movie provider interface
 *
 * IMPLEMENTATION STATUS: Skeleton only - not functional yet
 * This provider will be implemented in Phase 2 as a cost-effective alternative to TMDB
 *
 * OMDb API costs: $1-10/month vs TMDB Commercial $149/month
 * See: https://www.omdbapi.com/
 *
 * @see ROADMAP_SAAS.md Phase 2 for migration plan
 */
@Injectable()
export class OMDbProvider implements IMovieProvider {
  private readonly logger = new Logger(OMDbProvider.name);
  private readonly apiKey = process.env.OMDB_API_KEY;
  private readonly baseUrl = 'http://www.omdbapi.com/';

  /**
   * Discover movies/TV shows
   *
   * NOTE: OMDb doesn't have a direct "discover" endpoint like TMDB
   * Will need to implement search-based discovery or use genre keywords
   */
  async discover(params: DiscoverParams): Promise<DiscoverResponse> {
    this.logger.warn('OMDbProvider.discover() not yet implemented');
    throw new NotImplementedException(
      'OMDb provider is not yet implemented. Please use TMDB provider or implement this method.',
    );

    // TODO Phase 2: Implement using OMDb search with genre keywords
    // Example approach:
    // 1. Map genre IDs to keywords
    // 2. Use OMDb search API: http://www.omdbapi.com/?s=keyword&type=movie&page=1
    // 3. Filter by year, rating, etc.
    // 4. Transform response to DiscoverResponse format
  }

  /**
   * Get detailed information about a movie/TV show
   *
   * OMDb endpoint: http://www.omdbapi.com/?i=IMDB_ID or ?t=TITLE
   */
  async getDetails(id: string, type: 'movie' | 'tv'): Promise<MovieDetailsDto> {
    this.logger.warn('OMDbProvider.getDetails() not yet implemented');
    throw new NotImplementedException(
      'OMDb provider is not yet implemented. Please use TMDB provider or implement this method.',
    );

    // TODO Phase 2: Implement using OMDb get by ID
    // Example: http://www.omdbapi.com/?i=tt3896198&apikey=YOUR_KEY
    // Transform response to MovieDetailsDto format
  }

  /**
   * Search for movies/TV shows by query
   *
   * OMDb endpoint: http://www.omdbapi.com/?s=query&type=movie&page=1
   */
  async search(query: string, type: 'movie' | 'tv', page: number = 1): Promise<DiscoverResponse> {
    this.logger.warn('OMDbProvider.search() not yet implemented');
    throw new NotImplementedException(
      'OMDb provider is not yet implemented. Please use TMDB provider or implement this method.',
    );

    // TODO Phase 2: Implement using OMDb search
    // Example: http://www.omdbapi.com/?s=matrix&type=movie&page=1
    // Transform response to DiscoverResponse format
  }

  /**
   * Get available genres
   *
   * NOTE: OMDb doesn't provide a genres list endpoint
   * Will need to maintain a static list or scrape from IMDb
   */
  async getGenres(type: 'movie' | 'tv'): Promise<MoviesGenresDto[]> {
    this.logger.warn('OMDbProvider.getGenres() not yet implemented');
    throw new NotImplementedException(
      'OMDb provider is not yet implemented. Please use TMDB provider or implement this method.',
    );

    // TODO Phase 2: Return static genre list
    // OMDb doesn't provide genre endpoints, so we'll use IMDb standard genres
    // Example:
    // return [
    //   { id: 1, name: 'Action' },
    //   { id: 2, name: 'Comedy' },
    //   // ... etc
    // ];
  }

  /**
   * Get watch providers
   *
   * NOTE: OMDb doesn't provide watch provider information
   * May need to use a separate API like JustWatch or Streaming Availability API
   */
  async getWatchProviders(id: string, type: 'movie' | 'tv', region: string): Promise<any> {
    this.logger.warn('OMDbProvider.getWatchProviders() not yet implemented');

    // OMDb doesn't support watch providers
    // Return empty or use fallback to Streaming Availability API
    return null;
  }
}

/**
 * IMPLEMENTATION NOTES FOR PHASE 2:
 *
 * 1. API Key Setup:
 *    - Get API key from https://www.omdbapi.com/apikey.aspx
 *    - Add OMDB_API_KEY to .env
 *
 * 2. OMDb API Limitations:
 *    - 1,000 requests/day (free)
 *    - No genre discovery endpoint
 *    - No watch providers
 *    - Less comprehensive data than TMDB
 *    - Good for basic movie info + posters
 *
 * 3. Migration Strategy:
 *    - Implement all interface methods
 *    - Add integration tests
 *    - Test side-by-side with TMDB
 *    - Switch via env variable: MOVIE_API_PROVIDER=omdb
 *
 * 4. Cost Comparison:
 *    - OMDb: $10/month (Pro tier, unlimited requests)
 *    - TMDB: $149/month (Commercial license)
 *    - Savings: $139/month (~1600€/year)
 *
 * 5. Data Quality Trade-offs:
 *    - OMDb has good basic data (title, year, poster, ratings)
 *    - Missing: trailers, cast photos, comprehensive crew info
 *    - Acceptable for MVP/growth phase
 *    - Can upgrade to TMDB when revenue supports it
 */
