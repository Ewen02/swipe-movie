"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { useTranslations } from "next-intl"
import type { MovieGenre } from "@/schemas/movies"
import { Film, RefreshCw } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { RoomErrorBoundary } from "@/components/error"
import { RoomsPageSkeleton } from "./RoomsPageSkeleton"
import { useUserStats } from "@/hooks/useUserStats"
import { fadeInUp, staggerContainer } from "@/lib/animations"

function RoomsPageContent() {
  const t = useTranslations('rooms')
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState<UserRoomsResponseDto | null>(null)
  const [genres, setGenres] = useState<MovieGenre[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showJoinDialog, setShowJoinDialog] = useState(false)

  // Load user statistics
  const userStats = useUserStats(rooms)

  const loadData = () => {
    setLoading(true)
    setError(null)
    Promise.all([getMyRoom(), getGenres()])
      .then(([roomsData, genresData]) => {
        setRooms(roomsData)
        setGenres(genresData)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const onCreate = async (values: CreateRoomValues) => {
    try {
      setError(null)
      setLoading(true)
      const room = await createRoom(values)
      setShowCreateDialog(false)
      router.push(`/rooms/${room.code}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : t('errorUnknown'))
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
      setError(e instanceof Error ? e.message : t('errorUnknown'))
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
          totalMatches={userStats.totalMatches}
          totalSwipesToday={userStats.totalSwipesToday}
          onCreateRoom={() => setShowCreateDialog(true)}
          onJoinRoom={() => setShowJoinDialog(true)}
        />

        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
              <CardContent className="py-6 space-y-4">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadData}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t('retry')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* My Rooms Section */}
        {rooms && (
          <motion.div
            className="max-w-6xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h2
              className="text-2xl font-semibold mb-6 flex items-center gap-2"
              variants={fadeInUp}
            >
              <Film className="w-6 h-6 text-primary" />
              {t('myActiveRooms')}
            </motion.h2>
            <motion.div variants={fadeInUp}>
              <RoomsList rooms={rooms} />
            </motion.div>
          </motion.div>
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
