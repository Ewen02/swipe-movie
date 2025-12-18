"use client"

import { memo } from "react"
import { Target } from "lucide-react"
import type { SidebarTranslations } from "../types"

interface ShortcutsCardProps {
  translations: SidebarTranslations
  likeLabel: string
  undoLabel: string
}

export const ShortcutsCard = memo(function ShortcutsCard({
  translations,
  likeLabel,
  undoLabel
}: ShortcutsCardProps) {
  return (
    <div className="bg-gradient-to-br from-foreground/5 to-foreground/2 backdrop-blur-sm rounded-2xl border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2">
        <Target className="w-4 h-4 text-blue-500" />
        {translations.shortcuts}
      </h3>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{translations.nope}</span>
          <kbd className="px-2 py-0.5 bg-foreground/10 rounded text-foreground/80">←</kbd>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{likeLabel}</span>
          <kbd className="px-2 py-0.5 bg-foreground/10 rounded text-foreground/80">→</kbd>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>{undoLabel}</span>
          <kbd className="px-2 py-0.5 bg-foreground/10 rounded text-foreground/80">⌘Z</kbd>
        </div>
      </div>
    </div>
  )
})
