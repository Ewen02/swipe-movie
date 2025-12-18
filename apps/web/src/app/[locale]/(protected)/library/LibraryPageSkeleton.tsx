import { Skeleton } from "@swipe-movie/ui"

export function LibraryPageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="relative">
            <Skeleton className="aspect-2/3 w-full rounded-xl" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  )
}
