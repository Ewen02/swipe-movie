import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MovieCardSkeleton } from "@/components/swipe/MovieCardSkeleton"

export function RoomPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-6xl flex-1">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0 space-y-3">
              <Skeleton className="h-10 w-64" />
              <div className="flex flex-wrap gap-2 items-center">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />

          {/* Movie Cards Skeleton */}
          <div className="space-y-6">
            <div className="relative h-[600px] w-full max-w-sm mx-auto">
              <MovieCardSkeleton />
            </div>

            {/* Buttons Skeleton */}
            <div className="flex justify-center gap-6 mt-8">
              <Skeleton className="rounded-full w-16 h-16" />
              <Skeleton className="rounded-full w-14 h-14" />
              <Skeleton className="rounded-full w-16 h-16" />
            </div>

            {/* Progress dots skeleton */}
            <div className="flex justify-center mt-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="w-2 h-2 rounded-full" />
                ))}
              </div>
            </div>

            {/* Instructions skeleton */}
            <Skeleton className="h-4 w-96 mx-auto mt-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
