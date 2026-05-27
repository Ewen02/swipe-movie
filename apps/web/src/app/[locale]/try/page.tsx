'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { Film } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  isTrialActive,
  getTrialData,
  startTrial,
  type TrialData,
} from '@/lib/trial'
import { useTrialSwipe } from '@/hooks/trial/useTrialSwipe'
import { useLoginWall } from '@/hooks/trial/useLoginWall'
import { TrialBanner } from '@/components/trial/TrialBanner'
import { TrialSwipeCard, TrialSwipeButtons } from '@/components/trial/TrialSwipeCard'
import { TrialMatchAnimation } from '@/components/trial/TrialMatchAnimation'
import { LoginWallModal } from '@/components/trial/LoginWallModal'

const TOTAL_SWIPES = 15

function TrialPageContent() {
  const t = useTranslations('trial')
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = (params?.locale as string) || 'fr'

  const [trialData, setTrialData] = useState<TrialData | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showMatch, setShowMatch] = useState(false)

  // Initialize trial session
  useEffect(() => {
    async function init() {
      try {
        if (isTrialActive()) {
          const existing = getTrialData()
          if (existing) {
            setTrialData(existing)
            setIsInitializing(false)
            return
          }
        }

        // Start a new trial
        const genreParam = searchParams?.get('genre')
        const genreId = genreParam ? parseInt(genreParam, 10) : undefined

        const data = await startTrial({
          genreId: genreId && !isNaN(genreId) ? genreId : undefined,
        })
        setTrialData(data)
      } catch (err) {
        console.error('[TrialPage] Failed to start trial:', err)
        setError('Failed to start trial. Please try again.')
      } finally {
        setIsInitializing(false)
      }
    }

    init()
  }, [searchParams])

  // Swipe hook
  const {
    movies,
    currentIndex,
    matches,
    swipeCount,
    isLoading,
    swipe,
    latestMatch,
    clearLatestMatch,
  } = useTrialSwipe(
    trialData?.roomCode || '',
    trialData?.token || '',
  )

  // Login wall
  const { shouldShow: showLoginWall, trigger, dismiss, isHardBlock } = useLoginWall(
    swipeCount,
    matches.length > 0,
  )

  // Handle match animation completion
  const handleMatchComplete = useCallback(() => {
    setShowMatch(false)
    clearLatestMatch()
    // The login wall will show automatically via useLoginWall
  }, [clearLatestMatch])

  // Show match animation when a new match arrives
  useEffect(() => {
    if (latestMatch) {
      setShowMatch(true)
    }
  }, [latestMatch])

  // Handle swipe
  const handleSwipe = useCallback(
    (value: boolean) => {
      if (isAnimating || swipeCount >= TOTAL_SWIPES) return
      const currentMovie = movies[currentIndex]
      if (!currentMovie) return

      setIsAnimating(true)
      setExitDirection(value ? 'right' : 'left')

      // Wait for exit animation
      setTimeout(() => {
        swipe(currentMovie.id, value)
        setExitDirection(null)
        setIsAnimating(false)
      }, 400)
    },
    [isAnimating, movies, currentIndex, swipe, swipeCount],
  )

  // Loading state
  if (isInitializing || (!trialData && !error)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Film className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">{t('loading')}</p>
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
  const visibleMovies = movies.slice(currentIndex, currentIndex + 3)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top banner */}
      <TrialBanner remaining={remaining} locale={locale} />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        {/* Swipe counter */}
        <div className="mb-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {t('swipeCount', { count: swipeCount, total: TOTAL_SWIPES })}
          </p>
          {/* Progress bar */}
          <div className="w-48 h-1.5 bg-muted rounded-full mt-2 mx-auto overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(swipeCount / TOTAL_SWIPES) * 100}%` }}
            />
          </div>
        </div>

        {/* Card stack */}
        {isLoading ? (
          <div className="w-80 h-[480px] flex items-center justify-center">
            <div className="text-center">
              <Film className="w-10 h-10 mx-auto mb-3 animate-pulse text-primary" />
              <p className="text-sm text-muted-foreground">{t('loading')}</p>
            </div>
          </div>
        ) : visibleMovies.length > 0 ? (
          <>
            {/* Glow effect */}
            <div className="relative">
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/15 rounded-full blur-3xl" />
              </div>

              {/* Cards container */}
              <div className="relative w-80 h-[480px]">
                <AnimatePresence mode="popLayout">
                  {visibleMovies.map((movie, index) => (
                    <TrialSwipeCard
                      key={movie.id}
                      movie={movie}
                      onSwipe={handleSwipe}
                      isTop={index === 0}
                      exitDirection={index === 0 ? exitDirection : null}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6">
              <TrialSwipeButtons
                onSwipe={handleSwipe}
                disabled={isAnimating || swipeCount >= TOTAL_SWIPES}
              />
            </div>

            {/* Instruction */}
            <p className="text-center text-xs text-muted-foreground mt-4">
              Glissez la carte ou utilisez les boutons
            </p>
          </>
        ) : (
          <div className="w-80 h-[480px] flex items-center justify-center">
            <div className="text-center">
              <Film className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Plus de films disponibles
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Match animation */}
      <TrialMatchAnimation
        show={showMatch}
        movie={latestMatch}
        onComplete={handleMatchComplete}
      />

      {/* Login wall modal */}
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
