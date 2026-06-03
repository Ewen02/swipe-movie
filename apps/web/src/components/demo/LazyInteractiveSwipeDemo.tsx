'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';

type DemoProps = { className?: string };

/**
 * Lazily loads the InteractiveSwipeDemo (and its framer-motion dependency)
 * only once it scrolls near the viewport. Uses an imperative `import()` fired
 * from an IntersectionObserver rather than `next/dynamic`, so Next does not
 * emit a preload hint for the chunk — framer-motion is kept entirely off the
 * initial download until the user approaches the below-the-fold demo. A
 * skeleton placeholder preserves layout until it mounts.
 */
const Skeleton = () => (
  <div className="w-full aspect-[3/4] max-w-sm mx-auto rounded-2xl bg-muted/40 animate-pulse" />
);

export function LazyInteractiveSwipeDemo({ className = '' }: DemoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [Demo, setDemo] = useState<ComponentType<DemoProps> | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || Demo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          import('@/components/demo/InteractiveSwipeDemo').then((m) =>
            setDemo(() => m.InteractiveSwipeDemo),
          );
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [Demo]);

  return <div ref={ref}>{Demo ? <Demo className={className} /> : <Skeleton />}</div>;
}
