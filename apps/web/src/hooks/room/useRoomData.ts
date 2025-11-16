import { useState, useEffect } from "react"
import { getRoomByCode } from "@/lib/api/rooms"
import { getMySwipesByRoom } from "@/lib/api/swipes"
import type { RoomWithMembersResponseDto } from "@/schemas/rooms"

interface UseRoomDataProps {
  code: string
}

interface UseRoomDataReturn {
  room: RoomWithMembersResponseDto | null
  loading: boolean
  error: string | null
  swipedMovieIds: Set<string>
  swipesLoaded: boolean
  setSwipedMovieIds: React.Dispatch<React.SetStateAction<Set<string>>>
  reloadSwipes: () => Promise<void>
  reloadRoom: () => Promise<void>
}

export function useRoomData({ code }: UseRoomDataProps): UseRoomDataReturn {
  const [room, setRoom] = useState<RoomWithMembersResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [swipedMovieIds, setSwipedMovieIds] = useState<Set<string>>(new Set())
  const [swipesLoaded, setSwipesLoaded] = useState(false)

  useEffect(() => {
    if (!code) return
    loadRoom()
  }, [code])

  const loadRoom = async () => {
    try {
      setLoading(true)
      const roomData = await getRoomByCode(code)
      setRoom(roomData)

      // Load user's swipes for this room
      await loadSwipes(roomData.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load room")
    } finally {
      setLoading(false)
    }
  }

  const loadSwipes = async (roomId: string) => {
    try {
      const swipes = await getMySwipesByRoom(roomId)
      const swipedIds = new Set(swipes.map(swipe => swipe.movieId))
      setSwipedMovieIds(swipedIds)
      setSwipesLoaded(true)
    } catch (err) {
      console.error("Failed to load swipes:", err)
      setSwipesLoaded(true) // Set to true even on error so we don't block loading
    }
  }

  const reloadSwipes = async () => {
    if (!room) return
    await loadSwipes(room.id)
  }

  const reloadRoom = async () => {
    await loadRoom()
  }

  return {
    room,
    loading,
    error,
    swipedMovieIds,
    swipesLoaded,
    setSwipedMovieIds,
    reloadSwipes,
    reloadRoom,
  }
}
