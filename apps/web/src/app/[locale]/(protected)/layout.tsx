import { ReactNode } from "react"
import { Header } from "@/components/layout/Header"
import { SWRPrefetch } from "@/components/providers/swr-prefetch"
import { OnboardingCheck } from "@/components/providers/OnboardingCheck"
import { getMyRoomServer, getGenresServer, getUserPreferencesServer } from "@/lib/api-server"
import { ROOMS_KEY } from "@/hooks/useRooms"
import { GENRES_KEY } from "@/hooks/useGenres"
import { USER_PREFERENCES_KEY } from "@/hooks/useUserPreferences"

// Protected pages depend on the authenticated session (cookies) and fetch
// per-user data from the API in this layout. They must NOT be statically
// pre-rendered at build time: doing so makes Next try to SSG /admin,
// /connections, etc., which hang on the API call and fail the build with
// "took more than 60 seconds". force-dynamic renders them per-request (SSR);
// client-side freshness is still handled by SWR.
export const dynamic = "force-dynamic"

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
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </div>
      </OnboardingCheck>
    </SWRPrefetch>
  )
}
  