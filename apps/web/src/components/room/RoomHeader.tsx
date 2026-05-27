import { Badge } from "@swipe-movie/ui"
import { Film, Users, RefreshCw } from "lucide-react"
import { ShareRoomButton } from "@/components/room/ShareRoomButton"
import { motion } from "framer-motion"

interface RoomHeaderProps {
  roomName: string
  roomCode: string
  roomType: string | undefined
  membersCount: number
  isRecurring?: boolean
  lastResetAt?: string | null
  recurringInterval?: string | null
  translations: {
    unnamedRoom: string
    moviesType: string
    tvShowsType: string
  }
}

function getNextResetLabel(lastResetAt: string | null | undefined, interval: string | null | undefined): string | null {
  if (!lastResetAt || !interval) return null
  const last = new Date(lastResetAt)
  const intervalMs = interval === 'weekly' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000
  const nextReset = new Date(last.getTime() + intervalMs)
  const daysLeft = Math.max(0, Math.ceil((nextReset.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
  return `${daysLeft}j`
}

export function RoomHeader({
  roomName,
  roomCode,
  roomType,
  membersCount,
  isRecurring,
  lastResetAt,
  recurringInterval,
  translations: t,
}: RoomHeaderProps) {
  const displayName = roomName || t.unnamedRoom

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shrink-0">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                    {displayName}
                  </h1>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>
                      Code: <span className="font-mono font-semibold text-primary">{roomCode}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {membersCount}/10
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                <Badge className="bg-foreground/10 text-foreground border-border shrink-0">
                  {roomType === 'movie' ? t.moviesType : t.tvShowsType}
                </Badge>
                {isRecurring && (
                  <Badge className="bg-primary/10 text-primary border-primary/30 shrink-0 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Récurrente {getNextResetLabel(lastResetAt, recurringInterval) && `· Prochain reset dans ${getNextResetLabel(lastResetAt, recurringInterval)}`}
                  </Badge>
                )}
                <ShareRoomButton
                  roomCode={roomCode}
                  roomName={displayName}
                  variant="default"
                  size="default"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg text-white ml-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
