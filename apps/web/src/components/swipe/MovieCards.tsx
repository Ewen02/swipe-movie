"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, type PanInfo, useMotionValue, useTransform, animate } from "framer-motion"
import { Card, CardContent, Button, Badge } from "@swipe-movie/ui"
import { Heart, X, Undo2, Sparkles, Star, Calendar, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { MovieBasic } from "@/schemas/movies"
import { RoomWithMembersResponseDto } from "@/schemas/rooms"
import { RatingBadge, ReleaseDateBadge } from "@/components/ui/movie"
import { getProvidersByIds } from "@/lib/constants/providers"
import { MovieCardSkeleton } from "./MovieCardSkeleton"

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
  onShowDetails?: (movieId: number) => void
  roomFilters?: RoomWithMembersResponseDto
  isLoading?: boolean
}

interface MovieCardProps {
  movie: MovieBasic
  index: number
  totalCards: number
  isActive: boolean
  onSwipe: (movie: MovieBasic, direction: "left" | "right") => void
  onShowDetails?: (movieId: number) => void
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
  onShowDetails,
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

  // Enhanced transforms for better visual feedback
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95])
  const boxShadow = useTransform(
    x,
    [-200, 0, 200],
    [
      "0 25px 50px -12px rgba(239, 68, 68, 0.4)",  // Red glow left (nope)
      "0 25px 50px -12px rgba(0, 0, 0, 0.25)",     // Neutral shadow
      "0 25px 50px -12px rgba(34, 197, 94, 0.4)"  // Green glow right (like)
    ]
  )

  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0])
  const likeScale = useTransform(x, [0, 150], [0.8, 1.2])
  const nopeScale = useTransform(x, [-150, 0], [1.2, 0.8])

  // Badge rotation follows card rotation
  const likeBadgeRotate = useTransform(x, [0, 150], [15, 25])
  const nopeBadgeRotate = useTransform(x, [-150, 0], [-25, -15])

  const handleDragEnd = (_event: any, info: PanInfo) => {
    if (!isActive) return

    const threshold = 75
    const velocity = info.velocity.x
    const absVelocity = Math.abs(velocity)

    if (Math.abs(info.offset.x) > threshold || absVelocity > 400) {
      const direction = info.offset.x > 0 ? "right" : "left"
      // Velocity-based exit: faster swipe = faster exit animation
      const exitDuration = Math.max(0.2, 0.4 - (absVelocity / 2000))
      handleSwipe(direction, exitDuration)
    } else {
      // Rubber band spring back animation
      animate(x, 0, {
        type: "spring",
        damping: 20,
        stiffness: 400,
      })
      animate(rotate, 0, {
        type: "spring",
        damping: 20,
        stiffness: 400,
      })
    }
  }

  // Store exit duration for animation
  const [exitDuration, setExitDuration] = useState(0.4)

  const handleSwipe = (direction: "left" | "right", duration: number = 0.4) => {
    // Enhanced haptic feedback patterns
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      if (direction === "right") {
        // Celebratory pattern for likes
        navigator.vibrate([30, 20, 50])
      } else {
        // Short decisive pattern for nope
        navigator.vibrate([40])
      }
    }

    // Créer des particules pour les likes (more particles for likes)
    if (direction === "right") {
      const newParticles: Particle[] = Array.from({ length: 16 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 150 - 75,
        y: Math.random() * 150 - 75,
        color: ["#22c55e", "#10b981", "#34d399", "#6ee7b7", "#fbbf24", "#f59e0b"][Math.floor(Math.random() * 6)],
        delay: Math.random() * 0.15,
      }))
      setParticles(newParticles)

      // Nettoyer les particules après l'animation
      setTimeout(() => setParticles([]), 1200)
    }

    setExitDuration(duration)
    setExitDirection(direction)
    onSwipe(movie, direction)
  }

  const handleDrag = () => {
    if (!isActive) return
    const currentX = x.get()
    // Increased rotation from 25° to 30° for more dynamic feel
    const rotationValue = (currentX / 300) * 30
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

  const zIndex = totalCards - index
  const shouldShow = index < 3 // Show up to 3 cards in stack

  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null

  return (
    <motion.div
      className={cn("absolute inset-0", isActive ? "cursor-grab active:cursor-grabbing" : "pointer-events-none")}
      style={{
        x: isActive ? x : 0,
        rotate: isActive ? rotate : (index === 1 ? -2 : -4), // Slight rotation for stacked cards
        scale: isActive ? scale : (index === 1 ? 0.96 : 0.92), // More noticeable scale for stack
        opacity: shouldShow ? (isActive ? opacity : (index === 1 ? 0.85 : 0.7)) : 0,
        y: index === 0 ? 0 : (index === 1 ? 12 : 24), // Cards peek from behind (positive Y = below)
        zIndex,
        boxShadow: isActive
          ? boxShadow
          : index === 1
            ? "0 15px 35px -10px rgba(0, 0, 0, 0.2)"
            : "0 20px 40px -15px rgba(0, 0, 0, 0.15)",
      }}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: -400, right: 400 }}
      dragMomentum={false}
      dragElastic={0.15} // Slightly more elastic for better feel
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={
        exitDirection
          ? {
              x: exitDirection === "right" ? 400 : -400,
              opacity: 0,
              rotate: exitDirection === "right" ? 30 : -30, // Increased from 25 to 30
              scale: 0.9, // Scale down on exit
            }
          : {}
      }
      transition={{
        duration: exitDirection ? exitDuration : 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        // Spring physics for more natural feel when not exiting
        type: exitDirection ? "tween" : "spring",
        damping: 25,
        stiffness: 300,
      }}
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

            <Image
              src={movie.posterUrl || movie.backdropUrl || "/placeholder.svg"}
              alt={movie.title}
              fill
              draggable={false}
              className={cn(
                "object-cover select-none transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 640px) 100vw, 448px"
              priority={index === 0}
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
                  style={{
                    opacity: likeOpacity,
                    scale: likeScale,
                    rotate: likeBadgeRotate,
                  }}
                >
                  <Badge
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-bold px-6 py-3 border-4 border-white flex items-center gap-2"
                    style={{
                      boxShadow: "0 0 30px rgba(34, 197, 94, 0.6), 0 10px 40px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                    >
                      <Heart className="w-5 h-5 fill-white" />
                    </motion.div>
                    LIKE
                    <Sparkles className="w-4 h-4" />
                  </Badge>
                </motion.div>

                <motion.div
                  className="absolute top-8 left-8 flex items-center gap-2"
                  style={{
                    opacity: nopeOpacity,
                    scale: nopeScale,
                    rotate: nopeBadgeRotate,
                  }}
                >
                  <Badge
                    className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-xl font-bold px-6 py-3 border-4 border-white flex items-center gap-2"
                    style={{
                      boxShadow: "0 0 30px rgba(239, 68, 68, 0.6), 0 10px 40px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: [-5, 5, -5] }}
                      transition={{ repeat: Infinity, duration: 0.3 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
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

                {/* Watch Providers - Show movie's actual providers */}
                {movie.watchProviders && movie.watchProviders.length > 0 && (
                  <div className="flex gap-1.5">
                    {movie.watchProviders.slice(0, 3).map((provider) => (
                      <div
                        key={provider.id}
                        className="relative w-8 h-8 rounded-md overflow-hidden border border-white/30 shadow-lg"
                        title={provider.name}
                      >
                        <Image
                          src={provider.logoPath}
                          alt={provider.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {movie.watchProviders.length > 3 && (
                      <div className="w-8 h-8 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-xs font-semibold shadow-lg">
                        +{movie.watchProviders.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-white text-2xl font-bold flex-1">
                  {movie.title}
                </h3>

                {onShowDetails && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="shrink-0 w-10 h-10 sm:w-9 sm:h-9 bg-white/90 hover:bg-white shadow-lg border-2 border-white/40 backdrop-blur-md rounded-full transition-all hover:scale-110 active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation()
                      onShowDetails(movie.id)
                    }}
                    aria-label="Voir les détails"
                  >
                    <Info className="w-5 h-5 sm:w-4 sm:h-4 text-gray-800" />
                  </Button>
                )}
              </div>

              <p className="text-white/90 text-sm mt-2 line-clamp-3">{movie.overview}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function MovieCards({ movies, onSwipe, onUndo, onEmpty, onShowDetails, roomFilters, isLoading = false }: MovieCardsProps) {
  const [currentCards, setCurrentCards] = useState(movies)
  const [lastSwipe, setLastSwipe] = useState<{ movie: MovieBasic; direction: "left" | "right" } | null>(null)
  const [swipeCount, setSwipeCount] = useState(0)
  const [likeCount, setLikeCount] = useState(0)
  const activeCardButtonSwipeRef = useRef<((direction: "left" | "right") => void) | null>(null)
  const activeCardHoverRef = useRef<((direction: "left" | "right") => void) | null>(null)
  const activeCardHoverEndRef = useRef<(() => void) | null>(null)
  const loadingMoreRef = useRef(false)

  // Sync currentCards with movies prop when it changes (e.g., loading more movies)
  useEffect(() => {
    // Filter out any undefined/null values to prevent errors
    const validMovies = movies.filter(Boolean)
    console.log(`[MovieCards] Received ${validMovies.length} movies`)
    console.log(`[MovieCards] Movie IDs:`, validMovies.map(m => m.id))
    setCurrentCards(validMovies)
    // Reset the loading flag when we receive new movies
    if (validMovies.length > 3) {
      loadingMoreRef.current = false
    }
  }, [movies])

  const handleCardSwipe = (movie: MovieBasic, direction: "left" | "right") => {
    console.log(`[MovieCards] Swiped movie ${movie.id} (${movie.title}) ${direction}`)
    setLastSwipe({ movie, direction })
    setSwipeCount((prev) => prev + 1)
    if (direction === "right") {
      setLikeCount((prev) => prev + 1)
    }
    onSwipe(movie, direction)

    setTimeout(() => {
      setCurrentCards((prev: MovieBasic[]) => {
        const newCards = prev.filter((m) => m && m.id !== movie.id)
        console.log(`[MovieCards] After swipe: ${newCards.length} cards remaining`)
        // Load more movies proactively when we have 3 or fewer cards left
        // This ensures smooth infinite scrolling without seeing empty state
        // Use a ref to prevent multiple simultaneous calls
        if (newCards.length <= 3 && onEmpty && !loadingMoreRef.current) {
          console.log(`[MovieCards] Only ${newCards.length} cards left, loading more proactively`)
          loadingMoreRef.current = true
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
      {/* Active Filters Display - Compact pill design */}
      {roomFilters && (
        <div className="mb-4 max-w-sm mx-auto">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {roomFilters.minRating !== null && roomFilters.minRating !== undefined && (
              <Badge className="text-[11px] gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30 transition-colors">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {roomFilters.minRating.toFixed(1)}+
              </Badge>
            )}

            {(roomFilters.releaseYearMin !== null && roomFilters.releaseYearMin !== undefined) ||
             (roomFilters.releaseYearMax !== null && roomFilters.releaseYearMax !== undefined) ? (
              <Badge className="text-[11px] gap-1 px-2.5 py-1 bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                <Calendar className="w-3 h-3" />
                {roomFilters.releaseYearMin && roomFilters.releaseYearMax
                  ? `${roomFilters.releaseYearMin}-${roomFilters.releaseYearMax}`
                  : roomFilters.releaseYearMin
                    ? `${roomFilters.releaseYearMin}+`
                    : `≤${roomFilters.releaseYearMax}`}
              </Badge>
            ) : null}

            {(roomFilters.runtimeMin !== null && roomFilters.runtimeMin !== undefined &&
              roomFilters.runtimeMax !== null && roomFilters.runtimeMax !== undefined) && (
              <Badge className="text-[11px] gap-1 px-2.5 py-1 bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30 transition-colors">
                {roomFilters.runtimeMin === 0 && roomFilters.runtimeMax === 90
                    ? "< 90min"
                    : roomFilters.runtimeMin === 90 && roomFilters.runtimeMax === 180
                      ? "90-180min"
                      : roomFilters.runtimeMin === 180
                        ? "> 180min"
                        : `${roomFilters.runtimeMin}-${roomFilters.runtimeMax}min`}
              </Badge>
            )}

            {roomFilters.originalLanguage && (
              <Badge className="text-[11px] gap-1 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                {roomFilters.originalLanguage.toUpperCase()}
              </Badge>
            )}

            {roomFilters.watchProviders && roomFilters.watchProviders.length > 0 && (
              <>
                {getProvidersByIds(roomFilters.watchProviders).filter((p): p is NonNullable<typeof p> => p !== undefined).map((provider) => (
                  <Badge
                    key={provider.id}
                    className="text-[11px] gap-1 px-2.5 py-1 bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30 transition-colors"
                  >
                    {provider.logo}
                  </Badge>
                ))}
              </>
            )}

            {roomFilters.watchRegion && (
              <Badge className="text-[11px] gap-1 px-2.5 py-1 bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30 transition-colors">
                {roomFilters.watchRegion.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Card container - with enhanced stack preview */}
      <div className="relative h-[450px] sm:h-[550px] md:h-[600px] w-full max-w-sm mx-auto">
        {/* Stack shadow hint - shows there are more cards */}
        {currentCards.length > 2 && !isLoading && (
          <div className="absolute inset-x-4 -bottom-2 h-4 bg-gradient-to-t from-black/10 to-transparent rounded-b-xl blur-sm" />
        )}

        {isLoading ? (
          <div className="absolute inset-0">
            <MovieCardSkeleton />
          </div>
        ) : (
          /* Show up to 3 cards in stack for better depth effect */
          currentCards.filter(Boolean).slice(0, 3).map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              index={index}
              totalCards={Math.min(currentCards.length, 3)}
              isActive={index === 0}
              onSwipe={handleCardSwipe}
              onShowDetails={onShowDetails}
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
          ))
        )}
      </div>

      {/* Swipe Buttons - Enhanced with vibrant colors and glow effects */}
      <div className="flex justify-center items-center gap-4 sm:gap-6 mt-4 sm:mt-8">
        {/* NOPE Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-red-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <Button
            size="lg"
            className="relative rounded-full w-16 h-16 sm:w-18 sm:h-18 p-0 bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 border-0 shadow-[0_8px_30px_-5px_rgba(239,68,68,0.5)] hover:shadow-[0_8px_40px_-5px_rgba(239,68,68,0.7)] transition-all duration-300 group"
            onClick={() => handleButtonSwipe("left")}
            onMouseEnter={() => handleButtonHover("left")}
            onMouseLeave={handleButtonHoverEnd}
            disabled={isLoading || currentCards.length === 0}
          >
            <X className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md transition-transform group-hover:rotate-12" />
          </Button>
        </motion.div>

        {/* Undo Button */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <Button
            size="lg"
            variant="outline"
            className="rounded-full w-12 h-12 sm:w-14 sm:h-14 p-0 border-2 border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
            onClick={handleUndo}
            disabled={isLoading || !lastSwipe}
            title="Annuler (Ctrl+Z)"
          >
            <Undo2 className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 group-hover:text-white transition-all group-hover:-rotate-45" />
          </Button>
        </motion.div>

        {/* LIKE Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-green-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <Button
            size="lg"
            className="relative rounded-full w-16 h-16 sm:w-18 sm:h-18 p-0 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 shadow-[0_8px_30px_-5px_rgba(34,197,94,0.5)] hover:shadow-[0_8px_40px_-5px_rgba(34,197,94,0.7)] transition-all duration-300 group overflow-hidden"
            onClick={() => handleButtonSwipe("right")}
            onMouseEnter={() => handleButtonHover("right")}
            onMouseLeave={handleButtonHoverEnd}
            disabled={isLoading || currentCards.length === 0}
          >
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md relative z-10 transition-transform group-hover:scale-110 group-hover:fill-white" />
          </Button>
        </motion.div>
      </div>

      {/* Stats - Compact floating pill */}
      {swipeCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mt-4"
        >
          <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-green-400 fill-green-400" />
              <span className="text-sm font-semibold text-white/90">{likeCount}</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-white/90">{swipeCount}</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-xs font-medium text-white/60">
              {Math.round((likeCount / swipeCount) * 100)}%
            </span>
          </div>
        </motion.div>
      )}

      {/* Progress indicator - Show remaining count instead of dots */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
          <div className="flex gap-0.5">
            {/* Show max 7 dots */}
            {Array.from({ length: Math.min(7, movies.length) }).map((_, index) => {
              const swipedCount = movies.length - currentCards.length
              const isCompleted = index < Math.min(swipedCount, 7)
              const isCurrent = index === Math.min(swipedCount, 6)

              return (
                <motion.div
                  key={index}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    isCompleted
                      ? "w-2 h-2 bg-gradient-to-r from-primary to-accent"
                      : isCurrent
                        ? "w-3 h-3 bg-primary shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                        : "w-2 h-2 bg-white/20",
                  )}
                  animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )
            })}
          </div>
          {currentCards.length > 0 && (
            <span className="text-[10px] text-white/50 font-medium ml-1">
              {currentCards.length} restants
            </span>
          )}
        </div>
      </div>

      {/* Keyboard hints - Desktop only */}
      <div className="text-center mt-4 text-xs text-white/30 hidden sm:block">
        <p>← → pour swiper • Ctrl+Z annuler</p>
      </div>

      {/* Bottom spacing for mobile nav */}
      <div className="h-4 sm:hidden" />
    </div>
  )
}
