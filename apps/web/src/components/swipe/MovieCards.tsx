"use client"

import { useState, useEffect, useRef, memo } from "react"
import Image from "next/image"
import { motion, type PanInfo, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion"
import { Button, Badge } from "@swipe-movie/ui"
import { Heart, X, Undo2, Sparkles, Star, Calendar, Info, Eye, Bookmark, Lightbulb, Zap, Target, TrendingUp, ThumbsUp, Clock, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { MovieBasic } from "@/schemas/movies"
import { RoomWithMembersResponseDto } from "@/schemas/rooms"
import { RatingBadge } from "@/components/ui/movie"
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

// Gradient colors based on movie rating
const getGradientByRating = (rating: number) => {
  if (rating >= 8) return "from-emerald-600 via-teal-600 to-cyan-600"
  if (rating >= 7) return "from-blue-600 via-indigo-600 to-purple-600"
  if (rating >= 6) return "from-violet-600 via-purple-600 to-fuchsia-600"
  if (rating >= 5) return "from-orange-600 via-amber-600 to-yellow-600"
  return "from-rose-600 via-pink-600 to-red-600"
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
  const [imageError, setImageError] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  const x = useMotionValue(0)
  const rotate = useMotionValue(0)
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])

  // Enhanced transforms for better visual feedback
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95])

  // Glow effects - more intense and colorful
  const likeGlow = useTransform(
    x,
    [0, 50, 150],
    [
      "0 0 0px rgba(34, 197, 94, 0), 0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      "0 0 40px rgba(34, 197, 94, 0.4), 0 0 80px rgba(34, 197, 94, 0.2), 0 25px 50px -12px rgba(34, 197, 94, 0.3)",
      "0 0 60px rgba(34, 197, 94, 0.6), 0 0 120px rgba(34, 197, 94, 0.4), 0 0 180px rgba(34, 197, 94, 0.2)"
    ]
  )
  const nopeGlow = useTransform(
    x,
    [-150, -50, 0],
    [
      "0 0 60px rgba(239, 68, 68, 0.6), 0 0 120px rgba(239, 68, 68, 0.4), 0 0 180px rgba(239, 68, 68, 0.2)",
      "0 0 40px rgba(239, 68, 68, 0.4), 0 0 80px rgba(239, 68, 68, 0.2), 0 25px 50px -12px rgba(239, 68, 68, 0.3)",
      "0 0 0px rgba(239, 68, 68, 0), 0 25px 50px -12px rgba(0, 0, 0, 0.25)"
    ]
  )

  // Border color transitions - progressive and symmetric
  const borderColor = useTransform(
    x,
    [-120, -80, -40, 0, 40, 80, 120],
    [
      "rgba(239, 68, 68, 0.8)",   // Red max
      "rgba(239, 68, 68, 0.5)",   // Red medium
      "rgba(239, 68, 68, 0.2)",   // Red subtle
      "rgba(255, 255, 255, 0.1)", // Neutral
      "rgba(34, 197, 94, 0.2)",   // Green subtle
      "rgba(34, 197, 94, 0.5)",   // Green medium
      "rgba(34, 197, 94, 0.8)"    // Green max
    ]
  )

  // Combined box shadow based on swipe direction - progressive and symmetric
  const boxShadow = useTransform(
    x,
    [-120, -80, -40, 0, 40, 80, 120],
    [
      "0 0 80px rgba(239, 68, 68, 0.6), 0 0 140px rgba(239, 68, 68, 0.4), 0 0 180px rgba(239, 68, 68, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.35)",
      "0 0 50px rgba(239, 68, 68, 0.4), 0 0 90px rgba(239, 68, 68, 0.25), 0 25px 50px -12px rgba(0, 0, 0, 0.3)",
      "0 0 20px rgba(239, 68, 68, 0.2), 0 0 40px rgba(239, 68, 68, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.27)",
      "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      "0 0 20px rgba(34, 197, 94, 0.2), 0 0 40px rgba(34, 197, 94, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.27)",
      "0 0 50px rgba(34, 197, 94, 0.4), 0 0 90px rgba(34, 197, 94, 0.25), 0 25px 50px -12px rgba(0, 0, 0, 0.3)",
      "0 0 80px rgba(34, 197, 94, 0.6), 0 0 140px rgba(34, 197, 94, 0.4), 0 0 180px rgba(34, 197, 94, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.35)"
    ]
  )

  // Symmetric opacity and scale for both directions - progressive
  const likeOpacity = useTransform(x, [0, 20, 50, 90], [0, 0.2, 0.6, 1])
  const nopeOpacity = useTransform(x, [-90, -50, -20, 0], [1, 0.6, 0.2, 0])
  const likeScale = useTransform(x, [0, 40, 90], [0.85, 1, 1.15])
  const nopeScale = useTransform(x, [-90, -40, 0], [1.15, 1, 0.85])

  // Badge rotation follows card rotation (symmetric and progressive)
  const likeBadgeRotate = useTransform(x, [0, 50, 90], [12, 18, 22])
  const nopeBadgeRotate = useTransform(x, [-90, -50, 0], [-22, -18, -12])

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

  // Enhanced stack effect - cards are more visible and offset
  const stackStyles = {
    0: { rotate: 0, scale: 1, y: 0, opacity: 1 },
    1: { rotate: 3, scale: 0.95, y: 8, opacity: 0.9 },
    2: { rotate: -2, scale: 0.90, y: 16, opacity: 0.75 },
  }
  const stackStyle = stackStyles[index as keyof typeof stackStyles] || stackStyles[2]

  return (
    <motion.div
      className={cn("absolute inset-0 rounded-3xl", isActive ? "cursor-grab active:cursor-grabbing" : "pointer-events-none")}
      style={{
        x: isActive ? x : 0,
        rotate: isActive ? rotate : stackStyle.rotate,
        scale: isActive ? scale : stackStyle.scale,
        opacity: shouldShow ? (isActive ? opacity : stackStyle.opacity) : 0,
        y: stackStyle.y,
        zIndex,
        boxShadow: isActive
          ? boxShadow
          : index === 1
            ? "0 20px 40px -10px rgba(0, 0, 0, 0.3), 0 8px 16px -8px rgba(0, 0, 0, 0.2)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 12px 24px -12px rgba(0, 0, 0, 0.15)",
        borderRadius: "1.5rem",
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
      <motion.div
        className="h-full rounded-3xl overflow-hidden border-2 flex flex-col"
        style={{
          borderColor: isActive ? borderColor : "rgba(255, 255, 255, 0.1)",
          background: "hsl(var(--background))",
        }}
      >
        {/* Poster Area - Gradient background with optional image */}
        <div className={cn(
          "relative flex-1 bg-gradient-to-br flex items-center justify-center",
          getGradientByRating(movie.voteAverage || 5)
        )}>
          {/* Movie poster image - covers the gradient when loaded */}
          {!imageError && (movie.posterUrl || movie.backdropUrl) && (
            <Image
              src={movie.posterUrl || movie.backdropUrl || ""}
              alt={movie.title}
              fill
              draggable={false}
              className={cn(
                "object-cover select-none transition-opacity duration-500",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, 448px"
              priority={index === 0}
            />
          )}

          {/* Loading state */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-black/10 animate-pulse" />
          )}

          {/* Fallback emoji when no image */}
          {(imageError || (!movie.posterUrl && !movie.backdropUrl)) && (
            <span className="text-8xl opacity-80">🎬</span>
          )}

          {/* Status badges (Watched / Watchlist) */}
          {movie.isWatched && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-green-500/90 text-white text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5 shadow-lg backdrop-blur-sm border border-green-400/30">
                <Eye className="w-3.5 h-3.5" />
                Deja vu
              </Badge>
            </div>
          )}

          {movie.isInWatchlist && !movie.isWatched && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-purple-500/90 text-white text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5 shadow-lg backdrop-blur-sm border border-purple-400/30">
                <Bookmark className="w-3.5 h-3.5" />
                Watchlist
                {movie.watchlistMemberCount && movie.watchlistMemberCount > 1 && (
                  <span className="text-[10px] opacity-80">({movie.watchlistMemberCount})</span>
                )}
              </Badge>
            </div>
          )}

          {/* Like/Nope indicators and particles */}
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
                className="absolute top-6 right-6 flex items-center gap-2"
                style={{
                  opacity: likeOpacity,
                  scale: likeScale,
                  rotate: likeBadgeRotate,
                }}
              >
                <Badge
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg font-bold px-4 py-2 border-4 border-white flex items-center gap-2"
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
                </Badge>
              </motion.div>

              <motion.div
                className="absolute top-6 left-6 flex items-center gap-2"
                style={{
                  opacity: nopeOpacity,
                  scale: nopeScale,
                  rotate: nopeBadgeRotate,
                }}
              >
                <Badge
                  className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-lg font-bold px-4 py-2 border-4 border-white flex items-center gap-2"
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
        </div>

        {/* Movie Info - Clean footer */}
        <div className="bg-gradient-to-t from-black via-black/95 to-black/80 px-4 py-3">
          {/* Main info row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-lg font-semibold truncate leading-tight">
                {movie.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-white/50 text-sm">{releaseYear}</span>
                {movie.watchProviders && movie.watchProviders.length > 0 && (
                  <>
                    <span className="text-white/20">•</span>
                    <div className="flex items-center gap-0.5">
                      {movie.watchProviders.slice(0, 3).map((provider) => (
                        <div
                          key={provider.id}
                          className="relative w-4 h-4 rounded-sm overflow-hidden"
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
                        <span className="text-white/30 text-[10px] ml-0.5">
                          +{movie.watchProviders.length - 3}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Rating - prominent */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-white font-semibold">{movie.voteAverage?.toFixed(1)}</span>
            </div>
          </div>

          {/* Details button - full width, subtle */}
          {onShowDetails && (
            <button
              className="w-full mt-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2"
              onClick={(e) => {
                e.stopPropagation()
                onShowDetails(movie.id)
              }}
            >
              <Info className="w-4 h-4" />
              Voir les détails
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Tips for the sidebar
const SWIPE_TIPS = [
  { icon: Zap, text: "Swipez vite pour une sortie dynamique", color: "text-yellow-400" },
  { icon: Target, text: "← → au clavier pour swiper", color: "text-blue-400" },
  { icon: Lightbulb, text: "Ctrl+Z pour annuler le dernier swipe", color: "text-purple-400" },
  { icon: Heart, text: "Les matchs apparaissent quand tous likent", color: "text-pink-400" },
  { icon: TrendingUp, text: "Plus vous swipez, mieux on vous connait", color: "text-green-400" },
]

// Memoized Sidebar Components to prevent re-renders
interface SessionStatsCardProps {
  swipeCount: number
  likeCount: number
  likeRate: number
}

const SessionStatsCard = memo(function SessionStatsCard({ swipeCount, likeCount, likeRate }: SessionStatsCardProps) {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-4">
      <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-primary" />
        Session
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50">Films vus</span>
          <span className="text-lg font-bold text-white">{swipeCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50">Likés</span>
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-green-400 fill-green-400" />
            <span className="text-lg font-bold text-green-400">{likeCount}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50">Taux like</span>
          <span className="text-lg font-bold text-white">{likeRate}%</span>
        </div>
        <div className="pt-2">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${likeRate}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

interface TipCardProps {
  currentTipIndex: number
}

const TipCard = memo(function TipCard({ currentTipIndex }: TipCardProps) {
  const currentTip = SWIPE_TIPS[currentTipIndex]
  const TipIcon = currentTip?.icon || Lightbulb

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-4">
      <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-yellow-400" />
        Astuce
      </h3>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTipIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-start gap-3"
        >
          <TipIcon className={cn("w-5 h-5 mt-0.5 shrink-0", currentTip?.color)} />
          <p className="text-sm text-white/70 leading-relaxed">{currentTip?.text}</p>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-1.5 mt-3">
        {SWIPE_TIPS.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              idx === currentTipIndex ? "bg-primary" : "bg-white/20"
            )}
          />
        ))}
      </div>
    </div>
  )
})

const ShortcutsCard = memo(function ShortcutsCard() {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-4">
      <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
        <Target className="w-4 h-4 text-blue-400" />
        Raccourcis
      </h3>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-white/60">
          <span>Nope</span>
          <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/80">←</kbd>
        </div>
        <div className="flex items-center justify-between text-white/60">
          <span>Like</span>
          <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/80">→</kbd>
        </div>
        <div className="flex items-center justify-between text-white/60">
          <span>Annuler</span>
          <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/80">⌘Z</kbd>
        </div>
      </div>
    </div>
  )
})

interface RecentLikesCardProps {
  recentLikes: MovieBasic[]
  onShowDetails?: (movieId: number) => void
}

const RecentLikesCard = memo(function RecentLikesCard({ recentLikes, onShowDetails }: RecentLikesCardProps) {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-4">
      <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
        <ThumbsUp className="w-4 h-4 text-green-400" />
        Récemment likés
      </h3>
      {recentLikes.length > 0 ? (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {recentLikes.map((movie, idx) => (
              <motion.div
                key={`${movie.id}-${idx}`}
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-2.5 p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                onClick={() => onShowDetails?.(movie.id)}
              >
                <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-white/10 shrink-0">
                  {movie.posterUrl && (
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate group-hover:text-primary transition-colors">
                    {movie.title}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] text-white/50">{movie.voteAverage?.toFixed(1)}</span>
                  </div>
                </div>
                <Heart className="w-3.5 h-3.5 text-green-400 fill-green-400 opacity-60" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-6">
          <Heart className="w-8 h-8 text-white/20 mx-auto mb-2" />
          <p className="text-xs text-white/40">Aucun like pour le moment</p>
          <p className="text-[10px] text-white/30 mt-1">Swipez vers la droite pour liker</p>
        </div>
      )}
    </div>
  )
})

interface MoviesRemainingCardProps {
  count: number
}

const MoviesRemainingCard = memo(function MoviesRemainingCard({ count }: MoviesRemainingCardProps) {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-4">
      <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-orange-400" />
        À découvrir
      </h3>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
              animate={{ width: `${Math.min(100, (count / 20) * 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <span className="text-lg font-bold text-white">{count}</span>
      </div>
      <p className="text-[10px] text-white/40 mt-2">films dans la pile</p>
    </div>
  )
})

export function MovieCards({ movies, onSwipe, onUndo, onEmpty, onShowDetails, roomFilters, isLoading = false }: MovieCardsProps) {
  const [currentCards, setCurrentCards] = useState(movies)
  const [lastSwipe, setLastSwipe] = useState<{ movie: MovieBasic; direction: "left" | "right" } | null>(null)
  const [swipeCount, setSwipeCount] = useState(0)
  const [likeCount, setLikeCount] = useState(0)
  const [recentLikes, setRecentLikes] = useState<MovieBasic[]>([])
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
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

  // Rotate tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % SWIPE_TIPS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleCardSwipe = (movie: MovieBasic, direction: "left" | "right") => {
    console.log(`[MovieCards] Swiped movie ${movie.id} (${movie.title}) ${direction}`)
    setLastSwipe({ movie, direction })
    setSwipeCount((prev) => prev + 1)
    if (direction === "right") {
      setLikeCount((prev) => prev + 1)
      // Add to recent likes (keep last 5)
      setRecentLikes((prev) => [movie, ...prev].slice(0, 5))
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
      // Retirer le film des récemment likés
      setRecentLikes((prev) => prev.filter((m) => m.id !== movie.id))
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

  // Calculate session stats
  const likeRate = swipeCount > 0 ? Math.round((likeCount / swipeCount) * 100) : 0

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
    <div className="relative flex gap-6 justify-center items-start">
      {/* Left Sidebar - Desktop only */}
      <div className="hidden lg:flex flex-col gap-4 w-56">
        <SessionStatsCard swipeCount={swipeCount} likeCount={likeCount} likeRate={likeRate} />
        <TipCard currentTipIndex={currentTipIndex} />
        <ShortcutsCard />
      </div>

      {/* Center Content */}
      <div className="flex-1 max-w-md">
        {/* Active Filters Display - Compact pill design */}
        {roomFilters && (
          <div className="mb-4">
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

        {/* Progress indicator - Top positioned, near cards (mobile/tablet only, desktop has sidebar) */}
        {currentCards.length > 0 && (
          <div className="flex justify-center mb-3 lg:hidden">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <span className="text-sm font-medium text-white/80">
                {currentCards.length} films restants
              </span>
              {swipeCount > 0 && (
                <>
                  <div className="w-px h-4 bg-white/20" />
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-green-400 fill-green-400" />
                    <span className="text-sm text-white/70">{likeCount}</span>
                  </div>
                </>
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

        {/* Session stats and keyboard hints - mobile/tablet only */}
        <div className="flex flex-col items-center gap-2 mt-4 lg:hidden">
          {swipeCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs text-white/50"
            >
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {swipeCount} swipés
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-green-400 fill-green-400" />
                {Math.round((likeCount / swipeCount) * 100)}% likés
              </span>
            </motion.div>
          )}
          {/* Keyboard hints - tablet only */}
          <div className="text-xs text-white/30 hidden sm:block lg:hidden">
            ← → pour swiper • Ctrl+Z annuler
          </div>
        </div>

        {/* Bottom spacing for mobile nav */}
        <div className="h-4 sm:hidden" />
      </div>

      {/* Right Sidebar - Desktop only */}
      <div className="hidden lg:flex flex-col gap-4 w-56">
        <RecentLikesCard recentLikes={recentLikes} onShowDetails={onShowDetails} />
        <MoviesRemainingCard count={currentCards.length} />
      </div>
    </div>
  )
}
