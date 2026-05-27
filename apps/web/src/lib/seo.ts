import { locales, type Locale, defaultLocale } from '@/i18n';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://swipe-movie.com').replace(
  /\/$/,
  '',
);

export const SITE_NAME = 'Swipe Movie';

export const TWITTER_HANDLE = '@swipemovie';

/**
 * Build a canonical URL for a given locale + path.
 * Path should start with `/` or be empty.
 */
export function localizedUrl(locale: Locale | string, path = ''): string {
  const cleanPath = path && !path.startsWith('/') ? `/${path}` : path;
  return `${SITE_URL}/${locale}${cleanPath}`;
}

/**
 * Build the alternates.languages object for a given path.
 * Includes one entry per supported locale plus an `x-default` fallback
 * pointing to the default locale, as recommended by Google.
 */
export function buildLanguageAlternates(path = ''): Record<string, string> {
  const map: Record<string, string> = {};
  for (const locale of locales) {
    map[locale] = localizedUrl(locale, path);
  }
  map['x-default'] = localizedUrl(defaultLocale, path);
  return map;
}

export type PageMeta = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
};

/**
 * Pick a localized meta block with a safe fallback to the default locale.
 * Accepts arbitrary string keys but always returns a non-null result.
 */
export function pickLocaleMeta<T extends PageMeta>(
  metaByLocale: Record<string, T>,
  locale: string,
): T {
  return metaByLocale[locale] ?? metaByLocale[defaultLocale]!;
}
