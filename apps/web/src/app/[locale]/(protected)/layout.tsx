import { ReactNode } from "react"
import { Header } from "@/components/layout/Header"
import { SWRPrefetch } from "@/components/providers/swr-prefetch"
import { OnboardingCheck } from "@/components/providers/OnboardingCheck"
import { getMyRoomServer, getGenresServer, getUserPreferencesServer } from "@/lib/api-server"
import { ROOMS_KEY } from "@/hooks/useRooms"
import { GENRES_KEY } from "@/hooks/useGenres"
import { USER_PREFERENCES_KEY } from "@/hooks/useUserPreferences"

// Removed force-dynamic to enable Next.js caching
// SWR handles data freshness on the client side with keepPreviousData

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode
}) {
  // Prefetch data in parallel on the server
  const [roomsData, genresData, preferencesData] = await Promise.all([
    getMyRoomServer(),
    getGenresServer(),
    getUserPreferencesServer(),
  ])

  // Build SWR fallback with prefetched data
  const fallback: Record<string, unknown> = {}
  if (roomsData) {
    fallback[ROOMS_KEY] = roomsData
  }
  if (genresData) {
    fallback[GENRES_KEY] = genresData
  }
  if (preferencesData) {
    fallback[USER_PREFERENCES_KEY] = preferencesData
  }

  return (
    <SWRPrefetch fallback={fallback}>
      <OnboardingCheck>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </OnboardingCheck>
    </SWRPrefetch>
  )
}
  