"use client"

import { lazy, Suspense, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@swipe-movie/ui"
import { RoomsList } from "@/components/room/RoomsList"
import { CreateRoomValues, JoinRoomValues } from "@/schemas/rooms"
import { joinRoom, createRoom } from "@/lib/api/rooms"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Plus, Users, Film, Heart, TrendingUp, Tv, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs"
import { RoomErrorBoundary } from "@/components/error"
import { RoomsPageSkeleton } from "./RoomsPageSkeleton"
import { useUserStats } from "@/hooks/useUserStats"
import { useOnboarding } from "@/hooks/useOnboarding"
import { useRooms } from "@/hooks/useRooms"
import { useGenres } from "@/hooks/useGenres"

type FilterType = "all" | "movie" | "tv" | "recent"
const ROOMS_PER_PAGE = 12

// Lazy load dialogs
const CreateRoomStepper = lazy(() => import("@/components/room/create-room").then(m => ({ default: m.CreateRoomStepper })))
const JoinRoomDialog = lazy(() => import("@/components/room/JoinRoomDialog").then(m => ({ default: m.JoinRoomDialog })))
const OnboardingTutorial = lazy(() => import("@/components/onboarding").then(m => ({ default: m.OnboardingTutorial })))

const FILTERS: { id: FilterType; icon: React.ReactNode; color: string }[] = [
  { id: "all", icon: null, color: "from-primary to-accent" },
  { id: "movie", icon: <Film className="w-4 h-4" />, color: "from-primary to-blue-500" },
  { id: "tv", icon: <Tv className="w-4 h-4" />, color: "from-accent to-purple-500" },
  { id: "recent", icon: <Clock className="w-4 h-4" />, color: "from-green-500 to-emerald-500" },
]

function RoomsPageContent() {
  const t = useTranslations('rooms')
  const router = useRouter()
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [currentPage, setCurrentPage] = useState(1)

  const { rooms, isLoading: roomsLoading, error: roomsError, refresh: refreshRooms } = useRooms()
  const { genres, isLoading: genresLoading } = useGenres()

  const loading = roomsLoading || genresLoading
  const error = actionError || roomsError

  const userStats = useUserStats(rooms.length > 0)
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding()

  // Filter rooms based on active filter
  const filteredRooms = useMemo(() => {
    const now = Date.now()
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000

    switch (activeFilter) {
      case "movie":
        return rooms.filter(room => room.type === "movie")
      case "tv":
        return rooms.filter(room => room.type === "tv")
      case "recent":
        return rooms.filter(room => new Date(room.createdAt).getTime() > sevenDaysAgo)
      default:
        return rooms
    }
  }, [rooms, activeFilter])

  // Pagination
  const totalPages = Math.ceil(filteredRooms.length / ROOMS_PER_PAGE)
  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * ROOMS_PER_PAGE
    return filteredRooms.slice(start, start + ROOMS_PER_PAGE)
  }, [filteredRooms, currentPage])

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  // Count rooms by type for filter badges
  const counts = useMemo(() => {
    const now = Date.now()
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
    return {
      all: rooms.length,
      movie: rooms.filter(r => r.type === "movie").length,
      tv: rooms.filter(r => r.type === "tv").length,
      recent: rooms.filter(r => new Date(r.createdAt).getTime() > sevenDaysAgo).length,
    }
  }, [rooms])

  const onCreate = async (values: CreateRoomValues) => {
    try {
      setActionError(null)
      setActionLoading(true)
      const room = await createRoom(values)
      setShowCreateDialog(false)
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
      refreshRooms()
      router.push(`/rooms/${room.code}`)
    } catch (e) {
      setActionError(e instanceof Error ? e.message : t('errorUnknown'))
    } finally {
      setActionLoading(false)
    }
  }

  if (loading && rooms.length === 0) {
    return <RoomsPageSkeleton />
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col">
      <BackgroundOrbs />

      <div className="flex-1 container mx-auto px-4 py-6 md:py-8 relative z-10 max-w-6xl">
        {/* Header compact */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t('title')}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {rooms.length > 0
                ? t('roomsCount', { count: rooms.length })
                : t('emptyDescription')
              }
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowJoinDialog(true)}
              className="border-border hover:bg-foreground/5"
            >
              <Users className="w-4 h-4 mr-2" />
              {t('join')}
            </Button>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('create')}
            </Button>
          </div>
        </motion.div>

        {/* Filters - Only show if there are rooms */}
        {rooms.length > 0 && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter.id
                const count = counts[filter.id]

                return (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterChange(filter.id)}
                    className={`
                      relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                      flex items-center gap-2
                      ${isActive
                        ? "text-white shadow-lg"
                        : "text-muted-foreground hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-border"
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeFilter"
                        className={`absolute inset-0 bg-gradient-to-r ${filter.color} rounded-xl`}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      {filter.icon}
                      {t(`filters.${filter.id}`)}
                      <span className={`
                        text-xs px-1.5 py-0.5 rounded-md
                        ${isActive ? "bg-foreground/20" : "bg-foreground/10"}
                      `}>
                        {count}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refreshRooms()}
              className="ml-2 text-red-500 hover:text-red-400"
            >
              {t('retry')}
            </Button>
          </motion.div>
        )}

        {/* Rooms List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFilter}-${currentPage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <RoomsList rooms={{ rooms: paginatedRooms }} onCreateRoom={() => setShowCreateDialog(true)} />
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="mt-8 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="border-border hover:bg-foreground/5 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first, last, current and adjacent pages
                const showPage = page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1

                if (!showPage) {
                  // Show ellipsis
                  if (page === 2 || page === totalPages - 1) {
                    return <span key={page} className="px-2 text-muted-foreground">...</span>
                  }
                  return null
                }

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`
                      w-8 h-8 rounded-lg text-sm font-medium transition-all
                      ${page === currentPage
                        ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/10"
                      }
                    `}
                  >
                    {page}
                  </button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="border-border hover:bg-foreground/5 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* Stats en bas - discret */}
        {rooms.length > 0 && (
          <motion.div
            className="mt-12 pt-8 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Film className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="font-semibold text-foreground">{rooms.length}</span>
                  <span className="ml-1">{t('stats.total')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-pink-500" />
                </div>
                <div>
                  <span className="font-semibold text-foreground">{userStats.totalMatches}</span>
                  <span className="ml-1">{t('stats.matches')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <span className="font-semibold text-foreground">{userStats.totalSwipesToday}</span>
                  <span className="ml-1">{t('stats.swipesToday')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dialogs */}
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

      <Footer />

      {/* Onboarding */}
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
