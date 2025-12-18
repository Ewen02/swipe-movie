"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@swipe-movie/ui"
import { Heart, X, Loader2, Star, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence, useMotionValue, useTransform, animate, PanInfo } from "framer-motion"
import { getMoviesByGenre, getGenres } from "@/lib/api/movies"
import type { MovieBasic, MovieGenre } from "@/schemas/movies"
import type { OnboardingSwipe } from "@/lib/api/users"

const REQUIRED_SWIPES = 10

// Default providers if none selected
const DEFAULT_PROVIDERS = [8, 119, 337, 531, 381, 283, 1899]
// Default genres if none selected: Action (28), Comedy (35), Drama (18), Thriller (53)
const DEFAULT_GENRES = [28, 35, 18, 53]

interface StepSwipeProps {
  selectedProviders: number[]
  selectedGenres: number[]
  onComplete: (swipes: OnboardingSwipe[]) => void
  onBack: () => void
}

interface SwipeCard {
  movie: MovieBasic
  direction?: "left" | "right"
}

export function StepSwipe({ selectedProviders, selectedGenres, onComplete, onBack }: StepSwipeProps) {
  const [movies, setMovies] = useState<MovieBasic[]>([])
  const [genresList, setGenresList] = useState<MovieGenre[]>([])
  const [loading, setLoading] = useState(true)
  const [swipes, setSwipes] = useState<OnboardingSwipe[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [exitingCard, setExitingCard] = useState<SwipeCard | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)

        // Load genres list for display
        const genres = await getGenres()
        setGenresList(genres)

        // Use user preferences or defaults
        const providers = selectedProviders.length > 0 ? selectedProviders : DEFAULT_PROVIDERS
        const genreIds = selectedGenres.length > 0 ? selectedGenres : DEFAULT_GENRES

        // Load movies from selected genres with provider filtering
        const allMovies: MovieBasic[] = []

        for (const genreId of genreIds) {
          const genreMovies = await getMoviesByGenre(genreId, "movie", 1, {
            watchProviders: providers,
            watchRegion: "FR",
          })
          allMovies.push(...genreMovies)
        }

        // Remove duplicates and shuffle
        const uniqueMovies = allMovies.filter(
          (movie, index, self) => self.findIndex((m) => m.id === movie.id) === index
        )
        const shuffled = uniqueMovies.sort(() => Math.random() - 0.5)

        // Take first 20 movies to have some buffer
        setMovies(shuffled.slice(0, 20))
      } catch (error) {
        console.error("Failed to load movies:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedProviders, selectedGenres])

  const handleSwipe = (movie: MovieBasic, direction: "left" | "right") => {
    const liked = direction === "right"
    const newSwipe: OnboardingSwipe = {
      tmdbId: movie.id.toString(),
      mediaType: "movie",
      liked,
    }

    const newSwipes = [...swipes, newSwipe]
    setSwipes(newSwipes)
    setExitingCard({ movie, direction })

    setTimeout(() => {
      setExitingCard(null)
      setCurrentIndex((prev) => prev + 1)

      // Check if we have enough swipes
      if (newSwipes.length >= REQUIRED_SWIPES) {
        onComplete(newSwipes)
      }
    }, 300)
  }

  const currentMovie = movies[currentIndex]
  const nextMovie = movies[currentIndex + 1]
  const progress = Math.min((swipes.length / REQUIRED_SWIPES) * 100, 100)
  const likesCount = swipes.filter((s) => s.liked).length

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Chargement des films...</p>
      </div>
    )
  }

  if (!currentMovie && swipes.length < REQUIRED_SWIPES) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <p className="text-muted-foreground">Plus de films disponibles</p>
        <Button onClick={() => onComplete(swipes)} className="mt-4">
          Continuer quand meme
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Derniere etape ! Swipez quelques films
        </h1>
        <p className="text-muted-foreground">
          Cela nous aidera a mieux comprendre vos gouts
        </p>
      </motion.div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">{swipes.length}/{REQUIRED_SWIPES} films</span>
          <span className="flex items-center gap-1 text-green-500">
            <Heart className="w-4 h-4 fill-green-500" />
            {likesCount} likes
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Card container */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-xs h-[400px] sm:h-[450px]">
          {/* Next card (behind) */}
          {nextMovie && (
            <div className="absolute inset-0 rounded-2xl overflow-hidden scale-95 opacity-50">
              <MovieCardStatic movie={nextMovie} genres={genresList} />
            </div>
          )}

          {/* Current card */}
          <AnimatePresence mode="wait">
            {currentMovie && !exitingCard && (
              <SwipeableCard
                key={currentMovie.id}
                movie={currentMovie}
                genres={genresList}
                onSwipe={handleSwipe}
              />
            )}
          </AnimatePresence>

          {/* Exiting card animation */}
          {exitingCard && (
            <motion.div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              initial={{ x: 0, rotate: 0, opacity: 1 }}
              animate={{
                x: exitingCard.direction === "right" ? 300 : -300,
                rotate: exitingCard.direction === "right" ? 20 : -20,
                opacity: 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <MovieCardStatic movie={exitingCard.movie} genres={genresList} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Swipe buttons */}
      <div className="flex justify-center items-center gap-6 mt-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => currentMovie && handleSwipe(currentMovie, "left")}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg"
        >
          <X className="w-7 h-7 text-white" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => currentMovie && handleSwipe(currentMovie, "right")}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg"
        >
          <Heart className="w-7 h-7 text-white" />
        </motion.button>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux genres
        </button>
      </div>
    </div>
  )
}

function MovieCardStatic({ movie, genres }: { movie: MovieBasic; genres: MovieGenre[] }) {
  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null

  // Get genre names from IDs
  const movieGenres = movie.genreIds
    ?.map((id) => genres.find((g) => g.id === id)?.name)
    .filter(Boolean)
    .slice(0, 2)

  return (
    <div className="h-full bg-card rounded-2xl overflow-hidden border border-border">
      <div className="relative h-2/3">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="320px"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-6xl">🎬</span>
          </div>
        )}
      </div>
      <div className="p-3 h-1/3 flex flex-col">
        <h3 className="font-semibold text-base truncate">{movie.title}</h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          {releaseYear && <span>{releaseYear}</span>}
          {movie.voteAverage && (
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              {movie.voteAverage.toFixed(1)}
            </span>
          )}
        </div>
        {/* Genres */}
        {movieGenres && movieGenres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {movieGenres.map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SwipeableCard({
  movie,
  genres,
  onSwipe,
}: {
  movie: MovieBasic
  genres: MovieGenre[]
  onSwipe: (movie: MovieBasic, direction: "left" | "right") => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-20, 20])
  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0])

  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null

  // Get genre names from IDs
  const movieGenres = movie.genreIds
    ?.map((id) => genres.find((g) => g.id === id)?.name)
    .filter(Boolean)
    .slice(0, 2)

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100
    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? "right" : "left"
      onSwipe(movie, direction)
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 20 })
    }
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-full bg-card rounded-2xl overflow-hidden border-2 border-border shadow-xl">
        <div className="relative h-2/3">
          {movie.posterUrl ? (
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover select-none"
              sizes="320px"
              draggable={false}
              priority
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-6xl">🎬</span>
            </div>
          )}

          {/* Like indicator */}
          <motion.div
            className="absolute top-4 right-4 px-4 py-2 bg-green-500 text-white font-bold rounded-lg border-2 border-white"
            style={{ opacity: likeOpacity, rotate: 15 }}
          >
            LIKE
          </motion.div>

          {/* Nope indicator */}
          <motion.div
            className="absolute top-4 left-4 px-4 py-2 bg-red-500 text-white font-bold rounded-lg border-2 border-white"
            style={{ opacity: nopeOpacity, rotate: -15 }}
          >
            NOPE
          </motion.div>
        </div>
        <div className="p-3 h-1/3 flex flex-col">
          <h3 className="font-semibold text-base truncate">{movie.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            {releaseYear && <span>{releaseYear}</span>}
            {movie.voteAverage && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                {movie.voteAverage.toFixed(1)}
              </span>
            )}
          </div>
          {/* Genres */}
          {movieGenres && movieGenres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {movieGenres.map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
