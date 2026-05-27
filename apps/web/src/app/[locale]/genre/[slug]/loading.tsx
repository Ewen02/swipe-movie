export default function GenreLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-8 max-w-6xl">
      {/* Breadcrumb skeleton */}
      <nav className="flex items-center gap-2">
        <div className="h-4 w-16 rounded bg-muted animate-pulse" />
        <span className="text-muted-foreground">/</span>
        <div className="h-4 w-12 rounded bg-muted animate-pulse" />
        <span className="text-muted-foreground">/</span>
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
      </nav>

      {/* Header skeleton */}
      <header className="space-y-4">
        {/* Title */}
        <div className="h-10 md:h-14 w-80 max-w-full rounded bg-muted animate-pulse" />
        {/* Intro text */}
        <div className="space-y-2 max-w-3xl">
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
        </div>
        {/* CTA button */}
        <div className="h-12 w-72 rounded-full bg-muted animate-pulse" />
      </header>

      {/* Grid of 10 skeleton movie cards — matches MovieGrid layout */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i} className="space-y-2">
            {/* Poster placeholder */}
            <div className="aspect-[2/3] rounded-xl bg-muted animate-pulse" />
            {/* Title placeholder */}
            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
            {/* Year / rating placeholder */}
            <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
          </li>
        ))}
      </ul>
    </div>
  )
}
