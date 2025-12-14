import { GET, POST, DELETE } from "@/lib/api"
import { ExternalConnection, SyncResult } from "@swipe-movie/types"

export type ExternalProvider = "trakt" | "anilist"

// Trakt API
export async function getTraktAuthUrl(): Promise<{ url: string }> {
  const response = await GET("/trakt/auth-url")
  if (!response.ok) {
    throw new Error("Failed to get Trakt auth URL")
  }
  return response.json()
}

export async function connectTrakt(code: string): Promise<{ success: boolean }> {
  const response = await POST("/trakt/callback", { body: JSON.stringify({ code }) })
  if (!response.ok) {
    throw new Error("Failed to connect Trakt")
  }
  return response.json()
}

export async function syncTrakt(): Promise<SyncResult> {
  const response = await POST("/trakt/sync")
  if (!response.ok) {
    throw new Error("Failed to sync Trakt")
  }
  return response.json()
}

export async function getTraktStatus(): Promise<ExternalConnection> {
  const response = await GET("/trakt/status")
  if (!response.ok) {
    throw new Error("Failed to get Trakt status")
  }
  return response.json()
}

export async function disconnectTrakt(): Promise<{ success: boolean }> {
  const response = await DELETE("/trakt/disconnect")
  if (!response.ok) {
    throw new Error("Failed to disconnect Trakt")
  }
  return response.json()
}

// AniList API
export async function getAniListAuthUrl(): Promise<{ url: string }> {
  const response = await GET("/anilist/auth-url")
  if (!response.ok) {
    throw new Error("Failed to get AniList auth URL")
  }
  return response.json()
}

export async function connectAniList(code: string): Promise<{ success: boolean }> {
  const response = await POST("/anilist/callback", { body: JSON.stringify({ code }) })
  if (!response.ok) {
    throw new Error("Failed to connect AniList")
  }
  return response.json()
}

export async function syncAniList(): Promise<SyncResult> {
  const response = await POST("/anilist/sync")
  if (!response.ok) {
    throw new Error("Failed to sync AniList")
  }
  return response.json()
}

export async function getAniListStatus(): Promise<ExternalConnection> {
  const response = await GET("/anilist/status")
  if (!response.ok) {
    throw new Error("Failed to get AniList status")
  }
  return response.json()
}

export async function disconnectAniList(): Promise<{ success: boolean }> {
  const response = await DELETE("/anilist/disconnect")
  if (!response.ok) {
    throw new Error("Failed to disconnect AniList")
  }
  return response.json()
}

// Generic helpers
export async function getAuthUrl(provider: ExternalProvider): Promise<{ url: string }> {
  switch (provider) {
    case "trakt":
      return getTraktAuthUrl()
    case "anilist":
      return getAniListAuthUrl()
  }
}

export async function connectProvider(provider: ExternalProvider, code: string): Promise<{ success: boolean }> {
  switch (provider) {
    case "trakt":
      return connectTrakt(code)
    case "anilist":
      return connectAniList(code)
  }
}

export async function syncProvider(provider: ExternalProvider): Promise<SyncResult> {
  switch (provider) {
    case "trakt":
      return syncTrakt()
    case "anilist":
      return syncAniList()
  }
}

export async function getProviderStatus(provider: ExternalProvider): Promise<ExternalConnection> {
  switch (provider) {
    case "trakt":
      return getTraktStatus()
    case "anilist":
      return getAniListStatus()
  }
}

export async function disconnectProvider(provider: ExternalProvider): Promise<{ success: boolean }> {
  switch (provider) {
    case "trakt":
      return disconnectTrakt()
    case "anilist":
      return disconnectAniList()
  }
}
