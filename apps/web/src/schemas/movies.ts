import { z } from "zod"

// Schema for watch provider
export const movieWatchProviderSchema = z.object({
  id: z.number(),
  name: z.string(),
  logoPath: z.string(),
})

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
})

// Schema for MoviesGenresDto
export const movieGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
})

// Schema for video
export const movieVideoSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  site: z.string(),
  type: z.string(),
  official: z.boolean(),
})

// Schema for cast member
export const movieCastSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profilePath: z.string().nullable(),
})

// Schema for crew member
export const movieCrewSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string(),
  department: z.string(),
})

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
})

// Array schemas
export const moviesListSchema = z.array(movieBasicSchema)
export const genresListSchema = z.array(movieGenreSchema)

// TypeScript types
export type MovieBasic = z.infer<typeof movieBasicSchema>
export type MovieGenre = z.infer<typeof movieGenreSchema>
export type MovieVideo = z.infer<typeof movieVideoSchema>
export type MovieCast = z.infer<typeof movieCastSchema>
export type MovieCrew = z.infer<typeof movieCrewSchema>
export type MovieWatchProvider = z.infer<typeof movieWatchProviderSchema>
export type MovieDetails = z.infer<typeof movieDetailsSchema>
export type MoviesList = z.infer<typeof moviesListSchema>
export type GenresList = z.infer<typeof genresListSchema>
