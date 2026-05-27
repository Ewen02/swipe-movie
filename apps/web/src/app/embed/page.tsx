"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Film, Heart, X } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion"
import {
  isTrialActive,
  getTrialData,
  startTrial,
  trialApiFetch,
  type TrialData,
} from "@/lib/trial"
import type { MovieBasic } from "@swipe-movie/types"

function EmbedContent() {
  const searchParams = useSearchParams()
  const genreId = parseInt(searchParams?.get("genre") ?? "0", 10) || 0

  const [trialData, setTrialData] = useState<TrialData | null>(null)
  const [movies, setMovies] = useState<MovieBasic[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [swipeCount, setSwipeCount] = useState(0)

  useEffect(() => {
    async function init() {
      try {
        let data: TrialData
        if (isTrialActive()) {
          data = getTrialData()!
        } else {
          data = await startTrial({ genreId: genreId || undefined })
        }
        setTrialData(data)

        const endpoint = genreId
          ? `/movies/genre/${genreId}?page=1`
          : "/movies/popular?page=1"
        const res = await trialApiFetch(endpoint)
        if (res.ok) {
          const films = await res.json()
          if (Array.isArray(films)) setMovies(films)
        }
      } catch {
        // Silent fail
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [genreId])

  const handleSwipe = useCallback(
    async (value: boolean) => {
      const movie = movies[currentIndex]
      if (!movie || !trialData) return
      setSwipeCount((p) => p + 1)
      setCurrentIndex((p) => p + 1)

      try {
        const roomRes = await trialApiFetch(`/rooms/code/${trialData.roomCode}`)
        if (roomRes.ok) {
          const room = await roomRes.json()
          await trialApiFetch("/swipes", {
            method: "POST",
            body: JSON.stringify({
              roomId: room.id,
              movieId: String(movie.id),
              value,
            }),
          })
        }
      } catch {
        // Silent
      }
    },
    [movies, currentIndex, trialData],
  )

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <Film className="w-10 h-10 animate-pulse text-pink-500" />
      </div>
    )
  }

  const movie = movies[currentIndex]

  if (!movie || swipeCount >= 5) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center space-y-4 px-4">
          <Film className="w-10 h-10 mx-auto text-pink-500" />
          <p className="text-lg font-bold">Envie de continuer ?</p>
          <a
            href="https://swipe-movie.com/try"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition"
          >
            Essayer Swipe Movie
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden p-4">
      <EmbedCard movie={movie} onSwipe={handleSwipe} />

      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => handleSwipe(false)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg hover:scale-110 transition"
        >
          <X className="w-7 h-7 text-white" />
        </button>
        <button
          onClick={() => handleSwipe(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg hover:scale-110 transition"
        >
          <Heart className="w-7 h-7 text-white" />
        </button>
      </div>

      <a
        href="https://swipe-movie.com/try"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-xs text-gray-500 hover:text-pink-500 transition"
      >
        Powered by Swipe Movie
      </a>
    </div>
  )
}

function EmbedCard({
  movie,
  onSwipe,
}: {
  movie: MovieBasic
  onSwipe: (value: boolean) => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15])
  const likeOpacity = useTransform(x, [0, 50, 100], [0, 0.5, 1])
  const nopeOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 400) {
      onSwipe(info.offset.x > 0)
    } else {
      animate(x, 0, { type: "spring", damping: 20, stiffness: 400 })
    }
  }

  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={movie.id}
        className="relative w-72 h-[420px] rounded-2xl overflow-hidden border border-white/10 cursor-grab active:cursor-grabbing"
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: -300, right: 300 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {movie.posterUrl && (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            unoptimized
            draggable={false}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <motion.div
          className="absolute top-4 right-4 bg-green-500/90 text-white text-lg font-bold px-3 py-1 rounded-full border-2 border-white"
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </motion.div>
        <motion.div
          className="absolute top-4 left-4 bg-red-500/90 text-white text-lg font-bold px-3 py-1 rounded-full border-2 border-white"
          style={{ opacity: nopeOpacity }}
        >
          NOPE
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-bold truncate">{movie.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            {year && <span>{year}</span>}
            {movie.voteAverage > 0 && <span>★ {movie.voteAverage.toFixed(1)}</span>}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function EmbedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
          <Film className="w-10 h-10 animate-pulse text-pink-500" />
        </div>
      }
    >
      <EmbedContent />
    </Suspense>
  )
}
