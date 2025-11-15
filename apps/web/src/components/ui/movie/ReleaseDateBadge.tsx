import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReleaseDateBadgeProps {
  releaseDate: string
  variant?: "card" | "info"
  className?: string
}

export function ReleaseDateBadge({ releaseDate, variant = "card", className }: ReleaseDateBadgeProps) {
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null

  if (!year) return null

  if (variant === "info") {
    return (
      <p className={cn("text-gray-600 dark:text-gray-400", className)}>
        {year}
      </p>
    )
  }

  return (
    <div className={cn("flex items-center gap-1 bg-black/40 rounded-full px-3 py-1", className)}>
      <Calendar className="w-4 h-4 text-blue-400" />
      <span className="text-white font-semibold text-sm">{year}</span>
    </div>
  )
}
