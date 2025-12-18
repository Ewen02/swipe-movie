"use client"

import { useState, useCallback, useEffect, lazy, Suspense, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Badge, Button } from "@swipe-movie/ui"
import { Heart, Users, Compass, Loader2, Settings2, Undo2, EyeOff, Eye } from "lucide-react"
import { useUserPreferences } from "@/hooks/useUserPreferences"
import { useGenres } from "@/hooks/useGenres"
import { useUserLibrary } from "@/hooks/useUserLibrary"
import { getMoviesByGenre, getPopularMovies } from "@/lib/api/movies"
import { saveOnboardingSwipes, deleteLibraryItemByTmdbId, type OnboardingSwipe } from "@/lib/api/users"
import type { MovieBasic } from "@/schemas/movies"
import { MovieCards } from "@/components/swipe/MovieCards"
import { MovieCardSkeleton } from "@/components/swipe/MovieCardSkeleton"
import { Footer } from "@/components/layout/Footer"
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs"
import { useToast } from "@/components/providers/toast-provider"

const MovieDetailsModal = lazy(() =>
  import("@/components/movies/MovieDetailsModal").then((m) => ({
    default: m.MovieDetailsModal,
  }))
)

// localStorage key for hide library preference
const HIDE_LIBRARY_KEY = "discover-hide-library"

export default function DiscoverPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { preferences, isLoading: prefsLoading } = useUserPreferences()
  const { genres } = useGenres()

  // Load user library for filtering
  const { items: libraryItems, isLoading: libraryLoading } = useUserLibrary({ limit: 1000 })

  const [movies, setMovies] = useState<MovieBasic[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [swipedIds, setSwipedIds] = useState<Set<string>>(new Set())
  const [likedCount, setLikedCount] = useState(0)
  const [swipedCount, setSwipedCount] = useState(0)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [showMovieDetails, setShowMovieDetails] = useState(false)
  const [hideLibrary, setHideLibrary] = useState(false)
  const [lastSwipedMovie, setLastSwipedMovie] = useState<{ movie: MovieBasic; liked: boolean } | null>(null)

  // Load hide library preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(HIDE_LIBRARY_KEY)
    if (stored !== null) {
      setHideLibrary(stored === "true")
    }
  }, [])

  // Compute library IDs for filtering
  const { dislikedIds, allLibraryIds } = useMemo(() => {
    const disliked = new Set<string>()
    const all = new Set<string>()

    for (const item of libraryItems) {
      all.add(item.tmdbId)
      if (item.status === "disliked") {
        disliked.add(item.tmdbId)
      }
    }

    return { dislikedIds: disliked, allLibraryIds: all }
  }, [libraryItems])

  // Handle hide library toggle change
  const handleHideLibraryChange = useCallback((checked: boolean) => {
    setHideLibrary(checked)
    localStorage.setItem(HIDE_LIBRARY_KEY, String(checked))
  }, [])

  // Load movies based on user preferences
  const loadMovies = useCallback(
    async (page: number) => {
      if (!preferences) return

      try {
        setLoading(true)
        let newMovies: MovieBasic[] = []

        // If user has favorite genres, use them
        if (preferences.favoriteGenreIds?.length > 0) {
          // Pick a random genre from favorites
          const randomGenreId =
            preferences.favoriteGenreIds[
              Math.floor(Math.random() * preferences.favoriteGenreIds.length)
            ]

          newMovies = await getMoviesByGenre(randomGenreId, "movie", page, {
            watchProviders: preferences.watchProviders,
            watchRegion: preferences.watchRegion || "FR",
          })
        } else {
          // Fallback to popular movies
          newMovies = await getPopularMovies(page)
        }

        // Filter movies:
        // 1. Always exclude already swiped in this session
        // 2. Always exclude disliked movies from library
        // 3. If hideLibrary is enabled, exclude all library items
        const filteredMovies = newMovies.filter((m) => {
          const idStr = m.id.toString()
          if (swipedIds.has(idStr)) return false
          if (dislikedIds.has(idStr)) return false
          if (hideLibrary && allLibraryIds.has(idStr)) return false
          return true
        })

        setMovies((prev) =>
          page === 1
            ? filteredMovies
            : [...prev, ...filteredMovies.filter((m) => !prev.some((p) => p.id === m.id))]
        )
        setCurrentPage(page)
      } catch (error) {
        console.error("Failed to load movies:", error)
        toast({
          type: "error",
          title: "Erreur",
          description: "Impossible de charger les films",
        })
      } finally {
        setLoading(false)
      }
    },
    [preferences, swipedIds, dislikedIds, allLibraryIds, hideLibrary, toast]
  )

  // Initial load - wait for both preferences and library
  useEffect(() => {
    if (preferences && !prefsLoading && !libraryLoading) {
      loadMovies(1)
    }
  }, [preferences, prefsLoading, libraryLoading, hideLibrary])

  const handleSwipe = useCallback(
    async (movie: MovieBasic, direction: "left" | "right") => {
      const liked = direction === "right"
      const movieIdStr = movie.id.toString()

      // Track last swiped movie for undo
      setLastSwipedMovie({ movie, liked })

      // Update local state
      setSwipedIds((prev) => {
        const newSet = new Set(prev)
        newSet.add(movieIdStr)
        return newSet
      })
      setMovies((prev) => prev.filter((m) => m.id.toString() !== movieIdStr))
      setSwipedCount((prev) => prev + 1)
      if (liked) {
        setLikedCount((prev) => prev + 1)
      }

      // Save to backend
      try {
        const swipe: OnboardingSwipe = {
          tmdbId: movieIdStr,
          mediaType: "movie",
          liked,
          source: "discover",
        }
        await saveOnboardingSwipes([swipe])
      } catch (error) {
        console.error("Failed to save swipe:", error)
      }
    },
    []
  )

  const handleUndo = useCallback(async (movie: MovieBasic) => {
    const movieIdStr = movie.id.toString()

    // Update local state first (optimistic)
    setSwipedIds((prev) => {
      const newSet = new Set(prev)
      newSet.delete(movieIdStr)
      return newSet
    })
    setMovies((prev) => [movie, ...prev])
    setSwipedCount((prev) => Math.max(0, prev - 1))

    // Check if this was a liked movie and decrement counter
    if (lastSwipedMovie?.movie.id === movie.id && lastSwipedMovie.liked) {
      setLikedCount((prev) => Math.max(0, prev - 1))
    }

    // Clear last swiped movie
    setLastSwipedMovie(null)

    // Delete from backend
    try {
      await deleteLibraryItemByTmdbId(movieIdStr, "movie")
    } catch (error) {
      console.error("Failed to undo swipe:", error)
      // Don't show error toast - the local undo already happened
    }
  }, [lastSwipedMovie])

  const handleLoadMore = useCallback(() => {
    if (!loading) {
      loadMovies(currentPage + 1)
    }
  }, [loading, currentPage, loadMovies])

  const handleShowDetails = useCallback((movieId: number) => {
    setSelectedMovieId(movieId)
    setShowMovieDetails(true)
  }, [])

  // Get user's selected genre names
  const selectedGenreNames = preferences?.favoriteGenreIds
    ?.map((id) => genres.find((g) => g.id === id)?.name)
    .filter(Boolean)
    .slice(0, 3)

  if (prefsLoading || libraryLoading || (!preferences && !prefsLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <BackgroundOrbs />
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <Suspense fallback={null}>
        {showMovieDetails && (
          <MovieDetailsModal
            movieId={selectedMovieId}
            mediaType="movie"
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
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-accent via-primary to-accent" />
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shrink-0">
                        <Compass className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                          Decouverte
                        </h1>
                        <p className="text-sm text-muted-foreground">
                          Explorez des films personnalises pour vous
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {selectedGenreNames && selectedGenreNames.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {selectedGenreNames.map((name) => (
                            <Badge
                              key={name}
                              className="bg-accent/20 text-accent border-accent/30 text-xs"
                            >
                              {name}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/onboarding")}
                        className="ml-auto"
                      >
                        <Settings2 className="w-4 h-4 mr-1" />
                        Preferences
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <div className="flex items-center gap-4 px-4 py-2 bg-foreground/5 backdrop-blur-sm rounded-full border border-border">
              <span className="text-sm font-medium text-foreground/80">
                {swipedCount} films vus
              </span>
              <div className="w-px h-4 bg-border" />
              <span className="flex items-center gap-1.5 text-sm text-green-500">
                <Heart className="w-4 h-4 fill-green-500" />
                {likedCount} likes
              </span>
            </div>
            <button
              onClick={() => handleHideLibraryChange(!hideLibrary)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                hideLibrary
                  ? "bg-primary/20 border-primary/30 text-primary"
                  : "bg-foreground/5 border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              {hideLibrary ? (
                <EyeOff className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
              <span className="text-xs font-medium">
                {hideLibrary ? "Bibliotheque masquee" : "Masquer bibliotheque"}
              </span>
            </button>
          </div>

          {/* Movie cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {loading && movies.length === 0 ? (
              <div className="space-y-6">
                <div className="relative h-[550px] w-full max-w-sm mx-auto">
                  <MovieCardSkeleton />
                </div>
                <div className="flex justify-center gap-6">
                  <div className="rounded-full w-14 h-14 bg-foreground/10 animate-pulse" />
                  <div className="rounded-full w-12 h-12 bg-foreground/10 animate-pulse" />
                  <div className="rounded-full w-14 h-14 bg-foreground/10 animate-pulse" />
                </div>
              </div>
            ) : movies.length > 0 ? (
              <MovieCards
                movies={movies}
                onSwipe={handleSwipe}
                onUndo={handleUndo}
                onEmpty={handleLoadMore}
                onShowDetails={handleShowDetails}
                isLoading={loading}
              />
            ) : (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border-2 border-dashed border-border rounded-3xl">
                  <div className="text-center py-16 px-6">
                    <div className="text-6xl mb-4">🎬</div>
                    <h3 className="text-xl font-semibold mb-2">
                      Plus de films !
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Vous avez vu tous les films disponibles pour vos preferences
                    </p>
                    <Button
                      onClick={() => loadMovies(1)}
                      className="bg-gradient-to-r from-accent to-primary hover:opacity-90"
                    >
                      Recharger
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* CTA to create room */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground/80">
                Envie de decider ensemble ?
              </span>
              <Button
                variant="link"
                size="sm"
                onClick={() => router.push("/rooms?create=true")}
                className="text-primary p-0 h-auto"
              >
                Creer une room
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="hidden sm:block">
          <Footer />
        </div>
      </div>
    </>
  )
}
