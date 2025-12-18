"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Badge } from "@swipe-movie/ui"
import { Heart, Star, Calendar, Sparkles, Zap, Target, TrendingUp, Lightbulb } from "lucide-react"
import { useTranslations } from "next-intl"
import { MovieBasic } from "@/schemas/movies"
import { getProvidersByIds } from "@/lib/constants/providers"
import { MovieCardSkeleton } from "./MovieCardSkeleton"
import { MovieCard } from "./MovieCard"
import { SwipeButtons } from "./SwipeButtons"
import {
  SessionStatsCard,
  TipCard,
  ShortcutsCard,
  RecentLikesCard,
  MoviesRemainingCard,
} from "./sidebar"
import type { MovieCardsProps, SidebarTranslations, SwipeTip } from "./types"

export function MovieCards({
  movies,
  onSwipe,
  onUndo,
  onEmpty,
  onShowDetails,
  roomFilters,
  isLoading = false
}: MovieCardsProps) {
  const t = useTranslations("swipe")
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

  // Sidebar translations
  const sidebarTranslations: SidebarTranslations = {
    session: t("sidebar.session"),
    moviesViewed: t("sidebar.moviesViewed"),
    liked: t("sidebar.liked"),
    likeRate: t("sidebar.likeRate"),
    tip: t("sidebar.tip"),
    shortcuts: t("sidebar.shortcuts"),
    nope: t("sidebar.nope"),
    recentlyLiked: t("sidebar.recentlyLiked"),
    noLikesYet: t("sidebar.noLikesYet"),
    swipeRightToLike: t("sidebar.swipeRightToLike"),
    toDiscover: t("sidebar.toDiscover"),
    moviesInPile: t("sidebar.moviesInPile"),
  }

  // Tips for the sidebar (translated)
  const swipeTips: SwipeTip[] = [
    { icon: Zap, text: t("sidebar.tips.swipeFast"), color: "text-yellow-400" },
    { icon: Target, text: t("sidebar.tips.keyboard"), color: "text-blue-400" },
    { icon: Lightbulb, text: t("sidebar.tips.undoTip"), color: "text-purple-400" },
    { icon: Heart, text: t("sidebar.tips.matches"), color: "text-pink-400" },
    { icon: TrendingUp, text: t("sidebar.tips.learning"), color: "text-green-400" },
  ]

  // Sync currentCards with movies prop when it changes
  useEffect(() => {
    const validMovies = movies.filter(Boolean)
    console.log(`[MovieCards] Received ${validMovies.length} movies`)
    setCurrentCards(validMovies)
    if (validMovies.length > 3) {
      loadingMoreRef.current = false
    }
  }, [movies])

  // Rotate tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % swipeTips.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [swipeTips.length])

  const handleCardSwipe = useCallback((movie: MovieBasic, direction: "left" | "right") => {
    console.log(`[MovieCards] Swiped movie ${movie.id} (${movie.title}) ${direction}`)
    setLastSwipe({ movie, direction })
    setSwipeCount((prev) => prev + 1)
    if (direction === "right") {
      setLikeCount((prev) => prev + 1)
      setRecentLikes((prev) => [movie, ...prev].slice(0, 5))
    }
    onSwipe(movie, direction)

    setTimeout(() => {
      setCurrentCards((prev: MovieBasic[]) => {
        const newCards = prev.filter((m) => m && m.id !== movie.id)
        console.log(`[MovieCards] After swipe: ${newCards.length} cards remaining`)
        if (newCards.length <= 3 && onEmpty && !loadingMoreRef.current) {
          console.log(`[MovieCards] Only ${newCards.length} cards left, loading more proactively`)
          loadingMoreRef.current = true
          setTimeout(() => onEmpty(), 0)
        }
        return newCards
      })
    }, 500)
  }, [onSwipe, onEmpty])

  const handleUndo = async () => {
    if (!lastSwipe) return

    const { movie, direction } = lastSwipe
    setCurrentCards((prev) => [movie, ...prev])
    setSwipeCount((prev) => Math.max(0, prev - 1))
    if (direction === "right") {
      setLikeCount((prev) => Math.max(0, prev - 1))
      setRecentLikes((prev) => prev.filter((m) => m.id !== movie.id))
    }

    if (onUndo) {
      try {
        await onUndo(movie)
      } catch (err) {
        console.error("Failed to undo swipe:", err)
      }
    }

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handleButtonSwipe("left")
      } else if (event.key === "ArrowRight") {
        handleButtonSwipe("right")
      } else if ((event.key === "z" || event.key === "Z") && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        handleUndo()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [lastSwipe])

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
          <h2 className="text-2xl font-bold text-foreground mb-2">{t("allSwiped")}</h2>
          <p className="text-muted-foreground">{t("allSwipedDescription")}</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative flex gap-6 justify-center items-start">
      {/* Left Sidebar - Desktop only */}
      <div className="hidden lg:flex flex-col gap-4 w-56">
        <SessionStatsCard
          swipeCount={swipeCount}
          likeCount={likeCount}
          likeRate={likeRate}
          translations={sidebarTranslations}
        />
        <TipCard
          currentTipIndex={currentTipIndex}
          tips={swipeTips}
          translations={sidebarTranslations}
        />
        <ShortcutsCard
          translations={sidebarTranslations}
          likeLabel={t("like")}
          undoLabel={t("undo")}
        />
      </div>

      {/* Center Content */}
      <div className="flex-1 max-w-md">
        {/* Active Filters Display */}
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

        {/* Progress indicator - mobile/tablet only */}
        {currentCards.length > 0 && (
          <div className="flex justify-center mb-3 lg:hidden">
            <div className="flex items-center gap-3 px-4 py-2 bg-foreground/5 backdrop-blur-sm rounded-full border border-border">
              <span className="text-sm font-medium text-foreground/80">
                {t("sidebar.moviesRemaining", { count: currentCards.length })}
              </span>
              {swipeCount > 0 && (
                <>
                  <div className="w-px h-4 bg-foreground/20" />
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-green-500 fill-green-500" />
                    <span className="text-sm text-foreground/70">{likeCount}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Card container */}
        <div className="relative h-[450px] sm:h-[550px] md:h-[600px] w-full max-w-sm mx-auto">
          {currentCards.length > 2 && !isLoading && (
            <div className="absolute inset-x-4 -bottom-2 h-4 bg-gradient-to-t from-black/10 to-transparent rounded-b-xl blur-sm" />
          )}

          {isLoading ? (
            <div className="absolute inset-0">
              <MovieCardSkeleton />
            </div>
          ) : (
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
                    ? (fn) => { activeCardButtonSwipeRef.current = fn }
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

        {/* Swipe Buttons */}
        <SwipeButtons
          onSwipe={handleButtonSwipe}
          onHover={handleButtonHover}
          onHoverEnd={handleButtonHoverEnd}
          onUndo={handleUndo}
          canUndo={!!lastSwipe}
          disabled={isLoading || currentCards.length === 0}
        />

        {/* Session stats - mobile/tablet only */}
        <div className="flex flex-col items-center gap-2 mt-4 lg:hidden">
          {swipeCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {t("sidebar.swiped", { count: swipeCount })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-green-500 fill-green-500" />
                {t("sidebar.percentLiked", { percent: Math.round((likeCount / swipeCount) * 100) })}
              </span>
            </motion.div>
          )}
          {/* Keyboard hints - tablet only */}
          <div className="text-xs text-muted-foreground/50 hidden sm:block lg:hidden">
            {t("sidebar.keyboardHint")}
          </div>
        </div>

        {/* Bottom spacing for mobile nav */}
        <div className="h-4 sm:hidden" />
      </div>

      {/* Right Sidebar - Desktop only */}
      <div className="hidden lg:flex flex-col gap-4 w-56">
        <RecentLikesCard
          recentLikes={recentLikes}
          onShowDetails={onShowDetails}
          translations={sidebarTranslations}
        />
        <MoviesRemainingCard
          count={currentCards.length}
          translations={sidebarTranslations}
        />
      </div>
    </div>
  )
}
