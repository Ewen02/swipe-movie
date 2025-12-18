"use client"

import { useState } from "react"
import Image from "next/image"
import { MoreVertical, Eye, Clock, Heart, ThumbsDown, Star, Trash2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LibraryItem } from "@/lib/api/users"
import type { MovieBasic } from "@/schemas/movies"

const STATUS_CONFIG = {
  watched: { icon: Eye, label: "Vu", color: "text-green-500" },
  watchlist: { icon: Clock, label: "A voir", color: "text-blue-500" },
  liked: { icon: Heart, label: "Like", color: "text-pink-500" },
  disliked: { icon: ThumbsDown, label: "Pas aime", color: "text-red-500" },
  rated: { icon: Star, label: "Note", color: "text-yellow-500" },
} as const

const SOURCE_CONFIG = {
  trakt: { label: "Trakt", color: "bg-red-500/20 text-red-400" },
  anilist: { label: "AniList", color: "bg-blue-500/20 text-blue-400" },
  onboarding: { label: "Onboarding", color: "bg-purple-500/20 text-purple-400" },
  manual: { label: "Manuel", color: "bg-gray-500/20 text-gray-400" },
  discover: { label: "Discover", color: "bg-green-500/20 text-green-400" },
} as const

const STATUS_OPTIONS = [
  { value: "watched", label: "Marquer comme vu", icon: Eye },
  { value: "watchlist", label: "Ajouter a ma liste", icon: Clock },
  { value: "liked", label: "J'aime", icon: Heart },
  { value: "disliked", label: "Je n'aime pas", icon: ThumbsDown },
] as const

interface LibraryCardProps {
  item: LibraryItem
  movie?: MovieBasic
  onStatusChange: (status: string) => void
  onDelete: () => void
  onClick: () => void
}

export function LibraryCard({
  item,
  movie,
  onStatusChange,
  onDelete,
  onClick,
}: LibraryCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const statusConfig = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]
  const sourceConfig = SOURCE_CONFIG[item.source as keyof typeof SOURCE_CONFIG]
  const StatusIcon = statusConfig?.icon || Eye

  const releaseYear = movie?.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null

  return (
    <div className="relative group">
      <div
        className="cursor-pointer rounded-xl overflow-hidden shadow-lg"
        onClick={onClick}
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] bg-muted">
          {movie?.posterUrl ? (
            <Image
              src={movie.posterUrl}
              alt={movie?.title || "Film"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <span className="text-5xl">🎬</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent dark:from-black/80 dark:via-black/20" />

          {/* Status badge */}
          {statusConfig && (
            <div className={cn(
              "absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
              "bg-background/80 dark:bg-black/60 backdrop-blur-sm border border-border/50",
              statusConfig.color
            )}>
              <StatusIcon className="w-3 h-3" />
              {statusConfig.label}
            </div>
          )}

          {/* Source badge */}
          {sourceConfig && (
            <div className={cn(
              "absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium",
              sourceConfig.color
            )}>
              {sourceConfig.label}
            </div>
          )}

          {/* Rating badge */}
          {item.rating && (
            <div className="absolute bottom-12 right-2 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400" />
              {item.rating.toFixed(1)}
            </div>
          )}

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h4 className="font-semibold text-sm text-foreground dark:text-white line-clamp-2 mb-1">
              {movie?.title || `Film #${item.tmdbId}`}
            </h4>
            <div className="flex items-center justify-between">
              {releaseYear && (
                <span className="text-xs text-muted-foreground">{releaseYear}</span>
              )}
              {movie?.voteAverage && (
                <span className="text-xs text-yellow-500 dark:text-yellow-400 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-500 dark:fill-yellow-400" />
                  {movie.voteAverage.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setShowMenu(!showMenu)
        }}
        className="absolute bottom-16 right-2 p-2 rounded-full bg-background/80 dark:bg-black/70 backdrop-blur-sm text-foreground hover:bg-background dark:hover:bg-black/90 transition-colors z-10 border border-border/50"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute bottom-20 right-2 z-50 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[180px]">
            <p className="px-3 py-1.5 text-xs text-muted-foreground border-b border-border mb-1">
              Changer le statut
            </p>
            {STATUS_OPTIONS.map((option) => {
              const Icon = option.icon
              const isActive = item.status === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onStatusChange(option.value)
                    setShowMenu(false)
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-accent/10",
                    isActive && "text-primary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {option.label}
                  {isActive && <Check className="w-4 h-4 ml-auto" />}
                </button>
              )
            })}
            <div className="border-t border-border mt-1 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
