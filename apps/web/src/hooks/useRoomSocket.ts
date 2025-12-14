import { useEffect, useState, useRef, useCallback } from "react"
import { io, Socket } from "socket.io-client"
import {
  MatchCreatedPayload,
  MatchDeletedPayload,
  UserJoinedPayload,
  UserLeftPayload,
  SocketEvents,
  SocketConfig,
  ConnectionState,
} from "@swipe-movie/types"

interface UseRoomSocketReturn {
  newMatch: MatchCreatedPayload | null
  deletedMatchMovieId: string | null
  userJoined: UserJoinedPayload | null
  userLeft: UserLeftPayload | null
  resetNewMatch: () => void
  resetDeletedMatch: () => void
  resetUserJoined: () => void
  resetUserLeft: () => void
  isConnected: boolean
  connectionState: ConnectionState
  reconnectAttempts: number
  triggerRefresh: () => void
}

export function useRoomSocket(roomId: string | null): UseRoomSocketReturn {
  const [newMatch, setNewMatch] = useState<MatchCreatedPayload | null>(null)
  const [deletedMatchMovieId, setDeletedMatchMovieId] = useState<string | null>(null)
  const [userJoined, setUserJoined] = useState<UserJoinedPayload | null>(null)
  const [userLeft, setUserLeft] = useState<UserLeftPayload | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected")
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

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
      SocketConfig.RECONNECT_DELAY_BASE * Math.pow(2, attemptCount),
      SocketConfig.RECONNECT_DELAY_MAX
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
      reconnectionAttempts: SocketConfig.MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: SocketConfig.RECONNECT_DELAY_BASE,
      reconnectionDelayMax: SocketConfig.RECONNECT_DELAY_MAX,
      timeout: SocketConfig.CONNECTION_TIMEOUT,
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

      console.log(`[WebSocket] Reconnect attempt ${attemptNumber}/${SocketConfig.MAX_RECONNECT_ATTEMPTS}`)
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

      // Trigger refresh to catch up on missed events
      setRefreshTrigger(prev => prev + 1)
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
    socket.on(SocketEvents.MATCH_CREATED, (payload: MatchCreatedPayload) => {
      if (!isMounted) return

      console.log("[WebSocket] Match created:", payload)
      setNewMatch(payload)
    })

    // Match deleted event (when someone undoes a swipe)
    socket.on(SocketEvents.MATCH_DELETED, (payload: MatchDeletedPayload) => {
      if (!isMounted) return

      console.log("[WebSocket] Match deleted:", payload)
      setDeletedMatchMovieId(payload.movieId)
    })

    // User joined event
    socket.on(SocketEvents.USER_JOINED, (payload: UserJoinedPayload) => {
      if (!isMounted) return

      console.log("[WebSocket] User joined:", payload)
      setUserJoined(payload)
    })

    // User left event
    socket.on(SocketEvents.USER_LEFT, (payload: UserLeftPayload) => {
      if (!isMounted) return

      console.log("[WebSocket] User left:", payload)
      setUserLeft(payload)
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

  const resetDeletedMatch = useCallback(() => {
    setDeletedMatchMovieId(null)
  }, [])

  const resetUserJoined = useCallback(() => {
    setUserJoined(null)
  }, [])

  const resetUserLeft = useCallback(() => {
    setUserLeft(null)
  }, [])

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  return {
    newMatch,
    deletedMatchMovieId,
    userJoined,
    userLeft,
    resetNewMatch,
    resetDeletedMatch,
    resetUserJoined,
    resetUserLeft,
    isConnected,
    connectionState,
    reconnectAttempts,
    triggerRefresh,
  }
}
