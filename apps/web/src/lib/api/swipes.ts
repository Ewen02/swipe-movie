import { GET, POST, DELETE } from "@/lib/api"
import { parseResponse, withErrors } from "@/lib/http"
import {
  CreateSwipeInput,
  ResponseSwipe,
  Swipe,
  Match,
  responseSwipeSchema,
  swipeSchema,
  matchesListSchema,
} from "@/schemas/swipes"

/**
 * Create a swipe (like or dislike a movie)
 */
export async function createSwipe(
  roomId: string,
  movieId: string,
  value: boolean
): Promise<ResponseSwipe> {
  const data: CreateSwipeInput = { roomId, movieId, value }

  return parseResponse(
    await POST("/swipes", { body: JSON.stringify(data) }),
    responseSwipeSchema,
    withErrors("SWIPES")
  )
}

/**
 * Delete a swipe (for undo functionality)
 */
export async function deleteSwipe(
  roomId: string,
  movieId: string
): Promise<{ deleted: boolean }> {
  const response = await DELETE(`/swipes?roomId=${roomId}&movieId=${movieId}`)
  if (!response.ok) {
    throw new Error("Failed to delete swipe")
  }
  return response.json()
}

/**
 * Get all matches for a room
 */
export async function getMatchesByRoom(roomId: string): Promise<Match[]> {
  return parseResponse(
    await GET(`/matches/${roomId}`),
    matchesListSchema,
    withErrors("MATCHES")
  )
}

/**
 * Get my swipes for a specific room
 */
export async function getMySwipesByRoom(roomId: string): Promise<Swipe[]> {
  return parseResponse(
    await GET(`/swipes/me?roomId=${roomId}`),
    swipeSchema.array(),
    withErrors("SWIPES")
  )
}
