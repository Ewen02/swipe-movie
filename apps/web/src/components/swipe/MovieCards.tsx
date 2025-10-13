"use client"

import { useState, useEffect, useRef } from "react"
import { motion, type PanInfo, useMotionValue, useTransform, animate } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Profile {
  id: number
  name: string
  age: number
  bio: string
  image: string
}

interface MovieCardsProps {
  profiles: Profile[]
  onSwipe: (profile: Profile, direction: "left" | "right") => void
}

interface MovieCardProps {
  profile: Profile
  index: number
  totalCards: number
  isActive: boolean
  onSwipe: (profile: Profile, direction: "left" | "right") => void
  onButtonSwipeRef?: (fn: (direction: "left" | "right") => void) => void
  onButtonHoverRef?: (hoverFn: (direction: "left" | "right") => void, hoverEndFn: () => void) => void
}

function MovieCard({
  profile,
  index,
  totalCards,
  isActive,
  onSwipe,
  onButtonSwipeRef,
  onButtonHoverRef,
}: MovieCardProps) {
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null)

  const x = useMotionValue(0)
  const rotate = useMotionValue(0)
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])

  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0])

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (!isActive) return

    const threshold = 75
    const velocity = info.velocity.x

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 400) {
      const direction = info.offset.x > 0 ? "right" : "left"
      handleSwipe(direction)
    } else {
      animate(x, 0, { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] })
      animate(rotate, 0, { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] })
    }
  }

  const handleSwipe = (direction: "left" | "right") => {
    setExitDirection(direction)
    onSwipe(profile, direction)
  }

  const handleDrag = () => {
    if (!isActive) return
    const currentX = x.get()
    const rotationValue = (currentX / 300) * 25
    rotate.set(rotationValue)
  }

  const handleButtonSwipe = (direction: "left" | "right") => {
    if (!isActive) return

    const targetX = direction === "right" ? 150 : -150
    const targetRotate = direction === "right" ? 15 : -15

    animate(x, targetX, { duration: 0.2, ease: "easeOut" })
    animate(rotate, targetRotate, { duration: 0.2, ease: "easeOut" })

    setTimeout(() => {
      handleSwipe(direction)
    }, 200)
  }

  const handleButtonHover = (direction: "left" | "right") => {
    if (!isActive) return

    const targetX = direction === "right" ? 30 : -30
    const targetRotate = direction === "right" ? 3 : -3

    animate(x, targetX, { duration: 0.2, ease: "easeOut" })
    animate(rotate, targetRotate, { duration: 0.2, ease: "easeOut" })
  }

  const handleButtonHoverEnd = () => {
    if (!isActive) return

    animate(x, 0, { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] })
    animate(rotate, 0, { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] })
  }

  useEffect(() => {
    if (isActive && onButtonSwipeRef) {
      onButtonSwipeRef(handleButtonSwipe)
    }
    if (isActive && onButtonHoverRef) {
      onButtonHoverRef(handleButtonHover, handleButtonHoverEnd)
    }
  }, [isActive, onButtonSwipeRef, onButtonHoverRef])

  const translateY = 0
  const zIndex = totalCards - index
  const shouldShow = index < 2

  return (
    <motion.div
      className={cn("absolute inset-0", isActive ? "cursor-grab active:cursor-grabbing" : "pointer-events-none")}
      style={{
        x: isActive ? x : 0,
        rotate: isActive ? rotate : 0,
        opacity: shouldShow ? (isActive ? opacity : 1) : 0,
        y: translateY,
        zIndex,
      }}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: -400, right: 400 }}
      dragMomentum={false}
      dragElastic={0.1}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={
        exitDirection
          ? {
              x: exitDirection === "right" ? 400 : -400,
              opacity: 0,
              rotate: exitDirection === "right" ? 25 : -25,
            }
          : {}
      }
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card className="h-full bg-white dark:bg-gray-800 shadow-xl">
        <CardContent className="p-0 h-full">
          <div className="relative h-full rounded-lg overflow-hidden">
            <img
              src={profile.image || "/placeholder.svg"}
              alt={profile.name}
              draggable={false}
              className="w-full h-full object-cover select-none"
            />

            {isActive && (
              <>
                <motion.div className="absolute top-8 right-8" style={{ opacity: likeOpacity }}>
                  <Badge className="bg-green-500 text-white text-lg px-4 py-2 rotate-12 border-4 border-green-400">
                    LIKE
                  </Badge>
                </motion.div>

                <motion.div className="absolute top-8 left-8" style={{ opacity: nopeOpacity }}>
                  <Badge className="bg-red-500 text-white text-lg px-4 py-2 -rotate-12 border-4 border-red-400">
                    NOPE
                  </Badge>
                </motion.div>
              </>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h3 className="text-white text-2xl font-bold">
                {profile.name}, {profile.age}
              </h3>
              <p className="text-white/90 text-sm mt-1">{profile.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function MovieCards({ profiles, onSwipe }: MovieCardsProps) {
  const [currentCards, setCurrentCards] = useState(profiles)
  const activeCardButtonSwipeRef = useRef<((direction: "left" | "right") => void) | null>(null)
  const activeCardHoverRef = useRef<((direction: "left" | "right") => void) | null>(null)
  const activeCardHoverEndRef = useRef<(() => void) | null>(null)

  const handleCardSwipe = (profile: Profile, direction: "left" | "right") => {
    onSwipe(profile, direction)

    setTimeout(() => {
      setCurrentCards((prev) => prev.filter((p) => p.id !== profile.id))
    }, 500)
  }

  const handleButtonSwipe = (direction: "left" | "right") => {
    if (activeCardButtonSwipeRef.current) {
      activeCardButtonSwipeRef.current(direction)
    }
  }

  const handleButtonHover = (direction: "left" | "right") => {
    if (activeCardHoverRef.current) {
      activeCardHoverRef.current(direction)
    }
  }

  const handleButtonHoverEnd = () => {
    if (activeCardHoverEndRef.current) {
      activeCardHoverEndRef.current()
    }
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handleButtonSwipe("left")
      } else if (event.key === "ArrowRight") {
        handleButtonSwipe("right")
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  if (currentCards.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Plus de profils !</h2>
        <p className="text-gray-600 dark:text-gray-300">Vous avez vu tous les profils disponibles</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="relative h-[600px] w-full max-w-sm mx-auto">
        {currentCards.slice(0, 2).map((profile, index) => (
          <MovieCard
            key={profile.id}
            profile={profile}
            index={index}
            totalCards={2}
            isActive={index === 0}
            onSwipe={handleCardSwipe}
            onButtonSwipeRef={
              index === 0
                ? (fn) => {
                    activeCardButtonSwipeRef.current = fn
                  }
                : undefined
            }
            onButtonHoverRef={
              index === 0
                ? (hoverFn, hoverEndFn) => {
                    activeCardHoverRef.current = hoverFn
                    activeCardHoverEndRef.current = hoverEndFn
                  }
                : undefined
            }
          />
        ))}
      </div>

      <div className="flex justify-center gap-6 mt-8">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-16 h-16 p-0 border-2 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-950 bg-transparent"
          onClick={() => handleButtonSwipe("left")}
          onMouseEnter={() => handleButtonHover("left")}
          onMouseLeave={handleButtonHoverEnd}
          disabled={currentCards.length === 0}
        >
          <X className="w-6 h-6 text-red-500" />
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-16 h-16 p-0 border-2 border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:border-green-700 dark:hover:bg-green-950 bg-transparent"
          onClick={() => handleButtonSwipe("right")}
          onMouseEnter={() => handleButtonHover("right")}
          onMouseLeave={handleButtonHoverEnd}
          disabled={currentCards.length === 0}
        >
          <Heart className="w-6 h-6 text-green-500" />
        </Button>
      </div>

      <div className="flex justify-center mt-6">
        <div className="flex gap-1">
          {profiles.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index < profiles.length - currentCards.length
                  ? "bg-gray-400 dark:bg-gray-600"
                  : index === profiles.length - currentCards.length
                    ? "bg-pink-500"
                    : "bg-gray-200 dark:bg-gray-700",
              )}
            />
          ))}
        </div>
      </div>

      <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>Glissez ou utilisez les boutons • ← → pour naviguer au clavier</p>
      </div>
    </div>
  )
}
