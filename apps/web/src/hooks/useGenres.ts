"use client"

import useSWR from "swr"
import { getGenres } from "@/lib/api/movies"
import type { MovieGenre } from "@/schemas/movies"

// SWR key for genres - these rarely change
export const GENRES_KEY = "/api/genres"

// Fetcher function
const fetchGenres = async (): Promise<MovieGenre[]> => {
  return getGenres()
}

export function useGenres() {
  const { data, error, isLoading, isValidating } = useSWR<MovieGenre[]>(
    GENRES_KEY,
    fetchGenres,
    {
      // Genres rarely change - cache for 30 minutes
      dedupingInterval: 30 * 60 * 1000,
      // Don't refetch on focus for static data
      revalidateOnFocus: false,
      // Cache indefinitely until manually invalidated
      revalidateIfStale: false,
    }
  )

  return {
    genres: data ?? [],
    isLoading,
    isValidating,
    error: error?.message ?? null,
  }
}
