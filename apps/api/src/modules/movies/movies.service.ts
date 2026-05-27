import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import type { MovieFilters } from '@swipe-movie/types';
import { PrismaService } from '../../infra/prisma.service';
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

// Re-export for backward compatibility
export type { MovieFilters } from '@swipe-movie/types';

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  MOVIE_DETAILS: 24 * 60 * 60 * 1000, // 24 hours
  GENRES: 7 * 24 * 60 * 60 * 1000, // 7 days
  DISCOVER: 12 * 60 * 60 * 1000, // 12 hours (increased from 6h)
  WATCH_PROVIDERS: 7 * 24 * 60 * 60 * 1000, // 7 days
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
    private readonly tmdb: TmdbService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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
      similar:
        movie.similar?.results
          ?.slice(0, 12)
          .map((m) => this.mapToMovieSummary(m)) ?? [],
      externalIds: movie.external_ids
        ? {
            imdbId: movie.external_ids.imdb_id ?? undefined,
            facebookId: movie.external_ids.facebook_id ?? undefined,
            instagramId: movie.external_ids.instagram_id ?? undefined,
            twitterId: movie.external_ids.twitter_id ?? undefined,
          }
        : undefined,
    };
  }

  async getMovieDetails(
    movieId: number,
    type: 'movie' | 'tv' = 'movie',
    options: { language?: string; region?: string } = {},
  ): Promise<MovieDetailsDto> {
    const mediaType = type === 'tv' ? 'tv' : 'movie';
    const language = options.language ?? TMDB_DEFAULT_LANG;
    const region = options.region ?? 'FR';
    const cacheKey = `tmdb:${mediaType}:${movieId}:${language}:${region}`;

    // Try to get from cache
    const cached = await this.cacheManager.get<MovieDetailsDto>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from TMDb API with videos, credits, similar and external_ids in a single call
    const url = `/${mediaType}/${movieId}?language=${language}&append_to_response=videos,credits,similar,external_ids`;
    const json = await this.tmdb.fetchJson<TMDbMovieDetailsResponse>(url);
    const result = this.mapToMovieDetails(json);

    // Fetch watch providers separately (different endpoint shape) and add to result
    const watchProviders = await this.getWatchProviders(movieId, type, region);
    result.watchProviders = watchProviders;

    // Store in cache
    await this.cacheManager.set(cacheKey, result, CACHE_TTL.MOVIE_DETAILS);

    return result;
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

  async getWatchProviders(
    movieId: number,
    type: 'movie' | 'tv' = 'movie',
    region = 'FR',
  ): Promise<{ id: number; name: string; logoPath: string }[]> {
    const mediaType = type === 'tv' ? 'tv' : 'movie';
    const cacheKey = `tmdb:providers:${mediaType}:${movieId}:${region}`;

    // Try to get from cache
    const cached =
      await this.cacheManager.get<
        { id: number; name: string; logoPath: string }[]
      >(cacheKey);
    if (cached) {
      return cached;
    }

    const url = `/${mediaType}/${movieId}/watch/providers`;

    try {
      const json = await this.tmdb.fetchJson<TMDbWatchProvidersResponse>(url);

      // flatrate = streaming subscription. Falls back to empty array if region unknown.
      const regionProviders = json.results?.[region];
      if (!regionProviders?.flatrate) {
        // Cache empty result too to avoid repeated API calls
        await this.cacheManager.set(cacheKey, [], CACHE_TTL.WATCH_PROVIDERS);
        return [];
      }

      // Deduplicate providers by normalized name to avoid duplicates like
      // "Crunchyroll" and "Crunchyroll Amazon Channel"
      const uniqueProvidersMap = new Map<
        string,
        { id: number; name: string; logoPath: string }
      >();

      // Patterns to normalize provider names (remove channel suffixes)
      const normalizeProviderName = (name: string): string => {
        return name
          .replace(/ Amazon Channel$/i, '')
          .replace(/ Apple TV Channel$/i, '')
          .replace(/ Roku Premium Channel$/i, '')
          .trim();
      };

      regionProviders.flatrate.forEach((p) => {
        const normalizedName = normalizeProviderName(p.provider_name);
        // Keep the first occurrence (usually the main provider, not the channel)
        if (!uniqueProvidersMap.has(normalizedName)) {
          uniqueProvidersMap.set(normalizedName, {
            id: p.provider_id,
            name: normalizedName, // Use normalized name
            logoPath: p.logo_path
              ? `${TMDB_IMAGE_BASE.POSTER}${p.logo_path}`
              : '',
          });
        }
      });

      // Return array of unique provider objects
      const result = Array.from(uniqueProvidersMap.values());

      // Store in cache
      await this.cacheManager.set(cacheKey, result, CACHE_TTL.WATCH_PROVIDERS);

      return result;
    } catch (error) {
      this.logger.error(
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

  async getBatchWatchProviders(
    movieIds: number[],
    type: 'movie' | 'tv' = 'movie',
  ): Promise<Record<number, { id: number; name: string; logoPath: string }[]>> {
    // Fetch all watch providers in parallel
    const results = await Promise.allSettled(
      movieIds.map(async (id) => ({
        movieId: id,
        providers: await this.getWatchProviders(id, type),
      })),
    );

    // Build a map of movieId -> providers
    const providersMap: Record<
      number,
      { id: number; name: string; logoPath: string }[]
    > = {};

    results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<{
          movieId: number;
          providers: { id: number; name: string; logoPath: string }[];
        }> => result.status === 'fulfilled',
      )
      .forEach((result) => {
        providersMap[result.value.movieId] = result.value.providers;
      });

    return providersMap;
  }

  async getAllWatchProviders(
    region: string = 'FR',
  ): Promise<{ id: number; name: string; logoPath: string }[]> {
    const cacheKey = `tmdb:providers:${region}`;

    // Try to get from cache
    const cached =
      await this.cacheManager.get<
        { id: number; name: string; logoPath: string }[]
      >(cacheKey);
    if (cached) {
      return cached;
    }

    const url = `/watch/providers/movie?language=${TMDB_DEFAULT_LANG}&watch_region=${region}`;

    try {
      const json = await this.tmdb.fetchJson<{
        results: {
          provider_id: number;
          provider_name: string;
          logo_path: string;
          display_priority: number;
        }[];
      }>(url);

      // Map and sort by display priority
      const providers = json.results
        .map((p) => ({
          id: p.provider_id,
          name: p.provider_name,
          logoPath: p.logo_path
            ? `${TMDB_IMAGE_BASE.POSTER}${p.logo_path}`
            : '',
          displayPriority: p.display_priority,
        }))
        .sort((a, b) => a.displayPriority - b.displayPriority)
        .map(({ id, name, logoPath }) => ({ id, name, logoPath }));

      // Store in cache (7 days)
      await this.cacheManager.set(cacheKey, providers, CACHE_TTL.GENRES);

      return providers;
    } catch (error) {
      this.logger.error(
        `Failed to fetch watch providers for ${region}:`,
        error,
      );
      return [];
    }
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

  /**
   * Clear all movie cache (useful for development)
   */
  async clearCache(): Promise<void> {
    await this.cacheManager.clear();
  }
}
