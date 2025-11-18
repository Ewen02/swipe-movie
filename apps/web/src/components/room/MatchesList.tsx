"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { Match } from "@/schemas/swipes"
import { MovieBasic } from "@/schemas/movies"
import { RoomWithMembersResponseDto } from "@/schemas/rooms"
import { getMatchesByRoom } from "@/lib/api/swipes"
import { getBatchMovieDetails } from "@/lib/api/movies"
import { RatingBadge, VoteCountBadge, ProviderList } from "@/components/ui/movie"
import { TopMatch } from "./TopMatch"
import { MovieDetailsModal } from "@/components/movies/MovieDetailsModal"
import { MatchesListSkeleton } from "./MatchesListSkeleton"

interface MatchesListProps {
  roomId: string
  totalMembers?: number
  refreshTrigger?: number
  roomFilters?: RoomWithMembersResponseDto
}

interface MatchWithMovie extends Match {
  movie?: MovieBasic
  rankingScore?: number
}

export function MatchesList({ roomId, totalMembers = 2, refreshTrigger, roomFilters }: MatchesListProps) {
  const [matches, setMatches] = useState<MatchWithMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [showMovieDetails, setShowMovieDetails] = useState(false)

  useEffect(() => {
    loadMatches()
  }, [roomId, refreshTrigger])

  const loadMatches = async () => {
    try {
      setLoading(true)
      const matchesData = await getMatchesByRoom(roomId)

      // Batch load movie details for all matches
      const movieIds = matchesData.map((match) => parseInt(match.movieId))
      const movies = await getBatchMovieDetails(movieIds)

      // Create a map of movieId -> movie for quick lookup
      const movieMap = new Map(movies.map((movie) => [movie.id.toString(), movie]))

      // Calculate ranking score for each match
      const matchesWithMovies = matchesData.map((match) => {
        const movie = movieMap.get(match.movieId)

        if (!movie) {
          return { ...match, rankingScore: 0 }
        }

        // Calculate ranking score:
        // - 70% weight: vote count (agreement percentage)
        // - 30% weight: TMDb rating
        const agreementScore = (match.voteCount / totalMembers) * 70
        const ratingScore = (movie.voteAverage / 10) * 30
        const rankingScore = agreementScore + ratingScore

        return { ...match, movie, rankingScore }
      })

      // Sort by ranking score (highest first)
      matchesWithMovies.sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0))

      setMatches(matchesWithMovies)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load matches")
    } finally {
      setLoading(false)
    }
  }

  const handleShowDetails = (movieId: number) => {
    setSelectedMovieId(movieId)
    setShowMovieDetails(true)
  }

  if (loading) {
    return <MatchesListSkeleton />
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
    <>
      {/* Movie Details Modal */}
      <MovieDetailsModal
        movieId={selectedMovieId}
        mediaType={roomFilters?.type as "movie" | "tv" | undefined}
        open={showMovieDetails}
        onOpenChange={setShowMovieDetails}
      />

      <div className="space-y-6">
        {/* Top Match Section */}
        {topMatch && topMatch.movie && (
          <TopMatch
            match={topMatch}
            movie={topMatch.movie}
            totalMembers={totalMembers}
            roomFilters={roomFilters}
            onShowDetails={() => handleShowDetails(topMatch.movie!.id)}
          />
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
                onClick={() => match.movie && handleShowDetails(match.movie.id)}
              >
                <CardContent className="p-0">
                  {match.movie ? (
                    <>
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={match.movie.posterUrl || match.movie.backdropUrl}
                          alt={match.movie.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                        <VoteCountBadge voteCount={match.voteCount} variant="absolute" />

                        {/* Watch Providers */}
                        {roomFilters?.watchProviders && roomFilters.watchProviders.length > 0 && (
                          <ProviderList
                            providerIds={roomFilters.watchProviders}
                            variant="match"
                            maxVisible={2}
                            showNames={false}
                          />
                        )}
                      </div>
                      <div className="p-3 space-y-1">
                        <h4 className="font-semibold text-sm line-clamp-2 text-gray-900 dark:text-white">
                          {match.movie.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs">
                          <RatingBadge rating={match.movie.voteAverage} variant="match" />
                          <VoteCountBadge
                            voteCount={match.voteCount}
                            totalMembers={totalMembers}
                            showPercentage={true}
                            variant="inline"
                          />
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
    </>
  )
}
