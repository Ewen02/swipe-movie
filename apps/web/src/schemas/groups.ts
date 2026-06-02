import { z } from "zod"

// -------- Group member --------
export const groupMemberSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
})
export type GroupMember = z.infer<typeof groupMemberSchema>

// -------- Group --------
export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdBy: z.string(),
  type: z.string(),
  genreId: z.number(),
  members: z.array(groupMemberSchema),
  memberCount: z.number(),
  createdAt: z.union([z.string(), z.date()]),
})
export type Group = z.infer<typeof groupSchema>

export const groupsResponseSchema = z.object({
  groups: z.array(groupSchema),
})
export type GroupsResponseDto = z.infer<typeof groupsResponseSchema>

// -------- Create group --------
export const createGroupSchema = z.object({
  name: z.string().max(100).optional(),
  memberUserIds: z.array(z.string()).optional(),
  fromRoomId: z.string().optional(),
})
export type CreateGroupValues = z.infer<typeof createGroupSchema>

// -------- Start session (re-room) --------
export const groupSessionResponseSchema = z.object({
  code: z.string(),
  roomId: z.string(),
  notified: z.number(),
})
export type GroupSessionResponseDto = z.infer<typeof groupSessionResponseSchema>
