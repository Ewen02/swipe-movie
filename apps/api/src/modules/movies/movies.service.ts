import { Injectable } from '@nestjs/common';
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

@Injectable()
export class MoviesService {
  constructor(private readonly tmdb: TmdbService) {}

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
    };
  }

  async getMovieDetails(movieId: number): Promise<MovieDetailsDto> {
    const url = `/movie/${movieId}?language=${TMDB_DEFAULT_LANG}`;
    const json = await this.tmdb.fetchJson<TMDbMovieDetailsResponse>(url);
    return this.mapToMovieDetails(json);
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
    const params = new URLSearchParams({
      language: TMDB_DEFAULT_LANG,
      page: page.toString(),
      with_genres: genreId.toString(),
    });

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
    console.log('[MoviesService] TMDb URL:', url);
    console.log('[MoviesService] Filters applied:', JSON.stringify(filters, null, 2));

    const json = await this.tmdb.fetchJson<TMDbDiscoverResponse>(url);
    console.log(`[MoviesService] TMDb returned ${json.results?.length || 0} movies`);

    return (json.results ?? []).map((movie) => this.mapToMovieSummary(movie));
  }

  async getGenres(): Promise<MoviesGenresDto[]> {
    const url = `/genre/movie/list?language=${TMDB_DEFAULT_LANG}`;
    const json = await this.tmdb.fetchJson<TMDbGenresResponse>(url);
    return (json.genres ?? []).map((genre) => this.mapToMovieGenre(genre));
  }
}
