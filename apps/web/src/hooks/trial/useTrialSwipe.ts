'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { trialApiFetch } from '@/lib/trial'
import type { MovieBasic } from '@/schemas/movies'

interface UseTrialSwipeReturn {
  movies: MovieBasic[]
  currentIndex: number
  matches: MovieBasic[]
  swipeCount: number
  isLoading: boolean
  swipe: (movieId: number, value: boolean) => Promise<void>
  hasMatch: boolean
  latestMatch: MovieBasic | null
  clearLatestMatch: () => void
}

export function useTrialSwipe(roomCode: string, token: string): UseTrialSwipeReturn {
  const [movies, setMovies] = useState<MovieBasic[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matches, setMatches] = useState<MovieBasic[]>([])
  const [swipeCount, setSwipeCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [latestMatch, setLatestMatch] = useState<MovieBasic | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const hasInitialized = useRef(false)

  // Fetch room ID from room code
  useEffect(() => {
    if (!roomCode || !token || hasInitialized.current) return
    hasInitialized.current = true

    async function fetchRoomAndMovies() {
      try {
        setIsLoading(true)

        // Get room data from code
        const roomRes = await trialApiFetch(`/rooms/code/${roomCode}`)
        if (!roomRes.ok) {
          console.error('[useTrialSwipe] Failed to fetch room:', roomRes.status)
          return
        }
        const roomData = await roomRes.json()
        setRoomId(roomData.id)

        // Fetch movies based on room genre
        const genreId = roomData.genreId || 0
        const type = roomData.type || 'movie'
        const endpoint =
          genreId > 0
            ? `/movies/genre/${genreId}?type=${type}&page=1`
            : `/movies/popular?page=1`

        const moviesRes = await trialApiFetch(endpoint)
        if (!moviesRes.ok) {
          console.error('[useTrialSwipe] Failed to fetch movies:', moviesRes.status)
          return
        }
        const moviesData: MovieBasic[] = await moviesRes.json()
        setMovies(moviesData)
      } catch (err) {
        console.error('[useTrialSwipe] Init error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoomAndMovies()
  }, [roomCode, token])

  // Load more movies when running low
  const loadMoreMovies = useCallback(async () => {
    if (!roomId) return
    try {
      const nextPage = currentPage + 1

      // Try to get room data to know the genreId
      const roomRes = await trialApiFetch(`/rooms/code/${roomCode}`)
      if (!roomRes.ok) return
      const roomData = await roomRes.json()

      const genreId = roomData.genreId || 0
      const type = roomData.type || 'movie'
      const endpoint =
        genreId > 0
          ? `/movies/genre/${genreId}?type=${type}&page=${nextPage}`
          : `/movies/popular?page=${nextPage}`

      const moviesRes = await trialApiFetch(endpoint)
      if (!moviesRes.ok) return
      const newMovies: MovieBasic[] = await moviesRes.json()

      if (newMovies.length > 0) {
        setMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id))
          const uniqueNew = newMovies.filter((m) => !existingIds.has(m.id))
          return [...prev, ...uniqueNew]
        })
        setCurrentPage(nextPage)
      }
    } catch (err) {
      console.error('[useTrialSwipe] Failed to load more movies:', err)
    }
  }, [roomId, roomCode, currentPage])

  const swipe = useCallback(
    async (movieId: number, value: boolean) => {
      if (!roomId) return

      try {
        const res = await trialApiFetch('/swipes', {
          method: 'POST',
          body: JSON.stringify({
            roomId,
            movieId: movieId.toString(),
            value,
          }),
        })

        if (!res.ok) {
          console.error('[useTrialSwipe] Swipe failed:', res.status)
          return
        }

        const result = await res.json()
        setSwipeCount((prev) => prev + 1)
        setCurrentIndex((prev) => prev + 1)

        // Check for match
        if (result.matchCreated) {
          const matchedMovie = movies.find((m) => m.id === movieId)
          if (matchedMovie) {
            setMatches((prev) => [...prev, matchedMovie])
            setLatestMatch(matchedMovie)
          }
        }

        // Load more movies if running low
        const remaining = movies.length - (currentIndex + 1)
        if (remaining <= 5) {
          loadMoreMovies()
        }
      } catch (err) {
        console.error('[useTrialSwipe] Swipe error:', err)
      }
    },
    [roomId, movies, currentIndex, loadMoreMovies],
  )

  const clearLatestMatch = useCallback(() => {
    setLatestMatch(null)
  }, [])

  return {
    movies,
    currentIndex,
    matches,
    swipeCount,
    isLoading,
    swipe,
    hasMatch: matches.length > 0,
    latestMatch,
    clearLatestMatch,
  }
}
