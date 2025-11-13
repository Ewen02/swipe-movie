import { GET } from "@/lib/api"
import { parseResponse, withErrors } from "@/lib/http"
import {
  MovieBasic,
  MovieDetails,
  MovieGenre,
  moviesListSchema,
  genresListSchema,
  movieDetailsSchema,
} from "@/schemas/movies"

export interface MovieFilters {
  minRating?: number
  releaseYearMin?: number
  releaseYearMax?: number
  runtimeMin?: number
  runtimeMax?: number
  watchProviders?: number[]
  watchRegion?: string
  originalLanguage?: string
}

/**
 * Get popular movies
 */
export async function getPopularMovies(page = 1): Promise<MovieBasic[]> {
  return parseResponse(
    await GET(`/movies/popular?page=${page}`),
    moviesListSchema,
    withErrors("MOVIES")
  )
}

/**
 * Get list of movie/TV genres
 */
export async function getGenres(): Promise<MovieGenre[]> {
  return parseResponse(
    await GET("/movies/genres"),
    genresListSchema,
    withErrors("MOVIES")
  )
}

/**
 * Get movies filtered by genre and type
 */
export async function getMoviesByGenre(
  genreId: number,
  type: "movie" | "tv" = "movie",
  page = 1,
  filters?: MovieFilters
): Promise<MovieBasic[]> {
  const params = new URLSearchParams({
    type,
    page: page.toString(),
  })

  if (filters?.minRating) {
    params.append("minRating", filters.minRating.toString())
  }
  if (filters?.releaseYearMin) {
    params.append("releaseYearMin", filters.releaseYearMin.toString())
  }
  if (filters?.releaseYearMax) {
    params.append("releaseYearMax", filters.releaseYearMax.toString())
  }
  if (filters?.runtimeMin) {
    params.append("runtimeMin", filters.runtimeMin.toString())
  }
  if (filters?.runtimeMax) {
    params.append("runtimeMax", filters.runtimeMax.toString())
  }
  if (filters?.watchProviders && filters.watchProviders.length > 0) {
    params.append("watchProviders", filters.watchProviders.join(","))
  }
  if (filters?.watchRegion) {
    params.append("watchRegion", filters.watchRegion)
  }
  if (filters?.originalLanguage) {
    params.append("originalLanguage", filters.originalLanguage)
  }

  const url = `/movies/genre/${genreId}?${params.toString()}`
  console.log("Fetching movies from API:", url, "Filters:", filters)

  return parseResponse(
    await GET(url),
    moviesListSchema,
    withErrors("MOVIES")
  )
}

/**
 * Get detailed information about a specific movie
 */
export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  return parseResponse(
    await GET(`/movies/${movieId}`),
    movieDetailsSchema,
    withErrors("MOVIES")
  )
}
