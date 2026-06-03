"use client"

import { motion } from "framer-motion"
import { Badge, Button } from "@swipe-movie/ui"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import type { UserRoomsResponseDto } from "@/schemas/rooms"
import { Film, Tv, ArrowRight, Users, Heart, Star, Plus } from "lucide-react"
import { ShareRoomButton } from "./ShareRoomButton"

interface RoomsListProps {
  rooms: UserRoomsResponseDto
  onCreateRoom?: () => void
  onJoinRoom?: () => void
}

export function RoomsList({ rooms, onCreateRoom, onJoinRoom }: RoomsListProps) {
  const router = useRouter()
  const t = useTranslations('rooms')
  const locale = useLocale()

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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {onCreateRoom && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
              {onJoinRoom && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border hover:bg-foreground/5"
                  onClick={onJoinRoom}
                >
                  <Users className="w-5 h-5 mr-2" />
                  {t('join')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {rooms.rooms.map((room, index) => {
        const createdDate = new Date(room.createdAt)
        const ageMs = Date.now() - createdDate.getTime()
        const isRecent = ageMs < 24 * 60 * 60 * 1000
        // Rooms live 72h. Surface "expire dans Xh" once under 24h left — the most
        // useful per-card signal for a short-lived room.
        const hoursLeft = Math.ceil((72 * 60 * 60 * 1000 - ageMs) / (60 * 60 * 1000))
        const expiringSoon = hoursLeft > 0 && hoursLeft <= 24
        const openRoom = () => router.push(`/rooms/${room.code}`)

        return (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={t('card.openRoom', { name: room.name || t('card.unnamed') })}
            onClick={openRoom}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                openRoom()
              }
            }}
          >
            {/* Hover glow — kept subtle so it doesn't compete with the primary
                "Accéder" action, which is the only element that should read as
                a call to action. */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg opacity-0 group-hover:opacity-15 transition-opacity duration-500" />

            <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden group-hover:border-primary/40 transition-all duration-300">
              {/* Top accent bar */}
              <div className={`h-1 ${
                room.type === "movie"
                  ? "bg-gradient-to-r from-primary to-blue-500"
                  : "bg-gradient-to-r from-accent to-purple-500"
              }`} />

              <div className="p-4">
                {/* Header: icon + title/badge + meta on one tight block. */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${
                    room.type === "movie"
                      ? "bg-gradient-to-br from-primary to-blue-500"
                      : "bg-gradient-to-br from-accent to-purple-500"
                  }`}>
                    {room.type === "movie" ? (
                      <Film className="w-5 h-5 text-white" aria-hidden="true" />
                    ) : (
                      <Tv className="w-5 h-5 text-white" aria-hidden="true" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base truncate" title={room.name || t('card.unnamed')}>
                        {room.name || t('card.unnamed')}
                      </h3>
                      {expiringSoon ? (
                        <Badge className="text-[10px] px-1.5 py-0 bg-orange-500/20 text-orange-500 border-orange-500/30 shrink-0">
                          {t('card.expiresIn', { hours: hoursLeft })}
                        </Badge>
                      ) : isRecent && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-green-500/20 text-green-500 border-green-500/30 shrink-0">
                          {t('card.new')}
                        </Badge>
                      )}
                    </div>

                    {/* One compact meta line: members · matches · (rating) · date */}
                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground mt-0.5">
                      <span
                        className="flex items-center gap-1 text-blue-400"
                        aria-label={t('card.membersLabel', { count: room.memberCount || 0 })}
                      >
                        <Users className="w-3.5 h-3.5" aria-hidden="true" />
                        {room.memberCount || 0}
                      </span>
                      <span
                        className={`flex items-center gap-1 ${
                          (room.matchCount || 0) > 0 ? "text-pink-400" : ""
                        }`}
                        aria-label={t('card.matchesLabel', { count: room.matchCount || 0 })}
                      >
                        <Heart className={`w-3.5 h-3.5 ${(room.matchCount || 0) > 0 ? "fill-pink-400" : ""}`} aria-hidden="true" />
                        {room.matchCount || 0}
                      </span>
                      {room.minRating && room.minRating > 0 && (
                        <span
                          className="flex items-center gap-1"
                          title={t('card.minRating', { rating: room.minRating })}
                          aria-label={t('card.minRating', { rating: room.minRating })}
                        >
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" aria-hidden="true" />
                          {room.minRating}+
                        </span>
                      )}
                      <span className="text-muted-foreground/70">·</span>
                      <span className="text-muted-foreground/70">
                        {createdDate.toLocaleDateString(locale, { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions — "Accéder" is the primary action (full width); invite
                    is demoted to an icon button. */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <ShareRoomButton
                    roomCode={room.code}
                    roomName={room.name || t('card.unnamed')}
                    variant="outline"
                    size="icon"
                    iconOnly
                    className="border-border hover:bg-foreground/5 h-9 w-9 shrink-0"
                  />
                  <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-md text-sm h-9"
                      onClick={(e) => {
                        e.stopPropagation()
                        openRoom()
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
