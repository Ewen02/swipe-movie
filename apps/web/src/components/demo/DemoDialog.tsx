"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, X, Star, Film, RotateCcw, Sparkles } from "lucide-react"
import Image from "next/image"
import { fadeInUp, staggerContainer } from "@/lib/animations"

interface DemoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DEMO_MOVIES = [
  {
    id: 1,
    title: "Inception",
    year: "2010",
    genre: "Science-Fiction",
    rating: 8.8,
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  },
  {
    id: 2,
    title: "Parasite",
    year: "2019",
    genre: "Thriller",
    rating: 8.5,
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  },
  {
    id: 3,
    title: "Interstellar",
    year: "2014",
    genre: "Science-Fiction",
    rating: 8.6,
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
]

export function DemoDialog({ open, onOpenChange }: DemoDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipedRight, setSwipedRight] = useState(0)
  const [swipedLeft, setSwipedLeft] = useState(0)
  const [showMatch, setShowMatch] = useState(false)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)

  const currentMovie = DEMO_MOVIES[currentIndex]

  const handleSwipe = (liked: boolean) => {
    setDirection(liked ? "right" : "left")

    setTimeout(() => {
      if (liked) {
        setSwipedRight(prev => prev + 1)
        // Show match animation on second like
        if (swipedRight === 1) {
          setShowMatch(true)
          setTimeout(() => {
            setShowMatch(false)
          }, 2000)
        }
      } else {
        setSwipedLeft(prev => prev + 1)
      }

      if (currentIndex < DEMO_MOVIES.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        // Reset demo
        setCurrentIndex(0)
        setSwipedRight(0)
        setSwipedLeft(0)
      }
      setDirection(null)
    }, 300)
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setSwipedRight(0)
    setSwipedLeft(0)
    setShowMatch(false)
    setDirection(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border-2 border-primary/20 -mx-6 -mt-6 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
          <div className="relative p-8 md:p-10 text-center">
            <div className="inline-flex p-3 bg-gradient-to-br from-primary to-accent rounded-xl mb-4 shadow-lg">
              <Film className="w-8 h-8 text-white" />
            </div>
            <DialogHeader className="text-center sm:text-center">
              <DialogTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                Démo Interactive
              </DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Découvrez comment fonctionne Swipe Movie ! Swipez à droite pour aimer, à gauche pour passer
            </p>
          </div>
        </div>

        <motion.div
          className="space-y-8 px-2 pb-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Stats Cards */}
          <motion.div className="grid grid-cols-3 gap-4 md:gap-6" variants={fadeInUp}>
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-md group">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mb-3 group-hover:scale-110 transition-transform">
                  <Film className="w-7 h-7 text-primary" />
                </div>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
                  {swipedRight + swipedLeft}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">Films vus</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-500/50 transition-all hover:shadow-md group">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 mb-3 group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-green-500" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-green-500 mb-1">
                  {swipedRight}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">J'aime</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-500/50 transition-all hover:shadow-md group">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 mb-3 group-hover:scale-110 transition-transform">
                  <X className="w-7 h-7 text-red-500" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-red-500 mb-1">
                  {swipedLeft}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">Pas intéressé</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Movie Card */}
          <motion.div className="relative" variants={fadeInUp}>
            {showMatch && (
              <div className="absolute inset-0 z-50 bg-gradient-to-br from-green-500/95 via-primary/95 to-accent/95 rounded-2xl flex flex-col items-center justify-center backdrop-blur-md shadow-2xl">
                <div className="text-7xl md:text-8xl mb-6 animate-bounce">🎉</div>
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-3">C'est un Match !</h3>
                <p className="text-white/90 text-base md:text-xl">Tout le monde aime ce film</p>
              </div>
            )}

            <Card
              className={`overflow-hidden border-2 transition-all duration-300 ${
                direction === "left"
                  ? "-translate-x-[120%] opacity-0 rotate-[-15deg]"
                  : direction === "right"
                  ? "translate-x-[120%] opacity-0 rotate-[15deg]"
                  : "translate-x-0 opacity-100 rotate-0"
              }`}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[2/3] max-w-md mx-auto">
                  <Image
                    src={currentMovie.poster}
                    alt={currentMovie.title}
                    fill
                    className="object-cover"
                    sizes="500px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary/90 backdrop-blur-sm border-primary/20 border-2 text-lg px-3 py-1">
                        <Star className="w-4 h-4 mr-1.5 fill-yellow-400 text-yellow-400" />
                        {currentMovie.rating}
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                      <h3 className="text-3xl font-bold text-white">{currentMovie.title}</h3>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-sm">
                          {currentMovie.year}
                        </Badge>
                        <Badge variant="secondary" className="text-sm">
                          {currentMovie.genre}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div className="flex justify-center items-center gap-6 md:gap-10" variants={fadeInUp}>
            <Button
              size="lg"
              variant="outline"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-600 hover:scale-110 transition-all shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={() => handleSwipe(false)}
              disabled={!!direction}
              aria-label="Passer ce film"
            >
              <X className="w-8 h-8 md:w-10 md:h-10" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-600 hover:scale-110 transition-all shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={() => handleSwipe(true)}
              disabled={!!direction}
              aria-label="Aimer ce film"
            >
              <Heart className="w-8 h-8 md:w-10 md:h-10" />
            </Button>
          </motion.div>

          {/* Info Card */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-dashed border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2 flex-1">
                  <p className="text-sm md:text-base font-bold text-foreground">
                    Astuce : Swipez à droite 2 fois pour voir une animation de match !
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    Quand plusieurs personnes aiment le même film, c'est un match et vous pouvez le regarder ensemble.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {/* Reset Button */}
          <motion.div className="flex justify-center" variants={fadeInUp}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2 border-2 hover:border-primary/50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Recommencer la démo
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
