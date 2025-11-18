"use client"

import { Card, CardContent } from "@/components/ui/card"
import { RoomsList } from "@/components/room/RoomsList"
import { RoomStatsHeader } from "@/components/room/RoomStatsHeader"
import { CreateRoomDialog } from "@/components/room/CreateRoomDialog"
import { JoinRoomDialog } from "@/components/room/JoinRoomDialog"
import {
  CreateRoomValues,
  JoinRoomValues,
  UserRoomsResponseDto
} from "@/schemas/rooms"

import { joinRoom, createRoom, getMyRoom } from "@/lib/api/rooms"
import { getGenres } from "@/lib/api/movies"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { MovieGenre } from "@/schemas/movies"
import { Film } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { RoomErrorBoundary } from "@/components/error"
import { RoomsPageSkeleton } from "./RoomsPageSkeleton"

function RoomsPageContent() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState<UserRoomsResponseDto | null>(null)
  const [genres, setGenres] = useState<MovieGenre[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showJoinDialog, setShowJoinDialog] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([getMyRoom(), getGenres()])
      .then(([roomsData, genresData]) => {
        setRooms(roomsData)
        setGenres(genresData)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const onCreate = async (values: CreateRoomValues) => {
    try {
      setError(null)
      setLoading(true)
      const room = await createRoom(values)
      setShowCreateDialog(false)
      router.push(`/rooms/${room.code}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const onJoin = async (values: JoinRoomValues) => {
    try {
      setError(null)
      setLoading(true)
      const room = await joinRoom(values)
      setShowJoinDialog(false)
      router.push(`/rooms/${room.code}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <RoomsPageSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Header with Stats */}
        <RoomStatsHeader
          totalRooms={rooms?.rooms.length || 0}
          totalMatches={0}
          totalSwipesToday={0}
          onCreateRoom={() => setShowCreateDialog(true)}
          onJoinRoom={() => setShowJoinDialog(true)}
        />

        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
              <CardContent className="py-4">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* My Rooms Section */}
        {rooms && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Film className="w-6 h-6 text-primary" />
              Mes rooms actives
            </h2>
            <RoomsList rooms={rooms} />
          </div>
        )}

        {/* Dialogs */}
        <CreateRoomDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={onCreate}
          genres={genres}
          loading={loading}
        />

        <JoinRoomDialog
          open={showJoinDialog}
          onOpenChange={setShowJoinDialog}
          onSubmit={onJoin}
          loading={loading}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function RoomsPage() {
  return (
    <RoomErrorBoundary>
      <RoomsPageContent />
    </RoomErrorBoundary>
  )
}
