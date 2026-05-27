"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Heart, Film, ExternalLink } from "lucide-react"
import { Button } from "@swipe-movie/ui"
import { useTranslations } from "next-intl"
import { Footer } from "@/components/layout/Footer"
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs"
import { MovieDetailsModal } from "@/components/movies/MovieDetailsModal"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { getMyMatches } from "@/lib/api/swipes"
import { getBatchMovieDetails, getBatchWatchProviders } from "@/lib/api/movies"
import type { MovieBasic, MovieWatchProvider } from "@/schemas/movies"
import type { Match } from "@/schemas/swipes"
import { buildMovieSlug } from "@/lib/slug"

type MatchWithMovie = Match & {
  roomName: string
  roomCode: string
  movie?: MovieBasic
  providers?: MovieWatchProvider[]
}

export default function MatchesPage() {
  const t = useTranslations()
  const [matches, setMatches] = useState<MatchWithMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [showMovieDetails, setShowMovieDetails] = useState(false)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      setLoading(true)
      setError(null)
      const matchesData = await getMyMatches()

      if (matchesData.length === 0) {
        setMatches([])
        return
      }

      // Batch load movie details
      const movieIds = [...new Set(matchesData.map((m) => parseInt(m.movieId)).filter((id) => !isNaN(id)))]
      const [movies, providersMap] = await Promise.all([
        getBatchMovieDetails(movieIds),
        getBatchWatchProviders(movieIds),
      ])

      const movieMap = new Map(movies.map((movie) => [movie.id.toString(), movie]))

      const enriched: MatchWithMovie[] = matchesData
        .map((match) => {
          const movie = movieMap.get(match.movieId)
          const movieIdNum = parseInt(match.movieId)
          const providers = !isNaN(movieIdNum) ? providersMap[movieIdNum] ?? [] : []
          return { ...match, movie: movie || undefined, providers }
        })
        .filter((m) => m.movie)

      setMatches(enriched)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load matches")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col">
      <BackgroundOrbs />

      <MovieDetailsModal
        movieId={selectedMovieId}
        open={showMovieDetails}
        onOpenChange={setShowMovieDetails}
      />

      <div className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div className="mb-8" variants={fadeInUp}>
            <Link href="/rooms">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2 hover:bg-foreground/5">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('nav.rooms')}
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-pink-500/10">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <h1 className="text-3xl font-bold">{t('nav.matches')}</h1>
              {matches.length > 0 && (
                <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 text-sm font-medium">
                  {matches.length} films
                </span>
              )}
            </div>
            <p className="text-muted-foreground">
              Tous vos matchs de films, toutes rooms confondues. Trouvez ou regarder !
            </p>
          </motion.div>

          {/* Content */}
          {loading ? (
            <MatchesSkeleton />
          ) : error ? (
            <motion.div className="text-center py-16" variants={fadeInUp}>
              <p className="text-red-500 mb-4">{error}</p>
              <Button variant="outline" onClick={loadMatches}>
                Reessayer
              </Button>
            </motion.div>
          ) : matches.length === 0 ? (
            <motion.div className="text-center py-16" variants={fadeInUp}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Film className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aucun match</h3>
              <p className="text-muted-foreground mb-4">
                Swipez dans une room pour trouver vos premiers matchs !
              </p>
              <Link href="/rooms">
                <Button>Aller aux rooms</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                >
                  <MatchCard
                    match={match}
                    onShowDetails={() => {
                      if (match.movie) {
                        setSelectedMovieId(match.movie.id)
                        setShowMovieDetails(true)
                      }
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

function MatchCard({
  match,
  onShowDetails,
}: {
  match: MatchWithMovie
  onShowDetails: () => void
}) {
  const movie = match.movie!
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null

  return (
    <div
      className="group relative rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden hover:border-pink-500/40 transition-all cursor-pointer"
      onClick={onShowDetails}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            unoptimized
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Room badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-white font-medium">
            {match.roomName}
          </span>
        </div>

        {/* Rating */}
        {movie.voteAverage > 0 && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-lg bg-yellow-500/90 text-xs text-white font-bold">
              ★ {movie.voteAverage.toFixed(1)}
            </span>
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-semibold text-white line-clamp-2 mb-1">{movie.title}</h3>
          <div className="flex items-center gap-2 text-xs text-white/80">
            {year && <span>{year}</span>}
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
              {match.voteCount} votes
            </span>
          </div>
        </div>
      </div>

      {/* Watch providers section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Ou regarder
          </span>
          <Link
            href={`/film/${buildMovieSlug(movie.title, movie.id)}`}
            className="text-xs text-primary hover:underline flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3" />
            Fiche
          </Link>
        </div>

        {match.providers && match.providers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {match.providers.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 px-2 py-1"
              >
                {p.logoPath ? (
                  <Image
                    src={p.logoPath}
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded object-contain"
                    unoptimized
                  />
                ) : null}
                <span className="text-xs font-medium">{p.name}</span>
              </div>
            ))}
            {match.providers.length > 4 && (
              <span className="text-xs text-muted-foreground self-center">
                +{match.providers.length - 4}
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Pas de plateforme connue
          </p>
        )}
      </div>
    </div>
  )
}

function MatchesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border/60 bg-card/60 overflow-hidden animate-pulse"
        >
          <div className="aspect-[2/3] bg-muted" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-muted rounded w-1/3" />
            <div className="flex gap-2">
              <div className="h-7 bg-muted rounded-lg w-20" />
              <div className="h-7 bg-muted rounded-lg w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
