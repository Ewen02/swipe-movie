"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ExternalLink, Users } from "lucide-react"
import { Match } from "@/schemas/swipes"
import { MovieBasic } from "@/schemas/movies"
import { getMatchesByRoom } from "@/lib/api/swipes"
import { getMovieDetails } from "@/lib/api/movies"
import { TopMatch } from "./TopMatch"

interface MatchesListProps {
  roomId: string
  totalMembers?: number
  refreshTrigger?: number
}

interface MatchWithMovie extends Match {
  movie?: MovieBasic
  rankingScore?: number
}

export function MatchesList({ roomId, totalMembers = 2, refreshTrigger }: MatchesListProps) {
  const [matches, setMatches] = useState<MatchWithMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMatches()
  }, [roomId, refreshTrigger])

  const loadMatches = async () => {
    try {
      setLoading(true)
      const matchesData = await getMatchesByRoom(roomId)

      // Load movie details for each match and calculate ranking score
      const matchesWithMovies = await Promise.all(
        matchesData.map(async (match) => {
          try {
            const movie = await getMovieDetails(parseInt(match.movieId))

            // Calculate ranking score:
            // - 70% weight: vote count (agreement percentage)
            // - 30% weight: TMDb rating
            const agreementScore = (match.voteCount / totalMembers) * 70
            const ratingScore = (movie.voteAverage / 10) * 30
            const rankingScore = agreementScore + ratingScore

            return { ...match, movie, rankingScore }
          } catch (err) {
            console.error(`Failed to load movie ${match.movieId}:`, err)
            return { ...match, rankingScore: 0 }
          }
        })
      )

      // Sort by ranking score (highest first)
      matchesWithMovies.sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0))

      setMatches(matchesWithMovies)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load matches")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Matches 🎉
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-[2/3] bg-gray-300 dark:bg-gray-700 rounded-t-lg" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="text-5xl mb-4">🎬</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Aucun match pour le moment
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Continuez à swiper pour trouver un film que tout le monde aime !
        </p>
      </div>
    )
  }

  const topMatch = matches[0]
  const otherMatches = matches.slice(1)

  return (
    <div className="space-y-6">
      {/* Top Match Section */}
      {topMatch && topMatch.movie && (
        <TopMatch match={topMatch} movie={topMatch.movie} totalMembers={totalMembers} />
      )}

      {/* Other Matches Section */}
      {otherMatches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Autres Matches ({otherMatches.length})
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {otherMatches.map((match) => (
              <Card
                key={match.id}
                className="group hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              >
                <CardContent className="p-0">
                  {match.movie ? (
                    <>
                      <div className="relative aspect-[2/3]">
                        <img
                          src={match.movie.posterUrl || match.movie.backdropUrl}
                          alt={match.movie.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-2 right-2">
                            <Badge className="bg-green-500 text-white">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              TMDb
                            </Badge>
                          </div>
                        </div>
                        {/* Vote count badge */}
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-blue-500 text-white text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {match.voteCount}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        <h4 className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white">
                          {match.movie.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span>{match.movie.voteAverage.toFixed(1)}</span>
                          </div>
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {Math.round((match.voteCount / totalMembers) * 100)}%
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Film #{match.movieId}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
