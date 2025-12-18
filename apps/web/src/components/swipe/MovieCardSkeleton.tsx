import { Card, CardContent, Skeleton } from "@swipe-movie/ui"

export function MovieCardSkeleton() {
  return (
    <Card className="h-full bg-white dark:bg-gray-800 shadow-xl">
      <CardContent className="p-0 h-full">
        <div className="relative h-full rounded-lg overflow-hidden">
          {/* Image skeleton */}
          <Skeleton className="absolute inset-0" />

          {/* Bottom info skeleton */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6">
            {/* Badges skeleton */}
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-6 w-16 rounded-full bg-foreground/20" />
              <Skeleton className="h-6 w-16 rounded-full bg-foreground/20" />
              <Skeleton className="h-8 w-8 rounded-md bg-foreground/20" />
            </div>

            {/* Title skeleton */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <Skeleton className="h-8 w-3/4 bg-foreground/20" />
              <Skeleton className="h-10 w-10 rounded-md bg-foreground/20" />
            </div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-foreground/20" />
              <Skeleton className="h-4 w-5/6 bg-foreground/20" />
              <Skeleton className="h-4 w-4/6 bg-foreground/20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
