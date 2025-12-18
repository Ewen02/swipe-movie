"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button, FortuneWheel, type FortuneWheelItem } from "@swipe-movie/ui"
import { RefreshCw } from "lucide-react"
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

      // Calculate ranking score for each match and filter out matches without valid movie data
      const matchesWithMovies = matchesData
        .map((match) => {
          const movie = movieMap.get(match.movieId)

          if (!movie) {
            return null // Will be filtered out
          }

          // Calculate ranking score:
          // - 70% weight: vote count (agreement percentage)
          // - 30% weight: TMDb rating
          const agreementScore = (match.voteCount / totalMembers) * 70
          const ratingScore = (movie.voteAverage / 10) * 30
          const rankingScore = agreementScore + ratingScore

          return { ...match, movie, rankingScore }
        })
        .filter((match): match is NonNullable<typeof match> => match !== null)

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
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={loadMatches}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </Button>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border-2 border-dashed border-border rounded-3xl">
          <div className="text-center py-16 px-6">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold mb-2">
              Aucun match pour le moment
            </h3>
            <p className="text-muted-foreground">
              Continuez à swiper pour trouver un film que tout le monde aime !
            </p>
          </div>
        </div>
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

        {/* Fortune Wheel for all matches */}
        {matches.length >= 2 && (
          <div className="flex justify-center">
            <FortuneWheel
              items={matches
                .filter((m): m is MatchWithMovie & { movie: MovieBasic } => !!m.movie)
                .map((m): FortuneWheelItem => ({
                  id: m.id,
                  label: m.movie.title,
                  imageUrl: m.movie.posterUrl,
                }))}
              onSpinEnd={(item) => {
                const match = matches.find((m) => m.id === item.id)
                if (match?.movie) {
                  handleShowDetails(match.movie.id)
                }
              }}
              translations={{
                triggerButton: "Laisser le hasard choisir",
                title: "Roue du destin",
                spinButton: "Faire tourner !",
                spinningText: "La roue tourne...",
                resultTitle: "Le destin a choisi !",
                resultSubtitle: "Bon visionnage !",
              }}
            />
          </div>
        )}

        {/* Other Matches Section */}
      {otherMatches.length > 0 && (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
            <div className="p-5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 text-sm">
                  {otherMatches.length}
                </span>
                Autres Matches
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {otherMatches.map((match) => (
                  <div
                    key={match.id}
                    className="group/card cursor-pointer"
                    onClick={() => match.movie && handleShowDetails(match.movie.id)}
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-foreground/5">
                      <Image
                        src={match.movie!.posterUrl || match.movie!.backdropUrl}
                        alt={match.movie!.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        loading="lazy"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

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

                      {/* Bottom info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h4 className="font-semibold text-sm text-white line-clamp-2 mb-1">
                          {match.movie!.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <RatingBadge rating={match.movie!.voteAverage} variant="match" />
                          <VoteCountBadge
                            voteCount={match.voteCount}
                            totalMembers={totalMembers}
                            showPercentage={true}
                            variant="inline"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}
