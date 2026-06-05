import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { MovieBasicDto, MovieDetailsDto } from './dtos/movie-response.dto';
import {
  TMDbPopularResponse,
  TMDbMovieDetailsResponse,
} from '../tmdb/types/tmdb.types';
import { TmdbService } from '../tmdb/tmdb.service';
import { TMDB_IMAGE_BASE, TMDB_DEFAULT_LANG } from '../tmdb/tmdb.constants';
import { MovieDiscoverService } from './movie-discover.service';
import { MovieProviderService } from './movie-provider.service';

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  MOVIE_DETAILS: 24 * 60 * 60 * 1000, // 24 hours
} as const;

@Injectable()
export class MovieDetailsService {
  private readonly logger = new Logger(MovieDetailsService.name);

  constructor(
    private readonly tmdb: TmdbService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly movieDiscoverService: MovieDiscoverService,
    private readonly movieProviderService: MovieProviderService,
  ) {}

  private mapToMovieDetails(movie: TMDbMovieDetailsResponse): MovieDetailsDto {
    const movieWithGenreIds = {
      ...movie,
      genre_ids: movie.genres?.map((genre) => genre.id) ?? [],
    };
    return {
      ...this.movieDiscoverService.mapToMovieSummary(
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
            ? `${TMDB_IMAGE_BASE.PROFILE}${c.profile_path}`
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
          .map((m) => this.movieDiscoverService.mapToMovieSummary(m)) ?? [],
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
    const watchProviders = await this.movieProviderService.getWatchProviders(
      movieId,
      type,
      region,
    );
    result.watchProviders = watchProviders;

    // Store in cache
    await this.cacheManager.set(cacheKey, result, CACHE_TTL.MOVIE_DETAILS);

    return result;
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
