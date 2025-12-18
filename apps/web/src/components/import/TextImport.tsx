"use client"

import { useState } from "react"
import { Button, Badge } from "@swipe-movie/ui"
import { FileText, Loader2, Check, X, Search, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { GET } from "@/lib/api"
import { saveOnboardingSwipes, type OnboardingSwipe } from "@/lib/api/users"
import Image from "next/image"

interface SearchResult {
  id: number
  title: string
  releaseDate: string | null
  posterPath: string | null
  mediaType: string
}

interface ImportedMovie {
  query: string
  result: SearchResult | null
  status: "pending" | "found" | "not_found" | "imported"
}

export function TextImport() {
  const [text, setText] = useState("")
  const [importing, setImporting] = useState(false)
  const [searching, setSearching] = useState(false)
  const [movies, setMovies] = useState<ImportedMovie[]>([])
  const [step, setStep] = useState<"input" | "review" | "done">("input")

  const parseMovieList = (input: string): string[] => {
    // Split by newlines and filter empty lines
    return input
      .split(/[\n,;]/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  }

  const searchMovie = async (query: string): Promise<SearchResult | null> => {
    try {
      const response = await GET(
        `/movies/search?query=${encodeURIComponent(query)}&type=movie`
      )
      if (!response.ok) return null

      const data = await response.json()
      if (data && data.length > 0) {
        const movie = data[0]
        return {
          id: movie.id,
          title: movie.title,
          releaseDate: movie.releaseDate,
          posterPath: movie.posterUrl || null,
          mediaType: "movie",
        }
      }
      return null
    } catch (error) {
      console.error("Search failed:", error)
      return null
    }
  }

  const handleSearch = async () => {
    const queries = parseMovieList(text)
    if (queries.length === 0) return

    setSearching(true)
    setMovies(queries.map((q) => ({ query: q, result: null, status: "pending" })))
    setStep("review")

    // Search movies one by one
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i]
      const result = await searchMovie(query)

      setMovies((prev) => {
        const updated = [...prev]
        updated[i] = {
          query,
          result,
          status: result ? "found" : "not_found",
        }
        return updated
      })
    }

    setSearching(false)
  }

  const handleRemove = (index: number) => {
    setMovies((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImport = async () => {
    const moviesToImport = movies.filter(
      (m) => m.status === "found" && m.result
    )
    if (moviesToImport.length === 0) return

    setImporting(true)

    try {
      const swipes: OnboardingSwipe[] = moviesToImport.map((m) => ({
        tmdbId: m.result!.id.toString(),
        mediaType: m.result!.mediaType,
        liked: true, // Will be saved as "watchlist" status via backend
        source: "manual",
      }))

      await saveOnboardingSwipes(swipes)

      // Mark all as imported
      setMovies((prev) =>
        prev.map((m) =>
          m.status === "found" ? { ...m, status: "imported" as const } : m
        )
      )
      setStep("done")
    } catch (error) {
      console.error("Import failed:", error)
    } finally {
      setImporting(false)
    }
  }

  const handleReset = () => {
    setText("")
    setMovies([])
    setStep("input")
  }

  const foundCount = movies.filter((m) => m.status === "found").length
  const notFoundCount = movies.filter((m) => m.status === "not_found").length
  const importedCount = movies.filter((m) => m.status === "imported").length

  return (
    <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl overflow-hidden">
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Import texte</h3>
            <p className="text-sm text-muted-foreground">
              Collez une liste de films (un par ligne)
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="The Matrix&#10;Inception&#10;Interstellar&#10;..."
                className="w-full h-40 p-4 rounded-xl bg-foreground/5 border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-muted-foreground">
                  {parseMovieList(text).length} film(s) detecte(s)
                </span>
                <Button
                  onClick={handleSearch}
                  disabled={parseMovieList(text).length === 0 || searching}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90"
                >
                  {searching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Recherche...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Rechercher
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                  {foundCount} trouves
                </Badge>
                {notFoundCount > 0 && (
                  <Badge variant="secondary" className="bg-red-500/20 text-red-500">
                    {notFoundCount} non trouves
                  </Badge>
                )}
                {searching && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Recherche en cours...
                  </Badge>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {movies.map((movie, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      movie.status === "found"
                        ? "bg-green-500/10 border border-green-500/20"
                        : movie.status === "not_found"
                        ? "bg-red-500/10 border border-red-500/20"
                        : "bg-foreground/5 border border-border"
                    }`}
                  >
                    {movie.status === "pending" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : movie.status === "found" ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}

                    {movie.result?.posterPath ? (
                      <div className="relative w-8 h-12 rounded overflow-hidden shrink-0">
                        <Image
                          src={movie.result.posterPath}
                          alt={movie.result.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-12 rounded bg-foreground/10 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {movie.result?.title || movie.query}
                      </p>
                      {movie.result?.releaseDate && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(movie.result.releaseDate).getFullYear()}
                        </p>
                      )}
                      {movie.status === "not_found" && (
                        <p className="text-xs text-red-400">
                          "{movie.query}" non trouve
                        </p>
                      )}
                    </div>

                    {movie.status === "found" && (
                      <button
                        onClick={() => handleRemove(index)}
                        className="p-1 hover:bg-foreground/10 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <Button variant="ghost" onClick={handleReset}>
                  Annuler
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={foundCount === 0 || importing || searching}
                  className="bg-gradient-to-r from-violet-500 to-purple-600 hover:opacity-90"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Import...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Importer {foundCount} film(s)
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Import reussi !</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {importedCount} film(s) ont ete ajoutes a votre bibliotheque
              </p>
              <Button variant="outline" onClick={handleReset}>
                Importer d'autres films
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
