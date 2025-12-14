import { useState, useEffect, useCallback } from "react"
import { useSession } from "@/lib/auth-client"
import { getMoviesByGenre, getBatchWatchProviders, getRecommendedMoviesForRoom, MovieFilters } from "@/lib/api/movies"
import { shuffleWithSeed } from "@/lib/utils"
import type { RoomWithMembersResponseDto } from "@/schemas/rooms"
import type { MovieBasic } from "@/schemas/movies"

interface UseMoviesDataProps {
  room: RoomWithMembersResponseDto | null
  swipedMovieIds: Set<string>
  swipesLoaded: boolean
}

interface UseMoviesDataReturn {
  movies: MovieBasic[]
  setMovies: React.Dispatch<React.SetStateAction<MovieBasic[]>>
  moviesLoading: boolean
  currentPage: number
  hasMoreMovies: boolean
  loadMovies: (
    genreId: number,
    type: 'movie' | 'tv',
    page?: number,
    append?: boolean,
    roomData?: RoomWithMembersResponseDto,
    customSwipedIds?: Set<string>
  ) => Promise<void>
  handleLoadMoreMovies: () => void
}

export function useMoviesData({ room, swipedMovieIds, swipesLoaded }: UseMoviesDataProps): UseMoviesDataReturn {
  const { data: session } = useSession()
  const [movies, setMovies] = useState<MovieBasic[]>([])
  const [moviesLoading, setMoviesLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreMovies, setHasMoreMovies] = useState(true)
  const [emptyPagesCount, setEmptyPagesCount] = useState(0)
  const [lastLoadedPage, setLastLoadedPage] = useState(0)

  // Initial load when room is ready AND swipes are loaded
  useEffect(() => {
    if (!room) return
    if (!swipesLoaded) return // Wait for swipes to be loaded first
    if (room.genreId !== null && room.genreId !== undefined) {
      // Reset pagination state when room changes
      setMovies([]) // Clear movies to show skeleton during reload
      setEmptyPagesCount(0)
      setHasMoreMovies(true)
      setLastLoadedPage(0)
      setCurrentPage(1)
      loadMovies(room.genreId, room.type as 'movie' | 'tv', 1, false, room, swipedMovieIds)
    }
  }, [room?.id, room?.members?.length, swipesLoaded])

  const loadMovies = useCallback(async (
    genreId: number,
    type: 'movie' | 'tv' = 'movie',
    page = 1,
    append = false,
    roomData?: RoomWithMembersResponseDto,
    customSwipedIds?: Set<string>
  ) => {
    try {
      setMoviesLoading(true)

      // Use roomData if provided, otherwise use room state
      const currentRoom = roomData || room

      let moviesData: MovieBasic[]

      // Use recommendations endpoint if we have a room ID (includes watched/watchlist data)
      if (currentRoom?.id) {
        moviesData = await getRecommendedMoviesForRoom(currentRoom.id, page)
      } else {
        // Fallback to regular genre endpoint
        // Build filters from room settings
        const filters: MovieFilters = {}
        if (currentRoom?.minRating) filters.minRating = currentRoom.minRating
        if (currentRoom?.releaseYearMin) filters.releaseYearMin = currentRoom.releaseYearMin
        if (currentRoom?.releaseYearMax) filters.releaseYearMax = currentRoom.releaseYearMax
        if (currentRoom?.runtimeMin) filters.runtimeMin = currentRoom.runtimeMin
        if (currentRoom?.runtimeMax) filters.runtimeMax = currentRoom.runtimeMax
        if (currentRoom?.watchProviders && currentRoom.watchProviders.length > 0) {
          filters.watchProviders = currentRoom.watchProviders
          // Always set watch region when filtering by providers (defaults to FR)
          filters.watchRegion = currentRoom.watchRegion || "FR"
        }
        if (currentRoom?.originalLanguage) filters.originalLanguage = currentRoom.originalLanguage

        moviesData = await getMoviesByGenre(genreId, type, page, filters)
      }

      // Use custom swiped IDs if provided (avoids closure issues)
      const swipedIds = customSwipedIds || swipedMovieIds

      // Filter out already swiped movies (both likes and dislikes)
      const filteredMovies = moviesData.filter(movie => !swipedIds.has(movie.id.toString()))

      // Shuffle movies with user email + room ID as seed for consistent but unique ordering per user
      const seed = `${session?.user?.email || 'anonymous'}-${currentRoom?.id || room?.id || 'room'}-${page}`
      const shuffledMovies = shuffleWithSeed(filteredMovies, seed)

      // Load watch providers for movies that don't already have them
      try {
        const validMovies = shuffledMovies.filter(Boolean)

        // Only fetch providers for movies that don't have them yet
        const moviesNeedingProviders = validMovies.filter(m => !m.watchProviders || m.watchProviders.length === 0)
        const movieIdsNeedingProviders = moviesNeedingProviders.map(m => m.id)

        // Skip API call if all movies already have providers
        const providersMap = movieIdsNeedingProviders.length > 0
          ? await getBatchWatchProviders(movieIdsNeedingProviders, type)
          : {}

        // Add providers to movies (preserve recommendation data: isWatched, isInWatchlist, watchlistMemberCount)
        const moviesWithProviders = validMovies.map(movie => ({
          ...movie,
          watchProviders: movie.watchProviders || providersMap[movie.id] || [],
        }))

        if (append) {
          setMovies(prev => {
            // Filter out any undefined values and create a Set of existing movie IDs to avoid duplicates
            const validPrev = prev.filter(Boolean)
            const validWithProviders = moviesWithProviders.filter(Boolean)
            const existingIds = new Set(validPrev.map(m => m.id))
            const newMovies = validWithProviders.filter(m => !existingIds.has(m.id))

            console.log(`[useMoviesData] Appending: ${newMovies.length} new movies to ${validPrev.length} existing`)
            console.log(`[useMoviesData] New movie IDs:`, newMovies.map(m => m.id))
            console.log(`[useMoviesData] Total after append: ${validPrev.length + newMovies.length}`)

            return [...validPrev, ...newMovies]
          })
        } else {
          console.log(`[useMoviesData] Replacing with ${moviesWithProviders.length} movies`)
          setMovies(moviesWithProviders.filter(Boolean))
          setCurrentPage(page)
        }

        // Update page tracking
        setLastLoadedPage(page)
        if (!append) {
          setCurrentPage(page)
        }

        // Track empty pages after filtering
        if (moviesWithProviders.length === 0) {
          setEmptyPagesCount(prev => {
            const newCount = prev + 1
            console.log(`[useMoviesData] Empty page ${page}, count: ${newCount}`)
            // Stop after 10 consecutive empty pages OR TMDB limit
            if (newCount >= 10 || page >= 500) {
              console.log(`[useMoviesData] Stopping after ${newCount} empty pages or page limit`)
              setHasMoreMovies(false)
            }
            return newCount
          })
        } else {
          // Reset counter when we successfully get movies
          console.log(`[useMoviesData] Got ${moviesWithProviders.length} movies on page ${page}, resetting empty count`)
          setEmptyPagesCount(0)
        }

        // Stop if TMDB API returns no data (end of catalog)
        if (moviesData.length === 0) {
          console.log(`[useMoviesData] TMDB returned no data on page ${page} - end of catalog`)
          setHasMoreMovies(false)
          return
        }

        // Only auto-load more if this is the initial load (page 1) and we have very few movies
        // For subsequent loads, let the user trigger via handleLoadMoreMovies
        const currentMovieCount = append ? movies.length + moviesWithProviders.length : moviesWithProviders.length
        const isInitialLoad = page === 1 && !append
        const needsMore = currentMovieCount < 5 // Only auto-load if we have less than 5 movies
        const canLoadMore = page < 20 && moviesData.length > 0

        console.log(`[useMoviesData] Count: ${currentMovieCount}, Page: ${page}, Initial: ${isInitialLoad}, NeedsMore: ${needsMore}`)

        if (isInitialLoad && needsMore && canLoadMore) {
          console.log(`[useMoviesData] Initial load - auto-loading page ${page + 1}`)
          setMoviesLoading(false)
          await loadMovies(genreId, type, page + 1, true, roomData, customSwipedIds || swipedMovieIds)
          return
        }
      } catch (providerErr) {
        console.error("Failed to load watch providers:", providerErr)
        // Still set movies without providers on error
        if (append) {
          setMovies(prev => {
            const validPrev = prev.filter(Boolean)
            const validShuffled = shuffledMovies.filter(Boolean)
            const existingIds = new Set(validPrev.map(m => m.id))
            const newMovies = validShuffled.filter(m => !existingIds.has(m.id))
            return [...validPrev, ...newMovies]
          })
        } else {
          setMovies(shuffledMovies.filter(Boolean))
          setCurrentPage(page)
        }
      }
    } catch (err) {
      console.error("Failed to load movies:", err)
    } finally {
      setMoviesLoading(false)
    }
  }, [room, swipedMovieIds, session?.user?.email, movies.length])

  const handleLoadMoreMovies = useCallback(() => {
    const nextPage = lastLoadedPage + 1

    console.log(`[useMoviesData] handleLoadMoreMovies - hasMore: ${hasMoreMovies}, loading: ${moviesLoading}, lastPage: ${lastLoadedPage}, nextPage: ${nextPage}, movies: ${movies.length}`)

    if (room?.genreId === null || room?.genreId === undefined || moviesLoading) {
      console.log(`[useMoviesData] Skipping load - invalid room or already loading`)
      return
    }

    // Force load if we have no movies and haven't tried too many pages yet
    if (movies.length === 0 && nextPage <= 100) {
      console.log(`[useMoviesData] FORCE LOAD - no movies available, trying page ${nextPage}`)
      setHasMoreMovies(true)
      setEmptyPagesCount(0)
      loadMovies(room.genreId, room.type as 'movie' | 'tv', nextPage, true, room, swipedMovieIds)
      return
    }

    // Normal load if more content available
    if (hasMoreMovies && nextPage <= 500) {
      console.log(`[useMoviesData] Loading page ${nextPage}`)
      loadMovies(room.genreId, room.type as 'movie' | 'tv', nextPage, true, room, swipedMovieIds)
    } else {
      console.log(`[useMoviesData] Cannot load more - hasMore: ${hasMoreMovies}, nextPage: ${nextPage}`)
    }
  }, [room, lastLoadedPage, moviesLoading, hasMoreMovies, loadMovies, swipedMovieIds, movies.length])

  return {
    movies,
    setMovies,
    moviesLoading,
    currentPage,
    hasMoreMovies,
    loadMovies,
    handleLoadMoreMovies,
  }
}
