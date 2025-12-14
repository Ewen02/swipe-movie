import { GET } from "@/lib/api"
import { parseResponse, withErrors } from "@/lib/http"
import {
  MovieBasic,
  MovieDetails,
  MovieGenre,
  MovieWatchProvider,
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

  return parseResponse(
    await GET(url),
    moviesListSchema,
    withErrors("MOVIES")
  )
}

/**
 * Get detailed information about a specific movie or TV show
 */
export async function getMovieDetails(
  movieId: number,
  type: "movie" | "tv" = "movie"
): Promise<MovieDetails> {
  return parseResponse(
    await GET(`/movies/${movieId}?type=${type}`),
    movieDetailsSchema,
    withErrors("MOVIES")
  )
}

/**
 * Get detailed information about multiple movies in batch
 */
export async function getBatchMovieDetails(movieIds: number[]): Promise<MovieDetails[]> {
  if (movieIds.length === 0) return []

  const response = await GET(`/movies/batch/details?ids=${movieIds.join(',')}`)
  if (!response.ok) {
    throw new Error("Failed to fetch batch movie details")
  }

  const data = await response.json()
  return Array.isArray(data) ? data : []
}

/**
 * Get watch providers for a specific movie
 */
export async function getMovieWatchProviders(
  movieId: number,
  type: "movie" | "tv" = "movie"
): Promise<MovieWatchProvider[]> {
  const response = await GET(`/movies/${movieId}/providers?type=${type}`)
  if (!response.ok) {
    return []
  }
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

/**
 * Get watch providers for multiple movies in batch
 */
export async function getBatchWatchProviders(
  movieIds: number[],
  type: "movie" | "tv" = "movie"
): Promise<Record<number, MovieWatchProvider[]>> {
  if (movieIds.length === 0) return {}

  const response = await GET(`/movies/batch/providers?ids=${movieIds.join(',')}&type=${type}`)
  if (!response.ok) {
    return {}
  }

  const data = await response.json()
  return typeof data === 'object' && data !== null ? data : {}
}

/**
 * Get all available watch providers for a region
 */
export async function getAllWatchProviders(
  region: string = "FR"
): Promise<MovieWatchProvider[]> {
  const response = await GET(`/movies/providers/all?region=${region}`)
  if (!response.ok) {
    return []
  }
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

/**
 * Get recommended movies for a room with watched/watchlist indicators
 * This endpoint enriches movies with isWatched, isInWatchlist, and watchlistMemberCount
 */
export async function getRecommendedMoviesForRoom(
  roomId: string,
  page = 1
): Promise<MovieBasic[]> {
  const response = await GET(`/recommendations/room/${roomId}?page=${page}`)
  if (!response.ok) {
    console.error("Failed to fetch recommendations")
    return []
  }
  const data = await response.json()
  return data.movies || []
}
