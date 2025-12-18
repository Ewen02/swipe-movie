import { GET, PUT, POST, PATCH, DELETE } from "@/lib/api"

export interface UserPreferences {
  watchProviders: number[]
  watchRegion: string
  favoriteGenreIds: number[]
  onboardingStep: number
  onboardingCompleted: boolean
}

export interface UpdateUserPreferencesDto {
  watchProviders?: number[]
  watchRegion?: string
  favoriteGenreIds?: number[]
  onboardingStep?: number
  onboardingCompleted?: boolean
}

export interface OnboardingSwipe {
  tmdbId: string
  mediaType: string
  liked: boolean
  source?: "onboarding" | "discover" | "manual"
}

/**
 * Get current user preferences
 */
export async function getUserPreferences(): Promise<UserPreferences | null> {
  const response = await GET("/users/me/preferences")
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error("Failed to fetch user preferences")
  }
  return response.json()
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  dto: UpdateUserPreferencesDto
): Promise<UserPreferences> {
  const response = await PUT("/users/me/preferences", {
    body: JSON.stringify(dto),
    headers: { "Content-Type": "application/json" },
  })
  if (!response.ok) {
    throw new Error("Failed to update user preferences")
  }
  return response.json()
}

/**
 * Save batch onboarding swipes
 */
export async function saveOnboardingSwipes(
  swipes: OnboardingSwipe[]
): Promise<{ saved: number }> {
  const response = await POST("/users/me/onboarding/swipes", {
    body: JSON.stringify({ swipes }),
  })
  if (!response.ok) {
    throw new Error("Failed to save onboarding swipes")
  }
  return response.json()
}

/**
 * Complete onboarding
 */
export async function completeOnboarding(): Promise<UserPreferences> {
  const response = await POST("/users/me/onboarding/complete", {
    body: JSON.stringify({}),
  })
  if (!response.ok) {
    throw new Error("Failed to complete onboarding")
  }
  return response.json()
}

// Library types
export interface LibraryItem {
  id: string
  tmdbId: string
  mediaType: "movie" | "tv"
  status: string
  source: string
  rating?: number
  importedAt: string
}

export interface LibraryResponse {
  items: LibraryItem[]
  total: number
  page: number
  totalPages: number
}

export interface LibraryQueryParams {
  status?: string
  source?: string
  page?: number
  limit?: number
}

/**
 * Get user library with optional filters
 */
export async function getUserLibrary(params: LibraryQueryParams = {}): Promise<LibraryResponse> {
  const searchParams = new URLSearchParams()
  if (params.status) searchParams.set("status", params.status)
  if (params.source) searchParams.set("source", params.source)
  if (params.page) searchParams.set("page", params.page.toString())
  if (params.limit) searchParams.set("limit", params.limit.toString())

  const query = searchParams.toString()
  const url = `/users/me/library${query ? `?${query}` : ""}`

  const response = await GET(url)
  if (!response.ok) {
    throw new Error("Failed to fetch user library")
  }
  return response.json()
}

/**
 * Update a library item status
 */
export async function updateLibraryItemStatus(
  itemId: string,
  status: string
): Promise<LibraryItem> {
  const response = await PATCH(`/users/me/library/${itemId}`, {
    body: JSON.stringify({ status }),
  })
  if (!response.ok) {
    throw new Error("Failed to update library item")
  }
  return response.json()
}

/**
 * Delete a library item
 */
export async function deleteLibraryItem(itemId: string): Promise<void> {
  const response = await DELETE(`/users/me/library/${itemId}`)
  if (!response.ok) {
    throw new Error("Failed to delete library item")
  }
}

/**
 * Delete a library item by TMDB ID
 */
export async function deleteLibraryItemByTmdbId(
  tmdbId: string,
  mediaType: string = "movie"
): Promise<void> {
  const response = await DELETE(
    `/users/me/library/by-tmdb/${tmdbId}?mediaType=${mediaType}`
  )
  if (!response.ok) {
    throw new Error("Failed to delete library item")
  }
}

// Library stats types
export interface LibraryStats {
  total: number
  byStatus: Record<string, number>
  bySource: Record<string, number>
}

/**
 * Get library statistics (counts by status and source)
 */
export async function getLibraryStats(): Promise<LibraryStats> {
  const response = await GET("/users/me/library/stats")
  if (!response.ok) {
    throw new Error("Failed to fetch library stats")
  }
  return response.json()
}

// GDPR / Data export types
export interface UserDataExport {
  profile: {
    id: string
    email: string
    name: string | null
    createdAt: string
  }
  preferences: UserPreferences | null
  library: LibraryItem[]
  swipes: Array<{
    movieId: string
    roomId: string
    value: boolean
    createdAt: string
  }>
  rooms: Array<{
    id: string
    name: string
    code: string
  }>
  matches: Array<{
    movieId: string
    roomId: string
    createdAt: string
  }>
  exportedAt: string
}

/**
 * Export all user data (GDPR compliant)
 */
export async function exportUserData(): Promise<UserDataExport> {
  const response = await GET("/users/me/export")
  if (!response.ok) {
    throw new Error("Failed to export user data")
  }
  return response.json()
}

/**
 * Delete user account and all data (GDPR compliant)
 */
export async function deleteUserAccount(): Promise<void> {
  const response = await DELETE("/users/me")
  if (!response.ok) {
    throw new Error("Failed to delete user account")
  }
}
