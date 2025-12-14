import { ReactNode } from "react"
import { SWRPrefetch } from "@/components/providers/swr-prefetch"
import { getRoomByCodeServer } from "@/lib/api-server"

interface RoomLayoutProps {
  children: ReactNode
  params: Promise<{ code: string }>
}

export default async function RoomLayout({
  children,
  params,
}: RoomLayoutProps) {
  const { code } = await params

  // Prefetch room data on the server
  const roomData = await getRoomByCodeServer(code)

  // Build SWR fallback with prefetched room data
  // Using the same key as useRoomData hook: /api/rooms/code/${code}
  const fallback: Record<string, unknown> = {}
  if (roomData) {
    fallback[`/api/rooms/code/${code}`] = roomData
  }

  return (
    <SWRPrefetch fallback={fallback}>
      {children}
    </SWRPrefetch>
  )
}
