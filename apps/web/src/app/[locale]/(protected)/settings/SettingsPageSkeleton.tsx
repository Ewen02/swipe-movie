import { Skeleton } from "@swipe-movie/ui"

export function SettingsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background overflow-hidden flex flex-col">
      {/* Background orbs */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

      <div className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-2xl mx-auto animate-pulse">
          {/* Header */}
          <div className="mb-8">
            <Skeleton className="h-9 w-32 mb-4" />
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="h-9 w-32" />
            </div>
            <Skeleton className="h-5 w-64" />
          </div>

          {/* Profile Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-9 h-9 rounded-xl" />
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data & Privacy Section */}
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-9 h-9 rounded-xl" />
              <Skeleton className="h-6 w-32" />
            </div>

            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-10 w-full rounded-lg mb-4" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/5 to-background/80 backdrop-blur-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-9 h-9 rounded-xl" />
              <Skeleton className="h-6 w-28" />
            </div>

            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
