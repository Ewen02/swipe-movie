'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, PanInfo } from 'framer-motion'
import { Heart, X, Star } from 'lucide-react'
import type { MovieBasic } from '@/schemas/movies'

interface TrialSwipeCardProps {
  movie: MovieBasic
  onSwipe: (value: boolean) => void
  isTop: boolean
  exitDirection: 'left' | 'right' | null
}

export function TrialSwipeCard({
  movie,
  onSwipe,
  isTop,
  exitDirection,
}: TrialSwipeCardProps) {
  const [dragX, setDragX] = useState(0)

  const handleDrag = (_: unknown, info: PanInfo) => {
    setDragX(info.offset.x)
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe(true)
    } else if (info.offset.x < -100) {
      onSwipe(false)
    }
    setDragX(0)
  }

  const likeOpacity = Math.min(Math.max(dragX / 100, 0), 1)
  const nopeOpacity = Math.min(Math.max(-dragX / 100, 0), 1)

  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''
  const rating = movie.voteAverage ? movie.voteAverage.toFixed(1) : ''

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10, opacity: 1 }}
      animate={{
        scale: isTop ? 1 : 0.95,
        y: isTop ? 0 : 10,
        rotate: isTop ? dragX * 0.05 : 0,
      }}
      exit={{
        x: exitDirection === 'right' ? 400 : -400,
        rotate: exitDirection === 'right' ? 20 : -20,
        opacity: 0,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
      }}
      whileTap={isTop ? { scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="h-full overflow-hidden rounded-2xl border-2 border-border bg-background/95 backdrop-blur-sm shadow-2xl">
        {/* Movie Poster */}
        <div className="relative h-[60%] bg-muted overflow-hidden">
          {movie.posterUrl ? (
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 400px) 100vw, 400px"
              unoptimized
              priority={isTop}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <span className="text-7xl">🎬</span>
            </div>
          )}

          {/* Like indicator */}
          <motion.div
            className="absolute top-4 right-4 px-4 py-2 bg-green-500 rounded-lg border-4 border-green-400 rotate-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: likeOpacity }}
          >
            <span className="text-white font-bold text-xl">LIKE</span>
          </motion.div>

          {/* Nope indicator */}
          <motion.div
            className="absolute top-4 left-4 px-4 py-2 bg-red-500 rounded-lg border-4 border-red-400 -rotate-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: nopeOpacity }}
          >
            <span className="text-white font-bold text-xl">NOPE</span>
          </motion.div>

          {/* Rating badge */}
          {rating && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-white text-sm font-semibold">{rating}</span>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="p-4 flex-1">
          <h3 className="text-lg font-bold text-foreground truncate">{movie.title}</h3>
          {year && (
            <p className="text-sm text-muted-foreground mt-0.5">{year}</p>
          )}
          {movie.overview && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
              {movie.overview}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface TrialSwipeButtonsProps {
  onSwipe: (value: boolean) => void
  disabled?: boolean
}

export function TrialSwipeButtons({ onSwipe, disabled }: TrialSwipeButtonsProps) {
  return (
    <div className="flex justify-center gap-6">
      <motion.button
        className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center text-red-500 hover:bg-red-500/20 hover:border-red-500/50 transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onSwipe(false)}
        disabled={disabled}
        aria-label="Nope"
      >
        <X className="w-8 h-8" />
      </motion.button>

      <motion.button
        className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center text-green-500 hover:bg-green-500/20 hover:border-green-500/50 transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onSwipe(true)}
        disabled={disabled}
        aria-label="Like"
      >
        <Heart className="w-8 h-8" />
      </motion.button>
    </div>
  )
}
