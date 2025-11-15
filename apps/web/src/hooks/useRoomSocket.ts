import { useEffect, useState, useRef, useCallback } from "react"
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
  connectionState: "connected" | "disconnected" | "reconnecting" | "error"
  reconnectAttempts: number
}

const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_DELAY_BASE = 1000 // 1 second
const RECONNECT_DELAY_MAX = 30000 // 30 seconds

export function useRoomSocket(roomId: string | null): UseRoomSocketReturn {
  const [newMatch, setNewMatch] = useState<MatchCreatedPayload | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState<"connected" | "disconnected" | "reconnecting" | "error">("disconnected")
  const [reconnectAttempts, setReconnectAttempts] = useState(0)

  const socketRef = useRef<Socket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasJoinedRoomRef = useRef(false)

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  const calculateReconnectDelay = useCallback((attemptCount: number): number => {
    // Exponential backoff with jitter
    const exponentialDelay = Math.min(
      RECONNECT_DELAY_BASE * Math.pow(2, attemptCount),
      RECONNECT_DELAY_MAX
    )
    const jitter = Math.random() * 1000
    return exponentialDelay + jitter
  }, [])

  const joinRoom = useCallback((socket: Socket, room: string) => {
    if (!hasJoinedRoomRef.current) {
      socket.emit("joinRoom", room)
      hasJoinedRoomRef.current = true
    }
  }, [])

  useEffect(() => {
    if (!roomId) {
      setConnectionState("disconnected")
      return
    }

    let isMounted = true
    hasJoinedRoomRef.current = false

    // Create socket connection with resilience options
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/matches`, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: RECONNECT_DELAY_BASE,
      reconnectionDelayMax: RECONNECT_DELAY_MAX,
      timeout: 20000, // 20 seconds connection timeout
      autoConnect: true,
    })

    socketRef.current = socket

    // Connection successful
    socket.on("connect", () => {
      if (!isMounted) return

      console.log("[WebSocket] Connected successfully")
      setIsConnected(true)
      setConnectionState("connected")
      setReconnectAttempts(0)
      clearReconnectTimeout()

      // Join the room
      joinRoom(socket, roomId)
    })

    // Attempting to reconnect
    socket.io.on("reconnect_attempt", (attemptNumber) => {
      if (!isMounted) return

      console.log(`[WebSocket] Reconnect attempt ${attemptNumber}/${MAX_RECONNECT_ATTEMPTS}`)
      setConnectionState("reconnecting")
      setReconnectAttempts(attemptNumber)
    })

    // Successfully reconnected
    socket.io.on("reconnect", (attemptNumber) => {
      if (!isMounted) return

      console.log(`[WebSocket] Reconnected after ${attemptNumber} attempts`)
      setIsConnected(true)
      setConnectionState("connected")
      setReconnectAttempts(0)

      // Rejoin room after reconnection
      hasJoinedRoomRef.current = false
      joinRoom(socket, roomId)
    })

    // Reconnection failed
    socket.io.on("reconnect_failed", () => {
      if (!isMounted) return

      console.error("[WebSocket] Reconnection failed after max attempts")
      setConnectionState("error")
    })

    // Reconnection error
    socket.io.on("reconnect_error", (error) => {
      if (!isMounted) return

      console.error("[WebSocket] Reconnection error:", error.message)
    })

    // Disconnected
    socket.on("disconnect", (reason) => {
      if (!isMounted) return

      console.log(`[WebSocket] Disconnected: ${reason}`)
      setIsConnected(false)
      hasJoinedRoomRef.current = false

      // If server disconnected us or network error, try to reconnect
      if (reason === "io server disconnect" || reason === "transport close") {
        setConnectionState("reconnecting")
      } else {
        setConnectionState("disconnected")
      }
    })

    // Connection error
    socket.on("connect_error", (error) => {
      if (!isMounted) return

      console.error("[WebSocket] Connection error:", error.message)
      setIsConnected(false)
      setConnectionState("error")
    })

    // Match created event
    socket.on("matchCreated", (payload: MatchCreatedPayload) => {
      if (!isMounted) return

      console.log("[WebSocket] Match created:", payload)
      setNewMatch(payload)
    })

    // Ping/pong for connection health check
    socket.on("ping", () => {
      console.log("[WebSocket] Ping received")
    })

    // Cleanup
    return () => {
      isMounted = false
      clearReconnectTimeout()

      if (socketRef.current) {
        if (hasJoinedRoomRef.current) {
          socketRef.current.emit("leaveRoom", roomId)
        }
        socketRef.current.removeAllListeners()
        socketRef.current.disconnect()
        socketRef.current = null
      }

      hasJoinedRoomRef.current = false
    }
  }, [roomId, joinRoom, clearReconnectTimeout, calculateReconnectDelay])

  const resetNewMatch = useCallback(() => {
    setNewMatch(null)
  }, [])

  return {
    newMatch,
    resetNewMatch,
    isConnected,
    connectionState,
    reconnectAttempts,
  }
}
