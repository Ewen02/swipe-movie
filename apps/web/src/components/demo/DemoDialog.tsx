"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, X, Star, Users, Sparkles } from "lucide-react"
import Image from "next/image"

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
    poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
  },
  {
    id: 2,
    title: "The Grand Budapest Hotel",
    year: "2014",
    genre: "Comédie",
    rating: 8.1,
    poster: "https://image.tmdb.org/t/p/w500/nX5XotM9yprCKarRH4fzOq1VM1J.jpg",
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Démo Interactive
          </DialogTitle>
          <DialogDescription>
            Découvrez comment Swipe Movie fonctionne ! Swipez à droite pour aimer, à gauche pour passer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Membres</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{swipedRight}</p>
                <p className="text-xs text-muted-foreground">J'aime</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <X className="w-6 h-6 mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold">{swipedLeft}</p>
                <p className="text-xs text-muted-foreground">Pas intéressé</p>
              </CardContent>
            </Card>
          </div>

          {/* Movie Card */}
          <div className="relative">
            {showMatch && (
              <div className="absolute inset-0 z-50 bg-black/80 rounded-2xl flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold text-white mb-2">C'est un Match !</h3>
                <p className="text-white/80">Tout le monde aime ce film</p>
              </div>
            )}

            <Card
              className={`overflow-hidden transition-all duration-300 ${
                direction === "left" ? "-translate-x-[120%] opacity-0" :
                direction === "right" ? "translate-x-[120%] opacity-0" :
                "translate-x-0 opacity-100"
              }`}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[2/3] max-w-sm mx-auto">
                  <Image
                    src={currentMovie.poster}
                    alt={currentMovie.title}
                    fill
                    className="object-cover rounded-t-lg"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary">
                        <Star className="w-3 h-3 mr-1" />
                        {currentMovie.rating}
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{currentMovie.title}</h3>
                      <div className="flex gap-2 text-sm">
                        <Badge variant="secondary">{currentMovie.year}</Badge>
                        <Badge variant="secondary">{currentMovie.genre}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6">
            <Button
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full border-2 border-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => handleSwipe(false)}
              disabled={!!direction}
            >
              <X className="w-8 h-8" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-16 h-16 rounded-full border-2 border-green-500 hover:bg-green-500 hover:text-white"
              onClick={() => handleSwipe(true)}
              disabled={!!direction}
            >
              <Heart className="w-8 h-8" />
            </Button>
          </div>

          {/* Reset Button */}
          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Recommencer la démo
            </Button>
          </div>

          {/* Instructions */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                💡 <strong>Astuce</strong> : Swipez à droite 2 fois pour voir une animation de match !
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
