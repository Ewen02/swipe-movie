import { Skeleton } from "@swipe-movie/ui"

export function OnboardingPageSkeleton() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] animate-pulse">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-0 mb-2">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-3 w-16 mt-2" />
              </div>
              {index < 2 && (
                <Skeleton className="h-0.5 w-16 sm:w-24 md:w-32 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl p-6">
        {/* Step header */}
        <div className="text-center mb-6">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>

        {/* Provider/Genre grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-foreground/5"
            >
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
              <Skeleton className="h-5 flex-1" />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-border/50">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
