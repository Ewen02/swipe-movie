"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Sparkles, Heart } from "lucide-react"
import { MovieBasic } from "@/schemas/movies"
import { useEffect, useCallback } from "react"
import confetti from "canvas-confetti"

interface MatchAnimationProps {
  show: boolean
  movie?: MovieBasic
  onComplete: () => void
}

export function MatchAnimation({ show, movie, onComplete }: MatchAnimationProps) {
  // Trigger confetti explosion
  const fireConfetti = useCallback(() => {
    // First burst - center
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'],
    })

    // Second burst - left side
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#22c55e', '#10b981', '#34d399'],
      })
    }, 150)

    // Third burst - right side
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#22c55e', '#10b981', '#34d399'],
      })
    }, 300)

    // Final celebration burst
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5, x: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#22c55e', '#ec4899', '#8b5cf6'],
        startVelocity: 45,
        gravity: 0.8,
      })
    }, 450)
  }, [])

  useEffect(() => {
    if (show) {
      // Fire confetti when animation starts
      fireConfetti()

      // Haptic feedback for match celebration
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([50, 30, 50, 30, 100])
      }

      const timer = setTimeout(onComplete, 3500)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete, fireConfetti])

  return (
    <AnimatePresence>
      {show && movie && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onComplete}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, rotate: 10 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="relative max-w-md mx-4"
          >
            {/* Sparkles Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: "50%",
                    y: "50%",
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                  className="absolute"
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              ))}
            </div>

            {/* Card */}
            <div className="relative bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-1 rounded-2xl shadow-2xl">
              <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
                {/* Trophy Header */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", damping: 10 }}
                  >
                    <Trophy className="w-16 h-16 mx-auto text-white drop-shadow-lg" />
                  </motion.div>
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-bold text-white mt-4"
                  >
                    C&apos;est un Match !
                  </motion.h2>
                </div>

                {/* Movie Info */}
                <div className="p-6 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative inline-block mb-4 w-48 h-72"
                  >
                    <Image
                      src={movie.posterUrl || movie.backdropUrl}
                      alt={movie.title}
                      width={192}
                      height={288}
                      className="object-cover rounded-lg shadow-xl"
                      priority
                      sizes="192px"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                      className="absolute -top-4 -right-4"
                    >
                      <div className="bg-red-500 rounded-full p-3 shadow-lg">
                        <Heart className="w-8 h-8 text-white fill-white" />
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    {movie.title}
                  </motion.h3>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-gray-600 dark:text-gray-400"
                  >
                    Tout le monde aime ce film !
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Tap to dismiss hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-center text-white/60 text-sm mt-4"
            >
              Cliquez pour fermer
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
