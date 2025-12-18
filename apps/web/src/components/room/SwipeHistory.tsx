"use client"

import { useEffect, useState } from "react"
import {
  Badge,
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@swipe-movie/ui"
import { getMySwipesByRoom } from "@/lib/api/swipes"
import { getBatchMovieDetails } from "@/lib/api/movies"
import { ThumbsUp, ThumbsDown, Film, Undo2, RefreshCw, Loader2, History } from "lucide-react"
import Image from "next/image"
import type { Swipe } from "@/schemas/swipes"
import type { MovieDetails } from "@/schemas/movies"
import { SwipeHistorySkeleton } from "./SwipeHistorySkeleton"
import { cn } from "@/lib/utils"

interface SwipeHistoryProps {
  roomId: string
  onUndo?: (movieId: string) => void
  mediaType?: "movie" | "tv"
}

export function SwipeHistory({ roomId, onUndo, mediaType = "movie" }: SwipeHistoryProps) {
  const [swipes, setSwipes] = useState<Swipe[]>([])
  const [movies, setMovies] = useState<Map<string, MovieDetails>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<"all" | "likes" | "dislikes">("all")
  const [showUndoDialog, setShowUndoDialog] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<{ id: string; title: string } | null>(null)
  const [undoingMovieId, setUndoingMovieId] = useState<string | null>(null)

  useEffect(() => {
    loadHistory()
  }, [roomId])

  const handleUndoClick = (movieId: string, movieTitle: string) => {
    setSelectedMovie({ id: movieId, title: movieTitle })
    setShowUndoDialog(true)
  }

  const handleConfirmUndo = async () => {
    if (selectedMovie && onUndo) {
      setUndoingMovieId(selectedMovie.id)
      try {
        await onUndo(selectedMovie.id)
      } finally {
        setUndoingMovieId(null)
      }
    }
    setShowUndoDialog(false)
    setSelectedMovie(null)
  }

  const loadHistory = async () => {
    try {
      setLoading(true)
      const swipesData = await getMySwipesByRoom(roomId)

      // Sort by most recent first
      swipesData.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })

      setSwipes(swipesData)

      // Load movie details for all swipes
      if (swipesData.length > 0) {
        const movieIds = Array.from(new Set(swipesData.map((s) => parseInt(s.movieId))))
        const moviesData = await getBatchMovieDetails(movieIds)

        const moviesMap = new Map<string, MovieDetails>()
        moviesData.forEach((movie) => {
          moviesMap.set(movie.id.toString(), movie)
        })
        setMovies(moviesMap)
      }
    } catch (err) {
      console.error("Failed to load swipe history:", err)
      setError(err instanceof Error ? err.message : "Failed to load history")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <SwipeHistorySkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <Film className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-red-500 mb-4">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={loadHistory}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </Button>
      </div>
    )
  }

  if (swipes.length === 0) {
    return (
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border-2 border-dashed border-border rounded-3xl">
          <div className="text-center py-16 px-6">
            <div className="text-6xl mb-4">📜</div>
            <h3 className="text-xl font-semibold mb-2">Aucun swipe pour le moment</h3>
            <p className="text-muted-foreground">
              Commence à swiper pour voir ton historique ici !
            </p>
          </div>
        </div>
      </div>
    )
  }

  const filteredSwipes = swipes.filter((swipe) => {
    if (filterType === "likes") return swipe.value === true
    if (filterType === "dislikes") return swipe.value === false
    return true
  })

  const totalLikes = swipes.filter((s) => s.value === true).length
  const totalDislikes = swipes.filter((s) => s.value === false).length

  const FILTERS = [
    { id: "all", label: "Tous", count: swipes.length, color: "from-blue-500 to-cyan-500" },
    { id: "likes", label: "J'aime", count: totalLikes, color: "from-green-500 to-emerald-500" },
    { id: "dislikes", label: "Pas intéressé", count: totalDislikes, color: "from-red-500 to-rose-500" },
  ] as const

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="relative group">
          <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{swipes.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Film className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">J'aime</p>
                <p className="text-2xl font-bold text-green-400">{totalLikes}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <ThumbsUp className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Passés</p>
                <p className="text-2xl font-bold text-red-400">{totalDislikes}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <ThumbsDown className="w-5 h-5 text-red-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {FILTERS.map((filter) => {
          const isActive = filterType === filter.id
          return (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id as typeof filterType)}
              className={cn(
                "relative px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                isActive
                  ? "text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground bg-foreground/5 hover:bg-foreground/10 border border-border"
              )}
            >
              {isActive && (
                <div className={cn("absolute inset-0 bg-gradient-to-r rounded-xl", filter.color)} />
              )}
              <span className="relative">{filter.label}</span>
              <span className={cn(
                "relative text-xs px-1.5 py-0.5 rounded-md",
                isActive ? "bg-foreground/20" : "bg-foreground/10"
              )}>
                {filter.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Swipe Grid */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <div className="p-5">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-400" />
              Historique
            </h3>

            {filteredSwipes.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Aucun swipe dans cette catégorie</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredSwipes.map((swipe) => {
                  const movie = movies.get(swipe.movieId)
                  if (!movie) return null

                  return (
                    <div key={swipe.id} className="group/card">
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-foreground/5">
                        <Image
                          src={movie.posterUrl || movie.backdropUrl}
                          alt={movie.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Status badge - top right */}
                        <div className="absolute top-2 right-2">
                          <Badge className={cn(
                            "text-white text-[10px] px-1.5 py-0.5",
                            swipe.value ? "bg-green-500/90" : "bg-red-500/90"
                          )}>
                            {swipe.value ? (
                              <><ThumbsUp className="w-3 h-3 mr-1" /> Like</>
                            ) : (
                              <><ThumbsDown className="w-3 h-3 mr-1" /> Pass</>
                            )}
                          </Badge>
                        </div>

                        {/* Bottom info */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          {/* Undo button */}
                          {onUndo && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleUndoClick(swipe.movieId, movie.title)
                              }}
                              className="w-full h-7 mb-2 text-xs bg-background/80 dark:bg-black/60 hover:bg-background/90 dark:hover:bg-black/80 backdrop-blur-sm border border-border opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-opacity"
                              disabled={undoingMovieId === swipe.movieId}
                            >
                              {undoingMovieId === swipe.movieId ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <Undo2 className="w-3 h-3 mr-1" />
                                  Annuler
                                </>
                              )}
                            </Button>
                          )}
                          <h4 className="font-semibold text-sm text-white line-clamp-2 mb-0.5">{movie.title}</h4>
                          <p className="text-[10px] text-white/60">
                            {new Date(swipe.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Undo Confirmation Dialog */}
      <AlertDialog open={showUndoDialog} onOpenChange={setShowUndoDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler ce swipe ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler votre swipe pour "{selectedMovie?.title}" ?
              Le film réapparaîtra dans votre pile de swipe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={undoingMovieId !== null}>Non, conserver</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUndo} disabled={undoingMovieId !== null}>
              {undoingMovieId !== null ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Annulation...
                </>
              ) : (
                "Oui, annuler"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
