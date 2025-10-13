"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getRoomByCode } from "@/lib/api/rooms"
import type { RoomWithMembersResponseDto } from "@/schemas/rooms"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function RoomPage() {
  const { code } = useParams<{ code: string }>()
  const [room, setRoom] = useState<RoomWithMembersResponseDto | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!code) return
    setLoading(true)
    getRoomByCode(code)
      .then(setRoom)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [code])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Chargement de la room...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">Erreur : {error}</p>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Room introuvable</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-4">{room.name}</h1>
      <p className="text-muted-foreground mb-6">
        Code d’invitation : <Badge>{room.code}</Badge>
      </p>

      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Membres</h2>
          <ul className="space-y-2">
            {room.members.map((member, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <Badge variant="secondary">{member.name ?? "Utilisateur inconnu"}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}