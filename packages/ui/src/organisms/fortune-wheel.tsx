"use client"

import * as React from "react"
import { motion, useAnimation } from "framer-motion"
import { Dices, PartyPopper } from "lucide-react"
import { cn } from "../utils/cn"
import { Button } from "../atoms/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

export interface FortuneWheelItem {
  id: string
  label: string
  imageUrl?: string
}

export interface FortuneWheelTranslations {
  triggerButton: string
  title: string
  spinButton: string
  spinningText: string
  resultTitle: string
  resultSubtitle: string
}

export interface FortuneWheelProps {
  items: FortuneWheelItem[]
  onSelect?: (item: FortuneWheelItem) => void
  onSpinEnd?: (item: FortuneWheelItem) => void
  disabled?: boolean
  translations?: Partial<FortuneWheelTranslations>
  renderItem?: (item: FortuneWheelItem) => React.ReactNode
  className?: string
}

const defaultTranslations: FortuneWheelTranslations = {
  triggerButton: "Laisser le hasard choisir",
  title: "Roue du destin",
  spinButton: "Faire tourner !",
  spinningText: "La roue tourne...",
  resultTitle: "Le destin a choisi !",
  resultSubtitle: "Bon visionnage !",
}

// Colors for wheel segments
const SEGMENT_COLORS = [
  "bg-pink-500",
  "bg-purple-500",
  "bg-blue-500",
  "bg-cyan-500",
  "bg-teal-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-rose-500",
]

const FortuneWheel = React.forwardRef<HTMLDivElement, FortuneWheelProps>(
  (
    {
      items,
      onSelect,
      onSpinEnd,
      disabled = false,
      translations: customTranslations,
      renderItem,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [isSpinning, setIsSpinning] = React.useState(false)
    const [selectedItem, setSelectedItem] = React.useState<FortuneWheelItem | null>(null)
    const [rotation, setRotation] = React.useState(0)
    const controls = useAnimation()

    const translations = { ...defaultTranslations, ...customTranslations }

    const spin = React.useCallback(async () => {
      if (isSpinning || items.length === 0) return

      setIsSpinning(true)
      setSelectedItem(null)

      // Calculate random winner
      const winnerIndex = Math.floor(Math.random() * items.length)
      const segmentAngle = 360 / items.length

      // Calculate final rotation:
      // - Add several full rotations (5-8)
      // - Land on the winner segment (top = 0 degrees)
      const fullRotations = 5 + Math.floor(Math.random() * 3)
      const targetAngle = segmentAngle * winnerIndex + segmentAngle / 2
      const finalRotation = rotation + fullRotations * 360 + (360 - targetAngle)

      // Animate the wheel
      await controls.start({
        rotate: finalRotation,
        transition: {
          duration: 4,
          ease: [0.25, 0.1, 0.25, 1], // Custom easing for realistic spin
        },
      })

      setRotation(finalRotation)
      setSelectedItem(items[winnerIndex])
      setIsSpinning(false)

      // Call callbacks
      if (onSelect) {
        onSelect(items[winnerIndex])
      }
      if (onSpinEnd) {
        onSpinEnd(items[winnerIndex])
      }
    }, [isSpinning, items, rotation, controls, onSelect, onSpinEnd])

    // Need at least 2 items to spin
    if (items.length < 2) {
      return null
    }

    const segmentAngle = 360 / items.length

    return (
      <div ref={ref} className={cn(className)}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2" disabled={disabled}>
              <Dices className="w-4 h-4" />
              {translations.triggerButton}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Dices className="w-5 h-5" />
                {translations.title}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center py-6">
              {/* Pointer */}
              <div className="relative z-10 mb-[-20px]">
                <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-pink-500 drop-shadow-lg" />
              </div>

              {/* Wheel */}
              <div className="relative w-72 h-72">
                <motion.div
                  className="absolute inset-0 rounded-full overflow-hidden shadow-2xl border-4 border-gray-200 dark:border-gray-700"
                  animate={controls}
                  style={{ rotate: rotation }}
                >
                  {items.map((item, index) => {
                    const startAngle = index * segmentAngle
                    const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length]

                    // Calculate clip path for segment
                    const startRad = (startAngle - 90) * (Math.PI / 180)
                    const endRad = (startAngle + segmentAngle - 90) * (Math.PI / 180)

                    return (
                      <div
                        key={item.id}
                        className={cn("absolute w-full h-full", color)}
                        style={{
                          clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(startRad)}% ${50 + 50 * Math.sin(startRad)}%, ${50 + 50 * Math.cos(endRad)}% ${50 + 50 * Math.sin(endRad)}%)`,
                        }}
                      >
                        {/* Item content in segment */}
                        <div
                          className="absolute flex items-center justify-center"
                          style={{
                            left: `${50 + 30 * Math.cos((startAngle + segmentAngle / 2 - 90) * (Math.PI / 180))}%`,
                            top: `${50 + 30 * Math.sin((startAngle + segmentAngle / 2 - 90) * (Math.PI / 180))}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          {renderItem ? (
                            renderItem(item)
                          ) : item.imageUrl ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-200">
                              <img
                                src={item.imageUrl}
                                alt={item.label}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold text-center p-1 leading-tight">
                              {item.label.substring(0, 10)}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {/* Center circle */}
                  <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center z-10 border-4 border-gray-100 dark:border-gray-600">
                    <Dices className="w-6 h-6 text-pink-500" />
                  </div>
                </motion.div>
              </div>

              {/* Spin Button */}
              <Button
                onClick={spin}
                disabled={isSpinning}
                size="lg"
                className="mt-8 gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {isSpinning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Dices className="w-5 h-5" />
                    </motion.div>
                    {translations.spinningText}
                  </>
                ) : (
                  <>
                    <Dices className="w-5 h-5" />
                    {translations.spinButton}
                  </>
                )}
              </Button>

              {/* Selected Item Display */}
              {selectedItem && !isSpinning && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="mt-6 text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <PartyPopper className="w-5 h-5 text-yellow-500" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {translations.resultTitle}
                    </span>
                    <PartyPopper className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg">
                    {selectedItem.imageUrl && (
                      <div className="relative w-16 h-24 rounded overflow-hidden shadow-md flex-shrink-0">
                        <img
                          src={selectedItem.imageUrl}
                          alt={selectedItem.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="text-left">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {selectedItem.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {translations.resultSubtitle} 🍿
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
)

FortuneWheel.displayName = "FortuneWheel"

export { FortuneWheel }
