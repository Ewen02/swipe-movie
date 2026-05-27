"use client"

import { useEffect, useState, useCallback, Suspense } from "react"
import { useSearchParams, useParams } from "next/navigation"
import { Film } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  isTrialActive,
  getTrialData,
  startTrial,
  trialApiFetch,
  type TrialData,
} from "@/lib/trial"
import { useLoginWall } from "@/hooks/trial/useLoginWall"
import { TrialBanner } from "@/components/trial/TrialBanner"
import { TrialMatchAnimation } from "@/components/trial/TrialMatchAnimation"
import { LoginWallModal } from "@/components/trial/LoginWallModal"
import { MovieCards } from "@/components/swipe/MovieCards"
import type { MovieBasic } from "@/schemas/movies"

const TOTAL_SWIPES = 15

function TrialPageContent() {
  const t = useTranslations("trial")
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = (params?.locale as string) || "fr"

  const [trialData, setTrialData] = useState<TrialData | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [movies, setMovies] = useState<MovieBasic[]>([])
  const [roomId, setRoomId] = useState<string | null>(null)
  const [swipeCount, setSwipeCount] = useState(0)
  const [hasMatch, setHasMatch] = useState(false)
  const [showMatch, setShowMatch] = useState(false)
  const [latestMatchMovie, setLatestMatchMovie] = useState<MovieBasic | null>(null)
  const [moviesPage, setMoviesPage] = useState(1)

  // Login wall
  const { shouldShow: showLoginWall, trigger, dismiss, isHardBlock } = useLoginWall(
    swipeCount,
    hasMatch,
  )

  // Initialize trial session
  useEffect(() => {
    async function init() {
      try {
        let data: TrialData
        if (isTrialActive()) {
          const existing = getTrialData()
          if (existing) {
            data = existing
          } else {
            data = await createTrial()
          }
        } else {
          data = await createTrial()
        }

        setTrialData(data)

        // Fetch room ID from room code
        const roomRes = await trialApiFetch(`/rooms/code/${data.roomCode}`)
        if (roomRes.ok) {
          const room = await roomRes.json()
          setRoomId(room.id)
        }

        // Fetch initial movies
        await loadMovies(1)
      } catch (err) {
        console.error("[TrialPage] Failed to start trial:", err)
        setError("Failed to start trial. Please try again.")
      } finally {
        setIsInitializing(false)
      }
    }

    async function createTrial(): Promise<TrialData> {
      const genreParam = searchParams?.get("genre")
      const genreId = genreParam ? parseInt(genreParam, 10) : undefined
      return startTrial({
        genreId: genreId && !isNaN(genreId) ? genreId : undefined,
      })
    }

    init()
  }, [searchParams])

  async function loadMovies(page: number) {
    try {
      const res = await trialApiFetch(`/movies/popular?page=${page}`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setMovies((prev) => {
            const existingIds = new Set(prev.map((m) => m.id))
            const newMovies = data.filter((m: MovieBasic) => !existingIds.has(m.id))
            return [...prev, ...newMovies]
          })
        }
      }
    } catch {
      // Silently fail — movies will show empty state
    }
  }

  const handleSwipe = useCallback(
    async (movie: MovieBasic, direction: "left" | "right") => {
      if (!roomId || swipeCount >= TOTAL_SWIPES) return

      const value = direction === "right"
      setSwipeCount((prev) => prev + 1)

      try {
        const res = await trialApiFetch("/swipes", {
          method: "POST",
          body: JSON.stringify({ roomId, movieId: String(movie.id), value }),
        })

        if (res.ok) {
          const data = await res.json()
          if (data.matchCreated) {
            setHasMatch(true)
            setLatestMatchMovie(movie)
            setShowMatch(true)
          }
        }
      } catch {
        // Swipe failed silently — the card is already gone visually
      }
    },
    [roomId, swipeCount],
  )

  const handleEmpty = useCallback(() => {
    const nextPage = moviesPage + 1
    setMoviesPage(nextPage)
    loadMovies(nextPage)
  }, [moviesPage])

  const handleMatchComplete = useCallback(() => {
    setShowMatch(false)
    setLatestMatchMovie(null)
  }, [])

  // Loading state
  if (isInitializing || (!trialData && !error)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Film className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-sm mx-4">
          <Film className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-foreground font-medium mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const remaining = Math.max(0, TOTAL_SWIPES - swipeCount)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TrialBanner remaining={remaining} locale={locale} />

      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-6">
        <MovieCards
          movies={movies}
          onSwipe={handleSwipe}
          onEmpty={handleEmpty}
          isLoading={movies.length === 0}
        />
      </div>

      <TrialMatchAnimation
        show={showMatch}
        movie={latestMatchMovie}
        onComplete={handleMatchComplete}
      />

      <LoginWallModal
        show={showLoginWall && !showMatch}
        trigger={trigger}
        isHardBlock={isHardBlock}
        locale={locale}
        onDismiss={dismiss}
      />
    </div>
  )
}

export default function TrialPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <Film className="w-12 h-12 animate-pulse text-primary" />
        </div>
      }
    >
      <TrialPageContent />
    </Suspense>
  )
}
