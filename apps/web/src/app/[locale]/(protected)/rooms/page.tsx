"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RoomsList } from "@/components/room/RoomsList"
import { RoomStatsHeader } from "@/components/room/RoomStatsHeader"
import { CreateRoomDialog } from "@/components/room/CreateRoomDialog"
import { JoinRoomDialog } from "@/components/room/JoinRoomDialog"
import { OnboardingTutorial } from "@/components/onboarding"
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
import { useOnboarding } from "@/hooks/useOnboarding"
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

  // Onboarding tutorial
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding()

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
    <div className="min-h-screen bg-background overflow-hidden flex flex-col">
      {/* Background orbs */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      <div className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
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
            <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-red-500/20 rounded-3xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-red-500 to-red-600" />
              <CardContent className="py-6 space-y-4">
                <p className="text-red-500 text-sm text-center">{error}</p>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadData}
                    className="gap-2 border-white/20 hover:bg-white/5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {t('retry')}
                  </Button>
                </div>
              </CardContent>
            </div>
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

      {/* Onboarding Tutorial */}
      {showOnboarding && (
        <OnboardingTutorial
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />
      )}
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
