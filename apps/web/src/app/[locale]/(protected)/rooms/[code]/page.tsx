"use client"

import { useState, useCallback, lazy, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { useTranslations } from "next-intl"
import { createSwipe, deleteSwipe, getMySwipesByRoom } from "@/lib/api/swipes"
import { joinRoom } from "@/lib/api/rooms"
import { useRoomData, useMoviesData, useMatchNotifications } from "@/hooks/room"
import type { MovieBasic } from "@/schemas/movies"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { MovieCards } from "@/components/swipe/MovieCards"
import { MovieCardSkeleton } from "@/components/swipe/MovieCardSkeleton"
import { MatchesList } from "@/components/room/MatchesList"
import { MatchAnimation } from "@/components/room/MatchAnimation"
import { ShareRoomButton } from "@/components/room/ShareRoomButton"
import { Users, Film, UserPlus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/layout/Footer"
import { RoomErrorBoundary } from "@/components/error"
import { RoomPageSkeleton } from "@/components/room/RoomPageSkeleton"

// Lazy load heavy components that are not always visible
const MovieDetailsModal = lazy(() => import("@/components/movies/MovieDetailsModal").then(m => ({ default: m.MovieDetailsModal })))
const Analytics = lazy(() => import("@/components/room/Analytics").then(m => ({ default: m.Analytics })))
const SwipeHistory = lazy(() => import("@/components/room/SwipeHistory").then(m => ({ default: m.SwipeHistory })))

function RoomPageContent() {
  const t = useTranslations('room')
  const tSwipe = useTranslations('swipe')
  const router = useRouter()
  const { code } = useParams<{ code: string }>()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState("swipe")
  const [joiningRoom, setJoiningRoom] = useState(false)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [showMovieDetails, setShowMovieDetails] = useState(false)

  // Custom hooks for room data, movies, and match notifications
  const {
    room,
    loading,
    error,
    swipedMovieIds,
    swipesLoaded,
    setSwipedMovieIds,
    reloadSwipes,
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

    // Add movie to swiped set immediately to prevent re-swiping
    const movieIdStr = movie.id.toString()
    setSwipedMovieIds(prev => {
      const newSet = new Set(prev)
      newSet.add(movieIdStr)
      return newSet
    })

    // Remove the swiped movie from the movies list immediately
    setMovies(prev => prev.filter(m => m.id.toString() !== movieIdStr))

    try {
      const result = await createSwipe(room.id, movieIdStr, value)

      if (result.matchCreated) {
        // Show animation
        triggerMatchAnimation(movie)
      }
    } catch (err) {
      console.error("Failed to save swipe:", err)
      // On error, remove the movie from the swiped set and re-add it to movies
      setSwipedMovieIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(movieIdStr)
        return newSet
      })
      // Re-add the movie back to the list on error
      setMovies(prev => [movie, ...prev])
    }
  }, [room, setSwipedMovieIds, setMovies, triggerMatchAnimation])

  const handleUndo = useCallback(async (movie: MovieBasic) => {
    if (!room) return

    const movieIdStr = movie.id.toString()

    try {
      // Delete the swipe from backend
      await deleteSwipe(room.id, movieIdStr)

      // Remove the movie from the swiped set so it can be swiped again
      setSwipedMovieIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(movieIdStr)
        return newSet
      })

      // Re-add the movie to the front of the list so user can swipe it again
      setMovies(prev => {
        // Check if movie is not already in the list to avoid duplicates
        const exists = prev.some(m => m.id.toString() === movieIdStr)
        if (exists) return prev
        return [movie, ...prev]
      })

      // Refresh matches in case a match was deleted
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
    // Reload swipes when returning to swipe tab
    if (value === "swipe" && room) {
      try {
        const swipes = await getMySwipesByRoom(room.id)
        const swipedIds = new Set(swipes.map(swipe => swipe.movieId))

        // Update swiped IDs state
        setSwipedMovieIds(swipedIds)

        // Re-filter existing movies instead of reloading
        const filtered = movies.filter(movie => movie && !swipedIds.has(movie.id.toString()))
        setMovies(filtered)

        // If we have very few movies left (less than 3), load more
        if (filtered.length < 3 && room.genreId !== null && room.genreId !== undefined) {
          // Pass the fresh swipedIds to avoid closure issues
          await loadMovies(room.genreId, room.type as 'movie' | 'tv', currentPage + 1, true, undefined, swipedIds)
        }
      } catch (err) {
        console.error("Failed to reload swipes:", err)
      }
    }
  }, [room, movies, setMovies, setSwipedMovieIds, loadMovies, currentPage])

  if (loading) {
    return <RoomPageSkeleton />
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold mb-2">{t('error')}</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">{t('notFound')}</p>
      </div>
    )
  }

  // Check if current user is a member of the room
  const userId = session?.user?.id
  const isMember = userId && room.members.some(member => member.id === userId)

  const handleJoinRoom = async () => {
    try {
      setJoiningRoom(true)
      await joinRoom({ code })
      // Reload room data to refresh membership
      await reloadRoom()
      toast({
        title: t('welcomeTitle'),
        description: t('welcomeDescription'),
      })
    } catch (err) {
      console.error("Failed to join room:", err)
      const errorMessage = err instanceof Error ? err.message : String(err)

      // Check if it's a "room is full" error
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

  // If user is not a member, show join screen
  if (!isMember) {
    return (
      <div className="min-h-screen bg-background overflow-hidden flex items-center justify-center">
        {/* Background orbs */}
        <div className="fixed top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

        <div className="relative group max-w-md w-full mx-4">
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
              <p className="text-muted-foreground mb-6">
                {t('joinRoomDescription')}
              </p>
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
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Match Animation */}
      <MatchAnimation
        show={showMatchAnimation}
        movie={matchedMovie || undefined}
        onComplete={handleMatchAnimationComplete}
      />

      {/* Movie Details Modal - Lazy loaded */}
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
        {/* Background orbs */}
        <div className="fixed top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 py-8 max-w-6xl flex-1 relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {room.name || t('unnamedRoom')}
                </h1>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="secondary" className="text-sm">
                    {room.type === 'movie' ? t('moviesType') : t('tvShowsType')}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{t('membersCount', { count: room.members.length, max: 10 })}</span>
                  </div>
                </div>
              </div>

              <ShareRoomButton
                roomCode={room.code}
                roomName={room.name || t('unnamedRoom')}
                variant="outline"
                size="sm"
              />
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 relative bg-gradient-to-br from-green-500/20 to-green-500/10 backdrop-blur-xl border border-green-500/30 rounded-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <div className="py-4 px-6">
                <p className="text-green-700 dark:text-green-300 text-center font-medium">
                  {successMessage}
                </p>
              </div>
            </div>
          )}

          {/* Main Content - Tabs */}
          <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 h-12" aria-label={t('tabs.navigationAriaLabel')}>
              <TabsTrigger value="swipe" className="text-base" aria-label={t('tabs.swipeAriaLabel')}>{t('tabs.swipe')}</TabsTrigger>
              <TabsTrigger value="matches" className="text-base" aria-label={t('tabs.matchesAriaLabel')}>{t('tabs.matches')}</TabsTrigger>
              <TabsTrigger value="history" className="text-base" aria-label={t('tabs.historyAriaLabel')}>{t('tabs.history')}</TabsTrigger>
              <TabsTrigger value="stats" className="text-base" aria-label={t('tabs.statsAriaLabel')}>{t('tabs.stats')}</TabsTrigger>
              <TabsTrigger value="members" className="text-base" aria-label={t('tabs.membersAriaLabel')}>{t('tabs.members')}</TabsTrigger>
            </TabsList>

            {/* Swipe Tab */}
            <TabsContent value="swipe" className="space-y-6">
              {/* Only show loading screen if we have NO movies yet (initial load) */}
              {moviesLoading && movies.length === 0 ? (
                <div className="space-y-6">
                  <div className="relative h-[600px] w-full max-w-sm mx-auto">
                    <MovieCardSkeleton />
                  </div>
                  <div className="flex justify-center gap-6 mt-8">
                    <div className="rounded-full w-16 h-16 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="rounded-full w-14 h-14 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="rounded-full w-16 h-16 bg-gray-200 dark:bg-gray-700 animate-pulse" />
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
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                  <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-3xl overflow-hidden">
                    <div className="text-center py-20 px-6">
                      <div className="text-6xl mb-4">🎬</div>
                      <h3 className="text-xl font-semibold mb-2">
                        {room?.genreId === null || room?.genreId === undefined
                          ? tSwipe('noGenre')
                          : !hasMoreMovies
                          ? tSwipe('allSwiped')
                          : tSwipe('noMovies')}
                      </h3>
                      <p className="text-muted-foreground mb-4">
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
            </TabsContent>

            {/* Matches Tab */}
            <TabsContent value="matches">
              <MatchesList roomId={room.id} totalMembers={room.members.length} refreshTrigger={refreshMatches} roomFilters={room} />
            </TabsContent>

            {/* History Tab - Lazy loaded */}
            <TabsContent value="history">
              <Suspense fallback={<div className="text-center py-8 text-muted-foreground">Loading...</div>}>
                <SwipeHistory
                  roomId={room.id}
                  onUndo={async (movieId: string) => {
                    // Delete the swipe from backend
                    await deleteSwipe(room.id, movieId)
                    // Remove from swiped set
                    setSwipedMovieIds(prev => {
                      const newSet = new Set(prev)
                      newSet.delete(movieId)
                      return newSet
                    })
                    // Refresh matches
                    setRefreshMatches(prev => prev + 1)
                    // Switch to swipe tab to see the movie again
                    setCurrentTab("swipe")
                  }}
                  mediaType={room?.type as "movie" | "tv"}
                />
              </Suspense>
            </TabsContent>

            {/* Stats Tab - Lazy loaded */}
            <TabsContent value="stats">
              <Suspense fallback={<div className="text-center py-8 text-muted-foreground">Loading...</div>}>
                <Analytics roomId={room.id} mediaType={room?.type as "movie" | "tv"} />
              </Suspense>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      {t('roomMembers')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {room.members.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-4 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl hover:from-white/10 hover:to-white/5 transition-all duration-200 border border-white/10"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-lg shadow-md">
                            {(member.name ?? "?")[0].toUpperCase()}
                          </div>
                          <span className="font-medium">
                            {member.name ?? t('unknownUser')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}

export default function RoomPage() {
  const { code } = useParams<{ code: string }>()

  return (
    <RoomErrorBoundary roomId={code}>
      <RoomPageContent />
    </RoomErrorBoundary>
  )
}
