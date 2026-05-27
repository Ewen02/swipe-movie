export default function FilmLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-8 max-w-6xl">
      {/* Breadcrumb skeleton */}
      <nav className="flex items-center gap-2">
        <div className="h-4 w-16 rounded bg-muted animate-pulse" />
        <span className="text-muted-foreground">/</span>
        <div className="h-4 w-12 rounded bg-muted animate-pulse" />
        <span className="text-muted-foreground">/</span>
        <div className="h-4 w-32 rounded bg-muted animate-pulse" />
      </nav>

      {/* Hero section skeleton — poster left, info right */}
      <header className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40">
        <div className="flex flex-col gap-8 p-6 md:p-10 lg:flex-row lg:items-end">
          {/* Poster placeholder */}
          <div className="relative mx-auto w-full max-w-[260px] shrink-0">
            <div className="aspect-[2/3] rounded-2xl bg-muted animate-pulse" />
          </div>

          {/* Info placeholder */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Tagline */}
            <div className="h-4 w-40 rounded bg-muted animate-pulse" />
            {/* Title */}
            <div className="h-10 w-3/4 rounded bg-muted animate-pulse" />
            {/* Meta line (genres, runtime, rating) */}
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
              <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
              <div className="h-6 w-24 rounded-full bg-muted animate-pulse" />
            </div>
            {/* Director */}
            <div className="h-4 w-48 rounded bg-muted animate-pulse" />
            {/* Overview lines */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-muted animate-pulse" />
              <div className="h-4 w-full rounded bg-muted animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
            </div>
            {/* CTA button */}
            <div className="h-12 w-64 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </header>

      {/* Content grid skeleton — 2 cols + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Watch providers skeleton */}
          <section className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <div className="h-6 w-36 rounded bg-muted animate-pulse" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 w-12 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          </section>

          {/* Trailer skeleton */}
          <section className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <div className="h-6 w-32 rounded bg-muted animate-pulse" />
            <div className="aspect-video w-full rounded-xl bg-muted animate-pulse" />
          </section>

          {/* Cast skeleton */}
          <section className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <div className="h-6 w-40 rounded bg-muted animate-pulse" />
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shrink-0 w-20 space-y-2">
                  <div className="w-20 h-20 rounded-full bg-muted animate-pulse" />
                  <div className="h-3 w-16 mx-auto rounded bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
            <div className="h-6 w-32 rounded bg-muted animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                  <div className="h-6 w-20 rounded bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
