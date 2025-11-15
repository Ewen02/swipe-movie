"use client"

import { useState, useEffect, useRef } from "react"
import { motion, type PanInfo, useMotionValue, useTransform, animate } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, X, Undo2, Sparkles, Star, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { MovieBasic } from "@/schemas/movies"
import { RoomWithMembersResponseDto } from "@/schemas/rooms"
import { RatingBadge, ReleaseDateBadge, ProviderList } from "@/components/ui/movie"
import { getProvidersByIds } from "@/lib/constants/providers"

interface Particle {
  id: number
  x: number
  y: number
  color: string
  delay: number
}

interface MovieCardsProps {
  movies: MovieBasic[]
  onSwipe: (movie: MovieBasic, direction: "left" | "right") => void
  onUndo?: (movie: MovieBasic) => Promise<void>
  onEmpty?: () => void
  roomFilters?: RoomWithMembersResponseDto
}

interface MovieCardProps {
  movie: MovieBasic
  index: number
  totalCards: number
  isActive: boolean
  onSwipe: (movie: MovieBasic, direction: "left" | "right") => void
  onButtonSwipeRef?: (fn: (direction: "left" | "right") => void) => void
  onButtonHoverRef?: (hoverFn: (direction: "left" | "right") => void, hoverEndFn: () => void) => void
  roomFilters?: RoomWithMembersResponseDto
}

function MovieCard({
  movie,
  index,
  totalCards,
  isActive,
  onSwipe,
  onButtonSwipeRef,
  onButtonHoverRef,
  roomFilters,
}: MovieCardProps) {
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  const x = useMotionValue(0)
  const rotate = useMotionValue(0)
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])

  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0])
  const likeScale = useTransform(x, [0, 150], [0.8, 1.2])
  const nopeScale = useTransform(x, [-150, 0], [1.2, 0.8])

  const handleDragEnd = (_event: any, info: PanInfo) => {
    if (!isActive) return

    const threshold = 75
    const velocity = info.velocity.x

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 400) {
      const direction = info.offset.x > 0 ? "right" : "left"
      handleSwipe(direction)
    } else {
      animate(x, 0, { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] })
      animate(rotate, 0, { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] })
    }
  }

  const handleSwipe = (direction: "left" | "right") => {
    // Haptic feedback si disponible
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      // Vibration différente selon like/dislike
      navigator.vibrate(direction === "right" ? [30, 10, 30] : 50)
    }

    // Créer des particules pour les likes
    if (direction === "right") {
      const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        color: ["#22c55e", "#10b981", "#34d399", "#6ee7b7"][Math.floor(Math.random() * 4)],
        delay: Math.random() * 0.1,
      }))
      setParticles(newParticles)

      // Nettoyer les particules après l'animation
      setTimeout(() => setParticles([]), 1000)
    }

    setExitDirection(direction)
    onSwipe(movie, direction)
  }

  const handleDrag = () => {
    if (!isActive) return
    const currentX = x.get()
    const rotationValue = (currentX / 300) * 25
    rotate.set(rotationValue)
  }

  const handleButtonSwipe = (direction: "left" | "right") => {
    if (!isActive) return

    const targetX = direction === "right" ? 150 : -150
    const targetRotate = direction === "right" ? 15 : -15

    animate(x, targetX, { duration: 0.2, ease: "easeOut" })
    animate(rotate, targetRotate, { duration: 0.2, ease: "easeOut" })

    setTimeout(() => {
      handleSwipe(direction)
    }, 200)
  }

  const handleButtonHover = (direction: "left" | "right") => {
    if (!isActive) return

    const targetX = direction === "right" ? 30 : -30
    const targetRotate = direction === "right" ? 3 : -3

    animate(x, targetX, { duration: 0.2, ease: "easeOut" })
    animate(rotate, targetRotate, { duration: 0.2, ease: "easeOut" })
  }

  const handleButtonHoverEnd = () => {
    if (!isActive) return

    animate(x, 0, { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] })
    animate(rotate, 0, { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] })
  }

  useEffect(() => {
    if (isActive && onButtonSwipeRef) {
      onButtonSwipeRef(handleButtonSwipe)
    }
    if (isActive && onButtonHoverRef) {
      onButtonHoverRef(handleButtonHover, handleButtonHoverEnd)
    }
  }, [isActive, onButtonSwipeRef, onButtonHoverRef])

  const translateY = 0
  const zIndex = totalCards - index
  const shouldShow = index < 2

  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null

  return (
    <motion.div
      className={cn("absolute inset-0", isActive ? "cursor-grab active:cursor-grabbing" : "pointer-events-none")}
      style={{
        x: isActive ? x : 0,
        rotate: isActive ? rotate : 0,
        opacity: shouldShow ? (isActive ? opacity : 1) : 0,
        y: translateY,
        zIndex,
      }}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: -400, right: 400 }}
      dragMomentum={false}
      dragElastic={0.1}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={
        exitDirection
          ? {
              x: exitDirection === "right" ? 400 : -400,
              opacity: 0,
              rotate: exitDirection === "right" ? 25 : -25,
            }
          : {}
      }
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      initial={index === 0 ? { scale: 0.95, opacity: 0 } : {}}
      whileInView={index === 0 ? { scale: 1, opacity: 1 } : {}}
    >
      <Card className="h-full bg-white dark:bg-gray-800 shadow-xl">
        <CardContent className="p-0 h-full">
          <div className="relative h-full rounded-lg overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                <div className="text-gray-400 dark:text-gray-500">Chargement...</div>
              </div>
            )}

            <img
              src={movie.posterUrl || movie.backdropUrl || "/placeholder.svg"}
              alt={movie.title}
              draggable={false}
              className={cn(
                "w-full h-full object-cover select-none transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />

            {isActive && (
              <>
                {/* Particules pour les likes */}
                {particles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    className="absolute top-1/2 left-1/2 pointer-events-none"
                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: particle.x,
                      y: particle.y,
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: particle.delay,
                      ease: "easeOut",
                    }}
                  >
                    <Heart className="w-4 h-4" style={{ color: particle.color }} fill={particle.color} />
                  </motion.div>
                ))}

                <motion.div
                  className="absolute top-8 right-8 flex items-center gap-2"
                  style={{ opacity: likeOpacity, scale: likeScale }}
                >
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-bold px-6 py-3 rotate-12 border-4 border-white shadow-2xl flex items-center gap-2">
                    <Heart className="w-5 h-5 fill-white" />
                    LIKE
                    <Sparkles className="w-4 h-4" />
                  </Badge>
                </motion.div>

                <motion.div
                  className="absolute top-8 left-8 flex items-center gap-2"
                  style={{ opacity: nopeOpacity, scale: nopeScale }}
                >
                  <Badge className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-xl font-bold px-6 py-3 -rotate-12 border-4 border-white shadow-2xl flex items-center gap-2">
                    <X className="w-5 h-5" />
                    NOPE
                  </Badge>
                </motion.div>
              </>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <RatingBadge rating={movie.voteAverage} variant="card" />

                {releaseYear && (
                  <ReleaseDateBadge releaseDate={movie.releaseDate} variant="card" />
                )}

                {/* Watch Providers */}
                {roomFilters?.watchProviders && roomFilters.watchProviders.length > 0 && (
                  <ProviderList
                    providerIds={roomFilters.watchProviders}
                    variant="card"
                    maxVisible={2}
                    showNames={true}
                  />
                )}
              </div>

              <h3 className="text-white text-2xl font-bold mb-1">
                {movie.title}
              </h3>

              <p className="text-white/90 text-sm mt-2 line-clamp-3">{movie.overview}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function MovieCards({ movies, onSwipe, onUndo, onEmpty, roomFilters }: MovieCardsProps) {
  const [currentCards, setCurrentCards] = useState(movies)
  const [lastSwipe, setLastSwipe] = useState<{ movie: MovieBasic; direction: "left" | "right" } | null>(null)
  const [swipeCount, setSwipeCount] = useState(0)
  const [likeCount, setLikeCount] = useState(0)
  const activeCardButtonSwipeRef = useRef<((direction: "left" | "right") => void) | null>(null)
  const activeCardHoverRef = useRef<((direction: "left" | "right") => void) | null>(null)
  const activeCardHoverEndRef = useRef<(() => void) | null>(null)

  // Sync currentCards with movies prop when it changes (e.g., loading more movies)
  useEffect(() => {
    // Filter out any undefined/null values to prevent errors
    setCurrentCards(movies.filter(Boolean))
  }, [movies])

  const handleCardSwipe = (movie: MovieBasic, direction: "left" | "right") => {
    setLastSwipe({ movie, direction })
    setSwipeCount((prev) => prev + 1)
    if (direction === "right") {
      setLikeCount((prev) => prev + 1)
    }
    onSwipe(movie, direction)

    setTimeout(() => {
      setCurrentCards((prev: MovieBasic[]) => {
        const newCards = prev.filter((m) => m && m.id !== movie.id)
        // Check if we need to load more movies, but call it outside setState
        if (newCards.length === 0 && onEmpty) {
          setTimeout(() => onEmpty(), 0)
        }
        return newCards
      })
    }, 500)
  }

  const handleUndo = async () => {
    if (!lastSwipe) return

    // Annuler le swipe précédent
    const { movie, direction } = lastSwipe

    // Remettre la carte dans la pile
    setCurrentCards((prev) => [movie, ...prev])

    // Décrémenter les compteurs
    setSwipeCount((prev) => Math.max(0, prev - 1))
    if (direction === "right") {
      setLikeCount((prev) => Math.max(0, prev - 1))
    }

    // Call the onUndo callback if provided (to delete the swipe from backend)
    if (onUndo) {
      try {
        await onUndo(movie)
      } catch (err) {
        console.error("Failed to undo swipe:", err)
      }
    }

    // Réinitialiser l'historique
    setLastSwipe(null)
  }

  const handleButtonSwipe = (direction: "left" | "right") => {
    if (activeCardButtonSwipeRef.current) {
      activeCardButtonSwipeRef.current(direction)
    }
  }

  const handleButtonHover = (direction: "left" | "right") => {
    if (activeCardHoverRef.current) {
      activeCardHoverRef.current(direction)
    }
  }

  const handleButtonHoverEnd = () => {
    if (activeCardHoverEndRef.current) {
      activeCardHoverEndRef.current()
    }
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handleButtonSwipe("left")
      } else if (event.key === "ArrowRight") {
        handleButtonSwipe("right")
      } else if ((event.key === "z" || event.key === "Z") && (event.ctrlKey || event.metaKey)) {
        // Ctrl+Z ou Cmd+Z pour undo
        event.preventDefault()
        handleUndo()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [lastSwipe])

  if (currentCards.length === 0) {
    return (
      <div className="text-center py-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Plus de films !</h2>
          <p className="text-gray-600 dark:text-gray-300">Vous avez vu tous les films disponibles</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Active Filters Display */}
      {roomFilters && (
        <div className="mb-6 max-w-sm mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {roomFilters.minRating !== null && roomFilters.minRating !== undefined && (
              <Badge variant="secondary" className="text-xs gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                <Star className="w-3 h-3 fill-yellow-500" />
                Note ≥ {roomFilters.minRating.toFixed(1)}
              </Badge>
            )}

            {(roomFilters.releaseYearMin !== null && roomFilters.releaseYearMin !== undefined) ||
             (roomFilters.releaseYearMax !== null && roomFilters.releaseYearMax !== undefined) ? (
              <Badge variant="secondary" className="text-xs gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                <Calendar className="w-3 h-3" />
                {roomFilters.releaseYearMin && roomFilters.releaseYearMax
                  ? `${roomFilters.releaseYearMin} - ${roomFilters.releaseYearMax}`
                  : roomFilters.releaseYearMin
                    ? `Depuis ${roomFilters.releaseYearMin}`
                    : `Jusqu'à ${roomFilters.releaseYearMax}`}
              </Badge>
            ) : null}

            {(roomFilters.runtimeMin !== null && roomFilters.runtimeMin !== undefined &&
              roomFilters.runtimeMax !== null && roomFilters.runtimeMax !== undefined) && (
              <Badge variant="secondary" className="text-xs gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200">
                ⏱️ {roomFilters.runtimeMin === 0 && roomFilters.runtimeMax === 90
                    ? "Court (<90min)"
                    : roomFilters.runtimeMin === 90 && roomFilters.runtimeMax === 180
                      ? "Moyen (90-180min)"
                      : roomFilters.runtimeMin === 180
                        ? "Long (>180min)"
                        : `${roomFilters.runtimeMin}-${roomFilters.runtimeMax}min`}
              </Badge>
            )}

            {roomFilters.originalLanguage && (
              <Badge variant="secondary" className="text-xs gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                🌐 {roomFilters.originalLanguage.toUpperCase()}
              </Badge>
            )}

            {roomFilters.watchProviders && roomFilters.watchProviders.length > 0 && (
              <>
                {getProvidersByIds(roomFilters.watchProviders).filter((p): p is NonNullable<typeof p> => p !== undefined).map((provider) => (
                  <Badge
                    key={provider.id}
                    variant="secondary"
                    className="text-xs gap-1 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200"
                  >
                    {provider.logo} {provider.name}
                  </Badge>
                ))}
              </>
            )}

            {roomFilters.watchRegion && (
              <Badge variant="secondary" className="text-xs gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200">
                🌍 {roomFilters.watchRegion.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="relative h-[600px] w-full max-w-sm mx-auto">
        {currentCards.filter(Boolean).slice(0, 2).map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={index}
            totalCards={2}
            isActive={index === 0}
            onSwipe={handleCardSwipe}
            roomFilters={roomFilters}
            onButtonSwipeRef={
              index === 0
                ? (fn) => {
                    activeCardButtonSwipeRef.current = fn
                  }
                : undefined
            }
            onButtonHoverRef={
              index === 0
                ? (hoverFn, hoverEndFn) => {
                    activeCardHoverRef.current = hoverFn
                    activeCardHoverEndRef.current = hoverEndFn
                  }
                : undefined
            }
          />
        ))}
      </div>

      <div className="flex justify-center gap-6 mt-8">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full w-16 h-16 p-0 border-2 border-red-200 hover:border-red-400 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-600 dark:hover:bg-red-950 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all group"
            onClick={() => handleButtonSwipe("left")}
            onMouseEnter={() => handleButtonHover("left")}
            onMouseLeave={handleButtonHoverEnd}
            disabled={currentCards.length === 0}
          >
            <X className="w-7 h-7 text-red-500 group-hover:text-red-600 transition-colors" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full w-14 h-14 p-0 border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            onClick={handleUndo}
            disabled={!lastSwipe}
            title="Annuler (Ctrl+Z)"
          >
            <Undo2 className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200 transition-colors" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full w-16 h-16 p-0 border-2 border-green-200 hover:border-green-400 hover:bg-green-50 dark:border-green-800 dark:hover:border-green-600 dark:hover:bg-green-950 bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden"
            onClick={() => handleButtonSwipe("right")}
            onMouseEnter={() => handleButtonHover("right")}
            onMouseLeave={handleButtonHoverEnd}
            disabled={currentCards.length === 0}
          >
            <Heart className="w-7 h-7 text-green-500 group-hover:text-green-600 transition-colors relative z-10 group-hover:fill-green-500" />
          </Button>
        </motion.div>
      </div>

      {/* Stats */}
      {swipeCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-6"
        >
          <div className="flex items-center gap-6 px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-full shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {likeCount}
              </span>
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {swipeCount}
              </span>
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {Math.round((likeCount / swipeCount) * 100)}% ❤️
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex justify-center mt-6">
        <div className="flex gap-1">
          {movies.map((_: MovieBasic, index: number) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index < movies.length - currentCards.length
                  ? "bg-gradient-to-r from-purple-400 to-pink-400"
                  : index === movies.length - currentCards.length
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 w-3 h-3 shadow-lg"
                    : "bg-gray-200 dark:bg-gray-700",
              )}
            />
          ))}
        </div>
      </div>

      <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>Glissez ou utilisez les boutons • ← → pour naviguer • Ctrl+Z pour annuler</p>
      </div>
    </div>
  )
}
