"use client"

import { memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SidebarTranslations, SwipeTip } from "../types"

interface TipCardProps {
  currentTipIndex: number
  tips: SwipeTip[]
  translations: SidebarTranslations
}

export const TipCard = memo(function TipCard({ currentTipIndex, tips, translations }: TipCardProps) {
  const currentTip = tips[currentTipIndex]
  const TipIcon = currentTip?.icon || Lightbulb

  return (
    <div className="bg-gradient-to-br from-foreground/5 to-foreground/2 backdrop-blur-sm rounded-2xl border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-yellow-500" />
        {translations.tip}
      </h3>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTipIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-start gap-3"
        >
          <TipIcon className={cn("w-5 h-5 mt-0.5 shrink-0", currentTip?.color)} />
          <p className="text-sm text-muted-foreground leading-relaxed">{currentTip?.text}</p>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-1.5 mt-3">
        {tips.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              idx === currentTipIndex ? "bg-primary" : "bg-foreground/20"
            )}
          />
        ))}
      </div>
    </div>
  )
})
