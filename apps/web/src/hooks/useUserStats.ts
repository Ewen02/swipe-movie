import { useState, useEffect, useRef } from "react"
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

  // Use ref to track if we've already loaded stats to prevent duplicate loads
  const hasLoadedRef = useRef(false)
  const loadingRef = useRef(false)

  useEffect(() => {
    if (!rooms || rooms.rooms.length === 0) {
      setStats({
        totalMatches: 0,
        totalSwipesToday: 0,
        totalSwipes: 0,
        loading: false,
      })
      hasLoadedRef.current = false
      return
    }

    // Prevent duplicate loads
    if (hasLoadedRef.current || loadingRef.current) {
      return
    }

    const loadStats = async () => {
      try {
        loadingRef.current = true
        setStats((prev) => ({ ...prev, loading: true }))

        // Load matches and swipes for all rooms with rate limiting
        const roomIds = rooms.rooms.map((r) => r.id)

        // Limit to first 5 rooms to avoid rate limiting
        // TODO: Create a backend endpoint that returns aggregated stats
        const limitedRoomIds = roomIds.slice(0, 5)
        const matchesResults: any[] = []
        const swipesResults: any[] = []

        // Process one room at a time to avoid rate limits
        for (const roomId of limitedRoomIds) {
          try {
            const [matches, swipes] = await Promise.all([
              getMatchesByRoom(roomId).catch(() => []),
              getMySwipesByRoom(roomId).catch(() => []),
            ])
            matchesResults.push(matches)
            swipesResults.push(swipes)
          } catch {
            // Ignore errors for individual rooms
          }

          // Small delay between rooms
          await new Promise(resolve => setTimeout(resolve, 50))
        }

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
        hasLoadedRef.current = true
      } catch (error) {
        console.error("Failed to load user stats:", error)
        setStats({
          totalMatches: 0,
          totalSwipesToday: 0,
          totalSwipes: 0,
          loading: false,
        })
      } finally {
        loadingRef.current = false
      }
    }

    loadStats()
  }, [rooms])

  return stats
}
