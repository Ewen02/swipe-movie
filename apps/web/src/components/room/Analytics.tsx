"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getRoomAnalytics } from "@/lib/api/swipes"
import { getBatchMovieDetails } from "@/lib/api/movies"
import { TrendingUp, ThumbsUp, ThumbsDown, Trophy, Activity, Users, Film, RefreshCw } from "lucide-react"
import Image from "next/image"
import type { MovieBasic } from "@/schemas/movies"
import { AnalyticsSkeleton } from "./AnalyticsSkeleton"

interface AnalyticsProps {
  roomId: string
  mediaType?: "movie" | "tv"
}

interface RoomAnalytics {
  overview: {
    totalSwipes: number
    totalLikes: number
    totalDislikes: number
    totalMatches: number
    likePercentage: number
    matchRate: number
  }
  memberActivity: Array<{
    userId: string
    userName: string | null
    totalSwipes: number
    likes: number
    dislikes: number
    likePercentage: number
  }>
  mostLiked: Array<{ movieId: string; likes: number }>
  mostDisliked: Array<{ movieId: string; dislikes: number }>
  dailyActivity: Array<{
    date: string
    swipes: number
    likes: number
    dislikes: number
  }>
}

export function Analytics({ roomId, mediaType = "movie" }: AnalyticsProps) {
  const [analytics, setAnalytics] = useState<RoomAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [likedMovies, setLikedMovies] = useState<MovieBasic[]>([])
  const [dislikedMovies, setDislikedMovies] = useState<MovieBasic[]>([])

  useEffect(() => {
    loadAnalytics()
  }, [roomId])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await getRoomAnalytics(roomId)
      setAnalytics(data)

      // Load movie details for most liked/disliked
      if (data.mostLiked.length > 0) {
        const likedIds = data.mostLiked.map((m: { movieId: string; likes: number }) => parseInt(m.movieId))
        const liked = await getBatchMovieDetails(likedIds)
        setLikedMovies(liked)
      }

      if (data.mostDisliked.length > 0) {
        const dislikedIds = data.mostDisliked.map((m: { movieId: string; dislikes: number }) => parseInt(m.movieId))
        const disliked = await getBatchMovieDetails(dislikedIds)
        setDislikedMovies(disliked)
      }
    } catch (err) {
      console.error("Failed to load analytics:", err)
      setError(err instanceof Error ? err.message : "Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <AnalyticsSkeleton />
  }

  if (error || !analytics) {
    return (
      <div className="text-center py-20">
        <Film className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-red-500 mb-4">{error || "Impossible de charger les statistiques"}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={loadAnalytics}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Swipes</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalSwipes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.overview.totalLikes} likes · {analytics.overview.totalDislikes} dislikes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux de Like</CardTitle>
            <ThumbsUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.likePercentage}%</div>
            <Progress value={analytics.overview.likePercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Matches</CardTitle>
            <Trophy className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalMatches}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Taux de match: {analytics.overview.matchRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Member Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Activité des membres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.memberActivity.map((member) => (
              <div key={member.userId} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{member.userName || "Utilisateur inconnu"}</span>
                    <span className="text-sm text-muted-foreground">
                      {member.totalSwipes} swipes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={member.likePercentage} className="flex-1" />
                    <span className="text-sm text-muted-foreground">
                      {member.likePercentage}% likes
                    </span>
                  </div>
                  <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{member.likes} 👍</span>
                    <span>{member.dislikes} 👎</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Most Liked Movies */}
      {likedMovies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-green-500" />
              Films les plus likés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {analytics.mostLiked.map((stat, idx) => {
                const movie = likedMovies.find((m) => m.id.toString() === stat.movieId)
                if (!movie) return null

                return (
                  <div key={stat.movieId} className="relative group">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                      <Image
                        src={movie.posterUrl || movie.backdropUrl}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-500 text-white">
                          {stat.likes} ❤️
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-medium line-clamp-1">{movie.title}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Most Disliked Movies */}
      {dislikedMovies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsDown className="w-5 h-5 text-red-500" />
              Films les plus rejetés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {analytics.mostDisliked.map((stat) => {
                const movie = dislikedMovies.find((m) => m.id.toString() === stat.movieId)
                if (!movie) return null

                return (
                  <div key={stat.movieId} className="relative group">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden opacity-60">
                      <Image
                        src={movie.posterUrl || movie.backdropUrl}
                        alt={movie.title}
                        fill
                        className="object-cover grayscale"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="destructive">
                          {stat.dislikes} 👎
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-medium line-clamp-1 text-muted-foreground">
                      {movie.title}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Activity (Last 7 days) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Activité des 7 derniers jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.dailyActivity.map((day) => {
              const maxSwipes = Math.max(...analytics.dailyActivity.map((d) => d.swipes))
              const percentage = maxSwipes > 0 ? (day.swipes / maxSwipes) * 100 : 0

              return (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-muted-foreground">
                    {new Date(day.date).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Progress value={percentage} className="flex-1" />
                      <span className="text-sm font-medium w-12 text-right">
                        {day.swipes}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>{day.likes} 👍</span>
                      <span>{day.dislikes} 👎</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
