"use client"

import { useState, useCallback, useEffect, lazy, Suspense } from "react"
import { useParams } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { useTranslations } from "next-intl"
import { isTrialActive, getTrialData } from "@/lib/trial"
import { createSwipe, deleteSwipe } from "@/lib/api/swipes"
import { ApiError } from "@/lib/http"
import { captureEvent } from "@/components/providers/PostHogProvider"
import { joinRoom } from "@/lib/api/rooms"
import { useRoomData, useMoviesData, useMatchNotifications } from "@/hooks/room"
import type { MovieBasic } from "@/schemas/movies"
import { useToast } from "@/components/providers/toast-provider"
import { MatchAnimation } from "@/components/room/MatchAnimation"
import { Footer } from "@/components/layout/Footer"
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs"
import { RoomErrorBoundary } from "@/components/error"
import { RoomPageSkeleton } from "@/components/room/RoomPageSkeleton"
import { BottomTabNav } from "@/components/room/BottomTabNav"
import { JoinRoomScreen } from "@/components/room/JoinRoomScreen"
import { RoomHeader } from "@/components/room/RoomHeader"
import { RoomTabs } from "@/components/room/RoomTabs"
import { TrialBanner } from "@/components/trial/TrialBanner"
import { LoginWallModal } from "@/components/trial/LoginWallModal"
import { useLoginWall } from "@/hooks/trial/useLoginWall"

// Lazy load heavy components that are not always visible
const MovieDetailsModal = lazy(() => import("@/components/movies/MovieDetailsModal").then(m => ({ default: m.MovieDetailsModal })))

function RoomPageContent() {
  const t = useTranslations('room')
  const tSwipe = useTranslations('swipe')
  const params = useParams<{ code: string }>()
  const code = params?.code ?? ""
  const { data: session } = useSession()
  const { toast } = useToast()
  const trialData = isTrialActive() ? getTrialData() : null
  const isTrial = Boolean(trialData)
  const [currentTab, setCurrentTab] = useState("swipe")
  const [joiningRoom, setJoiningRoom] = useState(false)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [showMovieDetails, setShowMovieDetails] = useState(false)
  const [trialSwipeCount, setTrialSwipeCount] = useState(0)
  const [trialHasMatch, setTrialHasMatch] = useState(false)
  const locale = (params as unknown as { locale?: string })?.locale ?? "fr"
  const { shouldShow: showTrialWall, trigger: trialTrigger, dismiss: trialDismiss, isHardBlock: trialHardBlock } = useLoginWall(trialSwipeCount, trialHasMatch)

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
    userJoined,
    resetUserJoined,
    userLeft,
    resetUserLeft,
  } = useMatchNotifications({ roomId: room?.id || null })

  // Notify when a member joins the room
  useEffect(() => {
    if (!userJoined) return
    const name = userJoined.user.name || t('members.someone')
    toast({
      title: t('members.joined', { name }),
      type: "success",
      duration: 3000,
    })
    reloadRoom()
    resetUserJoined()
  }, [userJoined, toast, reloadRoom, resetUserJoined, t])

  // Notify when a member leaves the room
  useEffect(() => {
    if (!userLeft) return
    toast({
      title: t('members.left'),
      type: "default",
      duration: 3000,
    })
    reloadRoom()
    resetUserLeft()
  }, [userLeft, toast, reloadRoom, resetUserLeft, t])

  // Auto-load more movies when the list is empty but more are available
  useEffect(() => {
    if (movies.length === 0 && hasMoreMovies && !moviesLoading && room) {
      handleLoadMoreMovies()
    }
  }, [movies.length, hasMoreMovies, moviesLoading, room, handleLoadMoreMovies])

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
      captureEvent("swipe", { direction, movieId: movieIdStr, roomId: room.id })
      if (isTrial) {
        setTrialSwipeCount(prev => prev + 1)
        captureEvent("trial_swipe", { movieId: movieIdStr, direction, swipeNumber: trialSwipeCount + 1 })
      }
      if (result.matchCreated) {
        if (isTrial) {
          setTrialHasMatch(true)
          captureEvent("trial_match", { movieId: movieIdStr, roomId: room.id })
        }
        captureEvent("match_found", { movieId: movieIdStr, roomId: room.id })
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
      const filtered = movies.filter(movie => movie && !swipedMovieIds.has(movie.id.toString()))
      if (filtered.length !== movies.length) {
        setMovies(filtered)
      }
      if (filtered.length < 3 && room.genreId !== null && room.genreId !== undefined) {
        await loadMovies(room.genreId, room.type as 'movie' | 'tv', currentPage + 1, true, undefined, swipedMovieIds)
      }
    }
  }, [room, movies, swipedMovieIds, setMovies, loadMovies, currentPage])

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

  const userId = session?.user?.id ?? trialData?.guestId
  const isMember = userId && room.members.some(member => member.id === userId)

  const handleJoinRoom = async () => {
    try {
      setJoiningRoom(true)
      await joinRoom({ code })
      await reloadRoom()
      captureEvent("room_joined", { roomCode: code })
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

  if (!isMember) {
    return (
      <JoinRoomScreen
        roomName={room.name}
        roomType={room.type}
        membersCount={room.members.length}
        joiningRoom={joiningRoom}
        onJoinRoom={handleJoinRoom}
        translations={{
          unnamedRoom: t('unnamedRoom'),
          moviesType: t('moviesType'),
          tvShowsType: t('tvShowsType'),
          membersCount: t('membersCount', { count: room.members.length, max: 10 }),
          joinRoomDescription: t('joinRoomDescription'),
          connecting: t('connecting'),
          joiningButton: t('joiningButton'),
        }}
      />
    )
  }

  return (
    <>
      {isTrial && (
        <TrialBanner remaining={Math.max(0, 25 - trialSwipeCount)} locale={locale} />
      )}

      {isTrial && (
        <LoginWallModal
          show={showTrialWall && !showMatchAnimation}
          trigger={trialTrigger}
          isHardBlock={trialHardBlock}
          locale={locale}
          onDismiss={trialDismiss}
        />
      )}

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
          <RoomHeader
            roomName={room.name}
            roomCode={room.code}
            roomType={room.type}
            membersCount={room.members.length}
            isTrial={isTrial}
            translations={{
              unnamedRoom: t('unnamedRoom'),
              moviesType: t('moviesType'),
              tvShowsType: t('tvShowsType'),
            }}
          />

          <RoomTabs
            currentTab={currentTab}
            onTabChange={handleTabChange}
            room={room}
            movies={movies}
            moviesLoading={moviesLoading}
            hasMoreMovies={hasMoreMovies}
            refreshMatches={refreshMatches}
            onSwipe={handleSwipe}
            onUndo={handleUndo}
            onLoadMoreMovies={handleLoadMoreMovies}
            onShowDetails={handleShowDetails}
            setSwipedMovieIds={setSwipedMovieIds}
            setRefreshMatches={setRefreshMatches}
            translations={{
              tabs: {
                swipe: t('tabs.swipe'),
                matches: t('tabs.matches'),
                history: t('tabs.history'),
                stats: t('tabs.stats'),
                members: t('tabs.members'),
              },
              unnamedRoom: t('unnamedRoom'),
              roomMembers: t('roomMembers'),
              unknownUser: t('unknownUser'),
              noGenre: tSwipe('noGenre'),
              noGenreDescription: tSwipe('noGenreDescription'),
              allSwiped: tSwipe('allSwiped'),
              allSwipedDescription: tSwipe('allSwipedDescription'),
              noMovies: tSwipe('noMovies'),
              noMoviesDescription: tSwipe('noMoviesDescription'),
            }}
          />
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
