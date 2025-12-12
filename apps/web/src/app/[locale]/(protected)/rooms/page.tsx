"use client"

import { lazy, Suspense, useState } from "react"
import { motion } from "framer-motion"
import { CardContent, Button } from "@swipe-movie/ui"
import { RoomsList } from "@/components/room/RoomsList"
import { RoomStatsHeader } from "@/components/room/RoomStatsHeader"
import { CreateRoomValues, JoinRoomValues } from "@/schemas/rooms"

import { joinRoom, createRoom } from "@/lib/api/rooms"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Film, RefreshCw } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { RoomErrorBoundary } from "@/components/error"
import { RoomsPageSkeleton } from "./RoomsPageSkeleton"
import { useUserStats } from "@/hooks/useUserStats"
import { useOnboarding } from "@/hooks/useOnboarding"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useRooms } from "@/hooks/useRooms"
import { useGenres } from "@/hooks/useGenres"

// Lazy load dialogs - they're not needed until user interaction
const CreateRoomStepper = lazy(() => import("@/components/room/create-room").then(m => ({ default: m.CreateRoomStepper })))
const JoinRoomDialog = lazy(() => import("@/components/room/JoinRoomDialog").then(m => ({ default: m.JoinRoomDialog })))
const OnboardingTutorial = lazy(() => import("@/components/onboarding").then(m => ({ default: m.OnboardingTutorial })))

function RoomsPageContent() {
  const t = useTranslations('rooms')
  const router = useRouter()
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showJoinDialog, setShowJoinDialog] = useState(false)

  // SWR hooks for data fetching with caching
  const { rooms, isLoading: roomsLoading, error: roomsError, refresh: refreshRooms } = useRooms()
  const { genres, isLoading: genresLoading } = useGenres()

  // Combine loading states
  const loading = roomsLoading || genresLoading
  const error = actionError || roomsError

  // Load user statistics
  const userStats = useUserStats(rooms.length > 0)

  // Onboarding tutorial
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding()

  const onCreate = async (values: CreateRoomValues) => {
    try {
      setActionError(null)
      setActionLoading(true)
      const room = await createRoom(values)
      setShowCreateDialog(false)
      // Refresh rooms cache after creation
      refreshRooms()
      router.push(`/rooms/${room.code}`)
    } catch (e) {
      setActionError(e instanceof Error ? e.message : t('errorUnknown'))
    } finally {
      setActionLoading(false)
    }
  }

  const onJoin = async (values: JoinRoomValues) => {
    try {
      setActionError(null)
      setActionLoading(true)
      const room = await joinRoom(values)
      setShowJoinDialog(false)
      // Refresh rooms cache after joining
      refreshRooms()
      router.push(`/rooms/${room.code}`)
    } catch (e) {
      setActionError(e instanceof Error ? e.message : t('errorUnknown'))
    } finally {
      setActionLoading(false)
    }
  }

  // Show skeleton only on initial load (no cached data)
  if (loading && rooms.length === 0) {
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
          totalRooms={rooms.length}
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
                    onClick={() => refreshRooms()}
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
            <RoomsList rooms={{ rooms }} onCreateRoom={() => setShowCreateDialog(true)} />
          </motion.div>
        </motion.div>

        {/* Dialogs - Lazy loaded */}
        <Suspense fallback={null}>
          {showCreateDialog && (
            <CreateRoomStepper
              open={showCreateDialog}
              onOpenChange={setShowCreateDialog}
              onSubmit={onCreate}
              genres={genres}
              loading={actionLoading}
            />
          )}
        </Suspense>

        <Suspense fallback={null}>
          {showJoinDialog && (
            <JoinRoomDialog
              open={showJoinDialog}
              onOpenChange={setShowJoinDialog}
              onSubmit={onJoin}
              loading={actionLoading}
            />
          )}
        </Suspense>
      </div>

      {/* Footer */}
      <Footer />

      {/* Onboarding Tutorial - Lazy loaded */}
      <Suspense fallback={null}>
        {showOnboarding && (
          <OnboardingTutorial
            onComplete={completeOnboarding}
            onSkip={skipOnboarding}
          />
        )}
      </Suspense>
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
