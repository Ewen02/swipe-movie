import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

type RatingVariant = "card" | "match" | "topMatch"

interface RatingBadgeProps {
  rating: number
  variant?: RatingVariant
  className?: string
}

const variantStyles = {
  card: {
    container: "flex items-center gap-1 bg-black/40 rounded-full px-3 py-1",
    icon: "w-4 h-4 text-yellow-400 fill-yellow-400",
    text: "text-white font-semibold text-sm"
  },
  match: {
    container: "flex items-center gap-1",
    icon: "w-3 h-3 text-yellow-400 fill-yellow-400",
    text: "text-xs text-gray-600 dark:text-gray-400"
  },
  topMatch: {
    container: "text-lg px-4 py-2 border-2 border-yellow-500 text-yellow-700 dark:text-yellow-400 font-bold",
    icon: "w-5 h-5 mr-2 fill-yellow-500",
    text: ""
  }
}

export function RatingBadge({ rating, variant = "card", className }: RatingBadgeProps) {
  const styles = variantStyles[variant]

  if (variant === "topMatch") {
    return (
      <Badge
        variant="outline"
        className={cn(styles.container, className)}
      >
        <Star className={styles.icon} />
        {rating.toFixed(1)}/10
      </Badge>
    )
  }

  return (
    <div className={cn(styles.container, className)}>
      <Star className={styles.icon} />
      <span className={styles.text}>{rating.toFixed(1)}</span>
    </div>
  )
}
