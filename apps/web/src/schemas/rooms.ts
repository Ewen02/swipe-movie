import { z } from "zod"

// -------- Create & Join DTO --------
export const createRoomSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères").optional(),
  type: z.enum(['movie', 'tv'], {
    message: "Le type est requis (movie ou tv)",
  }),
  genreId: z.number({
    message: "L'ID du genre doit être un nombre",
  }).optional(),
  // Advanced filters
  minRating: z.number().min(0).max(10).optional(),
  releaseYearMin: z.number().min(1900).optional(),
  releaseYearMax: z.number().min(1900).optional(),
  runtimeMin: z.number().min(0).optional(),
  runtimeMax: z.number().min(0).optional(),
  watchProviders: z.array(z.number()).optional(),
  watchRegion: z.string().length(2).optional(),
  originalLanguage: z.string().length(2).optional(),
})
export type CreateRoomValues = z.infer<typeof createRoomSchema>

export const joinRoomSchema = z.object({
  code: z.string().length(6, "Le code doit contenir exactement 6 caractères"),
})
export type JoinRoomValues = z.infer<typeof joinRoomSchema>

// -------- User --------
export const userSchema = z.object({
  name: z.string().nullable(),
})
export type User = z.infer<typeof userSchema>

// -------- Room Base --------
export const roomSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().length(6),
  type: z.enum(['MOVIE', 'TV', 'movie', 'tv']).transform((val) => val.toLowerCase() as 'movie' | 'tv').optional(),
  genreId: z.number().nullable().optional(),
  createdBy: z.string(),
  createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  // Advanced filters
  minRating: z.number().nullable().optional(),
  releaseYearMin: z.number().nullable().optional(),
  releaseYearMax: z.number().nullable().optional(),
  runtimeMin: z.number().nullable().optional(),
  runtimeMax: z.number().nullable().optional(),
  watchProviders: z.array(z.number()).optional(),
  watchRegion: z.string().nullable().optional(),
  originalLanguage: z.string().nullable().optional(),
})
export type Room = z.infer<typeof roomSchema>

// -------- Response DTOs --------
export const roomCreateResponseSchema = roomSchema
export type RoomCreateResponseDto = z.infer<typeof roomCreateResponseSchema>

export const roomJoinResponseSchema = roomSchema
export type RoomJoinResponseDto = z.infer<typeof roomJoinResponseSchema>

export const roomWithMembersSchema = roomSchema.extend({
  members: z.array(userSchema),
})
export type RoomWithMembersResponseDto = z.infer<typeof roomWithMembersSchema>

export const roomMembersResponseSchema = z.object({
  members: z.array(userSchema),
})
export type RoomMembersResponseDto = z.infer<typeof roomMembersResponseSchema>

export const userRoomsResponseSchema = z.object({
  rooms: z.array(roomSchema),
})
export type UserRoomsResponseDto = z.infer<typeof userRoomsResponseSchema>