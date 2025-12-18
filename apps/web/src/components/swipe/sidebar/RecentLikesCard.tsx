"use client"

import { memo } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ThumbsUp, Heart, Star } from "lucide-react"
import { MovieBasic } from "@/schemas/movies"
import type { SidebarTranslations } from "../types"

interface RecentLikesCardProps {
  recentLikes: MovieBasic[]
  onShowDetails?: (movieId: number) => void
  translations: SidebarTranslations
}

export const RecentLikesCard = memo(function RecentLikesCard({
  recentLikes,
  onShowDetails,
  translations
}: RecentLikesCardProps) {
  return (
    <div className="bg-gradient-to-br from-foreground/5 to-foreground/2 backdrop-blur-sm rounded-2xl border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2">
        <ThumbsUp className="w-4 h-4 text-green-500" />
        {translations.recentlyLiked}
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
                className="flex items-center gap-2.5 p-2 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-colors cursor-pointer group"
                onClick={() => onShowDetails?.(movie.id)}
              >
                <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-foreground/10 shrink-0">
                  {movie.posterUrl && (
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="40px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {movie.title}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] text-muted-foreground">{movie.voteAverage?.toFixed(1)}</span>
                  </div>
                </div>
                <Heart className="w-3.5 h-3.5 text-green-500 fill-green-500 opacity-60" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-6">
          <Heart className="w-8 h-8 text-foreground/20 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">{translations.noLikesYet}</p>
          <p className="text-[10px] text-muted-foreground/70 mt-1">{translations.swipeRightToLike}</p>
        </div>
      )}
    </div>
  )
})
