import { ReactNode } from "react"
import { Header } from "@/components/layout/Header"
import { SWRPrefetch } from "@/components/providers/swr-prefetch"
import { getMyRoomServer, getGenresServer } from "@/lib/api-server"
import { ROOMS_KEY } from "@/hooks/useRooms"
import { GENRES_KEY } from "@/hooks/useGenres"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode
}) {
  // Prefetch data in parallel on the server
  const [roomsData, genresData] = await Promise.all([
    getMyRoomServer(),
    getGenresServer(),
  ])

  // Build SWR fallback with prefetched data
  const fallback: Record<string, unknown> = {}
  if (roomsData) {
    fallback[ROOMS_KEY] = roomsData
  }
  if (genresData) {
    fallback[GENRES_KEY] = genresData
  }

  return (
    <SWRPrefetch fallback={fallback}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </SWRPrefetch>
  )
}
  