import { z } from "zod"
import type {
  MovieBasic as MovieBasicType,
  MovieDetails as MovieDetailsType,
  MovieGenre as MovieGenreType,
  MovieWatchProvider as MovieWatchProviderType,
  MovieVideo as MovieVideoType,
  MovieCast as MovieCastType,
  MovieCrew as MovieCrewType,
} from "@swipe-movie/types"

// ==========================================
// Zod Schemas for runtime validation
// ==========================================

// Schema for watch provider
export const movieWatchProviderSchema = z.object({
  id: z.number(),
  name: z.string(),
  logoPath: z.string(),
}) satisfies z.ZodType<MovieWatchProviderType>

// Schema for MovieBasicDto
export const movieBasicSchema = z.object({
  id: z.number(),
  adult: z.boolean(),
  title: z.string(),
  posterUrl: z.string(),
  backdropUrl: z.string(),
  genreIds: z.array(z.number()),
  originalLanguage: z.string(),
  originalTitle: z.string(),
  popularity: z.number(),
  releaseDate: z.string(),
  overview: z.string(),
  video: z.boolean(),
  voteAverage: z.number(),
  voteCount: z.number(),
  watchProviders: z.array(movieWatchProviderSchema).optional(),
  // Recommendation data (optional - from RecommendationsService)
  isWatched: z.boolean().optional(),
  isInWatchlist: z.boolean().optional(),
  watchlistMemberCount: z.number().optional(),
}) satisfies z.ZodType<MovieBasicType>

// Schema for MoviesGenresDto
export const movieGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
}) satisfies z.ZodType<MovieGenreType>

// Schema for video
export const movieVideoSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  site: z.string(),
  type: z.string(),
  official: z.boolean(),
}) satisfies z.ZodType<MovieVideoType>

// Schema for cast member
export const movieCastSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profilePath: z.string().nullable(),
}) satisfies z.ZodType<MovieCastType>

// Schema for crew member
export const movieCrewSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string(),
  department: z.string(),
}) satisfies z.ZodType<MovieCrewType>

// Schema for MovieDetailsDto
export const movieDetailsSchema = movieBasicSchema.extend({
  budget: z.number(),
  revenue: z.number(),
  runtime: z.number(),
  status: z.string(),
  tagline: z.string(),
  homepage: z.string(),
  imdbId: z.string(),
  genres: z.array(movieGenreSchema),
  productionCompanies: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      origin_country: z.string(),
    })
  ),
  productionCountries: z.array(
    z.object({
      iso_3166_1: z.string(),
      name: z.string(),
    })
  ),
  spokenLanguages: z.array(
    z.object({
      iso_639_1: z.string(),
      english_name: z.string(),
      name: z.string(),
    })
  ),
  videos: z.array(movieVideoSchema).optional(),
  cast: z.array(movieCastSchema).optional(),
  crew: z.array(movieCrewSchema).optional(),
}) satisfies z.ZodType<MovieDetailsType>

// Array schemas
export const moviesListSchema = z.array(movieBasicSchema)
export const genresListSchema = z.array(movieGenreSchema)

// ==========================================
// Re-export types from @swipe-movie/types
// ==========================================
export type {
  MovieBasic,
  MovieDetails,
  MovieGenre,
  MovieWatchProvider,
  MovieVideo,
  MovieCast,
  MovieCrew,
  RecommendedMovie,
  UserMediaStatus,
  MovieFilters,
} from "@swipe-movie/types"

// Local type aliases (for backward compatibility with z.infer usage)
export type MoviesList = z.infer<typeof moviesListSchema>
export type GenresList = z.infer<typeof genresListSchema>
