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
  mediaType?: "movie" | "tv"
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MovieDetailsModal({
  movieId,
  mediaType = "movie",
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
  }, [movieId, open, mediaType])

  const loadMovieDetails = async () => {
    if (!movieId) return

    try {
      setLoading(true)
      setError(null)
      const data = await getMovieDetails(movieId, mediaType)
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

  // Get provider URL or search page
  const getProviderUrl = (providerId: number, providerName: string) => {
    // Map of common provider IDs to their search/browse URLs
    const providerUrls: Record<number, string> = {
      8: "https://www.netflix.com/search?q=" + encodeURIComponent(movie?.title || ""), // Netflix
      119: "https://www.primevideo.com/search/ref=atv_nb_sug?phrase=" + encodeURIComponent(movie?.title || ""), // Amazon Prime
      337: "https://www.disneyplus.com/search?q=" + encodeURIComponent(movie?.title || ""), // Disney+
      531: "https://www.paramountplus.com/search/?query=" + encodeURIComponent(movie?.title || ""), // Paramount+
      350: "https://tv.apple.com/search?q=" + encodeURIComponent(movie?.title || ""), // Apple TV+
      1899: "https://www.max.com/search?q=" + encodeURIComponent(movie?.title || ""), // Max
      283: "https://www.crunchyroll.com/search?q=" + encodeURIComponent(movie?.title || ""), // Crunchyroll
      2: "https://tv.apple.com/search?q=" + encodeURIComponent(movie?.title || ""), // Apple TV
    }

    // If we have a specific URL for this provider, use it
    if (providerUrls[providerId]) {
      return providerUrls[providerId]
    }

    // Otherwise, link to JustWatch for this specific movie/show
    const type = mediaType === "tv" ? "tv-show" : "movie"
    const slug = movie?.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || ""
    return `https://www.justwatch.com/fr/${type}/${slug}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="movie-details-description">
        {loading && (
          <>
            <DialogTitle className="sr-only">Chargement des détails du film</DialogTitle>
            <div id="movie-details-description" className="space-y-6">
              {/* Backdrop skeleton */}
              <div className="relative -mx-6 -mt-6 h-64 overflow-hidden rounded-t-lg">
                <Skeleton className="h-full w-full" />
              </div>

              {/* Title and basic info */}
              <div className="space-y-3">
                <Skeleton className="h-10 w-3/4" />
                <div className="flex gap-3 flex-wrap">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>

              {/* Overview */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              {/* Cast */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-24" />
                <div className="flex gap-4 overflow-x-auto">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex-shrink-0 space-y-2">
                      <Skeleton className="h-24 w-20 rounded-lg" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Providers */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <div className="flex gap-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-12 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {error && (
          <>
            <DialogTitle className="sr-only">Erreur de chargement</DialogTitle>
            <div id="movie-details-description" className="text-center py-8">
              <Film className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-red-500">{error}</p>
              <Button onClick={loadMovieDetails} variant="outline" className="mt-4">
                Réessayer
              </Button>
            </div>
          </>
        )}

        {movie && !loading && (
          <div id="movie-details-description" className="space-y-6">
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
                    sizes="(max-width: 768px) 100vw, 896px"
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

            {/* Trailer */}
            {movie.videos && movie.videos.length > 0 && (() => {
              // Find the first official YouTube trailer
              const trailer = movie.videos.find(
                (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official
              ) || movie.videos.find(
                (v) => v.site === 'YouTube' && v.type === 'Trailer'
              ) || movie.videos.find((v) => v.site === 'YouTube');

              return trailer ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Bande-annonce</h3>
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      title={trailer.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : null;
            })()}

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Casting principal</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {movie.cast.map((actor) => (
                    <div key={actor.id} className="text-center">
                      <div className="relative w-full aspect-[2/3] mb-2 bg-muted rounded-lg overflow-hidden">
                        {actor.profilePath ? (
                          <Image
                            src={actor.profilePath}
                            alt={actor.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-4xl text-muted-foreground">👤</span>
                          </div>
                        )}
                      </div>
                      <p className="font-medium text-sm truncate">{actor.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {actor.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Crew */}
            {movie.crew && movie.crew.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Équipe technique</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {movie.crew.map((member) => (
                    <div key={`${member.id}-${member.job}`} className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.job}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Watch Providers */}
            {movie.watchProviders && movie.watchProviders.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Disponible sur</h3>
                <div className="flex flex-wrap gap-3">
                  {movie.watchProviders.map((provider) => (
                    <Button
                      key={provider.id}
                      asChild
                      variant="outline"
                      className="h-auto p-3 hover:bg-primary/10 hover:border-primary transition-colors"
                    >
                      <a
                        href={getProviderUrl(provider.id, provider.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        {provider.logoPath && (
                          <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={provider.logoPath}
                              alt={provider.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="text-sm font-medium">{provider.name}</span>
                        <ExternalLink className="w-4 h-4 ml-1 opacity-60" />
                      </a>
                    </Button>
                  ))}
                </div>
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
