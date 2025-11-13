import { z } from "zod"

// Schema for creating a swipe
export const createSwipeSchema = z.object({
  roomId: z.string(),
  movieId: z.string(),
  value: z.boolean(),
})

// Schema for Swipe response
export const swipeSchema = z.object({
  id: z.string(),
  value: z.boolean(),
  movieId: z.string(),
  roomId: z.string(),
  userId: z.string(),
  createdAt: z.string(),
})

// Schema for ResponseSwipeDto (with matchCreated flag)
export const responseSwipeSchema = swipeSchema.extend({
  matchCreated: z.boolean(),
})

// Schema for Match
export const matchSchema = z.object({
  id: z.string(),
  movieId: z.string(),
  roomId: z.string(),
  voteCount: z.number(),
  createdAt: z.string(),
})

// Array schemas
export const swipesListSchema = z.array(responseSwipeSchema)
export const matchesListSchema = z.array(matchSchema)

// TypeScript types
export type CreateSwipeInput = z.infer<typeof createSwipeSchema>
export type Swipe = z.infer<typeof swipeSchema>
export type ResponseSwipe = z.infer<typeof responseSwipeSchema>
export type Match = z.infer<typeof matchSchema>
export type SwipesList = z.infer<typeof swipesListSchema>
export type MatchesList = z.infer<typeof matchesListSchema>
