import { Skeleton } from "@swipe-movie/ui"

export function ConnectionsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col">
      {/* Background orbs */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      <div className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-2xl mx-auto animate-pulse">
          {/* Header */}
          <div className="mb-8">
            <Skeleton className="h-9 w-36 mb-4" />
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="h-9 w-36" />
            </div>
            <Skeleton className="h-5 w-80" />
          </div>

          {/* Connection Cards */}
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div>
                      <Skeleton className="h-6 w-24 mb-1" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-28 rounded-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* Text Import Section */}
          <div className="mt-6 rounded-2xl border border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-9 h-9 rounded-xl" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-24 w-full rounded-lg mb-3" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>

          {/* Info Section */}
          <div className="mt-8 rounded-2xl border border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl p-6">
            <Skeleton className="h-6 w-48 mb-3" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <Skeleton className="w-4 h-4 rounded shrink-0 mt-0.5" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
