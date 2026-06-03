import { Suspense, lazy } from "react"
import { Heart, Sparkles, History, BarChart3, Users } from "lucide-react"
import { MovieCards } from "@/components/swipe/MovieCards"
import { MovieCardSkeleton } from "@/components/swipe/MovieCardSkeleton"
import { MatchesList } from "@/components/room/MatchesList"
import { MembersPanel } from "@/components/room/MembersPanel"
import { deleteSwipe } from "@/lib/api/swipes"
import { motion } from "framer-motion"
import type { MovieBasic } from "@/schemas/movies"
import type { RoomWithMembersResponseDto } from "@/schemas/rooms"

// Lazy load heavy components that are not always visible
const Analytics = lazy(() => import("@/components/room/Analytics").then(m => ({ default: m.Analytics })))
const SwipeHistory = lazy(() => import("@/components/room/SwipeHistory").then(m => ({ default: m.SwipeHistory })))

// Tab configuration with colors
const TABS = [
  { id: "swipe", icon: Heart, gradient: "from-pink-500 to-rose-500" },
  { id: "matches", icon: Sparkles, gradient: "from-green-500 to-emerald-500" },
  { id: "history", icon: History, gradient: "from-blue-500 to-cyan-500" },
  { id: "stats", icon: BarChart3, gradient: "from-purple-500 to-violet-500" },
  { id: "members", icon: Users, gradient: "from-orange-500 to-amber-500" },
] as const

interface RoomTabsProps {
  currentTab: string
  onTabChange: (tab: string) => void
  room: RoomWithMembersResponseDto
  movies: MovieBasic[]
  moviesLoading: boolean
  hasMoreMovies: boolean
  refreshMatches: number
  onSwipe: (movie: MovieBasic, direction: "left" | "right") => void
  onUndo: (movie: MovieBasic) => Promise<void>
  onLoadMoreMovies: () => void
  onShowDetails: (movieId: number) => void
  setSwipedMovieIds: React.Dispatch<React.SetStateAction<Set<string>>>
  setRefreshMatches: React.Dispatch<React.SetStateAction<number>>
  onMatchCountChange?: (count: number) => void
  translations: {
    tabs: Record<string, string>
    unnamedRoom: string
    roomMembers: string
    unknownUser: string
    noGenre: string
    noGenreDescription: string
    allSwiped: string
    allSwipedDescription: string
    noMovies: string
    noMoviesDescription: string
  }
}

export function RoomTabs({
  currentTab,
  onTabChange,
  room,
  movies,
  moviesLoading,
  hasMoreMovies,
  refreshMatches,
  onSwipe,
  onUndo,
  onLoadMoreMovies,
  onShowDetails,
  setSwipedMovieIds,
  setRefreshMatches,
  onMatchCountChange,
  translations: t,
}: RoomTabsProps) {
  return (
    <>
      {/* Desktop Tabs */}
      <div className="hidden sm:block mb-6">
        <div className="relative bg-card border border-border rounded-2xl p-1.5">
          <div className="grid grid-cols-5 gap-1.5">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = currentTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    relative flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                    ${isActive
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                      : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{t.tabs[tab.id]}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={currentTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {currentTab === "swipe" && (
          <SwipeTabContent
            room={room}
            movies={movies}
            moviesLoading={moviesLoading}
            hasMoreMovies={hasMoreMovies}
            onSwipe={onSwipe}
            onUndo={onUndo}
            onLoadMoreMovies={onLoadMoreMovies}
            onShowDetails={onShowDetails}
            translations={t}
          />
        )}

        {currentTab === "matches" && (
          <MatchesList
            roomId={room.id}
            totalMembers={room.members.length}
            refreshTrigger={refreshMatches}
            onMatchCountChange={onMatchCountChange}
            roomFilters={room}
          />
        )}

        {currentTab === "history" && (
          <Suspense fallback={<div className="text-center py-8 text-muted-foreground">Loading...</div>}>
            <SwipeHistory
              roomId={room.id}
              onUndo={async (movieId: string) => {
                await deleteSwipe(room.id, movieId)
                setSwipedMovieIds(prev => {
                  const newSet = new Set(prev)
                  newSet.delete(movieId)
                  return newSet
                })
                setRefreshMatches(prev => prev + 1)
              }}
              mediaType={room?.type as "movie" | "tv"}
            />
          </Suspense>
        )}

        {currentTab === "stats" && (
          <Suspense fallback={<div className="text-center py-8 text-muted-foreground">Loading...</div>}>
            <Analytics roomId={room.id} mediaType={room?.type as "movie" | "tv"} />
          </Suspense>
        )}

        {currentTab === "members" && (
          <MembersPanel
            members={room.members}
            roomCode={room.code}
            roomName={room.name}
            translations={{
              unnamedRoom: t.unnamedRoom,
              roomMembers: t.roomMembers,
              unknownUser: t.unknownUser,
            }}
          />
        )}
      </motion.div>
    </>
  )
}

// --- Swipe Tab Content (internal) ---

interface SwipeTabContentProps {
  room: RoomWithMembersResponseDto
  movies: MovieBasic[]
  moviesLoading: boolean
  hasMoreMovies: boolean
  onSwipe: (movie: MovieBasic, direction: "left" | "right") => void
  onUndo: (movie: MovieBasic) => Promise<void>
  onLoadMoreMovies: () => void
  onShowDetails: (movieId: number) => void
  translations: {
    noGenre: string
    noGenreDescription: string
    allSwiped: string
    allSwipedDescription: string
    noMovies: string
    noMoviesDescription: string
  }
}

function SwipeTabContent({
  room,
  movies,
  moviesLoading,
  hasMoreMovies,
  onSwipe,
  onUndo,
  onLoadMoreMovies,
  onShowDetails,
  translations: t,
}: SwipeTabContentProps) {
  if (moviesLoading && movies.length === 0) {
    return (
      <div className="space-y-6">
        <div className="relative h-[550px] w-full max-w-sm mx-auto">
          <MovieCardSkeleton />
        </div>
        <div className="flex justify-center gap-6">
          <div className="rounded-full w-14 h-14 bg-foreground/10 animate-pulse" />
          <div className="rounded-full w-12 h-12 bg-foreground/10 animate-pulse" />
          <div className="rounded-full w-14 h-14 bg-foreground/10 animate-pulse" />
        </div>
      </div>
    )
  }

  if (movies.length > 0) {
    return (
      <MovieCards
        movies={movies}
        onSwipe={onSwipe}
        onUndo={onUndo}
        onEmpty={onLoadMoreMovies}
        onShowDetails={onShowDetails}
        roomFilters={room}
        isLoading={moviesLoading}
      />
    )
  }

  return (
    <div className="relative">
      <div className="relative bg-card border-2 border-dashed border-border rounded-3xl">
        <div className="text-center py-16 px-6">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold mb-2">
            {room?.genreId === null || room?.genreId === undefined
              ? t.noGenre
              : !hasMoreMovies
              ? t.allSwiped
              : t.noMovies}
          </h3>
          <p className="text-muted-foreground">
            {room?.genreId === null || room?.genreId === undefined
              ? t.noGenreDescription
              : !hasMoreMovies
              ? t.allSwipedDescription
              : t.noMoviesDescription}
          </p>
        </div>
      </div>
    </div>
  )
}
