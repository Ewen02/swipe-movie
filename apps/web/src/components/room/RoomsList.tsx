"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { UserRoomsResponseDto } from "@/schemas/rooms"
import { Film, Tv, ArrowRight, Calendar, Sparkles } from "lucide-react"
import { ShareRoomButton } from "./ShareRoomButton"
import { fadeInUp } from "@/lib/animations"

interface RoomsListProps {
  rooms: UserRoomsResponseDto
}

export function RoomsList({ rooms }: RoomsListProps) {
  const router = useRouter()

  if (rooms.rooms.length === 0) {
    return (
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
        <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-3xl overflow-hidden">
          <div className="p-12 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
                <Film className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucune room active</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Créez votre première room pour commencer à swiper des films avec vos amis !
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {rooms.rooms.map((room, index) => {
        const createdDate = new Date(room.createdAt)
        const isRecent = Date.now() - createdDate.getTime() < 24 * 60 * 60 * 1000 // Less than 24h

        return (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group cursor-pointer"
            onClick={() => router.push(`/rooms/${room.code}`)}
          >
            {/* Hover glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

            <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group-hover:border-primary/30 transition-all duration-300">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                      room.type === "movie"
                        ? "bg-gradient-to-br from-primary to-blue-500"
                        : "bg-gradient-to-br from-accent to-purple-500"
                    }`}>
                      {room.type === "movie" ? (
                        <Film className="w-6 h-6 text-white" />
                      ) : (
                        <Tv className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {room.name || "Room sans nom"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="font-mono text-xs border-white/20">
                          {room.code}
                        </Badge>
                        {isRecent && (
                          <Badge className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                            Nouveau
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4 pb-4 border-b border-white/10">
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
                    <Badge variant="secondary" className="capitalize bg-white/5 border-white/10">
                      {room.type === "movie" ? "🎬 Films" : "📺 Séries"}
                    </Badge>
                  </div>
                  {room.genreId && room.genreId > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span>Genre filtré</span>
                    </div>
                  )}
                  {room.minRating && room.minRating > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span>⭐ {room.minRating}+</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <ShareRoomButton
                    roomCode={room.code}
                    roomName={room.name || "Room sans nom"}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/20 hover:bg-white/5"
                  />
                  <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-md"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/rooms/${room.code}`)
                      }}
                    >
                      Accéder
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}