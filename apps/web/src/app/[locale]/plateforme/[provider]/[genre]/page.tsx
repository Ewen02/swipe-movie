import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { buildLanguageAlternates, SITE_NAME, SITE_URL } from '@/lib/seo';
import { getProviderBySlug, getGenreBySlug, PROVIDERS, GENRES } from '@/lib/catalog';
import { getMoviesByGenrePublic } from '@/lib/movies-public';
import { ListingPage } from '@/components/movies/public/ListingPage';
import { SEOPageTracker } from '@/components/seo/SEOPageTracker';
import { buildMovieSlug } from '@/lib/slug';

export const dynamicParams = false;
export const revalidate = 43200;

type Params = { locale: string; provider: string; genre: string };

const COPY = {
  fr: {
    breadcrumbHome: 'Accueil',
    breadcrumbCatalog: 'Films',
    titleTpl: (provider: string, genre: string) =>
      `Meilleurs films ${genre.toLowerCase()} sur ${provider}`,
    cta: 'Lance une room pour choisir ton film',
    empty: 'Aucun film trouvé pour cette combinaison.',
    descTpl: (provider: string, genre: string) =>
      `Sélection des meilleurs films ${genre.toLowerCase()} disponibles sur ${provider}. Sélection mise à jour, casting, où regarder. Swipez entre amis pour trouver le bon.`,
  },
  en: {
    breadcrumbHome: 'Home',
    breadcrumbCatalog: 'Movies',
    titleTpl: (provider: string, genre: string) =>
      `Best ${genre.toLowerCase()} movies on ${provider}`,
    cta: 'Start a room to pick a movie',
    empty: 'No movies found for this combination.',
    descTpl: (provider: string, genre: string) =>
      `Hand-picked ${genre.toLowerCase()} movies on ${provider}. Up-to-date selection, cast, where to watch. Swipe with friends to find the right one.`,
  },
  es: {
    breadcrumbHome: 'Inicio',
    breadcrumbCatalog: 'Películas',
    titleTpl: (provider: string, genre: string) =>
      `Mejores películas ${genre.toLowerCase()} en ${provider}`,
    cta: 'Abre una sala para elegir una película',
    empty: 'No se han encontrado películas para esta combinación.',
    descTpl: (provider: string, genre: string) =>
      `Películas ${genre.toLowerCase()} seleccionadas en ${provider}. Selección actualizada, reparto, dónde verlas. Desliza con amigos para encontrar la indicada.`,
  },
  de: {
    breadcrumbHome: 'Start',
    breadcrumbCatalog: 'Filme',
    titleTpl: (provider: string, genre: string) => `Beste ${genre}-Filme auf ${provider}`,
    cta: 'Starte einen Raum, um einen Film zu wählen',
    empty: 'Keine Filme für diese Kombination gefunden.',
    descTpl: (provider: string, genre: string) =>
      `Handverlesene ${genre}-Filme auf ${provider}. Aktuelle Auswahl, Besetzung, wo zu schauen. Swipe mit Freunden, um den richtigen zu finden.`,
  },
  it: {
    breadcrumbHome: 'Home',
    breadcrumbCatalog: 'Film',
    titleTpl: (provider: string, genre: string) =>
      `Migliori film ${genre.toLowerCase()} su ${provider}`,
    cta: 'Apri una room per scegliere un film',
    empty: 'Nessun film trovato per questa combinazione.',
    descTpl: (provider: string, genre: string) =>
      `Film ${genre.toLowerCase()} selezionati su ${provider}. Selezione aggiornata, cast, dove guardare. Swippa con gli amici per trovare quello giusto.`,
  },
} as const;

function getCopy(locale: string) {
  return COPY[locale as Locale] ?? COPY.fr;
}

function regionForLocale(locale: string): string {
  return locale === 'en' ? 'US' : 'FR';
}

export function generateStaticParams() {
  // Pre-render every provider × genre combination per locale (~8 × 18 × 2 ≈ 288).
  // Worth pre-building: small set, high SEO value (long-tail keywords).
  const params: Params[] = [];
  for (const locale of locales) {
    for (const provider of Object.keys(PROVIDERS)) {
      for (const genre of Object.keys(GENRES)) {
        params.push({ locale, provider, genre });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, provider, genre } = await params;
  const p = getProviderBySlug(provider);
  const g = getGenreBySlug(genre);
  if (!p || !g) return { title: 'Page introuvable', robots: { index: false } };

  const t = getCopy(locale);
  const providerName = p.name[locale as Locale] ?? p.name.fr;
  const genreName = g.name[locale as Locale] ?? g.name.fr;
  const title = t.titleTpl(providerName, genreName);
  const description = t.descTpl(providerName, genreName).slice(0, 160);
  const path = `/plateforme/${provider}/${genre}`;
  const canonical = `${SITE_URL}/${locale}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
    // provider×genre combos are useful product filters but hold no unique
    // editorial content vs the standalone /genre and /plateforme pages.
    // Keep them out of the index to avoid thin/duplicate-content dilution,
    // but follow so link equity still flows to the film pages.
    robots: { index: false, follow: true },
    openGraph: {
      type: 'website',
      url: canonical,
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PlatformGenrePage({ params }: { params: Promise<Params> }) {
  const { locale, provider, genre } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
  const p = getProviderBySlug(provider);
  const g = getGenreBySlug(genre);
  if (!p || !g) notFound();

  const t = getCopy(locale);
  const providerName = p.name[locale as Locale] ?? p.name.fr;
  const genreName = g.name[locale as Locale] ?? g.name.fr;
  const title = t.titleTpl(providerName, genreName);
  const intro = g.intro[locale as Locale] ?? g.intro.fr;

  const movies = await getMoviesByGenrePublic(g.tmdbId, locale, {
    watchProviders: [p.tmdbId],
    region: regionForLocale(locale),
    page: 1,
  });

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    numberOfItems: movies.length,
    itemListElement: movies.slice(0, 20).map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/${locale}/film/${buildMovieSlug(m.title, m.id)}`,
      name: m.title,
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.breadcrumbHome, item: `${SITE_URL}/${locale}` },
      {
        '@type': 'ListItem',
        position: 2,
        name: t.breadcrumbCatalog,
        item: `${SITE_URL}/${locale}/films`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: providerName,
        item: `${SITE_URL}/${locale}/plateforme/${provider}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: genreName,
        item: `${SITE_URL}/${locale}/plateforme/${provider}/${genre}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <SEOPageTracker pageType="combo" locale={locale} slug={`${provider}/${genre}`} title={title} provider={provider} genre={genre} />
      <ListingPage
        title={title}
        intro={intro}
        movies={movies}
        locale={locale}
        emptyLabel={t.empty}
        breadcrumbs={[
          { label: t.breadcrumbHome, href: `/${locale}` },
          { label: t.breadcrumbCatalog, href: `/${locale}/films` },
          { label: providerName, href: `/${locale}/plateforme/${provider}` },
          { label: genreName },
        ]}
        ctaLabel={t.cta}
        ctaHref={`/${locale}/try`}
      />
    </>
  );
}
