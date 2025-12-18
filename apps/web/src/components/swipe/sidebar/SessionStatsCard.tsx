"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { BarChart3, Heart } from "lucide-react"
import type { SidebarTranslations } from "../types"

interface SessionStatsCardProps {
  swipeCount: number
  likeCount: number
  likeRate: number
  translations: SidebarTranslations
}

export const SessionStatsCard = memo(function SessionStatsCard({
  swipeCount,
  likeCount,
  likeRate,
  translations
}: SessionStatsCardProps) {
  return (
    <div className="bg-gradient-to-br from-foreground/5 to-foreground/2 backdrop-blur-sm rounded-2xl border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-primary" />
        {translations.session}
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{translations.moviesViewed}</span>
          <span className="text-lg font-bold text-foreground">{swipeCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{translations.liked}</span>
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-green-500 fill-green-500" />
            <span className="text-lg font-bold text-green-500">{likeCount}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{translations.likeRate}</span>
          <span className="text-lg font-bold text-foreground">{likeRate}%</span>
        </div>
        <div className="pt-2">
          <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${likeRate}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
})
