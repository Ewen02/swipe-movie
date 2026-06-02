import { POST, GET, DELETE } from "@/lib/api"
import { parseResponse, withErrors } from "@/lib/http"
import {
  CreateGroupValues,
  Group,
  groupSchema,
  GroupsResponseDto,
  groupsResponseSchema,
  GroupSessionResponseDto,
  groupSessionResponseSchema,
} from "@/schemas/groups"

export async function createGroup(data: CreateGroupValues): Promise<Group> {
  return parseResponse(
    await POST("/groups", { body: JSON.stringify(data) }),
    groupSchema,
    withErrors("GROUPS"),
  )
}

export async function getMyGroups(): Promise<GroupsResponseDto> {
  return parseResponse(
    await GET("/groups/my"),
    groupsResponseSchema,
    withErrors("GROUPS"),
  )
}

/** Spawn a fresh room from a group and notify its members. */
export async function startGroupSession(
  groupId: string,
): Promise<GroupSessionResponseDto> {
  return parseResponse(
    await POST(`/groups/id/${groupId}/session`),
    groupSessionResponseSchema,
    withErrors("GROUPS"),
  )
}

export async function deleteGroup(groupId: string): Promise<void> {
  await DELETE(`/groups/id/${groupId}`)
}
