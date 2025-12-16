"use client"

import { useState, useCallback, lazy, Suspense } from "react"
import { useParams } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { useTranslations } from "next-intl"
import { createSwipe, deleteSwipe, getMySwipesByRoom } from "@/lib/api/swipes"
import { ApiError } from "@/lib/http"
import { joinRoom } from "@/lib/api/rooms"
import { useRoomData, useMoviesData, useMatchNotifications } from "@/hooks/room"
import type { MovieBasic } from "@/schemas/movies"
import { Badge, Button } from "@swipe-movie/ui"
import { useToast } from "@/components/providers/toast-provider"
import { MovieCards } from "@/components/swipe/MovieCards"
import { MovieCardSkeleton } from "@/components/swipe/MovieCardSkeleton"
import { MatchesList } from "@/components/room/MatchesList"
import { MatchAnimation } from "@/components/room/MatchAnimation"
import { ShareRoomButton } from "@/components/room/ShareRoomButton"
import { Users, Film, UserPlus, Sparkles, History, BarChart3, Heart } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs"
import { RoomErrorBoundary } from "@/components/error"
import { RoomPageSkeleton } from "@/components/room/RoomPageSkeleton"
import { BottomTabNav } from "@/components/room/BottomTabNav"
import { motion } from "framer-motion"

// Lazy load heavy components that are not always visible
const MovieDetailsModal = lazy(() => import("@/components/movies/MovieDetailsModal").then(m => ({ default: m.MovieDetailsModal })))
const Analytics = lazy(() => import("@/components/room/Analytics").then(m => ({ default: m.Analytics })))
const SwipeHistory = lazy(() => import("@/components/room/SwipeHistory").then(m => ({ default: m.SwipeHistory })))

// Tab configuration with colors
const TABS = [
  { id: "swipe", icon: Heart, gradient: "from-pink-500 to-rose-500" },
  { id: "matches", icon: Sparkles, gradient: "from-green-500 to-emerald-500" },
  { id: "history", icon: History, gradient: "from-blue-500 to-cyan-500" },
  { id: "stats", icon: BarChart3, gradient: "from-purple-500 to-violet-500" },
  { id: "members", icon: Users, gradient: "from-orange-500 to-amber-500" },
] as const

function RoomPageContent() {
  const t = useTranslations('room')
  const tSwipe = useTranslations('swipe')
  const params = useParams<{ code: string }>()
  const code = params?.code ?? ""
  const { data: session } = useSession()
  const { toast } = useToast()
  const [currentTab, setCurrentTab] = useState("swipe")
  const [joiningRoom, setJoiningRoom] = useState(false)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [showMovieDetails, setShowMovieDetails] = useState(false)

  const {
    room,
    loading,
    error,
    swipedMovieIds,
    swipesLoaded,
    setSwipedMovieIds,
    reloadRoom,
  } = useRoomData({ code })

  const {
    movies,
    setMovies,
    moviesLoading,
    currentPage,
    hasMoreMovies,
    loadMovies,
    handleLoadMoreMovies,
  } = useMoviesData({ room, swipedMovieIds, swipesLoaded })

  const {
    matchedMovie,
    showMatchAnimation,
    refreshMatches,
    setRefreshMatches,
    handleMatchAnimationComplete,
    triggerMatchAnimation,
  } = useMatchNotifications({ roomId: room?.id || null })

  const handleSwipe = useCallback(async (movie: MovieBasic, direction: "left" | "right") => {
    if (!room) return
    const value = direction === "right"
    const movieIdStr = movie.id.toString()

    setSwipedMovieIds(prev => {
      const newSet = new Set(prev)
      newSet.add(movieIdStr)
      return newSet
    })
    setMovies(prev => prev.filter(m => m.id.toString() !== movieIdStr))

    try {
      const result = await createSwipe(room.id, movieIdStr, value)
      if (result.matchCreated) {
        triggerMatchAnimation(movie)
      }
    } catch (err) {
      console.error("Failed to save swipe:", err)
      setSwipedMovieIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(movieIdStr)
        return newSet
      })
      setMovies(prev => [movie, ...prev])

      const isSwipeLimitError = err instanceof ApiError &&
        (err.code === 'SWIPE_LIMIT_REACHED' || err.message.toLowerCase().includes('swipe limit'))

      if (isSwipeLimitError) {
        toast({
          type: "error",
          title: tSwipe('limitReached'),
          description: tSwipe('limitReachedDescription'),
        })
      } else {
        toast({
          type: "error",
          title: tSwipe('swipeError'),
          description: err instanceof Error ? err.message : tSwipe('swipeErrorDescription'),
        })
      }
    }
  }, [room, setSwipedMovieIds, setMovies, triggerMatchAnimation, toast, tSwipe])

  const handleUndo = useCallback(async (movie: MovieBasic) => {
    if (!room) return
    const movieIdStr = movie.id.toString()

    try {
      await deleteSwipe(room.id, movieIdStr)
      setSwipedMovieIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(movieIdStr)
        return newSet
      })
      setMovies(prev => {
        const exists = prev.some(m => m.id.toString() === movieIdStr)
        if (exists) return prev
        return [movie, ...prev]
      })
      setRefreshMatches(prev => prev + 1)
    } catch (err) {
      console.error("Failed to undo swipe:", err)
    }
  }, [room, setSwipedMovieIds, setMovies, setRefreshMatches])

  const handleShowDetails = useCallback((movieId: number) => {
    setSelectedMovieId(movieId)
    setShowMovieDetails(true)
  }, [])

  const handleTabChange = useCallback(async (value: string) => {
    setCurrentTab(value)
    if (value === "swipe" && room) {
      try {
        const swipes = await getMySwipesByRoom(room.id)
        const swipedIds = new Set(swipes.map(swipe => swipe.movieId))
        setSwipedMovieIds(swipedIds)
        const filtered = movies.filter(movie => movie && !swipedIds.has(movie.id.toString()))
        setMovies(filtered)
        if (filtered.length < 3 && room.genreId !== null && room.genreId !== undefined) {
          await loadMovies(room.genreId, room.type as 'movie' | 'tv', currentPage + 1, true, undefined, swipedIds)
        }
      } catch (err) {
        console.error("Failed to reload swipes:", err)
      }
    }
  }, [room, movies, setMovies, setSwipedMovieIds, loadMovies, currentPage])

  if (loading) return <RoomPageSkeleton />

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BackgroundOrbs />
        <div className="text-center relative z-10">
          <p className="text-red-500 text-lg font-semibold mb-2">{t('error')}</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BackgroundOrbs />
        <p className="text-muted-foreground relative z-10">{t('notFound')}</p>
      </div>
    )
  }

  const userId = session?.user?.id
  const isMember = userId && room.members.some(member => member.id === userId)

  const handleJoinRoom = async () => {
    try {
      setJoiningRoom(true)
      await joinRoom({ code })
      await reloadRoom()
      toast({ title: t('welcomeTitle'), description: t('welcomeDescription') })
    } catch (err) {
      console.error("Failed to join room:", err)
      const errorMessage = err instanceof Error ? err.message : String(err)
      if (errorMessage.toLowerCase().includes('full') || errorMessage.toLowerCase().includes('pleine')) {
        toast({
          type: "error",
          title: t('roomFullTitle'),
          description: t('roomFullDescription', { current: room?.members.length || 0, max: 10 }),
        })
      } else {
        toast({
          type: "error",
          title: t('joinErrorTitle'),
          description: t('joinErrorDescription'),
        })
      }
    } finally {
      setJoiningRoom(false)
    }
  }

  // Join screen for non-members
  if (!isMember) {
    return (
      <div className="min-h-screen bg-background overflow-hidden flex items-center justify-center">
        <BackgroundOrbs />
        <motion.div
          className="relative group max-w-md w-full mx-4 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
          <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg mb-6">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2">{room.name || t('unnamedRoom')}</h1>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Badge variant="secondary" className="text-sm bg-white/10 border-white/20">
                  {room.type === 'movie' ? t('moviesType') : t('tvShowsType')}
                </Badge>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{t('membersCount', { count: room.members.length, max: 10 })}</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">{t('joinRoomDescription')}</p>
              <Button
                onClick={handleJoinRoom}
                disabled={joiningRoom}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg"
              >
                {joiningRoom ? (
                  <>
                    <Film className="w-4 h-4 mr-2 animate-pulse" />
                    {t('connecting')}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t('joiningButton')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <MatchAnimation
        show={showMatchAnimation}
        movie={matchedMovie || undefined}
        onComplete={handleMatchAnimationComplete}
      />

      <Suspense fallback={null}>
        {showMovieDetails && (
          <MovieDetailsModal
            movieId={selectedMovieId}
            mediaType={room?.type as "movie" | "tv" | undefined}
            open={showMovieDetails}
            onOpenChange={setShowMovieDetails}
          />
        )}
      </Suspense>

      <div className="min-h-screen bg-background overflow-hidden flex flex-col">
        <BackgroundOrbs />

        <div className="container mx-auto px-4 py-6 max-w-5xl flex-1 relative z-10">
          {/* Header */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shrink-0">
                        <Film className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                          {room.name || t('unnamedRoom')}
                        </h1>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>
                            Code: <span className="font-mono font-semibold text-primary">{room.code}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {room.members.length}/10
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Badge className="bg-white/10 text-foreground border-white/20 shrink-0">
                        {room.type === 'movie' ? t('moviesType') : t('tvShowsType')}
                      </Badge>
                      <ShareRoomButton
                        roomCode={room.code}
                        roomName={room.name || t('unnamedRoom')}
                        variant="default"
                        size="default"
                        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg text-white ml-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Desktop Tabs */}
          <div className="hidden sm:block mb-6">
            <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5">
              <div className="grid grid-cols-5 gap-1.5">
                {TABS.map((tab) => {
                  const Icon = tab.icon
                  const isActive = currentTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`
                        relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                        ${isActive
                          ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                          : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden lg:inline">{t(`tabs.${tab.id}`)}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {currentTab === "swipe" && (
              <>
                {moviesLoading && movies.length === 0 ? (
                  <div className="space-y-6">
                    <div className="relative h-[550px] w-full max-w-sm mx-auto">
                      <MovieCardSkeleton />
                    </div>
                    <div className="flex justify-center gap-6">
                      <div className="rounded-full w-14 h-14 bg-white/10 animate-pulse" />
                      <div className="rounded-full w-12 h-12 bg-white/10 animate-pulse" />
                      <div className="rounded-full w-14 h-14 bg-white/10 animate-pulse" />
                    </div>
                  </div>
                ) : movies.length > 0 ? (
                  <MovieCards
                    movies={movies}
                    onSwipe={handleSwipe}
                    onUndo={handleUndo}
                    onEmpty={handleLoadMoreMovies}
                    onShowDetails={handleShowDetails}
                    roomFilters={room}
                    isLoading={moviesLoading}
                  />
                ) : (
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-3xl">
                      <div className="text-center py-16 px-6">
                        <div className="text-6xl mb-4">🎬</div>
                        <h3 className="text-xl font-semibold mb-2">
                          {room?.genreId === null || room?.genreId === undefined
                            ? tSwipe('noGenre')
                            : !hasMoreMovies
                            ? tSwipe('allSwiped')
                            : tSwipe('noMovies')}
                        </h3>
                        <p className="text-muted-foreground">
                          {room?.genreId === null || room?.genreId === undefined
                            ? tSwipe('noGenreDescription')
                            : !hasMoreMovies
                            ? tSwipe('allSwipedDescription')
                            : tSwipe('noMoviesDescription')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {currentTab === "matches" && (
              <MatchesList
                roomId={room.id}
                totalMembers={room.members.length}
                refreshTrigger={refreshMatches}
                roomFilters={room}
              />
            )}

            {currentTab === "history" && (
              <Suspense fallback={<div className="text-center py-8 text-muted-foreground">Loading...</div>}>
                <SwipeHistory
                  roomId={room.id}
                  onUndo={async (movieId: string) => {
                    await deleteSwipe(room.id, movieId)
                    setSwipedMovieIds(prev => {
                      const newSet = new Set(prev)
                      newSet.delete(movieId)
                      return newSet
                    })
                    setRefreshMatches(prev => prev + 1)
                  }}
                  mediaType={room?.type as "movie" | "tv"}
                />
              </Suspense>
            )}

            {currentTab === "stats" && (
              <Suspense fallback={<div className="text-center py-8 text-muted-foreground">Loading...</div>}>
                <Analytics roomId={room.id} mediaType={room?.type as "movie" | "tv"} />
              </Suspense>
            )}

            {currentTab === "members" && (
              <div className="space-y-6">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Membres</p>
                        <p className="text-2xl font-bold text-orange-400">{room.members.length}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-400" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {10 - room.members.length} places restantes
                    </p>
                  </div>

                  <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Capacité</p>
                        <p className="text-2xl font-bold">{Math.round((room.members.length / 10) * 100)}%</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-amber-400" />
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all"
                        style={{ width: `${(room.members.length / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Members List */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
                    <div className="p-5">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-orange-400" />
                        {t('roomMembers')}
                      </h3>

                      <div className="space-y-3">
                        {room.members.map((member, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
                              {(member.name ?? "?")[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {member.name ?? t('unknownUser')}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {idx === 0 ? "Créateur" : "Membre"}
                              </p>
                            </div>
                            {idx === 0 && (
                              <div className="px-2 py-1 rounded-lg bg-orange-500/20 text-orange-400 text-xs font-medium">
                                Admin
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>

                      {/* Invite Section */}
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <p className="text-sm text-muted-foreground mb-3">
                          Invitez vos amis à rejoindre cette room
                        </p>
                        <ShareRoomButton
                          roomCode={room.code}
                          roomName={room.name || t('unnamedRoom')}
                          variant="default"
                          size="default"
                          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 shadow-lg text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="hidden sm:block">
          <Footer />
        </div>

        <BottomTabNav
          currentTab={currentTab}
          onTabChange={handleTabChange}
          matchCount={refreshMatches}
          translations={{
            swipe: t('tabs.swipe'),
            matches: t('tabs.matches'),
            history: t('tabs.history'),
            stats: t('tabs.stats'),
            members: t('tabs.members'),
          }}
        />

        <div className="h-20 sm:hidden" />
      </div>
    </>
  )
}

export default function RoomPage() {
  const params = useParams<{ code: string }>()
  const code = params?.code ?? ""

  return (
    <RoomErrorBoundary roomId={code}>
      <RoomPageContent />
    </RoomErrorBoundary>
  )
}
