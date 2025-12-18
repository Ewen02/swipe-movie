"use client"

import { motion } from "framer-motion"
import { Badge, Button } from "@swipe-movie/ui"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import type { UserRoomsResponseDto } from "@/schemas/rooms"
import { Film, Tv, ArrowRight, Users, Heart, Star, Sparkles, Plus } from "lucide-react"
import { ShareRoomButton } from "./ShareRoomButton"

interface RoomsListProps {
  rooms: UserRoomsResponseDto
  onCreateRoom?: () => void
}

export function RoomsList({ rooms, onCreateRoom }: RoomsListProps) {
  const router = useRouter()
  const t = useTranslations('rooms')

  if (rooms.rooms.length === 0) {
    return (
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
        <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border-2 border-dashed border-border rounded-3xl overflow-hidden">
          <div className="p-12 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
                <Film className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('emptyState.title')}</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t('emptyState.description')}
            </p>
            {onCreateRoom && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg"
                  onClick={onCreateRoom}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t('create')}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {rooms.rooms.map((room, index) => {
        const createdDate = new Date(room.createdAt)
        const isRecent = Date.now() - createdDate.getTime() < 24 * 60 * 60 * 1000

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
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

            <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden group-hover:border-primary/40 transition-all duration-300">
              {/* Top accent bar */}
              <div className={`h-1 ${
                room.type === "movie"
                  ? "bg-gradient-to-r from-primary to-blue-500"
                  : "bg-gradient-to-r from-accent to-purple-500"
              }`} />

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${
                    room.type === "movie"
                      ? "bg-gradient-to-br from-primary to-blue-500"
                      : "bg-gradient-to-br from-accent to-purple-500"
                  }`}>
                    {room.type === "movie" ? (
                      <Film className="w-5 h-5 text-white" />
                    ) : (
                      <Tv className="w-5 h-5 text-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg truncate" title={room.name || t('card.unnamed')}>
                        {room.name || t('card.unnamed')}
                      </h3>
                      {isRecent && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-green-500/20 text-green-500 border-green-500/30 shrink-0">
                          {t('card.new')}
                        </Badge>
                      )}
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1 text-blue-400">
                        <Users className="w-3.5 h-3.5" />
                        <span>{room.memberCount || 0}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${
                        (room.matchCount || 0) > 0 ? "text-pink-400" : "text-muted-foreground"
                      }`}>
                        <Heart className={`w-3.5 h-3.5 ${(room.matchCount || 0) > 0 ? "fill-pink-400" : ""}`} />
                        <span>{room.matchCount || 0}</span>
                      </div>
                      <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 border-border text-muted-foreground">
                        {room.code}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Details row */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-foreground/5 border-border">
                    {room.type === "movie" ? t('card.movies') : t('card.series')}
                  </Badge>
                  {room.minRating && room.minRating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span>{room.minRating}+</span>
                    </div>
                  )}
                  {room.genreId && room.genreId > 0 && (
                    <div className="flex items-center gap-1 text-primary">
                      <Sparkles className="w-3 h-3" />
                      <span>{t('card.filtered')}</span>
                    </div>
                  )}
                  <span className="text-muted-foreground/60">
                    {createdDate.toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <ShareRoomButton
                    roomCode={room.code}
                    roomName={room.name || t('card.unnamed')}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-border hover:bg-foreground/5 text-xs h-9"
                  />
                  <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-md text-xs h-9"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/rooms/${room.code}`)
                      }}
                    >
                      {t('card.access')}
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
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
