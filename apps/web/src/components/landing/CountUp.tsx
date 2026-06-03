'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

/**
 * CountUp — counts from 0 to `end` once the element scrolls into view.
 * Tiny client island (IntersectionObserver + requestAnimationFrame), no
 * framer-motion. SSR renders the final value so the number is present without
 * JS and for crawlers; the count-up is purely progressive enhancement.
 */
export function CountUp({
  end,
  suffix = '',
  prefix = '',
  duration = 1.8,
  className = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(end);
  // Locale formatting (toLocaleString) differs between the server's default
  // locale and the browser, causing a hydration mismatch. Render the plain
  // integer until the client takes over, then format locally.
  const [formatted, setFormatted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    setFormatted(true);

    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let raf = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(end * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setValue(0);
          raf = requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { rootMargin: '-50px' },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted ? value.toLocaleString() : value}
      {suffix}
    </span>
  );
}
