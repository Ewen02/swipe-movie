"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { UserRoomsResponseDto } from "@/schemas/rooms"
import { Film, Tv, ArrowRight } from "lucide-react"
import { ShareRoomButton } from "./ShareRoomButton"

interface RoomsListProps {
  rooms: UserRoomsResponseDto
}

export function RoomsList({ rooms }: RoomsListProps) {
  const router = useRouter()

  if (rooms.rooms.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-12 text-center">
          <Film className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground mb-2">Aucune room active</p>
          <p className="text-sm text-muted-foreground">
            Créez votre première room pour commencer !
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {rooms.rooms.map((room) => (
        <Card
          key={room.id}
          className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer"
          onClick={() => router.push(`/rooms/${room.code}`)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {room.type === "movie" ? (
                    <Film className="w-5 h-5 text-primary shrink-0" />
                  ) : (
                    <Tv className="w-5 h-5 text-accent shrink-0" />
                  )}
                  <h3 className="font-semibold text-lg truncate">
                    {room.name || "Room sans nom"}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="font-mono">
                    {room.code}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    {room.type === "movie" ? "🎬 Films" : "📺 Séries"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <ShareRoomButton
                  roomCode={room.code}
                  roomName={room.name || "Room sans nom"}
                  variant="ghost"
                  size="sm"
                  className="shrink-0"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0 group-hover:bg-primary/10 group-hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/rooms/${room.code}`)
                  }}
                >
                  Accéder
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}