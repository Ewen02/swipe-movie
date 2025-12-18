"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import type { SidebarTranslations } from "../types"

interface MoviesRemainingCardProps {
  count: number
  translations: SidebarTranslations
}

export const MoviesRemainingCard = memo(function MoviesRemainingCard({
  count,
  translations
}: MoviesRemainingCardProps) {
  return (
    <div className="bg-gradient-to-br from-foreground/5 to-foreground/2 backdrop-blur-sm rounded-2xl border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4 text-orange-500" />
        {translations.toDiscover}
      </h3>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
              animate={{ width: `${Math.min(100, (count / 20) * 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <span className="text-lg font-bold text-foreground">{count}</span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">{translations.moviesInPile}</p>
    </div>
  )
})
