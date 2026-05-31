'use client';

import Link from 'next/link';
import { captureEvent } from '@/components/providers/PostHogProvider';

type Props = {
  href: string;
  label: string;
  /** 'film' | 'serie' — the SEO page type this CTA lives on. */
  mediaType: 'film' | 'serie';
  locale: string;
  tmdbId: number;
  title: string;
};

/**
 * Tracked CTA for public SEO movie/series pages. This is the SEO → product
 * bridge (the most important conversion on these pages), so the click is
 * captured as `seo_cta_clicked` before navigation.
 */
export function MovieCtaButton({ href, label, mediaType, locale, tmdbId, title }: Props) {
  return (
    <Link
      href={href}
      onClick={() =>
        captureEvent('seo_cta_clicked', {
          page_type: mediaType,
          locale,
          tmdb_id: tmdbId,
          title,
          destination: href,
        })
      }
      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition"
    >
      {label}
    </Link>
  );
}
