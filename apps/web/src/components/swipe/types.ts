import { MovieBasic } from "@/schemas/movies"
import { RoomWithMembersResponseDto } from "@/schemas/rooms"
import type { LucideIcon } from "lucide-react"

export interface Particle {
  id: number
  x: number
  y: number
  color: string
  delay: number
}

export interface MovieCardsProps {
  movies: MovieBasic[]
  onSwipe: (movie: MovieBasic, direction: "left" | "right") => void
  onUndo?: (movie: MovieBasic) => Promise<void>
  onEmpty?: () => void
  onShowDetails?: (movieId: number) => void
  roomFilters?: RoomWithMembersResponseDto
  isLoading?: boolean
}

export interface MovieCardProps {
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

export interface SidebarTranslations {
  session: string
  moviesViewed: string
  liked: string
  likeRate: string
  tip: string
  shortcuts: string
  nope: string
  recentlyLiked: string
  noLikesYet: string
  swipeRightToLike: string
  toDiscover: string
  moviesInPile: string
}

export interface SwipeTip {
  icon: LucideIcon
  text: string
  color: string
}
