"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { getRoomByCode } from "@/lib/api/rooms"
import { getMoviesByGenre, MovieFilters, getMovieDetails } from "@/lib/api/movies"
import { createSwipe, getMySwipesByRoom } from "@/lib/api/swipes"
import { useRoomSocket } from "@/hooks/useRoomSocket"
import { useToast } from "@/components/providers/toast-provider"
import type { RoomWithMembersResponseDto } from "@/schemas/rooms"
import type { MovieBasic } from "@/schemas/movies"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MovieCards } from "@/components/swipe/MovieCards"
import { MatchesList } from "@/components/room/MatchesList"
import { MatchAnimation } from "@/components/room/MatchAnimation"
import { Users, Copy, CheckCircle2, Film } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Seeded random number generator for consistent shuffling per user
function seededRandom(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return function() {
    hash = (hash * 9301 + 49297) % 233280
    return hash / 233280
  }
}

// Shuffle array with a seed for consistent ordering per user
function shuffleWithSeed<T>(array: T[], seed: string): T[] {
  const shuffled = [...array]
  const random = seededRandom(seed)
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function RoomPage() {
  const { code } = useParams<{ code: string }>()
  const { toast } = useToast()
  const { data: session } = useSession()
  const [room, setRoom] = useState<RoomWithMembersResponseDto | null>(null)
  const [movies, setMovies] = useState<MovieBasic[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [moviesLoading, setMoviesLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [matchedMovie, setMatchedMovie] = useState<MovieBasic | null>(null)
  const [showMatchAnimation, setShowMatchAnimation] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [refreshMatches, setRefreshMatches] = useState(0)
  const [swipedMovieIds, setSwipedMovieIds] = useState<Set<string>>(new Set())
  const [currentTab, setCurrentTab] = useState("swipe")
  const lastProcessedMatchId = useRef<string | null>(null)

  // WebSocket connection for real-time match notifications
  const { newMatch, resetNewMatch } = useRoomSocket(room?.id || null)

  useEffect(() => {
    if (!code) return
    loadRoom()
  }, [code])

  // Handle new match from WebSocket
  useEffect(() => {
    if (!newMatch) return

    // Prevent processing the same match multiple times
    const matchId = newMatch.match.id
    if (lastProcessedMatchId.current === matchId) {
      return
    }
    lastProcessedMatchId.current = matchId

    const handleNewMatch = async () => {
      // Show toast notification
      toast({
        title: "🎉 Nouveau Match !",
        description: `Un film a été matché par le groupe !`,
        type: "success",
        duration: 5000,
      })

      // Fetch movie details and show animation if we have the movieId
      if (newMatch.match.movieId) {
        try {
          const movie = await getMovieDetails(parseInt(newMatch.match.movieId))

          // Show match animation
          setMatchedMovie(movie)
          setShowMatchAnimation(true)
        } catch (error) {
          console.error("Failed to fetch movie details:", error)
        }
      }

      // Trigger refresh of matches list
      setRefreshMatches((prev) => prev + 1)

      // Reset the match state
      resetNewMatch()
    }

    handleNewMatch()
  }, [newMatch])

  const loadRoom = async () => {
    try {
      setLoading(true)
      const roomData = await getRoomByCode(code)
      setRoom(roomData)

      // Load user's swipes for this room to filter already swiped movies
      let swipedIds = new Set<string>()
      try {
        const swipes = await getMySwipesByRoom(roomData.id)
        swipedIds = new Set(swipes.map(swipe => swipe.movieId))
        console.log(`[RE-SWIPE DEBUG] Loaded ${swipes.length} swipes for room ${roomData.id}`)
        console.log(`[RE-SWIPE DEBUG] Swiped movie IDs:`, Array.from(swipedIds))
        setSwipedMovieIds(swipedIds)
      } catch (err) {
        console.error("Failed to load swipes:", err)
      }

      // Load movies based on room's genre and type
      // Pass swipedIds directly to avoid React state timing issues
      if (roomData.genreId) {
        await loadMovies(roomData.genreId, roomData.type as 'movie' | 'tv', 1, false, roomData, swipedIds)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load room")
    } finally {
      setLoading(false)
    }
  }

  const loadMovies = async (
    genreId: number,
    type: 'movie' | 'tv' = 'movie',
    page = 1,
    append = false,
    roomData?: RoomWithMembersResponseDto,
    customSwipedIds?: Set<string>
  ) => {
    try {
      setMoviesLoading(true)

      // Use roomData if provided, otherwise use room state
      const currentRoom = roomData || room

      // Build filters from room settings
      const filters: MovieFilters = {}
      if (currentRoom?.minRating) filters.minRating = currentRoom.minRating
      if (currentRoom?.releaseYearMin) filters.releaseYearMin = currentRoom.releaseYearMin
      if (currentRoom?.releaseYearMax) filters.releaseYearMax = currentRoom.releaseYearMax
      if (currentRoom?.runtimeMin) filters.runtimeMin = currentRoom.runtimeMin
      if (currentRoom?.runtimeMax) filters.runtimeMax = currentRoom.runtimeMax
      if (currentRoom?.watchProviders && currentRoom.watchProviders.length > 0) {
        filters.watchProviders = currentRoom.watchProviders
      }
      if (currentRoom?.watchRegion) filters.watchRegion = currentRoom.watchRegion
      if (currentRoom?.originalLanguage) filters.originalLanguage = currentRoom.originalLanguage

      console.log("Loading movies with filters:", filters)
      const moviesData = await getMoviesByGenre(genreId, type, page, filters)

      // Use custom swiped IDs if provided (avoids closure issues)
      const swipedIds = customSwipedIds || swipedMovieIds

      // Filter out already swiped movies
      console.log(`[RE-SWIPE DEBUG] Before filter: ${moviesData.length} movies, swipedIds has ${swipedIds.size} entries`)
      const filteredMovies = moviesData.filter(movie => {
        const isAlreadySwiped = swipedIds.has(movie.id.toString())
        if (isAlreadySwiped) {
          console.log(`[RE-SWIPE DEBUG] Filtering out movie ${movie.id} (${movie.title})`)
        }
        return !isAlreadySwiped
      })
      console.log(`[RE-SWIPE DEBUG] After filter: ${filteredMovies.length} movies`)

      // Shuffle movies with user email + room ID as seed for consistent but unique ordering per user
      const seed = `${session?.user?.email || 'anonymous'}-${currentRoom?.id || room?.id || 'room'}-${page}`
      const shuffledMovies = shuffleWithSeed(filteredMovies, seed)

      if (append) {
        setMovies(prev => {
          // Filter out any undefined values and create a Set of existing movie IDs to avoid duplicates
          const validPrev = prev.filter(Boolean)
          const validShuffled = shuffledMovies.filter(Boolean)
          const existingIds = new Set(validPrev.map(m => m.id))
          const newMovies = validShuffled.filter(m => !existingIds.has(m.id))
          return [...validPrev, ...newMovies]
        })
      } else {
        setMovies(shuffledMovies.filter(Boolean))
        setCurrentPage(page)
      }

      // If we got very few movies after filtering (less than 5) and we're not on a high page yet,
      // automatically load more to ensure a good user experience
      const currentMovieCount = append ? movies.length + shuffledMovies.length : shuffledMovies.length
      if (currentMovieCount < 5 && shuffledMovies.length > 0 && page < 5) {
        console.log(`Only ${currentMovieCount} movies after filtering, loading next page...`)
        setMoviesLoading(false) // Temporarily set to false
        await loadMovies(genreId, type, page + 1, true, roomData)
        return // Don't set loading to false again, the recursive call will handle it
      }
    } catch (err) {
      console.error("Failed to load movies:", err)
      setError("Impossible de charger les films")
    } finally {
      setMoviesLoading(false)
    }
  }

  const handleSwipe = async (movie: MovieBasic, direction: "left" | "right") => {
    if (!room) return

    const value = direction === "right"

    // Add movie to swiped set immediately to prevent re-swiping
    const movieIdStr = movie.id.toString()
    setSwipedMovieIds(prev => {
      const newSet = new Set(prev)
      newSet.add(movieIdStr)
      console.log(`[RE-SWIPE DEBUG] Adding movie ${movie.id}, swipedMovieIds now has ${newSet.size} entries (was ${prev.size})`)
      return newSet
    })

    try {
      const result = await createSwipe(room.id, movieIdStr, value)

      if (result.matchCreated) {
        // Show animation
        setMatchedMovie(movie)
        setShowMatchAnimation(true)
      }
    } catch (err) {
      console.error("Failed to save swipe:", err)
      // On error, remove the movie from the swiped set
      setSwipedMovieIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(movieIdStr)
        console.log(`[RE-SWIPE DEBUG] Error occurred, removed movie ${movie.id}, swipedMovieIds now has ${newSet.size} entries`)
        return newSet
      })
    }
  }

  const handleMatchAnimationComplete = () => {
    setShowMatchAnimation(false)
    setMatchedMovie(null)
  }

  const handleCopyCode = () => {
    if (room?.code) {
      navigator.clipboard.writeText(room.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLoadMoreMovies = () => {
    if (room?.genreId && !moviesLoading) {
      const nextPage = currentPage + 1
      loadMovies(room.genreId, room.type as 'movie' | 'tv', nextPage, true)
    }
  }

  const handleTabChange = async (value: string) => {
    setCurrentTab(value)
    // Reload swipes when returning to swipe tab
    if (value === "swipe" && room) {
      console.log("[RE-SWIPE DEBUG] Tab changed to swipe, reloading swipes...")
      try {
        const swipes = await getMySwipesByRoom(room.id)
        const swipedIds = new Set(swipes.map(swipe => swipe.movieId))
        console.log(`[RE-SWIPE DEBUG] Reloaded ${swipes.length} swipes after tab change`)
        console.log(`[RE-SWIPE DEBUG] Updated swiped movie IDs:`, Array.from(swipedIds))

        // Update swiped IDs state
        setSwipedMovieIds(swipedIds)

        // Re-filter existing movies instead of reloading
        const filtered = movies.filter(movie => movie && !swipedIds.has(movie.id.toString()))
        console.log(`[RE-SWIPE DEBUG] Filtered movies from ${movies.length} to ${filtered.length}`)
        setMovies(filtered)

        // If we have very few movies left (less than 3), load more
        if (filtered.length < 3 && room.genreId) {
          console.log("[RE-SWIPE DEBUG] Too few movies left, loading more...")
          // Pass the fresh swipedIds to avoid closure issues
          await loadMovies(room.genreId, room.type as 'movie' | 'tv', currentPage + 1, true, undefined, swipedIds)
        }
      } catch (err) {
        console.error("Failed to reload swipes:", err)
      }
    }
  }

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

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
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
              <MatchesList roomId={room.id} totalMembers={room.members.length} refreshTrigger={refreshMatches} />
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
      </div>
    </>
  )
}
