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

        // Limit concurrent requests to 3 at a time to avoid rate limits
        const chunkSize = 3
        const matchesResults: any[] = []
        const swipesResults: any[] = []

        for (let i = 0; i < roomIds.length; i += chunkSize) {
          const chunk = roomIds.slice(i, i + chunkSize)

          const [matchesChunk, swipesChunk] = await Promise.all([
            Promise.all(chunk.map((id) => getMatchesByRoom(id).catch(() => []))),
            Promise.all(chunk.map((id) => getMySwipesByRoom(id).catch(() => []))),
          ])

          matchesResults.push(...matchesChunk)
          swipesResults.push(...swipesChunk)

          // Add small delay between chunks to avoid rate limiting
          if (i + chunkSize < roomIds.length) {
            await new Promise(resolve => setTimeout(resolve, 100))
          }
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
