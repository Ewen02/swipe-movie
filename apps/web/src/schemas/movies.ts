import { z } from "zod"

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
})

// Schema for MoviesGenresDto
export const movieGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
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
})

// Array schemas
export const moviesListSchema = z.array(movieBasicSchema)
export const genresListSchema = z.array(movieGenreSchema)

// TypeScript types
export type MovieBasic = z.infer<typeof movieBasicSchema>
export type MovieGenre = z.infer<typeof movieGenreSchema>
export type MovieDetails = z.infer<typeof movieDetailsSchema>
export type MoviesList = z.infer<typeof moviesListSchema>
export type GenresList = z.infer<typeof genresListSchema>
