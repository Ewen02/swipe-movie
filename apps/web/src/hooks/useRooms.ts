"use client"

import useSWR from "swr"
import { getMyRoom } from "@/lib/api/rooms"
import { UserRoomsResponseDto, RoomWithStats } from "@/schemas/rooms"

// SWR key for rooms
export const ROOMS_KEY = "/api/rooms/my"

// Fetcher function
const fetchRooms = async (): Promise<UserRoomsResponseDto> => {
  return getMyRoom()
}

export function useRooms() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<UserRoomsResponseDto>(
    ROOMS_KEY,
    fetchRooms,
    {
      // Keep data fresh for 2 minutes before refetching
      dedupingInterval: 2 * 60 * 1000,
      // Revalidate when user focuses the window
      revalidateOnFocus: true,
    }
  )

  return {
    rooms: data?.rooms ?? [],
    isLoading,
    isValidating,
    error: error?.message ?? null,
    refresh: () => mutate(),
    // Optimistic update helper
    updateRooms: (updater: (rooms: RoomWithStats[]) => RoomWithStats[]) => {
      mutate((current) => current ? { rooms: updater(current.rooms) } : current, false)
    },
  }
}
