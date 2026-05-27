/**
 * Slugify a title (kebab-case, ASCII-folded, max 60 chars).
 * Strips diacritics, lowercases, replaces non-alphanum runs with `-`.
 */
export function slugifyTitle(title: string): string {
  return (
    (title || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'film'
  );
}

/**
 * Build a `slug-tmdbId` token used in movie/series URLs.
 * Example: `oppenheimer-872585`.
 */
export function buildMovieSlug(title: string, tmdbId: number): string {
  return `${slugifyTitle(title)}-${tmdbId}`;
}

/**
 * Parse a `slug-tmdbId` token back into the TMDB id (the last numeric segment).
 * Returns null if the slug doesn't end with a valid id.
 */
export function parseMovieSlug(slug: string): { id: number; slug: string } | null {
  const match = /^(.*)-(\d+)$/.exec(slug);
  if (!match) return null;
  const id = Number(match[2]);
  if (!Number.isFinite(id) || id <= 0) return null;
  return { id, slug: match[1] ?? '' };
}
