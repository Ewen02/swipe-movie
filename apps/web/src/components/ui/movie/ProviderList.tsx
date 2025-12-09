import { Badge } from "@swipe-movie/ui"
import { getProvidersByIds } from "@/lib/constants/providers"

type ProviderVariant = "card" | "match" | "topMatch"

interface ProviderListProps {
  providerIds: number[]
  variant?: ProviderVariant
  maxVisible?: number
  showNames?: boolean
}

const variantStyles = {
  card: {
    container: "flex items-center gap-1.5 flex-wrap",
    badge: "bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-white font-medium flex items-center gap-1",
    overflow: "bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-white/90 font-medium"
  },
  match: {
    container: "absolute bottom-2 left-2 flex gap-1 flex-wrap max-w-[calc(100%-1rem)]",
    badge: "bg-purple-500/90 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 h-auto",
    overflow: ""
  },
  topMatch: {
    container: "flex items-center gap-2",
    badge: "text-base px-3 py-2 border-2 border-purple-500 text-purple-700 dark:text-purple-400",
    overflow: ""
  }
}

export function ProviderList({
  providerIds,
  variant = "card",
  maxVisible = 2,
  showNames = true
}: ProviderListProps) {
  if (!providerIds || providerIds.length === 0) return null

  const providers = getProvidersByIds(providerIds)
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

  if (providers.length === 0) return null

  const visibleProviders = variant === "topMatch" ? providers : providers.slice(0, maxVisible)
  const remainingCount = providerIds.length - maxVisible
  const styles = variantStyles[variant]

  return (
    <div className={styles.container}>
      {visibleProviders.map((provider) => (
        <Badge
          key={provider.id}
          variant={variant === "topMatch" ? "outline" : undefined}
          className={styles.badge}
          title={provider.name}
        >
          <span>{provider.logo}</span>
          {(showNames && (variant === "card" || variant === "topMatch")) && (
            <span>{provider.name}</span>
          )}
        </Badge>
      ))}

      {variant === "card" && remainingCount > 0 && (
        <div className={styles.overflow}>
          +{remainingCount}
        </div>
      )}
    </div>
  )
}
