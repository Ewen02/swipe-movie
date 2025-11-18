"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { UserRoomsResponseDto } from "@/schemas/rooms"
import { Film, Tv, ArrowRight, Users, Calendar, Sparkles } from "lucide-react"
import { ShareRoomButton } from "./ShareRoomButton"

interface RoomsListProps {
  rooms: UserRoomsResponseDto
}

export function RoomsList({ rooms }: RoomsListProps) {
  const router = useRouter()

  if (rooms.rooms.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="p-12 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Film className="w-10 h-10 text-primary/50" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Aucune room active</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Créez votre première room pour commencer à swiper des films avec vos amis !
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {rooms.rooms.map((room) => {
        const createdDate = new Date(room.createdAt)
        const isRecent = Date.now() - createdDate.getTime() < 24 * 60 * 60 * 1000 // Less than 24h

        return (
          <Card
            key={room.id}
            className="group hover:shadow-xl transition-all duration-200 hover:border-primary/50 cursor-pointer hover:scale-[1.02]"
            onClick={() => router.push(`/rooms/${room.code}`)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        room.type === "movie"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-accent"
                      }`}>
                        {room.type === "movie" ? (
                          <Film className="w-5 h-5" />
                        ) : (
                          <Tv className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {room.name || "Room sans nom"}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="font-mono text-xs">
                            {room.code}
                          </Badge>
                          {isRecent && (
                            <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400">
                              Nouveau
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {createdDate.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="capitalize">
                      {room.type === "movie" ? "🎬 Films" : "📺 Séries"}
                    </Badge>
                  </div>
                  {room.genreId && room.genreId > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Genre filtré</span>
                    </div>
                  )}
                  {room.minRating && room.minRating > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span>⭐ {room.minRating}+ min</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t" onClick={(e) => e.stopPropagation()}>
                  <ShareRoomButton
                    roomCode={room.code}
                    roomName={room.name || "Room sans nom"}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 group-hover:shadow-md"
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
        )
      })}
    </div>
  )
}