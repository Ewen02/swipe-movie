import { POST, GET } from "@/lib/api"
import { parseResponse, withErrors } from "@/lib/http"
import { 
  CreateRoomValues,
  JoinRoomValues,
  RoomCreateResponseDto,
  roomJoinResponseSchema,
  RoomJoinResponseDto,
  roomCreateResponseSchema,
  RoomWithMembersResponseDto,
  roomWithMembersSchema,
  UserRoomsResponseDto,
  userRoomsResponseSchema,
} from "@/schemas/rooms"

export async function createRoom(data: CreateRoomValues): Promise<RoomCreateResponseDto> {
  return parseResponse(
    await POST("/rooms", { body: JSON.stringify(data) }),
    roomCreateResponseSchema,
    withErrors("ROOMS") 
  )
}

export async function joinRoom(data: JoinRoomValues): Promise<RoomJoinResponseDto> {
  return parseResponse(
    await POST("/rooms/join", { body: JSON.stringify(data) }),
    roomJoinResponseSchema,
    withErrors("ROOMS")
  )
}

export async function getRoomById(roomId: string): Promise<RoomWithMembersResponseDto> {
  return parseResponse(
    await GET(`/rooms/id/${roomId}`),
    roomWithMembersSchema,
    withErrors("ROOMS")
  )
}

export async function getRoomByCode(roomCode: string): Promise<RoomWithMembersResponseDto> {
  return parseResponse(
    await GET(`/rooms/code/${roomCode}`),
    roomWithMembersSchema,
    withErrors("ROOMS")
  )
}

export async function getMyRoom(): Promise<UserRoomsResponseDto> {
  return parseResponse(
    await GET("/rooms/my"),
    userRoomsResponseSchema,
    withErrors("ROOMS")
  )
}