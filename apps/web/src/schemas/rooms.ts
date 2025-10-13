import { z } from "zod"

// -------- Create & Join DTO --------
export const createRoomSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
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
  createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
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