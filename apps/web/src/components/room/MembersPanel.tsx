import { Users, UserPlus } from "lucide-react"
import { ShareRoomButton } from "@/components/room/ShareRoomButton"
import { motion } from "framer-motion"
import type { User } from "@/schemas/rooms"

interface MembersPanelProps {
  members: User[]
  roomCode: string
  roomName: string
  translations: {
    unnamedRoom: string
    roomMembers: string
    unknownUser: string
  }
}

export function MembersPanel({
  members,
  roomCode,
  roomName,
  translations: t,
}: MembersPanelProps) {
  const displayName = roomName || t.unnamedRoom

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Membres</p>
              <p className="text-2xl font-bold text-orange-400">{members.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {10 - members.length} places restantes
          </p>
        </div>

        <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Capacité</p>
              <p className="text-2xl font-bold">{Math.round((members.length / 10) * 100)}%</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="mt-2 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all"
              style={{ width: `${(members.length / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
          <div className="p-5">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              {t.roomMembers}
            </h3>

            <div className="space-y-3">
              {members.map((member, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
                    {(member.name ?? "?")[0]!.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {member.name ?? t.unknownUser}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {idx === 0 ? "Créateur" : "Membre"}
                    </p>
                  </div>
                  {idx === 0 && (
                    <div className="px-2 py-1 rounded-lg bg-orange-500/20 text-orange-400 text-xs font-medium">
                      Admin
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Invite Section */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Invitez vos amis à rejoindre cette room
              </p>
              <ShareRoomButton
                roomCode={roomCode}
                roomName={displayName}
                variant="default"
                size="default"
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 shadow-lg text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
