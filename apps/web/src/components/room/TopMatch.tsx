"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Trophy, Users } from "lucide-react"
import { Match } from "@/schemas/swipes"
import { MovieBasic } from "@/schemas/movies"

interface TopMatchProps {
  match: Match
  movie: MovieBasic
  totalMembers: number
}

export function TopMatch({ match, movie, totalMembers }: TopMatchProps) {
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
              <img
                src={movie.backdropUrl || movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
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
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(movie.releaseDate).getFullYear()}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Agreement Percentage */}
                <Badge
                  variant="outline"
                  className="text-lg px-4 py-2 border-2 border-green-500 text-green-700 dark:text-green-400 font-bold"
                >
                  <Users className="w-5 h-5 mr-2" />
                  {agreementPercentage}% d&apos;accord
                </Badge>

                {/* TMDb Rating */}
                <Badge
                  variant="outline"
                  className="text-lg px-4 py-2 border-2 border-yellow-500 text-yellow-700 dark:text-yellow-400 font-bold"
                >
                  <Star className="w-5 h-5 mr-2 fill-yellow-500" />
                  {movie.voteAverage.toFixed(1)}/10
                </Badge>

                {/* Vote Count */}
                <Badge
                  variant="outline"
                  className="text-lg px-4 py-2 border-2 border-blue-500 text-blue-700 dark:text-blue-400"
                >
                  {match.voteCount} vote{match.voteCount > 1 ? "s" : ""}
                </Badge>
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
