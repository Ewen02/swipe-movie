"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"
import { Match } from "@/schemas/swipes"
import { MovieBasic } from "@/schemas/movies"
import { RoomWithMembersResponseDto } from "@/schemas/rooms"
import { RatingBadge, VoteCountBadge, AgreementBadge, ReleaseDateBadge, ProviderList } from "@/components/ui/movie"

interface TopMatchProps {
  match: Match
  movie: MovieBasic
  totalMembers: number
  roomFilters?: RoomWithMembersResponseDto
}

export function TopMatch({ match, movie, totalMembers, roomFilters }: TopMatchProps) {
  const agreementPercentage = Math.round((match.voteCount / totalMembers) * 100)

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          TOP MATCH
        </h3>
      </div>

      <Card className="border-2 border-yellow-500 shadow-xl overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Movie Poster */}
            <div className="relative aspect-[2/3] md:aspect-auto">
              <Image
                src={movie.backdropUrl || movie.posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-yellow-500 text-white font-bold text-sm px-3 py-1">
                  <Trophy className="w-4 h-4 mr-1" />
                  #1
                </Badge>
              </div>
            </div>

            {/* Movie Details */}
            <div className="p-6 space-y-4 flex flex-col justify-center">
              <div>
                <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {movie.title}
                </h4>
                {movie.releaseDate && (
                  <ReleaseDateBadge releaseDate={movie.releaseDate} variant="info" />
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Agreement Percentage */}
                <AgreementBadge
                  voteCount={match.voteCount}
                  totalMembers={totalMembers}
                  variant="large"
                />

                {/* TMDb Rating */}
                <RatingBadge rating={movie.voteAverage} variant="topMatch" />

                {/* Vote Count */}
                <VoteCountBadge voteCount={match.voteCount} variant="large" />

                {/* Watch Providers */}
                {roomFilters?.watchProviders && roomFilters.watchProviders.length > 0 && (
                  <ProviderList
                    providerIds={roomFilters.watchProviders}
                    variant="topMatch"
                    showNames={true}
                  />
                )}
              </div>

              {movie.overview && (
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-4">
                  {movie.overview}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
