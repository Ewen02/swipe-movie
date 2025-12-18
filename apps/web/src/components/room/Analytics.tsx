"use client"

import { useEffect, useState } from "react"
import { Button } from "@swipe-movie/ui"
import { getRoomAnalytics } from "@/lib/api/swipes"
import { getBatchMovieDetails } from "@/lib/api/movies"
import { TrendingUp, ThumbsUp, ThumbsDown, Trophy, Activity, Users, Film, RefreshCw, BarChart3 } from "lucide-react"
import Image from "next/image"
import type { MovieBasic } from "@/schemas/movies"
import { AnalyticsSkeleton } from "./AnalyticsSkeleton"
import { cn } from "@/lib/utils"

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative group">
          <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Swipes</p>
                <p className="text-2xl font-bold">{analytics.overview.totalSwipes}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {analytics.overview.totalLikes} likes · {analytics.overview.totalDislikes} pass
            </p>
          </div>
        </div>

        <div className="relative group">
          <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Taux de Like</p>
                <p className="text-2xl font-bold text-green-400">{analytics.overview.likePercentage}%</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <ThumbsUp className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <div className="mt-2 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                style={{ width: `${analytics.overview.likePercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Matches</p>
                <p className="text-2xl font-bold text-amber-400">{analytics.overview.totalMatches}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Taux: {analytics.overview.matchRate}%
            </p>
          </div>
        </div>

        <div className="relative group">
          <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Membres actifs</p>
                <p className="text-2xl font-bold text-purple-400">{analytics.memberActivity.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              dans cette room
            </p>
          </div>
        </div>
      </div>

      {/* Member Activity */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <div className="p-5">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Activité des membres
            </h3>

            <div className="space-y-3">
              {analytics.memberActivity.map((member, idx) => (
                <div
                  key={member.userId}
                  className="relative bg-foreground/5 hover:bg-foreground/10 rounded-xl p-4 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar placeholder */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-sm font-medium">
                      {(member.userName || "U")[0].toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium truncate">{member.userName || "Utilisateur inconnu"}</span>
                        <span className="text-sm text-muted-foreground shrink-0 ml-2">
                          {member.totalSwipes} swipes
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                          style={{ width: `${member.likePercentage}%` }}
                        />
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-green-400" />
                          {member.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsDown className="w-3 h-3 text-red-400" />
                          {member.dislikes}
                        </span>
                        <span className="text-green-400 font-medium ml-auto">
                          {member.likePercentage}% likes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Most Liked Movies */}
      {likedMovies.length > 0 && (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-green-400" />
                Films les plus likés
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {analytics.mostLiked.map((stat, idx) => {
                  const movie = likedMovies.find((m) => m.id.toString() === stat.movieId)
                  if (!movie) return null

                  return (
                    <div key={stat.movieId} className="group/card">
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-foreground/5">
                        <Image
                          src={movie.posterUrl || movie.backdropUrl}
                          alt={movie.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Likes badge */}
                        <div className="absolute top-2 right-2">
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/90 text-white text-xs font-medium">
                            <ThumbsUp className="w-3 h-3" />
                            {stat.likes}
                          </div>
                        </div>

                        {/* Bottom info */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h4 className="font-semibold text-sm text-white line-clamp-2">{movie.title}</h4>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Most Disliked Movies */}
      {dislikedMovies.length > 0 && (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500" />
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ThumbsDown className="w-5 h-5 text-red-400" />
                Films les plus rejetés
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {analytics.mostDisliked.map((stat) => {
                  const movie = dislikedMovies.find((m) => m.id.toString() === stat.movieId)
                  if (!movie) return null

                  return (
                    <div key={stat.movieId} className="group/card">
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-foreground/5 opacity-70 hover:opacity-100 transition-opacity">
                        <Image
                          src={movie.posterUrl || movie.backdropUrl}
                          alt={movie.title}
                          fill
                          className="object-cover grayscale transition-transform duration-300 group-hover/card:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Dislikes badge */}
                        <div className="absolute top-2 right-2">
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/90 text-white text-xs font-medium">
                            <ThumbsDown className="w-3 h-3" />
                            {stat.dislikes}
                          </div>
                        </div>

                        {/* Bottom info */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h4 className="font-semibold text-sm text-white/80 line-clamp-2">{movie.title}</h4>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Activity (Last 7 days) */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <div className="p-5">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Activité des 7 derniers jours
            </h3>

            <div className="space-y-3">
              {analytics.dailyActivity.map((day) => {
                const maxSwipes = Math.max(...analytics.dailyActivity.map((d) => d.swipes))
                const percentage = maxSwipes > 0 ? (day.swipes / maxSwipes) * 100 : 0

                return (
                  <div
                    key={day.date}
                    className="flex items-center gap-4 bg-foreground/5 hover:bg-foreground/10 rounded-xl p-3 transition-colors"
                  >
                    <div className="w-20 text-sm text-muted-foreground shrink-0">
                      {new Date(day.date).toLocaleDateString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                      })}
                    </div>

                    <div className="flex-1">
                      <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs shrink-0">
                      <span className="font-medium text-foreground">{day.swipes}</span>
                      <span className="flex items-center gap-1 text-green-400">
                        <ThumbsUp className="w-3 h-3" />
                        {day.likes}
                      </span>
                      <span className="flex items-center gap-1 text-red-400">
                        <ThumbsDown className="w-3 h-3" />
                        {day.dislikes}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
