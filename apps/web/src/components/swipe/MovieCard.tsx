"use client"

import { useState, useEffect, memo } from "react"
import Image from "next/image"
import { motion, type PanInfo, useMotionValue, useTransform, animate } from "framer-motion"
import { Badge } from "@swipe-movie/ui"
import { Heart, X, Star, Info, Eye, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MovieCardProps, Particle } from "./types"
import { getGradientByRating, stackStyles } from "./utils"

export const MovieCard = memo(function MovieCard({
  movie,
  index,
  totalCards,
  isActive,
  onSwipe,
  onShowDetails,
  onButtonSwipeRef,
  onButtonHoverRef,
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

  // Border color transitions - progressive and symmetric
  const borderColor = useTransform(
    x,
    [-120, -80, -40, 0, 40, 80, 120],
    [
      "rgba(239, 68, 68, 0.8)",
      "rgba(239, 68, 68, 0.5)",
      "rgba(239, 68, 68, 0.2)",
      "rgba(255, 255, 255, 0.1)",
      "rgba(34, 197, 94, 0.2)",
      "rgba(34, 197, 94, 0.5)",
      "rgba(34, 197, 94, 0.8)"
    ]
  )

  // Combined box shadow based on swipe direction
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

  // Symmetric opacity and scale for both directions
  const likeOpacity = useTransform(x, [0, 20, 50, 90], [0, 0.2, 0.6, 1])
  const nopeOpacity = useTransform(x, [-90, -50, -20, 0], [1, 0.6, 0.2, 0])
  const likeScale = useTransform(x, [0, 40, 90], [0.85, 1, 1.15])
  const nopeScale = useTransform(x, [-90, -40, 0], [1.15, 1, 0.85])

  // Badge rotation follows card rotation
  const likeBadgeRotate = useTransform(x, [0, 50, 90], [12, 18, 22])
  const nopeBadgeRotate = useTransform(x, [-90, -50, 0], [-22, -18, -12])

  const [exitDuration, setExitDuration] = useState(0.4)

  const handleSwipe = (direction: "left" | "right", duration: number = 0.4) => {
    // Enhanced haptic feedback patterns
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      if (direction === "right") {
        navigator.vibrate([30, 20, 50])
      } else {
        navigator.vibrate([40])
      }
    }

    // Create particles for likes
    if (direction === "right") {
      const newParticles: Particle[] = Array.from({ length: 16 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 150 - 75,
        y: Math.random() * 150 - 75,
        color: ["#22c55e", "#10b981", "#34d399", "#6ee7b7", "#fbbf24", "#f59e0b"][Math.floor(Math.random() * 6)],
        delay: Math.random() * 0.15,
      }))
      setParticles(newParticles)
      setTimeout(() => setParticles([]), 1200)
    }

    setExitDuration(duration)
    setExitDirection(direction)
    onSwipe(movie, direction)
  }

  const handleDragEnd = (_event: any, info: PanInfo) => {
    if (!isActive) return

    const threshold = 75
    const velocity = info.velocity.x
    const absVelocity = Math.abs(velocity)

    if (Math.abs(info.offset.x) > threshold || absVelocity > 400) {
      const direction = info.offset.x > 0 ? "right" : "left"
      const exitDuration = Math.max(0.2, 0.4 - (absVelocity / 2000))
      handleSwipe(direction, exitDuration)
    } else {
      animate(x, 0, { type: "spring", damping: 20, stiffness: 400 })
      animate(rotate, 0, { type: "spring", damping: 20, stiffness: 400 })
    }
  }

  const handleDrag = () => {
    if (!isActive) return
    const currentX = x.get()
    const rotationValue = (currentX / 300) * 30
    rotate.set(rotationValue)
  }

  const handleButtonSwipe = (direction: "left" | "right") => {
    if (!isActive) return

    const targetX = direction === "right" ? 150 : -150
    const targetRotate = direction === "right" ? 15 : -15

    animate(x, targetX, { duration: 0.2, ease: "easeOut" })
    animate(rotate, targetRotate, { duration: 0.2, ease: "easeOut" })

    setTimeout(() => handleSwipe(direction), 200)
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
  const shouldShow = index < 3

  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null
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
      dragElastic={0.15}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={
        exitDirection
          ? {
              x: exitDirection === "right" ? 400 : -400,
              opacity: 0,
              rotate: exitDirection === "right" ? 30 : -30,
              scale: 0.9,
            }
          : {}
      }
      transition={{
        duration: exitDirection ? exitDuration : 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
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
        {/* Poster Area */}
        <div className={cn(
          "relative flex-1 bg-gradient-to-br flex items-center justify-center",
          getGradientByRating(movie.voteAverage || 5)
        )}>
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
              loading={index === 0 ? "eager" : "lazy"}
              quality={index === 0 ? 85 : 75}
            />
          )}

          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-foreground/10 animate-pulse" />
          )}

          {(imageError || (!movie.posterUrl && !movie.backdropUrl)) && (
            <span className="text-8xl opacity-80">🎬</span>
          )}

          {/* Status badges */}
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
                  transition={{ duration: 0.8, delay: particle.delay, ease: "easeOut" }}
                >
                  <Heart className="w-4 h-4" style={{ color: particle.color }} fill={particle.color} />
                </motion.div>
              ))}

              <motion.div
                className="absolute top-6 right-6 flex items-center gap-2"
                style={{ opacity: likeOpacity, scale: likeScale, rotate: likeBadgeRotate }}
              >
                <Badge
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg font-bold px-4 py-2 border-4 border-white flex items-center gap-2"
                  style={{ boxShadow: "0 0 30px rgba(34, 197, 94, 0.6), 0 10px 40px rgba(0, 0, 0, 0.3)" }}
                >
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }}>
                    <Heart className="w-5 h-5 fill-white" />
                  </motion.div>
                  LIKE
                </Badge>
              </motion.div>

              <motion.div
                className="absolute top-6 left-6 flex items-center gap-2"
                style={{ opacity: nopeOpacity, scale: nopeScale, rotate: nopeBadgeRotate }}
              >
                <Badge
                  className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-lg font-bold px-4 py-2 border-4 border-white flex items-center gap-2"
                  style={{ boxShadow: "0 0 30px rgba(239, 68, 68, 0.6), 0 10px 40px rgba(0, 0, 0, 0.3)" }}
                >
                  <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 0.3 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                  NOPE
                </Badge>
              </motion.div>
            </>
          )}
        </div>

        {/* Movie Info Footer */}
        <div className="bg-gradient-to-t from-background via-background/95 to-background/80 dark:from-black dark:via-black/95 dark:to-black/80 px-4 py-3 border-t border-border/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-foreground text-lg font-semibold truncate leading-tight">
                {movie.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-muted-foreground text-sm">{releaseYear}</span>
                {movie.watchProviders && movie.watchProviders.length > 0 && (
                  <>
                    <span className="text-muted-foreground/30">•</span>
                    <div className="flex items-center gap-0.5">
                      {movie.watchProviders.slice(0, 3).map((provider) => (
                        <div
                          key={provider.id}
                          className="relative w-4 h-4 rounded-sm overflow-hidden"
                          title={provider.name}
                        >
                          <Image src={provider.logoPath} alt={provider.name} fill className="object-cover" loading="lazy" sizes="16px" />
                        </div>
                      ))}
                      {movie.watchProviders.length > 3 && (
                        <span className="text-muted-foreground/50 text-[10px] ml-0.5">
                          +{movie.watchProviders.length - 3}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-foreground font-semibold">{movie.voteAverage?.toFixed(1)}</span>
            </div>
          </div>

          {onShowDetails && (
            <button
              className="w-full mt-3 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-all text-sm font-medium flex items-center justify-center gap-2"
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
})
