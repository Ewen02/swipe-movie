import { useEffect, useState } from "react"
import { Film } from "lucide-react"
import { Section } from "./Section"
import { getBatchMovieDetails } from "@/lib/api/movies"
import type { TopMatchesData } from "@/lib/api/admin"

interface TopMatchedMoviesProps {
  topMatches: TopMatchesData | undefined
  isLoading: boolean
}

interface MovieInfo {
  title: string
  posterUrl: string
}

const RANK_STYLES = [
  "bg-amber-500/30 text-amber-400 border border-amber-500/40",
  "bg-gray-400/30 text-gray-300 border border-gray-400/40",
  "bg-orange-500/30 text-orange-400 border border-orange-500/40",
]

const DEFAULT_RANK_STYLE = "bg-muted/50 text-muted-foreground"

export function TopMatchedMovies({ topMatches, isLoading }: TopMatchedMoviesProps) {
  const [movieDetails, setMovieDetails] = useState<Record<string, MovieInfo>>({})

  useEffect(() => {
    if (!topMatches?.movies.length) return

    const movieIds = topMatches.movies.map((m) => parseInt(m.movieId)).filter((id) => !isNaN(id))
    if (movieIds.length === 0) return

    getBatchMovieDetails(movieIds)
      .then((details) => {
        const map: Record<string, MovieInfo> = {}
        for (const d of details) {
          map[d.id.toString()] = { title: d.title, posterUrl: d.posterUrl }
        }
        setMovieDetails(map)
      })
      .catch(() => {})
  }, [topMatches])

  return (
    <Section
      title="Top Films Matches"
      loading={isLoading}
      action={<Film className="w-4 h-4 text-muted-foreground" />}
    >
      {topMatches && topMatches.movies.length > 0 ? (
        <div className="space-y-2">
          {topMatches.movies.map((movie, i) => {
            const info = movieDetails[movie.movieId]
            return (
              <div key={movie.movieId} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    RANK_STYLES[i] || DEFAULT_RANK_STYLE
                  }`}
                >
                  {i + 1}
                </span>
                {info?.posterUrl ? (
                  <img
                    src={info.posterUrl}
                    alt={info.title}
                    className="w-8 h-12 rounded object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8 h-12 rounded bg-muted/40 shrink-0 flex items-center justify-center">
                    <Film className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {info?.title || `Film #${movie.movieId}`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {movie.matchCount} match{movie.matchCount > 1 ? "es" : ""}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">Pas encore de matches</p>
      )}
    </Section>
  )
}
