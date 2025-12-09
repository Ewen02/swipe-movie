import { Users } from "lucide-react"
import { cn } from "../utils/cn"
import { Badge } from "./badge"

interface VoteCountBadgeProps {
  voteCount: number
  totalMembers?: number
  showPercentage?: boolean
  variant?: "absolute" | "inline" | "large"
  className?: string
}

export function VoteCountBadge({
  voteCount,
  totalMembers,
  showPercentage = false,
  variant = "inline",
  className
}: VoteCountBadgeProps) {
  const percentage = totalMembers ? Math.round((voteCount / totalMembers) * 100) : null

  // Absolute positioned badge (for match cards)
  if (variant === "absolute") {
    return (
      <div className="absolute top-2 left-2">
        <Badge className={cn("bg-blue-500 text-white text-xs", className)}>
          <Users className="w-3 h-3 mr-1" />
          {voteCount}
        </Badge>
      </div>
    )
  }

  // Large badge with border (for top match)
  if (variant === "large") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "text-lg px-4 py-2 border-2 border-blue-500 text-blue-700 dark:text-blue-400",
          className
        )}
      >
        {voteCount} vote{voteCount > 1 ? "s" : ""}
      </Badge>
    )
  }

  // Inline display (for match list bottom section)
  if (showPercentage && percentage !== null) {
    return (
      <span className={cn("text-green-600 dark:text-green-400 font-medium", className)}>
        {percentage}%
      </span>
    )
  }

  return (
    <Badge className={cn("bg-blue-500 text-white text-xs", className)}>
      <Users className="w-3 h-3 mr-1" />
      {voteCount}
    </Badge>
  )
}
