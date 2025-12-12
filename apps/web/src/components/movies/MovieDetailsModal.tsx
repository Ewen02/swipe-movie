"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Badge,
  Button,
  Skeleton,
} from "@swipe-movie/ui"
import { getMovieDetails } from "@/lib/api/movies"
import type { MovieDetails } from "@/schemas/movies"
import { Calendar, Clock, Star, Globe, Film, ExternalLink, Play, Users, DollarSign, X } from "lucide-react"
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
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    if (movieId && open) {
      loadMovieDetails()
      setShowTrailer(false)
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
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  const formatMoney = (amount: number) => {
    if (amount === 0) return null
    if (amount >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(1)}B$`
    }
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(0)}M$`
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Get provider URL or search page
  const getProviderUrl = (providerId: number) => {
    const providerUrls: Record<number, string> = {
      8: "https://www.netflix.com/search?q=" + encodeURIComponent(movie?.title || ""),
      119: "https://www.primevideo.com/search/ref=atv_nb_sug?phrase=" + encodeURIComponent(movie?.title || ""),
      337: "https://www.disneyplus.com/search?q=" + encodeURIComponent(movie?.title || ""),
      531: "https://www.paramountplus.com/search/?query=" + encodeURIComponent(movie?.title || ""),
      350: "https://tv.apple.com/search?q=" + encodeURIComponent(movie?.title || ""),
      1899: "https://www.max.com/search?q=" + encodeURIComponent(movie?.title || ""),
      283: "https://www.crunchyroll.com/search?q=" + encodeURIComponent(movie?.title || ""),
    }

    if (providerUrls[providerId]) {
      return providerUrls[providerId]
    }

    const type = mediaType === "tv" ? "tv-show" : "movie"
    const slug = movie?.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || ""
    return `https://www.justwatch.com/fr/${type}/${slug}`
  }

  // Find trailer
  const trailer = movie?.videos?.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official
  ) || movie?.videos?.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  ) || movie?.videos?.find((v) => v.site === 'YouTube')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl w-[95vw] max-h-[90vh] overflow-hidden p-0 gap-0 bg-background/95 backdrop-blur-xl border-white/10"
        aria-describedby="movie-details-description"
      >
        {/* Loading State */}
        {loading && (
          <div className="p-6 space-y-6">
            <DialogTitle className="sr-only">Chargement des détails</DialogTitle>
            <Skeleton className="h-48 sm:h-64 w-full rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 text-center py-16">
            <DialogTitle className="sr-only">Erreur</DialogTitle>
            <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={loadMovieDetails} variant="outline">
              Réessayer
            </Button>
          </div>
        )}

        {/* Movie Content */}
        {movie && !loading && (
          <div id="movie-details-description" className="flex flex-col max-h-[90vh]">
            {/* Hero Section with Backdrop */}
            <div className="relative flex-shrink-0">
              {/* Backdrop Image */}
              <div className="relative h-48 sm:h-64 w-full overflow-hidden">
                {movie.backdropUrl ? (
                  <Image
                    src={movie.backdropUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 672px"
                  />
                ) : movie.posterUrl ? (
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover blur-sm scale-110"
                    sizes="(max-width: 768px) 100vw, 672px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                {/* Play Trailer Button */}
                {trailer && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTrailer(true)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-2xl"
                  >
                    <Play className="w-7 h-7 text-gray-900 ml-1" fill="currentColor" />
                  </motion.button>
                )}

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-semibold text-sm">
                    {movie.voteAverage.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Title Section - Overlapping */}
              <div className="px-5 -mt-12 relative z-10">
                <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  {movie.title}
                </DialogTitle>
                {movie.tagline && (
                  <p className="text-muted-foreground italic mt-1 text-sm">
                    "{movie.tagline}"
                  </p>
                )}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-5">
              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-2 pt-3">
                {movie.releaseDate && (
                  <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(movie.releaseDate).getFullYear()}
                  </Badge>
                )}
                {movie.runtime > 0 && (
                  <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatRuntime(movie.runtime)}
                  </Badge>
                )}
                {movie.originalLanguage && (
                  <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
                    <Globe className="w-3.5 h-3.5" />
                    {movie.originalLanguage.toUpperCase()}
                  </Badge>
                )}
                {movie.voteCount > 0 && (
                  <Badge variant="outline" className="gap-1.5 px-2.5 py-1">
                    <Users className="w-3.5 h-3.5" />
                    {movie.voteCount.toLocaleString()} votes
                  </Badge>
                )}
              </div>

              {/* Genres */}
              {movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge
                      key={genre.id}
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Synopsis */}
              {movie.overview && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Synopsis
                  </h3>
                  <p className="text-foreground/90 leading-relaxed text-sm sm:text-base">
                    {movie.overview}
                  </p>
                </div>
              )}

              {/* Watch Providers */}
              {movie.watchProviders && movie.watchProviders.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                    Où regarder
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.watchProviders.map((provider) => (
                      <a
                        key={provider.id}
                        href={getProviderUrl(provider.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all group"
                      >
                        {provider.logoPath && (
                          <div className="relative w-8 h-8 rounded-md overflow-hidden">
                            <Image
                              src={provider.logoPath}
                              alt={provider.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="text-sm font-medium">{provider.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Cast - Grid layout */}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                    Casting
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {movie.cast.slice(0, 10).map((actor) => (
                      <div key={actor.id} className="text-center">
                        <div className="relative w-full aspect-square mb-2 rounded-full overflow-hidden bg-muted ring-2 ring-white/10">
                          {actor.profilePath ? (
                            <Image
                              src={actor.profilePath}
                              alt={actor.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 25vw, 20vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl text-muted-foreground">
                              👤
                            </div>
                          )}
                        </div>
                        <p className="font-medium text-[11px] truncate">{actor.name}</p>
                        <p className="text-[9px] text-muted-foreground truncate">
                          {actor.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget & Revenue */}
              {(movie.budget > 0 || movie.revenue > 0) && (
                <div className="grid grid-cols-2 gap-3">
                  {movie.budget > 0 && (
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        Budget
                      </div>
                      <p className="font-semibold text-lg">{formatMoney(movie.budget)}</p>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        Box Office
                      </div>
                      <p className="font-semibold text-lg">{formatMoney(movie.revenue)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* External Links */}
              <div className="flex flex-wrap gap-2 pt-2">
                {movie.homepage && (
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <a href={movie.homepage} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4" />
                      Site officiel
                    </a>
                  </Button>
                )}
                {movie.imdbId && (
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <a href={`https://www.imdb.com/title/${movie.imdbId}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      IMDb
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Trailer Modal */}
            <AnimatePresence>
              {showTrailer && trailer && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-black/95 flex flex-col"
                >
                  <div className="flex items-center justify-between p-4">
                    <h3 className="text-white font-semibold">Bande-annonce</h3>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                      onClick={() => setShowTrailer(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="flex-1 px-4 pb-4">
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                        title={trailer.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
