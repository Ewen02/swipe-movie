"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getMovieDetails } from "@/lib/api/movies"
import type { MovieDetails } from "@/schemas/movies"
import { Calendar, Clock, Star, Globe, Film, ExternalLink } from "lucide-react"
import Image from "next/image"

interface MovieDetailsModalProps {
  movieId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MovieDetailsModal({
  movieId,
  open,
  onOpenChange,
}: MovieDetailsModalProps) {
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (movieId && open) {
      loadMovieDetails()
    }
  }, [movieId, open])

  const loadMovieDetails = async () => {
    if (!movieId) return

    try {
      setLoading(true)
      setError(null)
      const data = await getMovieDetails(movieId)
      setMovie(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec du chargement")
      console.error("Failed to load movie details:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}min`
  }

  const formatMoney = (amount: number) => {
    if (amount === 0) return "N/A"
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <Film className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-red-500">{error}</p>
            <Button onClick={loadMovieDetails} variant="outline" className="mt-4">
              Réessayer
            </Button>
          </div>
        )}

        {movie && !loading && (
          <div className="space-y-6">
            {/* Header with backdrop */}
            <div className="relative -mx-6 -mt-6 mb-4">
              {movie.backdropUrl && (
                <div className="relative h-64 w-full">
                  <Image
                    src={movie.backdropUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>
              )}

              <div className="absolute bottom-4 left-6 right-6">
                <DialogTitle className="text-3xl font-bold text-white drop-shadow-lg">
                  {movie.title}
                </DialogTitle>
                {movie.tagline && (
                  <p className="text-white/90 italic mt-1 drop-shadow">
                    {movie.tagline}
                  </p>
                )}
              </div>
            </div>

            {/* Metadata row */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                {movie.voteAverage.toFixed(1)} ({movie.voteCount.toLocaleString()} votes)
              </Badge>

              {movie.releaseDate && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(movie.releaseDate)}
                </Badge>
              )}

              {movie.runtime > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatRuntime(movie.runtime)}
                </Badge>
              )}

              {movie.originalLanguage && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {movie.originalLanguage.toUpperCase()}
                </Badge>
              )}
            </div>

            {/* Genres */}
            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="default">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Overview */}
            {movie.overview && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}

            {/* Budget & Revenue */}
            {(movie.budget > 0 || movie.revenue > 0) && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                {movie.budget > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="text-lg font-semibold">{formatMoney(movie.budget)}</p>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Box Office</p>
                    <p className="text-lg font-semibold">{formatMoney(movie.revenue)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Production Companies */}
            {movie.productionCompanies.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                  Production
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.productionCompanies.map((company) => (
                    <span
                      key={company.id}
                      className="text-sm px-2 py-1 bg-muted rounded"
                    >
                      {company.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Links */}
            <div className="flex gap-3 pt-4 border-t">
              {movie.homepage && (
                <Button asChild variant="outline" size="sm">
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Site officiel
                  </a>
                </Button>
              )}

              {movie.imdbId && (
                <Button asChild variant="outline" size="sm">
                  <a
                    href={`https://www.imdb.com/title/${movie.imdbId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    IMDb
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
