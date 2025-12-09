import { Card, CardContent, Skeleton } from "@swipe-movie/ui"

export function SwipeHistorySkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Summary Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="aspect-[2/3]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
