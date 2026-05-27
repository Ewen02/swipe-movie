import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import type { MovieFilters } from '@swipe-movie/types';
import {
  MovieBasicDto,
  MoviesGenresDto,
} from './dtos/movie-response.dto';
import {
  TMDbDiscoverResponse,
  TMDbGenresResponse,
} from '../tmdb/types/tmdb.types';
import { TmdbService } from '../tmdb/tmdb.service';
import { TMDB_IMAGE_BASE, TMDB_DEFAULT_LANG } from '../tmdb/tmdb.constants';

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  GENRES: 7 * 24 * 60 * 60 * 1000, // 7 days
  DISCOVER: 12 * 60 * 60 * 1000, // 12 hours
} as const;

@Injectable()
export class MovieDiscoverService {
  private readonly logger = new Logger(MovieDiscoverService.name);

  constructor(
    private readonly tmdb: TmdbService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * Generate a cache key hash from an object
   */
  private generateCacheKey(prefix: string, params?: unknown): string {
    if (!params) {
      return prefix;
    }
    const hash = crypto
      .createHash('md5')
      .update(JSON.stringify(params))
      .digest('hex');
    return `${prefix}:${hash}`;
  }

  mapToMovieSummary(
    media: TMDbDiscoverResponse['results'][number],
  ): MovieBasicDto {
    // TMDb returns either a movie (title/release_date) or a TV show (name/first_air_date).
    // We narrow with a type guard so the rest of the mapping is type-checked.
    const isTVShow = (
      m: typeof media,
    ): m is Extract<typeof media, { name: string }> => 'name' in m;

    return {
      id: media.id,
      adult: media.adult ?? false,
      title: isTVShow(media) ? media.name : media.title,
      backdropUrl: media.backdrop_path
        ? `${TMDB_IMAGE_BASE.BACKDROP}${media.backdrop_path}`
        : '',
      posterUrl: media.poster_path
        ? `${TMDB_IMAGE_BASE.POSTER}${media.poster_path}`
        : TMDB_IMAGE_BASE.NO_POSTER,
      genreIds: media.genre_ids ?? [],
      originalLanguage: media.original_language ?? '',
      originalTitle: isTVShow(media)
        ? media.original_name
        : media.original_title,
      popularity: media.popularity ?? 0,
      releaseDate: isTVShow(media)
        ? (media.first_air_date ?? '')
        : (media.release_date ?? ''),
      overview: media.overview ?? '',
      video: isTVShow(media) ? false : (media.video ?? false),
      voteAverage: media.vote_average ?? 0,
      voteCount: media.vote_count ?? 0,
    };
  }

  private mapToMovieGenre(
    genre: TMDbGenresResponse['genres'][number],
  ): MoviesGenresDto {
    return {
      id: genre.id,
      name: genre.name ?? '',
    };
  }

  async getPopularMovies(page = 1, region = 'FR'): Promise<MovieBasicDto[]> {
    // Use discover endpoint with watch providers filter to exclude cinema-only releases
    const DEFAULT_PROVIDERS = [8, 119, 337, 350, 531, 381, 283, 56, 1899, 1796];
    const params = new URLSearchParams({
      language: TMDB_DEFAULT_LANG,
      page: page.toString(),
      sort_by: 'popularity.desc',
      with_watch_providers: DEFAULT_PROVIDERS.join('|'),
      watch_region: region,
      'vote_count.gte': '100', // Only movies with enough votes
    });

    const url = `/discover/movie?${params.toString()}`;
    const json = await this.tmdb.fetchJson<TMDbDiscoverResponse>(url);
    return (json.results ?? []).map((movie) => this.mapToMovieSummary(movie));
  }

  async getMoviesByGenre(
    genreId: number,
    type: 'movie' | 'tv' = 'movie',
    page = 1,
    filters?: MovieFilters,
  ): Promise<MovieBasicDto[]> {
    const mediaType = type === 'tv' ? 'tv' : 'movie';

    // Generate cache key based on all parameters
    const cacheKey = this.generateCacheKey('tmdb:discover', {
      genreId,
      type,
      page,
      filters,
    });

    // Try to get from cache
    const cached = await this.cacheManager.get<MovieBasicDto[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build query parameters
    const params = new URLSearchParams({
      language: TMDB_DEFAULT_LANG,
      page: page.toString(),
    });

    // Only add with_genres if genreId is not 0 (0 means "all genres")
    if (genreId !== 0) {
      params.append('with_genres', genreId.toString());
    }

    // Add filters
    if (filters?.minRating) {
      params.append('vote_average.gte', filters.minRating.toString());
      // Aussi exiger un minimum de 100 votes pour éviter les films sans notes
      params.append('vote_count.gte', '100');
    }
    if (filters?.releaseYearMin) {
      const date = `${filters.releaseYearMin}-01-01`;
      params.append(
        type === 'tv' ? 'first_air_date.gte' : 'primary_release_date.gte',
        date,
      );
    }
    if (filters?.releaseYearMax) {
      const date = `${filters.releaseYearMax}-12-31`;
      params.append(
        type === 'tv' ? 'first_air_date.lte' : 'primary_release_date.lte',
        date,
      );
    }
    if (filters?.runtimeMin) {
      params.append('with_runtime.gte', filters.runtimeMin.toString());
    }
    if (filters?.runtimeMax) {
      params.append('with_runtime.lte', filters.runtimeMax.toString());
    }
    // Always filter by watch providers to exclude cinema-only releases
    // If no providers specified, use popular streaming services in France
    const DEFAULT_PROVIDERS = [8, 119, 337, 350, 531, 381, 283, 56, 1899, 1796]; // Netflix, Prime, Disney+, Apple TV+, Paramount+, Canal+, Crunchyroll, OCS, Max, OCS
    const providers =
      filters?.watchProviders && filters.watchProviders.length > 0
        ? filters.watchProviders
        : DEFAULT_PROVIDERS;

    params.append('with_watch_providers', providers.join('|'));
    // TMDB requires watch_region when filtering by providers
    params.append('watch_region', filters?.watchRegion || 'FR');
    if (filters?.originalLanguage) {
      params.append('with_original_language', filters.originalLanguage);
    }

    // Exclude cinema-only releases: only include Digital (4), Physical (5), TV (6)
    if (mediaType === 'movie') {
      params.append('with_release_type', '4|5|6');
    }

    const url = `/discover/${mediaType}?${params.toString()}`;

    // Fetch from TMDb API
    const json = await this.tmdb.fetchJson<TMDbDiscoverResponse>(url);
    const result = (json.results ?? []).map((movie) =>
      this.mapToMovieSummary(movie),
    );

    // Store in cache
    await this.cacheManager.set(cacheKey, result, CACHE_TTL.DISCOVER);

    return result;
  }

  async getGenres(): Promise<MoviesGenresDto[]> {
    const cacheKey = 'tmdb:genres:movie';

    // Try to get from cache
    const cached = await this.cacheManager.get<MoviesGenresDto[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from TMDb API
    const url = `/genre/movie/list?language=${TMDB_DEFAULT_LANG}`;
    const json = await this.tmdb.fetchJson<TMDbGenresResponse>(url);
    const result = (json.genres ?? []).map((genre) =>
      this.mapToMovieGenre(genre),
    );

    // Store in cache
    await this.cacheManager.set(cacheKey, result, CACHE_TTL.GENRES);

    return result;
  }

  /**
   * Search for movies or TV shows by query
   */
  async searchMovies(
    query: string,
    type: 'movie' | 'tv' = 'movie',
    page = 1,
  ): Promise<MovieBasicDto[]> {
    const mediaType = type === 'tv' ? 'tv' : 'movie';

    // Generate cache key based on all parameters
    const cacheKey = this.generateCacheKey('tmdb:search', {
      query,
      type,
      page,
    });

    // Try to get from cache
    const cached = await this.cacheManager.get<MovieBasicDto[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build query parameters
    const params = new URLSearchParams({
      language: TMDB_DEFAULT_LANG,
      query: query,
      page: page.toString(),
      include_adult: 'false',
    });

    const url = `/search/${mediaType}?${params.toString()}`;

    // Fetch from TMDb API
    const json = await this.tmdb.fetchJson<TMDbDiscoverResponse>(url);
    const result = (json.results ?? []).map((movie) =>
      this.mapToMovieSummary(movie),
    );

    // Store in cache (shorter TTL for search results)
    await this.cacheManager.set(cacheKey, result, CACHE_TTL.DISCOVER);

    return result;
  }
}
