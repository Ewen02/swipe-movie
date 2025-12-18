import { Skeleton } from "@swipe-movie/ui"
import { MovieCardSkeleton } from "@/components/swipe/MovieCardSkeleton"

export function RoomPageSkeleton() {
  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col">
      {/* Background orbs */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 py-6 max-w-5xl flex-1 relative z-10">
        {/* Header Glass Card */}
        <div className="mb-6 animate-pulse">
          <div className="relative bg-linear-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-3xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <div className="p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-2xl" />
                  <div className="min-w-0">
                    <Skeleton className="h-7 w-48 mb-2" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-10 w-28 rounded-lg ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden sm:block mb-6 animate-pulse">
          <div className="relative bg-linear-to-br from-background/95 to-background/80 backdrop-blur-xl border border-border rounded-2xl p-1.5">
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Movie Cards Skeleton */}
        <div className="space-y-6">
          <div className="relative h-[550px] w-full max-w-sm mx-auto">
            <MovieCardSkeleton />
          </div>

          {/* Buttons Skeleton */}
          <div className="flex justify-center gap-6">
            <Skeleton className="rounded-full w-14 h-14" />
            <Skeleton className="rounded-full w-12 h-12" />
            <Skeleton className="rounded-full w-14 h-14" />
          </div>
        </div>
      </div>

      {/* Mobile bottom nav placeholder */}
      <div className="h-20 sm:hidden" />
    </div>
  )
}
