import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import {
  MovieBasicDto,
  MoviesGenresDto,
  MovieDetailsDto,
} from './dtos/movie-response.dto';
import {
  TMDbPopularResponse,
  TMDbDiscoverResponse,
  TMDbGenresResponse,
  TMDbMovieDetailsResponse,
  TMDbWatchProvidersResponse,
} from '../tmdb/types/tmdb.types';
import { TmdbService } from '../tmdb/tmdb.service';
import { TMDB_IMAGE_BASE, TMDB_DEFAULT_LANG } from '../tmdb/tmdb.constants';

export interface MovieFilters {
  minRating?: number;
  releaseYearMin?: number;
  releaseYearMax?: number;
  runtimeMin?: number;
  runtimeMax?: number;
  watchProviders?: number[];
  watchRegion?: string;
  originalLanguage?: string;
}

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  MOVIE_DETAILS: 24 * 60 * 60 * 1000, // 24 hours
  GENRES: 7 * 24 * 60 * 60 * 1000, // 7 days
  DISCOVER: 60 * 60 * 1000, // 1 hour
  WATCH_PROVIDERS: 24 * 60 * 60 * 1000, // 24 hours
} as const;

@Injectable()
export class MoviesService {
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

  private mapToMovieSummary(
    movie: TMDbPopularResponse['results'][number],
  ): MovieBasicDto {
    return {
      id: movie.id,
      adult: movie.adult ?? false,
      title: movie.title,
      backdropUrl: movie.backdrop_path
        ? `${TMDB_IMAGE_BASE.BACKDROP}${movie.backdrop_path}`
        : '',
      posterUrl: movie.poster_path
        ? `${TMDB_IMAGE_BASE.POSTER}${movie.poster_path}`
        : TMDB_IMAGE_BASE.NO_POSTER,
      genreIds: movie.genre_ids ?? [],
      originalLanguage: movie.original_language ?? '',
      originalTitle: movie.original_title ?? '',
      popularity: movie.popularity ?? 0,
      releaseDate: movie.release_date ?? '',
      overview: movie.overview ?? '',
      video: movie.video ?? false,
      voteAverage: movie.vote_average ?? 0,
      voteCount: movie.vote_count ?? 0,
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

  private mapToMovieDetails(movie: TMDbMovieDetailsResponse): MovieDetailsDto {
    const movieWithGenreIds = {
      ...movie,
      genre_ids: movie.genres?.map((genre) => genre.id) ?? [],
    };
    return {
      ...this.mapToMovieSummary(
        movieWithGenreIds as TMDbPopularResponse['results'][number],
      ),
      budget: movie.budget ?? 0,
      revenue: movie.revenue ?? 0,
      runtime: movie.runtime ?? 0,
      status: movie.status ?? '',
      tagline: movie.tagline ?? '',
      homepage: movie.homepage ?? '',
      imdbId: movie.imdb_id ?? '',
      genres: movie.genres?.map((g) => ({ id: g.id, name: g.name })) ?? [],
      productionCompanies:
        movie.production_companies?.map((c) => ({
          id: c.id,
          name: c.name,
          origin_country: c.origin_country ?? '',
        })) ?? [],
      productionCountries:
        movie.production_countries?.map((c) => ({
          iso_3166_1: c.iso_3166_1,
          name: c.name,
        })) ?? [],
      spokenLanguages:
        movie.spoken_languages?.map((l) => ({
          iso_639_1: l.iso_639_1,
          english_name: l.english_name,
          name: l.name,
        })) ?? [],
      videos:
        movie.videos?.results?.map((v) => ({
          id: v.id,
          key: v.key,
          name: v.name,
          site: v.site,
          type: v.type,
          official: v.official,
        })) ?? [],
      cast:
        movie.credits?.cast?.slice(0, 10).map((c) => ({
          id: c.id,
          name: c.name,
          character: c.character,
          profilePath: c.profile_path
            ? `${TMDB_IMAGE_BASE.POSTER}${c.profile_path}`
            : null,
        })) ?? [],
      crew:
        movie.credits?.crew
          ?.filter((c) => ['Director', 'Writer', 'Producer'].includes(c.job))
          .slice(0, 5)
          .map((c) => ({
            id: c.id,
            name: c.name,
            job: c.job,
            department: c.department,
          })) ?? [],
    };
  }

  async getMovieDetails(movieId: number): Promise<MovieDetailsDto> {
    const cacheKey = `tmdb:movie:${movieId}`;

    // Try to get from cache
    const cached = await this.cacheManager.get<MovieDetailsDto>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from TMDb API with videos and credits
    const url = `/movie/${movieId}?language=${TMDB_DEFAULT_LANG}&append_to_response=videos,credits`;
    const json = await this.tmdb.fetchJson<TMDbMovieDetailsResponse>(url);
    const result = this.mapToMovieDetails(json);

    // Store in cache
    await this.cacheManager.set(cacheKey, result, CACHE_TTL.MOVIE_DETAILS);

    return result;
  }

  async getPopularMovies(page = 1): Promise<MovieBasicDto[]> {
    const url = `/movie/popular?language=${TMDB_DEFAULT_LANG}&page=${page}`;
    const json = await this.tmdb.fetchJson<TMDbPopularResponse>(url);
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
    if (filters?.watchProviders && filters.watchProviders.length > 0) {
      params.append('with_watch_providers', filters.watchProviders.join('|'));
      if (filters.watchRegion) {
        params.append('watch_region', filters.watchRegion);
      }
    }
    if (filters?.originalLanguage) {
      params.append('with_original_language', filters.originalLanguage);
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

  async getWatchProviders(
    movieId: number,
    type: 'movie' | 'tv' = 'movie',
  ): Promise<number[]> {
    const mediaType = type === 'tv' ? 'tv' : 'movie';
    const cacheKey = `tmdb:providers:${mediaType}:${movieId}`;

    // Try to get from cache
    const cached = await this.cacheManager.get<number[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const url = `/${mediaType}/${movieId}/watch/providers`;

    try {
      const json = await this.tmdb.fetchJson<TMDbWatchProvidersResponse>(url);

      // Get providers for France (FR) - flatrate means streaming subscription
      const frProviders = json.results?.['FR'];
      if (!frProviders?.flatrate) {
        // Cache empty result too to avoid repeated API calls
        await this.cacheManager.set(cacheKey, [], CACHE_TTL.WATCH_PROVIDERS);
        return [];
      }

      // Return array of provider IDs
      const result = frProviders.flatrate.map((p) => p.provider_id);

      // Store in cache
      await this.cacheManager.set(cacheKey, result, CACHE_TTL.WATCH_PROVIDERS);

      return result;
    } catch (error) {
      console.error(
        `Failed to fetch watch providers for ${mediaType} ${movieId}:`,
        error,
      );
      return [];
    }
  }

  async getBatchMovieDetails(movieIds: number[]): Promise<MovieDetailsDto[]> {
    // Fetch all movie details in parallel
    const results = await Promise.allSettled(
      movieIds.map((id) => this.getMovieDetails(id)),
    );

    // Filter out failed requests and return successful ones
    return results
      .filter(
        (result): result is PromiseFulfilledResult<MovieDetailsDto> =>
          result.status === 'fulfilled',
      )
      .map((result) => result.value);
  }
}
