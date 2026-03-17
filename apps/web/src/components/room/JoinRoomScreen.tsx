import { Badge, Button } from "@swipe-movie/ui"
import { Users, Film, UserPlus } from "lucide-react"
import { BackgroundOrbs } from "@/components/layout/BackgroundOrbs"
import { motion } from "framer-motion"

interface JoinRoomScreenProps {
  roomName: string
  roomType: string | undefined
  membersCount: number
  joiningRoom: boolean
  onJoinRoom: () => void
  translations: {
    unnamedRoom: string
    moviesType: string
    tvShowsType: string
    membersCount: string
    joinRoomDescription: string
    connecting: string
    joiningButton: string
  }
}

export function JoinRoomScreen({
  roomName,
  roomType,
  membersCount,
  joiningRoom,
  onJoinRoom,
  translations: t,
}: JoinRoomScreenProps) {
  return (
    <div className="min-h-screen bg-background overflow-hidden flex items-center justify-center">
      <BackgroundOrbs />
      <motion.div
        className="relative group max-w-md w-full mx-4 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
        <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg mb-6">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{roomName || t.unnamedRoom}</h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="secondary" className="text-sm bg-foreground/10 border-border">
                {roomType === 'movie' ? t.moviesType : t.tvShowsType}
              </Badge>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{t.membersCount}</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">{t.joinRoomDescription}</p>
            <Button
              onClick={onJoinRoom}
              disabled={joiningRoom}
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg"
            >
              {joiningRoom ? (
                <>
                  <Film className="w-4 h-4 mr-2 animate-pulse" />
                  {t.connecting}
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t.joiningButton}
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
