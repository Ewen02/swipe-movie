"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { UserRoomsResponseDto } from "@/schemas/rooms"

interface RoomsListProps {
  rooms: UserRoomsResponseDto
}

export function RoomsList({ rooms }: RoomsListProps) {
  const router = useRouter()

  if (rooms.rooms.length === 0) {
    return <p className="text-muted-foreground">Aucune room disponible.</p>
  }

  return (
    <div className="space-y-4">
      {rooms.rooms.map((room) => (
        <Card key={room.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <h3 className="font-semibold">{room.name}</h3>
              <Badge variant="secondary">{room.code}</Badge>
            </div>
            <Button size="sm" onClick={() => router.push(`/rooms/${room.code}`)}>
              Accéder
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}