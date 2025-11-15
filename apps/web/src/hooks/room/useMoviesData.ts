import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { getMoviesByGenre, MovieFilters } from "@/lib/api/movies"
import { shuffleWithSeed } from "@/lib/utils"
import type { RoomWithMembersResponseDto } from "@/schemas/rooms"
import type { MovieBasic } from "@/schemas/movies"

interface UseMoviesDataProps {
  room: RoomWithMembersResponseDto | null
  swipedMovieIds: Set<string>
}

interface UseMoviesDataReturn {
  movies: MovieBasic[]
  setMovies: React.Dispatch<React.SetStateAction<MovieBasic[]>>
  moviesLoading: boolean
  currentPage: number
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

export function useMoviesData({ room, swipedMovieIds }: UseMoviesDataProps): UseMoviesDataReturn {
  const { data: session } = useSession()
  const [movies, setMovies] = useState<MovieBasic[]>([])
  const [moviesLoading, setMoviesLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Initial load when room is ready or when user joins
  useEffect(() => {
    if (!room) return
    if (room.genreId !== null && room.genreId !== undefined) {
      loadMovies(room.genreId, room.type as 'movie' | 'tv', 1, false, room, swipedMovieIds)
    }
  }, [room?.id, room?.members?.length])

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

      // Build filters from room settings
      const filters: MovieFilters = {}
      if (currentRoom?.minRating) filters.minRating = currentRoom.minRating
      if (currentRoom?.releaseYearMin) filters.releaseYearMin = currentRoom.releaseYearMin
      if (currentRoom?.releaseYearMax) filters.releaseYearMax = currentRoom.releaseYearMax
      if (currentRoom?.runtimeMin) filters.runtimeMin = currentRoom.runtimeMin
      if (currentRoom?.runtimeMax) filters.runtimeMax = currentRoom.runtimeMax
      if (currentRoom?.watchProviders && currentRoom.watchProviders.length > 0) {
        filters.watchProviders = currentRoom.watchProviders
      }
      if (currentRoom?.watchRegion) filters.watchRegion = currentRoom.watchRegion
      if (currentRoom?.originalLanguage) filters.originalLanguage = currentRoom.originalLanguage

      const moviesData = await getMoviesByGenre(genreId, type, page, filters)

      // Use custom swiped IDs if provided (avoids closure issues)
      const swipedIds = customSwipedIds || swipedMovieIds

      // Filter out already swiped movies
      const filteredMovies = moviesData.filter(movie => !swipedIds.has(movie.id.toString()))

      // Shuffle movies with user email + room ID as seed for consistent but unique ordering per user
      const seed = `${session?.user?.email || 'anonymous'}-${currentRoom?.id || room?.id || 'room'}-${page}`
      const shuffledMovies = shuffleWithSeed(filteredMovies, seed)

      if (append) {
        setMovies(prev => {
          // Filter out any undefined values and create a Set of existing movie IDs to avoid duplicates
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

      // If we got very few movies after filtering (less than 5) and we're not on a high page yet,
      // automatically load more to ensure a good user experience
      const currentMovieCount = append ? movies.length + shuffledMovies.length : shuffledMovies.length
      if (currentMovieCount < 5 && shuffledMovies.length > 0 && page < 5) {
        setMoviesLoading(false) // Temporarily set to false
        await loadMovies(genreId, type, page + 1, true, roomData)
        return // Don't set loading to false again, the recursive call will handle it
      }
    } catch (err) {
      console.error("Failed to load movies:", err)
    } finally {
      setMoviesLoading(false)
    }
  }, [room, swipedMovieIds, session?.user?.email, movies.length])

  const handleLoadMoreMovies = useCallback(() => {
    if (room?.genreId !== null && room?.genreId !== undefined && !moviesLoading) {
      const nextPage = currentPage + 1
      loadMovies(room.genreId, room.type as 'movie' | 'tv', nextPage, true)
    }
  }, [room, currentPage, moviesLoading, loadMovies])

  return {
    movies,
    setMovies,
    moviesLoading,
    currentPage,
    loadMovies,
    handleLoadMoreMovies,
  }
}
