"use client"

import { useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { createSwipe, deleteSwipe, getMySwipesByRoom } from "@/lib/api/swipes"
import { useRoomData, useMoviesData, useMatchNotifications } from "@/hooks/room"
import type { MovieBasic } from "@/schemas/movies"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MovieCards } from "@/components/swipe/MovieCards"
import { MatchesList } from "@/components/room/MatchesList"
import { MatchAnimation } from "@/components/room/MatchAnimation"
import { Users, Copy, CheckCircle2, Film } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/layout/Footer"
import { RoomErrorBoundary } from "@/components/error"

function RoomPageContent() {
  const { code } = useParams<{ code: string }>()
  const [copied, setCopied] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState("swipe")

  // Custom hooks for room data, movies, and match notifications
  const {
    room,
    loading,
    error,
    swipedMovieIds,
    setSwipedMovieIds,
    reloadSwipes,
  } = useRoomData({ code })

  const {
    movies,
    setMovies,
    moviesLoading,
    currentPage,
    loadMovies,
    handleLoadMoreMovies,
  } = useMoviesData({ room, swipedMovieIds })

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

    try {
      const result = await createSwipe(room.id, movieIdStr, value)

      if (result.matchCreated) {
        // Show animation
        triggerMatchAnimation(movie)
      }
    } catch (err) {
      console.error("Failed to save swipe:", err)
      // On error, remove the movie from the swiped set
      setSwipedMovieIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(movieIdStr)
        return newSet
      })
    }
  }, [room, setSwipedMovieIds, triggerMatchAnimation])

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

      // Refresh matches in case a match was deleted
      setRefreshMatches(prev => prev + 1)
    } catch (err) {
      console.error("Failed to undo swipe:", err)
    }
  }, [room, setSwipedMovieIds, setRefreshMatches])

  const handleCopyCode = useCallback(() => {
    if (room?.code) {
      navigator.clipboard.writeText(room.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [room?.code])

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
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Film className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Chargement de la room...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold mb-2">Erreur</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Room introuvable</p>
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

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col">
        <div className="container mx-auto px-4 py-8 max-w-6xl flex-1">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {room.name || "Room sans nom"}
                </h1>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="secondary" className="text-sm">
                    {room.type === 'movie' ? '🎬 Films' : '📺 Séries'}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{room.members.length} membre{room.members.length > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="flex items-center gap-2 shrink-0 font-mono"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    {room.code}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <Card className="mb-6 border-green-500/50 bg-green-500/10">
              <CardContent className="py-4">
                <p className="text-green-700 dark:text-green-300 text-center font-medium">
                  {successMessage}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Main Content - Tabs */}
          <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-12">
              <TabsTrigger value="swipe" className="text-base">🎬 Swiper</TabsTrigger>
              <TabsTrigger value="matches" className="text-base">✨ Matches</TabsTrigger>
              <TabsTrigger value="members" className="text-base">👥 Membres</TabsTrigger>
            </TabsList>

            {/* Swipe Tab */}
            <TabsContent value="swipe" className="space-y-6">
              {moviesLoading ? (
                <div className="text-center py-20">
                  <Film className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
                  <p className="text-muted-foreground">Chargement des films...</p>
                </div>
              ) : movies.length > 0 ? (
                <MovieCards
                  movies={movies}
                  onSwipe={handleSwipe}
                  onUndo={handleUndo}
                  onEmpty={handleLoadMoreMovies}
                  roomFilters={room}
                />
              ) : (
                <Card className="border-dashed">
                  <CardContent className="text-center py-20">
                    <div className="text-6xl mb-4">🎬</div>
                    <h3 className="text-xl font-semibold mb-2">
                      Aucun film disponible
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Cette room n'a pas de genre configuré
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Matches Tab */}
            <TabsContent value="matches">
              <MatchesList roomId={room.id} totalMembers={room.members.length} refreshTrigger={refreshMatches} roomFilters={room} />
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Membres de la room
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {room.members.map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-lg">
                          {(member.name ?? "?")[0].toUpperCase()}
                        </div>
                        <span className="font-medium">
                          {member.name ?? "Utilisateur inconnu"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
