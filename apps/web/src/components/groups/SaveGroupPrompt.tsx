"use client"

import { useState } from "react"
import { Button } from "@swipe-movie/ui"
import { Bookmark, Check, X, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { createGroup } from "@/lib/api/groups"
import { useToast } from "@/components/providers/toast-provider"
import { captureEvent, ANALYTICS_EVENTS } from "@/components/providers/PostHogProvider"

interface SaveGroupPromptProps {
  roomId: string
  /** Hidden when the room already belongs to a group, or fewer than 2 members. */
  alreadyInGroup?: boolean
  membersCount: number
}

/**
 * Captures the moment of value: after swiping together, offer to save this crew
 * as a persistent group so they can be re-launched in one click later. This is
 * what turns a one-off room into a returning habit. Dismissible per session.
 */
export function SaveGroupPrompt({
  roomId,
  alreadyInGroup,
  membersCount,
}: SaveGroupPromptProps) {
  const t = useTranslations("groups")
  const { toast } = useToast()
  const [state, setState] = useState<"idle" | "saving" | "saved" | "dismissed">(
    "idle",
  )

  // Only worth saving a real crew, and not if it's already a group session.
  if (alreadyInGroup || membersCount < 2) return null
  if (state === "dismissed" || state === "saved") return null

  const handleSave = async () => {
    setState("saving")
    try {
      const group = await createGroup({ fromRoomId: roomId })
      captureEvent(ANALYTICS_EVENTS.GROUP_CREATED, {
        groupId: group.id,
        memberCount: group.memberCount,
        source: "room_prompt",
      })
      setState("saved")
      toast({ title: t("savedTitle"), description: t("savedDescription") })
    } catch (e) {
      setState("idle")
      toast({
        title: t("saveError"),
        description: e instanceof Error ? e.message : "",
        type: "error",
      })
    }
  }

  return (
    <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-3">
      <Bookmark className="w-5 h-5 text-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground">{t("savePromptTitle")}</div>
        <div className="text-xs text-muted-foreground">{t("savePromptSubtitle")}</div>
      </div>
      <Button size="sm" onClick={handleSave} disabled={state === "saving"}>
        {state === "saving" ? (
          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
        ) : (
          <Check className="w-4 h-4 mr-1.5" />
        )}
        {t("savePromptCta")}
      </Button>
      <button
        onClick={() => setState("dismissed")}
        aria-label={t("savePromptDismiss")}
        className="text-muted-foreground hover:text-foreground shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
