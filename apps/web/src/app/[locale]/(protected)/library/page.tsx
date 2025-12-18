"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Library, Film } from "lucide-react"
import { Button } from "@swipe-movie/ui"
import { LibraryFilters } from "@/components/library/LibraryFilters"
import { LibraryCard } from "@/components/library/LibraryCard"
import { MovieDetailsModal } from "@/components/movies/MovieDetailsModal"
import { Footer } from "@/components/layout/Footer"
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { useUserLibrary } from "@/hooks/useUserLibrary"
import { getBatchMovieDetails } from "@/lib/api/movies"
import type { MovieBasic } from "@/schemas/movies"
import { LibraryPageSkeleton } from "./LibraryPageSkeleton"

export default function LibraryPage() {
  const {
    items,
    total,
    page,
    totalPages,
    isLoading,
    filters,
    setStatus,
    setSource,
    setPage,
    updateStatus,
    deleteItem,
  } = useUserLibrary()

  const [movies, setMovies] = useState<Map<string, MovieBasic>>(new Map())
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [showMovieDetails, setShowMovieDetails] = useState(false)

  // Load movie details when items change
  useEffect(() => {
    async function loadMovieDetails() {
      if (items.length === 0) return

      const tmdbIds = items.map((item) => parseInt(item.tmdbId)).filter((id) => !isNaN(id))
      if (tmdbIds.length === 0) return

      try {
        const movieDetails = await getBatchMovieDetails(tmdbIds)
        const movieMap = new Map<string, MovieBasic>()
        movieDetails.forEach((movie) => {
          movieMap.set(movie.id.toString(), movie)
        })
        setMovies(movieMap)
      } catch (error) {
        console.error("Failed to load movie details:", error)
      }
    }

    loadMovieDetails()
  }, [items])

  const handleShowDetails = (movieId: number) => {
    setSelectedMovieId(movieId)
    setShowMovieDetails(true)
  }

  const handleStatusChange = async (itemId: string, status: string) => {
    try {
      await updateStatus(itemId, status)
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const handleDelete = async (itemId: string) => {
    try {
      await deleteItem(itemId)
    } catch (error) {
      console.error("Failed to delete item:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col">
      {/* Background orbs */}
      <BackgroundOrbs />

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movieId={selectedMovieId}
        open={showMovieDetails}
        onOpenChange={setShowMovieDetails}
      />

      <div className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div className="mb-8" variants={fadeInUp}>
            <Link href="/rooms">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2 hover:bg-foreground/5">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux rooms
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <Library className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Ma Bibliotheque</h1>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {total} films
              </span>
            </div>
            <p className="text-muted-foreground">
              Tous les films que vous avez importes ou aimes
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="mb-8 p-4 rounded-2xl border border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl"
            variants={fadeInUp}
          >
            <LibraryFilters
              status={filters.status}
              source={filters.source}
              onStatusChange={setStatus}
              onSourceChange={setSource}
            />
          </motion.div>

          {/* Content */}
          {isLoading && items.length === 0 ? (
            <LibraryPageSkeleton />
          ) : items.length === 0 ? (
            <motion.div
              className="text-center py-16"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Film className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aucun film</h3>
              <p className="text-muted-foreground mb-4">
                {filters.status || filters.source
                  ? "Aucun film ne correspond a ces filtres"
                  : "Importez des films via Trakt, AniList ou l'import texte"}
              </p>
              <Link href="/connections">
                <Button>Importer des films</Button>
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <LibraryCard
                      item={item}
                      movie={movies.get(item.tmdbId)}
                      onStatusChange={(status) => handleStatusChange(item.id, status)}
                      onDelete={() => handleDelete(item.id)}
                      onClick={() => {
                        const movieId = parseInt(item.tmdbId)
                        if (!isNaN(movieId)) {
                          handleShowDetails(movieId)
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  className="flex justify-center items-center gap-4 mt-8"
                  variants={fadeInUp}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    Precedent
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} sur {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Suivant
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
