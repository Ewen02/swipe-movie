"use client"

import { motion } from "framer-motion"
import { Film, Heart, History, BarChart3, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomTabNavProps {
  currentTab: string
  onTabChange: (tab: string) => void
  matchCount?: number
  translations: {
    swipe: string
    matches: string
    history: string
    stats: string
    members: string
  }
}

const tabs = [
  { id: "swipe", icon: Film },
  { id: "matches", icon: Heart },
  { id: "history", icon: History },
  { id: "stats", icon: BarChart3 },
  { id: "members", icon: Users },
]

export function BottomTabNav({
  currentTab,
  onTabChange,
  matchCount = 0,
  translations,
}: BottomTabNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden">
      {/* Gradient blur background */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80 backdrop-blur-lg border-t border-white/10" />

      <div className="relative flex items-center justify-around px-2 py-2 pb-safe">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentTab === tab.id
          const label = translations[tab.id as keyof typeof translations]
          const showBadge = tab.id === "matches" && matchCount > 0

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active indicator background */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              )}

              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isActive && "scale-110"
                  )}
                />

                {/* Notification badge */}
                {showBadge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {matchCount > 9 ? "9+" : matchCount}
                  </motion.span>
                )}
              </div>

              <span
                className={cn(
                  "text-[10px] font-medium transition-all",
                  isActive ? "opacity-100" : "opacity-70"
                )}
              >
                {label}
              </span>

              {/* Active dot indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute -bottom-0.5 w-1 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
