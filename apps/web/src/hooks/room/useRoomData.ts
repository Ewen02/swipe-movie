import { useState, useEffect, useCallback, useMemo } from "react"
import useSWR from "swr"
import { getRoomByCode } from "@/lib/api/rooms"
import { getMySwipesByRoom } from "@/lib/api/swipes"
import type { RoomWithMembersResponseDto } from "@/schemas/rooms"
import type { Swipe } from "@/schemas/swipes"

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

// SWR fetcher for room data
const roomFetcher = (code: string) => getRoomByCode(code)

// SWR fetcher for swipes data
const swipesFetcher = (roomId: string) => getMySwipesByRoom(roomId)

export function useRoomData({ code }: UseRoomDataProps): UseRoomDataReturn {
  // Local state for optimistic updates on swipes
  const [localSwipedIds, setLocalSwipedIds] = useState<Set<string> | null>(null)

  // SWR for room data with 2 min cache
  const {
    data: room,
    error: roomError,
    isLoading: roomLoading,
    mutate: mutateRoom,
  } = useSWR<RoomWithMembersResponseDto>(
    code ? `/api/rooms/code/${code}` : null,
    () => roomFetcher(code),
    {
      dedupingInterval: 2 * 60 * 1000,
      revalidateOnFocus: false,
    }
  )

  // SWR for swipes data - depends on room being loaded
  const {
    data: swipes,
    error: swipesError,
    isLoading: swipesLoading,
    mutate: mutateSwipes,
  } = useSWR<Swipe[]>(
    room?.id ? `/api/swipes/me/${room.id}` : null,
    () => swipesFetcher(room!.id),
    {
      dedupingInterval: 60 * 1000, // 1 min cache for swipes
      revalidateOnFocus: false,
    }
  )

  // Convert swipes to Set of movie IDs (use local state if available for optimistic updates)
  const swipedMovieIds = useMemo(() => {
    if (localSwipedIds !== null) {
      return localSwipedIds
    }
    return new Set(swipes?.map(s => s.movieId) ?? [])
  }, [swipes, localSwipedIds])

  // Setter that updates local state for optimistic updates
  const setSwipedMovieIds = useCallback((updater: React.SetStateAction<Set<string>>) => {
    setLocalSwipedIds(prev => {
      const current = prev ?? swipedMovieIds
      if (typeof updater === "function") {
        return updater(current)
      }
      return updater
    })
  }, [swipedMovieIds])

  // Reset local state when server data updates
  useEffect(() => {
    if (swipes) {
      setLocalSwipedIds(null)
    }
  }, [swipes])

  const reloadSwipes = useCallback(async () => {
    setLocalSwipedIds(null)
    await mutateSwipes()
  }, [mutateSwipes])

  const reloadRoom = useCallback(async () => {
    await mutateRoom()
  }, [mutateRoom])

  // Combine loading states
  const loading = roomLoading || (room && swipesLoading)
  const swipesLoaded = !swipesLoading && (swipes !== undefined || swipesError !== undefined)

  // Combine errors
  const error = roomError?.message ?? swipesError?.message ?? null

  return {
    room: room ?? null,
    loading: !!loading,
    error,
    swipedMovieIds,
    swipesLoaded,
    setSwipedMovieIds,
    reloadSwipes,
    reloadRoom,
  }
}
