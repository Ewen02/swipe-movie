import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface AgreementBadgeProps {
  voteCount: number
  totalMembers: number
  variant?: "small" | "large"
  className?: string
}

export function AgreementBadge({
  voteCount,
  totalMembers,
  variant = "large",
  className
}: AgreementBadgeProps) {
  const percentage = Math.round((voteCount / totalMembers) * 100)

  if (variant === "small") {
    return (
      <span className={cn("text-green-600 dark:text-green-400 font-medium", className)}>
        {percentage}%
      </span>
    )
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-lg px-4 py-2 border-2 border-green-500 text-green-700 dark:text-green-400 font-bold",
        className
      )}
    >
      <Users className="w-5 h-5 mr-2" />
      {percentage}% d&apos;accord
    </Badge>
  )
}
