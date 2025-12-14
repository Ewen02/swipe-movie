import { z } from "zod"
import {
  ROOM_CODE_LENGTH,
  ROOM_NAME_MIN_LENGTH,
  ValidationConstraints,
} from "@swipe-movie/types"

// -------- Create & Join DTO --------
export const createRoomSchema = z.object({
  name: z.string().min(ROOM_NAME_MIN_LENGTH, `Le nom doit contenir au moins ${ROOM_NAME_MIN_LENGTH} caractères`).optional(),
  type: z.enum(['movie', 'tv'], {
    message: "Le type est requis (movie ou tv)",
  }),
  genreId: z.number({
    message: "L'ID du genre doit être un nombre",
  }).optional(),
  // Advanced filters
  minRating: z.number().min(ValidationConstraints.RATING_MIN).max(ValidationConstraints.RATING_MAX).optional(),
  releaseYearMin: z.number().min(ValidationConstraints.RELEASE_YEAR_MIN).optional(),
  releaseYearMax: z.number().min(ValidationConstraints.RELEASE_YEAR_MIN).optional(),
  runtimeMin: z.number().min(ValidationConstraints.RUNTIME_MIN).optional(),
  runtimeMax: z.number().min(ValidationConstraints.RUNTIME_MIN).optional(),
  watchProviders: z.array(z.number()).optional(),
  watchRegion: z.string().length(ValidationConstraints.ISO_CODE_LENGTH).optional(),
  originalLanguage: z.string().length(ValidationConstraints.ISO_CODE_LENGTH).optional(),
})
export type CreateRoomValues = z.infer<typeof createRoomSchema>

export const joinRoomSchema = z.object({
  code: z.string().length(ROOM_CODE_LENGTH, `Le code doit contenir exactement ${ROOM_CODE_LENGTH} caractères`),
})
export type JoinRoomValues = z.infer<typeof joinRoomSchema>

// -------- User --------
export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
})
export type User = z.infer<typeof userSchema>

// -------- Room Base --------
export const roomSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().length(ROOM_CODE_LENGTH),
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

// Room with stats (matchCount, memberCount)
export const roomWithStatsSchema = roomSchema.extend({
  matchCount: z.number().default(0),
  memberCount: z.number().default(0),
})
export type RoomWithStats = z.infer<typeof roomWithStatsSchema>

export const userRoomsResponseSchema = z.object({
  rooms: z.array(roomWithStatsSchema),
})
export type UserRoomsResponseDto = z.infer<typeof userRoomsResponseSchema>