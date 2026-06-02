"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@swipe-movie/ui"
import { Users, Play, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useGroups } from "@/hooks/useGroups"
import { startGroupSession } from "@/lib/api/groups"
import { useToast } from "@/components/providers/toast-provider"
import { captureEvent, ANALYTICS_EVENTS } from "@/components/providers/PostHogProvider"

/**
 * "Tes groupes" — the retention surface. A saved crew can be re-launched into a
 * fresh swipe session in one tap, which also notifies the other members. Hidden
 * entirely when the user has no groups yet (the save-group prompt creates them).
 */
export function GroupsSection() {
  const t = useTranslations("groups")
  const router = useRouter()
  const { toast } = useToast()
  const { groups, isLoading, refresh } = useGroups()
  const [startingId, setStartingId] = useState<string | null>(null)

  if (isLoading || groups.length === 0) return null

  const handleStart = async (groupId: string) => {
    setStartingId(groupId)
    try {
      const res = await startGroupSession(groupId)
      captureEvent(ANALYTICS_EVENTS.GROUP_SESSION_STARTED, {
        groupId,
        notified: res.notified,
      })
      refresh()
      toast({
        title: t("sessionStartedTitle"),
        description:
          res.notified > 0
            ? t("sessionStartedNotified", { count: res.notified })
            : t("sessionStartedSolo"),
      })
      router.push(`/rooms/${res.code}`)
    } catch (e) {
      toast({
        title: t("sessionError"),
        description: e instanceof Error ? e.message : "",
        type: "error",
      })
      setStartingId(null)
    }
  }

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {t("title")}
        </h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {groups.map((group) => {
          const busy = startingId === group.id
          return (
            <div
              key={group.id}
              className="shrink-0 w-56 rounded-2xl border border-border bg-gradient-to-br from-foreground/5 to-transparent p-4"
            >
              <div className="font-semibold text-foreground truncate">{group.name}</div>
              <div className="text-xs text-muted-foreground mt-1 mb-3">
                {t("memberCount", { count: group.memberCount })}
              </div>
              <Button
                size="sm"
                onClick={() => handleStart(group.id)}
                disabled={busy}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                {busy ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {t("newSession")}
              </Button>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
