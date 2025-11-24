import { Injectable } from '@nestjs/common';
import {
  IMovieProvider,
  DiscoverParams,
  DiscoverResponse,
} from '../interfaces/movie-provider.interface';
import { MoviesGenresDto, MovieDetailsDto } from '../dtos/movie-response.dto';
import { MoviesService, MovieFilters } from '../movies.service';

/**
 * TMDB implementation of the movie provider interface
 * Wraps the existing TMDB service to conform to the IMovieProvider interface
 */
@Injectable()
export class TMDBProvider implements IMovieProvider {
  constructor(private readonly moviesService: MoviesService) {}

  /**
   * Discover movies/TV shows using TMDB API
   */
  async discover(params: DiscoverParams): Promise<DiscoverResponse> {
    const {
      type = 'movie',
      genreId,
      page = 1,
      minRating,
      releaseYearMin,
      releaseYearMax,
      runtimeMin,
      runtimeMax,
      watchProviders,
      watchRegion,
      originalLanguage,
    } = params;

    // Build filters for the existing movies service
    const filters: MovieFilters = {};
    if (minRating !== undefined) filters.minRating = minRating;
    if (releaseYearMin !== undefined) filters.releaseYearMin = releaseYearMin;
    if (releaseYearMax !== undefined) filters.releaseYearMax = releaseYearMax;
    if (runtimeMin !== undefined) filters.runtimeMin = runtimeMin;
    if (runtimeMax !== undefined) filters.runtimeMax = runtimeMax;
    if (watchProviders !== undefined) filters.watchProviders = watchProviders;
    if (watchRegion !== undefined) filters.watchRegion = watchRegion;
    if (originalLanguage !== undefined) filters.originalLanguage = originalLanguage;

    // Use existing movies service method (getMoviesByGenre)
    // Signature: getMoviesByGenre(genreId, type, page, filters)
    const results = await this.moviesService.getMoviesByGenre(genreId || 0, type, page, filters);

    // Transform to DiscoverResponse format
    return {
      page,
      results,
      total_pages: 500, // TMDB default max pages
      total_results: results.length * page,
    };
  }

  /**
   * Get detailed information about a movie/TV show
   */
  async getDetails(id: string, type: 'movie' | 'tv'): Promise<MovieDetailsDto> {
    return await this.moviesService.getMovieDetails(parseInt(id, 10), type);
  }

  /**
   * Search for movies/TV shows
   * Note: MoviesService doesn't have a search method yet - this is a TODO
   */
  async search(_query: string, _type: 'movie' | 'tv', page: number = 1): Promise<DiscoverResponse> {
    // TODO: Implement search in MoviesService
    // For now, return empty results
    return {
      page,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  /**
   * Get available genres
   */
  async getGenres(_type: 'movie' | 'tv'): Promise<MoviesGenresDto[]> {
    // MoviesService.getGenres() doesn't take type parameter
    // It returns all genres (movies + TV)
    return await this.moviesService.getGenres();
  }

  /**
   * Get watch providers for a movie/TV show
   */
  async getWatchProviders(id: string, type: 'movie' | 'tv', _region: string): Promise<any> {
    // MoviesService.getWatchProviders takes (id, type)
    return await this.moviesService.getWatchProviders(parseInt(id, 10), type);
  }
}
