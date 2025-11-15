import { useEffect, useState, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { Match } from "@/schemas/swipes"
import { MovieBasic } from "@/schemas/movies"

interface MatchCreatedPayload {
  roomId: string
  match: Match
  movie?: MovieBasic
}

interface UseRoomSocketReturn {
  newMatch: MatchCreatedPayload | null
  resetNewMatch: () => void
  isConnected: boolean
}

export function useRoomSocket(roomId: string | null): UseRoomSocketReturn {
  const [newMatch, setNewMatch] = useState<MatchCreatedPayload | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!roomId) return

    // Create socket connection
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/matches`, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    })

    socketRef.current = socket

    socket.on("connect", () => {
      setIsConnected(true)
      // Join the room
      socket.emit("joinRoom", roomId)
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
    })

    socket.on("matchCreated", (payload: MatchCreatedPayload) => {
      setNewMatch(payload)
    })

    socket.on("connect_error", (error) => {
      console.error("[WebSocket] Connection error:", error)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveRoom", roomId)
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [roomId])

  const resetNewMatch = () => {
    setNewMatch(null)
  }

  return {
    newMatch,
    resetNewMatch,
    isConnected,
  }
}
