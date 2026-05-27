import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import type { MovieFilters } from '@swipe-movie/types';
import { PrismaService } from '../../infra/prisma.service';
import {
  MovieBasicDto,
  MoviesGenresDto,
  MovieDetailsDto,
} from './dtos/movie-response.dto';
import { MovieDiscoverService } from './movie-discover.service';
import { MovieDetailsService } from './movie-details.service';
import { MovieProviderService } from './movie-provider.service';

// Re-export for backward compatibility
export type { MovieFilters } from '@swipe-movie/types';

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  PUBLIC_STATS: 30 * 60 * 1000, // 30 minutes — kept short so SEO pages reflect recent activity
} as const;

const MIN_SWIPES_FOR_STATS = 50;

export type PublicMovieStats = {
  likeRate: number | null;
  swipeCount: number;
  matchCount: number;
  hasEnoughData: boolean;
};

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly movieDiscoverService: MovieDiscoverService,
    private readonly movieDetailsService: MovieDetailsService,
    private readonly movieProviderService: MovieProviderService,
  ) {}

  /**
   * Aggregated, anonymous statistics computed from real user swipes & matches.
   * Returned `hasEnoughData` is false below MIN_SWIPES_FOR_STATS to avoid
   * misleading ratios on tiny samples and to protect against single-user inference.
   */
  async getPublicStats(movieId: number): Promise<PublicMovieStats> {
    const cacheKey = `tmdb:public-stats:${movieId}`;
    const cached = await this.cacheManager.get<PublicMovieStats>(cacheKey);
    if (cached) return cached;

    const movieIdStr = movieId.toString();

    const [likeCount, swipeCount, matchCount] = await Promise.all([
      this.prisma.swipe.count({ where: { movieId: movieIdStr, value: true } }),
      this.prisma.swipe.count({ where: { movieId: movieIdStr } }),
      this.prisma.match.count({ where: { movieId: movieIdStr } }),
    ]);

    const hasEnoughData = swipeCount >= MIN_SWIPES_FOR_STATS;
    const result: PublicMovieStats = {
      likeRate: hasEnoughData ? likeCount / swipeCount : null,
      swipeCount,
      matchCount,
      hasEnoughData,
    };

    await this.cacheManager.set(cacheKey, result, CACHE_TTL.PUBLIC_STATS);
    return result;
  }

  async getMovieDetails(
    movieId: number,
    type: 'movie' | 'tv' = 'movie',
    options: { language?: string; region?: string } = {},
  ): Promise<MovieDetailsDto> {
    return this.movieDetailsService.getMovieDetails(movieId, type, options);
  }

  async getPopularMovies(page = 1, region = 'FR'): Promise<MovieBasicDto[]> {
    return this.movieDiscoverService.getPopularMovies(page, region);
  }

  async getMoviesByGenre(
    genreId: number,
    type: 'movie' | 'tv' = 'movie',
    page = 1,
    filters?: MovieFilters,
  ): Promise<MovieBasicDto[]> {
    return this.movieDiscoverService.getMoviesByGenre(genreId, type, page, filters);
  }

  async getGenres(): Promise<MoviesGenresDto[]> {
    return this.movieDiscoverService.getGenres();
  }

  async getWatchProviders(
    movieId: number,
    type: 'movie' | 'tv' = 'movie',
    region = 'FR',
  ): Promise<{ id: number; name: string; logoPath: string }[]> {
    return this.movieProviderService.getWatchProviders(movieId, type, region);
  }

  async getBatchMovieDetails(movieIds: number[]): Promise<MovieDetailsDto[]> {
    return this.movieDetailsService.getBatchMovieDetails(movieIds);
  }

  async getBatchWatchProviders(
    movieIds: number[],
    type: 'movie' | 'tv' = 'movie',
  ): Promise<Record<number, { id: number; name: string; logoPath: string }[]>> {
    return this.movieProviderService.getBatchWatchProviders(movieIds, type);
  }

  async getAllWatchProviders(
    region: string = 'FR',
  ): Promise<{ id: number; name: string; logoPath: string }[]> {
    return this.movieProviderService.getAllWatchProviders(region);
  }

  async searchMovies(
    query: string,
    type: 'movie' | 'tv' = 'movie',
    page = 1,
  ): Promise<MovieBasicDto[]> {
    return this.movieDiscoverService.searchMovies(query, type, page);
  }

  /**
   * Clear all movie cache (useful for development)
   */
  async clearCache(): Promise<void> {
    await this.cacheManager.clear();
  }
}
