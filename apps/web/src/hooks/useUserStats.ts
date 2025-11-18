import { useState, useEffect } from "react"
import { getMatchesByRoom, getMySwipesByRoom } from "@/lib/api/swipes"
import type { UserRoomsResponseDto } from "@/schemas/rooms"

interface UserStats {
  totalMatches: number
  totalSwipesToday: number
  totalSwipes: number
  loading: boolean
}

export function useUserStats(rooms: UserRoomsResponseDto | null): UserStats {
  const [stats, setStats] = useState<UserStats>({
    totalMatches: 0,
    totalSwipesToday: 0,
    totalSwipes: 0,
    loading: true,
  })

  useEffect(() => {
    if (!rooms || rooms.rooms.length === 0) {
      setStats({
        totalMatches: 0,
        totalSwipesToday: 0,
        totalSwipes: 0,
        loading: false,
      })
      return
    }

    const loadStats = async () => {
      try {
        setStats((prev) => ({ ...prev, loading: true }))

        // Load matches and swipes for all rooms in parallel
        const roomIds = rooms.rooms.map((r) => r.id)

        const [matchesResults, swipesResults] = await Promise.all([
          Promise.all(roomIds.map((id) => getMatchesByRoom(id).catch(() => []))),
          Promise.all(roomIds.map((id) => getMySwipesByRoom(id).catch(() => []))),
        ])

        // Calculate total matches (unique across all rooms)
        const allMatches = matchesResults.flat()
        const totalMatches = allMatches.length

        // Calculate total swipes
        const allSwipes = swipesResults.flat()
        const totalSwipes = allSwipes.length

        // Calculate swipes today
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const totalSwipesToday = allSwipes.filter((swipe) => {
          const swipeDate = new Date(swipe.createdAt)
          swipeDate.setHours(0, 0, 0, 0)
          return swipeDate.getTime() === today.getTime()
        }).length

        setStats({
          totalMatches,
          totalSwipesToday,
          totalSwipes,
          loading: false,
        })
      } catch (error) {
        console.error("Failed to load user stats:", error)
        setStats({
          totalMatches: 0,
          totalSwipesToday: 0,
          totalSwipes: 0,
          loading: false,
        })
      }
    }

    loadStats()
  }, [rooms])

  return stats
}
