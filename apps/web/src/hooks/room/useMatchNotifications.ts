import { useState, useEffect, useRef, useCallback } from "react"
import { useRoomSocket } from "@/hooks/useRoomSocket"
import { getMovieDetails } from "@/lib/api/movies"
import { useToast } from "@/components/providers/toast-provider"
import type { MovieBasic } from "@/schemas/movies"

interface UseMatchNotificationsProps {
  roomId: string | null
}

interface UseMatchNotificationsReturn {
  matchedMovie: MovieBasic | null
  showMatchAnimation: boolean
  refreshMatches: number
  setRefreshMatches: React.Dispatch<React.SetStateAction<number>>
  handleMatchAnimationComplete: () => void
  triggerMatchAnimation: (movie: MovieBasic) => void
}

export function useMatchNotifications({ roomId }: UseMatchNotificationsProps): UseMatchNotificationsReturn {
  const { toast } = useToast()
  const [matchedMovie, setMatchedMovie] = useState<MovieBasic | null>(null)
  const [showMatchAnimation, setShowMatchAnimation] = useState(false)
  const [refreshMatches, setRefreshMatches] = useState(0)
  const lastProcessedMatchId = useRef<string | null>(null)

  // WebSocket connection for real-time match notifications
  const { newMatch, resetNewMatch } = useRoomSocket(roomId)

  // Handle new match from WebSocket
  useEffect(() => {
    if (!newMatch) return

    // Prevent processing the same match multiple times
    const matchId = newMatch.match.id
    if (lastProcessedMatchId.current === matchId) {
      return
    }
    lastProcessedMatchId.current = matchId

    const handleNewMatch = async () => {
      // Show toast notification
      toast({
        title: "🎉 Nouveau Match !",
        description: `Un film a été matché par le groupe !`,
        type: "success",
        duration: 5000,
      })

      // Fetch movie details and show animation if we have the movieId
      if (newMatch.match.movieId) {
        try {
          const movie = await getMovieDetails(parseInt(newMatch.match.movieId))

          // Show match animation
          setMatchedMovie(movie)
          setShowMatchAnimation(true)
        } catch (error) {
          console.error("Failed to fetch movie details:", error)
        }
      }

      // Trigger refresh of matches list
      setRefreshMatches((prev) => prev + 1)

      // Reset the match state
      resetNewMatch()
    }

    handleNewMatch()
  }, [newMatch, toast, resetNewMatch])

  const handleMatchAnimationComplete = useCallback(() => {
    setShowMatchAnimation(false)
    setMatchedMovie(null)
  }, [])

  const triggerMatchAnimation = useCallback((movie: MovieBasic) => {
    setMatchedMovie(movie)
    setShowMatchAnimation(true)
  }, [])

  return {
    matchedMovie,
    showMatchAnimation,
    refreshMatches,
    setRefreshMatches,
    handleMatchAnimationComplete,
    triggerMatchAnimation,
  }
}
