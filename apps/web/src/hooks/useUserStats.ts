import { useState, useEffect, useRef } from "react"
import { getUserStats } from "@/lib/api/swipes"
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

        // Single API call to get all stats
        const data = await getUserStats()

        setStats({
          totalMatches: data.totalMatches,
          totalSwipesToday: data.totalSwipesToday,
          totalSwipes: data.totalSwipes,
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
