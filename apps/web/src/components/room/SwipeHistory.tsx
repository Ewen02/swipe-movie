"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMySwipesByRoom } from "@/lib/api/swipes"
import { getBatchMovieDetails } from "@/lib/api/movies"
import { ThumbsUp, ThumbsDown, Film, Undo2 } from "lucide-react"
import Image from "next/image"
import type { Swipe } from "@/schemas/swipes"
import type { MovieDetails } from "@/schemas/movies"
import { SwipeHistorySkeleton } from "./SwipeHistorySkeleton"

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

  useEffect(() => {
    loadHistory()
  }, [roomId])

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
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (swipes.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📜</div>
        <h3 className="text-xl font-semibold mb-2">Aucun swipe pour le moment</h3>
        <p className="text-muted-foreground">
          Commence à swiper pour voir ton historique ici !
        </p>
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

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Swipes</p>
                <p className="text-2xl font-bold">{swipes.length}</p>
              </div>
              <Film className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">J'aime</p>
                <p className="text-2xl font-bold text-green-500">{totalLikes}</p>
              </div>
              <ThumbsUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pas intéressé</p>
                <p className="text-2xl font-bold text-red-500">{totalDislikes}</p>
              </div>
              <ThumbsDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filterType} onValueChange={(value) => setFilterType(value as typeof filterType)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Tous ({swipes.length})</TabsTrigger>
          <TabsTrigger value="likes">J'aime ({totalLikes})</TabsTrigger>
          <TabsTrigger value="dislikes">Pas intéressé ({totalDislikes})</TabsTrigger>
        </TabsList>

        <TabsContent value={filterType} className="space-y-4">
          {filteredSwipes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-10">
                <p className="text-muted-foreground">Aucun swipe dans cette catégorie</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSwipes.map((swipe) => {
                const movie = movies.get(swipe.movieId)
                if (!movie) return null

                return (
                  <Card key={swipe.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={movie.posterUrl || movie.backdropUrl}
                          alt={movie.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                          <div className="absolute top-2 right-2">
                            <Badge className={swipe.value ? "bg-green-500" : "bg-red-500"}>
                              {swipe.value ? (
                                <><ThumbsUp className="w-3 h-3 mr-1" /> J'aime</>
                              ) : (
                                <><ThumbsDown className="w-3 h-3 mr-1" /> Pas intéressé</>
                              )}
                            </Badge>
                          </div>
                          {onUndo && (
                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => onUndo(swipe.movieId)}
                                className="gap-1"
                              >
                                <Undo2 className="w-3 h-3" />
                                Annuler
                              </Button>
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 text-white">
                            <h4 className="font-semibold text-sm line-clamp-2">{movie.title}</h4>
                            <p className="text-xs text-gray-300">
                              {new Date(swipe.createdAt).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
