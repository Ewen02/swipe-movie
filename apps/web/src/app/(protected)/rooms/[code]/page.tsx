"use client"

import { useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { createSwipe, deleteSwipe, getMySwipesByRoom } from "@/lib/api/swipes"
import { joinRoom } from "@/lib/api/rooms"
import { useRoomData, useMoviesData, useMatchNotifications } from "@/hooks/room"
import type { MovieBasic } from "@/schemas/movies"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { MovieCards } from "@/components/swipe/MovieCards"
import { MovieCardSkeleton } from "@/components/swipe/MovieCardSkeleton"
import { MatchesList } from "@/components/room/MatchesList"
import { MatchAnimation } from "@/components/room/MatchAnimation"
import { ShareRoomButton } from "@/components/room/ShareRoomButton"
import { MovieDetailsModal } from "@/components/movies/MovieDetailsModal"
import { Analytics } from "@/components/room/Analytics"
import { SwipeHistory } from "@/components/room/SwipeHistory"
import { Users, Film, UserPlus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/layout/Footer"
import { RoomErrorBoundary } from "@/components/error"
import { RoomPageSkeleton } from "@/components/room/RoomPageSkeleton"

function RoomPageContent() {
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
        title: "Bienvenue !",
        description: "Vous avez rejoint la room avec succès.",
      })
    } catch (err) {
      console.error("Failed to join room:", err)
      const errorMessage = err instanceof Error ? err.message : String(err)

      // Check if it's a "room is full" error
      if (errorMessage.toLowerCase().includes('full') || errorMessage.toLowerCase().includes('pleine')) {
        toast({
          variant: "destructive",
          title: "Room complète",
          description: `Cette room est complète (${room?.members.length || 0}/10 membres). Demande au créateur de la room d'augmenter la capacité ou crée ta propre room !`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de rejoindre la room. Veuillez réessayer.",
        })
      }
    } finally {
      setJoiningRoom(false)
    }
  }

  // If user is not a member, show join screen
  if (!isMember) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <UserPlus className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{room.name || "Room sans nom"}</h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="secondary" className="text-sm">
                {room.type === 'movie' ? '🎬 Films' : '📺 Séries'}
              </Badge>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{room.members.length}/10 membres</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Rejoins cette room pour swiper et trouver des matches avec tes amis !
            </p>
            <Button
              onClick={handleJoinRoom}
              disabled={joiningRoom}
              size="lg"
              className="w-full"
            >
              {joiningRoom ? (
                <>
                  <Film className="w-4 h-4 mr-2 animate-pulse" />
                  Connexion...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Rejoindre la room
                </>
              )}
            </Button>
          </CardContent>
        </Card>
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

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movieId={selectedMovieId}
        mediaType={room?.type as "movie" | "tv" | undefined}
        open={showMovieDetails}
        onOpenChange={setShowMovieDetails}
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
                    <span>{room.members.length}/10 membres</span>
                  </div>
                </div>
              </div>

              <ShareRoomButton
                roomCode={room.code}
                roomName={room.name || "Room sans nom"}
                variant="outline"
                size="sm"
              />
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
            <TabsList className="grid w-full grid-cols-5 h-12">
              <TabsTrigger value="swipe" className="text-base">🎬 Swiper</TabsTrigger>
              <TabsTrigger value="matches" className="text-base">✨ Matches</TabsTrigger>
              <TabsTrigger value="history" className="text-base">📜 Historique</TabsTrigger>
              <TabsTrigger value="stats" className="text-base">📊 Stats</TabsTrigger>
              <TabsTrigger value="members" className="text-base">👥 Membres</TabsTrigger>
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
                <Card className="border-dashed">
                  <CardContent className="text-center py-20">
                    <div className="text-6xl mb-4">🎬</div>
                    <h3 className="text-xl font-semibold mb-2">
                      {room?.genreId === null || room?.genreId === undefined
                        ? "Configuration de la room incomplète"
                        : !hasMoreMovies
                        ? "Plus de films disponibles !"
                        : "Aucun film disponible"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {room?.genreId === null || room?.genreId === undefined
                        ? "Cette room n'a pas de genre configuré. Demande au créateur de configurer un genre pour commencer à swiper !"
                        : !hasMoreMovies
                        ? "Vous avez swipé tous les films disponibles avec ces filtres ! Essayez d'élargir vos critères (genre, note, année, plateforme) pour découvrir plus de contenus."
                        : "Tous les films ont déjà été vus. Essaie de modifier les filtres de la room."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Matches Tab */}
            <TabsContent value="matches">
              <MatchesList roomId={room.id} totalMembers={room.members.length} refreshTrigger={refreshMatches} roomFilters={room} />
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
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
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats">
              <Analytics roomId={room.id} mediaType={room?.type as "movie" | "tv"} />
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
