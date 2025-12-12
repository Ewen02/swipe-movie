import { Skeleton } from "@swipe-movie/ui"

export function RoomsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col">
      {/* Background orbs */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      <div className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Hero Header Skeleton */}
        <div className="relative group mb-12">
          <div className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
            {/* Top gradient bar */}
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

            <div className="p-8 md:p-12">
              {/* Header */}
              <div className="mb-8 animate-pulse">
                <Skeleton className="h-7 w-40 rounded-full mb-4" />
                <Skeleton className="h-12 w-72 mb-3" />
                <Skeleton className="h-6 w-96 max-w-full" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8 animate-pulse">
                {[
                  { border: "border-primary/20" },
                  { border: "border-accent/20" },
                  { border: "border-green-500/20" },
                ].map((style, i) => (
                  <div
                    key={i}
                    className={`relative bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md ${style.border} border rounded-2xl p-4 sm:p-3 md:p-6`}
                  >
                    <div className="flex flex-row items-center justify-between sm:flex-col sm:items-start md:flex-row md:items-center gap-2">
                      <div className="flex items-center gap-3 sm:order-2 md:order-1 sm:w-full">
                        <Skeleton className="sm:hidden w-12 h-12 rounded-xl" />
                        <div>
                          <Skeleton className="h-4 w-20 mb-1" />
                          <Skeleton className="h-8 w-12" />
                        </div>
                      </div>
                      <Skeleton className="hidden sm:block sm:order-1 md:order-2 w-10 h-10 md:w-14 md:h-14 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-pulse">
                <Skeleton className="h-14 w-full sm:w-48 rounded-lg" />
                <Skeleton className="h-14 w-full sm:w-48 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* My Rooms Section Skeleton */}
        <div className="max-w-6xl mx-auto animate-pulse">
          <Skeleton className="h-8 w-48 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
              >
                {/* Top accent bar */}
                <Skeleton className="h-1 w-full" />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-6 w-3/4" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-10" />
                        <Skeleton className="h-4 w-10" />
                        <Skeleton className="h-4 w-16 rounded-md" />
                      </div>
                    </div>
                  </div>

                  {/* Details row */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-white/10">
                    <Skeleton className="h-5 w-14 rounded-md" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 flex-1 rounded-lg" />
                    <Skeleton className="h-9 flex-1 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
