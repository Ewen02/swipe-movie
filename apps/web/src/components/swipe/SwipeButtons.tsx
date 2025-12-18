"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { Button } from "@swipe-movie/ui"
import { Heart, X, Undo2 } from "lucide-react"

interface SwipeButtonsProps {
  onSwipe: (direction: "left" | "right") => void
  onHover: (direction: "left" | "right") => void
  onHoverEnd: () => void
  onUndo: () => void
  canUndo: boolean
  disabled?: boolean
}

export const SwipeButtons = memo(function SwipeButtons({
  onSwipe,
  onHover,
  onHoverEnd,
  onUndo,
  canUndo,
  disabled = false,
}: SwipeButtonsProps) {
  return (
    <div className="flex justify-center items-center gap-4 sm:gap-6 mt-4 sm:mt-8">
      {/* NOPE Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-red-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <Button
          size="lg"
          className="relative rounded-full w-16 h-16 sm:w-18 sm:h-18 p-0 bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 border-0 shadow-[0_8px_30px_-5px_rgba(239,68,68,0.5)] hover:shadow-[0_8px_40px_-5px_rgba(239,68,68,0.7)] transition-all duration-300 group"
          onClick={() => onSwipe("left")}
          onMouseEnter={() => onHover("left")}
          onMouseLeave={onHoverEnd}
          disabled={disabled}
        >
          <X className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md transition-transform group-hover:rotate-12" />
        </Button>
      </motion.div>

      {/* Undo Button */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-12 h-12 sm:w-14 sm:h-14 p-0 border-2 border-border hover:border-primary/40 bg-foreground/10 hover:bg-foreground/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
          onClick={onUndo}
          disabled={disabled || !canUndo}
          title="Annuler (Ctrl+Z)"
        >
          <Undo2 className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-foreground transition-all group-hover:-rotate-45" />
        </Button>
      </motion.div>

      {/* LIKE Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-green-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <Button
          size="lg"
          className="relative rounded-full w-16 h-16 sm:w-18 sm:h-18 p-0 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 shadow-[0_8px_30px_-5px_rgba(34,197,94,0.5)] hover:shadow-[0_8px_40px_-5px_rgba(34,197,94,0.7)] transition-all duration-300 group overflow-hidden"
          onClick={() => onSwipe("right")}
          onMouseEnter={() => onHover("right")}
          onMouseLeave={onHoverEnd}
          disabled={disabled}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md relative z-10 transition-transform group-hover:scale-110 group-hover:fill-white" />
        </Button>
      </motion.div>
    </div>
  )
})
