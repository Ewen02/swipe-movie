import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { buildLanguageAlternates, SITE_NAME, SITE_URL } from '@/lib/seo';
import { listGenres, listProviders } from '@/lib/catalog';
import { listContexts } from '@/lib/contexts';
import { SEOPageTracker } from '@/components/seo/SEOPageTracker';

export const revalidate = 604800; // 7d — hub content rarely changes

type Params = { locale: string };

const COPY = {
  fr: {
    breadcrumbHome: 'Accueil',
    title: 'Tous les films à regarder, par genre et plateforme',
    intro:
      'Trouve ton prochain film en explorant par genre ou par plateforme de streaming. Sélection mise à jour automatiquement, sans débat : lance une room, swipe avec tes amis et matchez sur le bon film.',
    cta: 'Lance ta room',
    sectionGenres: 'Explorer par genre',
    sectionPlatforms: 'Explorer par plateforme de streaming',
    sectionCombos: 'Combinaisons populaires',
    sectionContexts: 'Explorer par contexte',
    contextsIntro:
      'Les sélections les plus utiles selon ton moment : soirée couple, entre amis, en famille, Halloween, Noël, court soir…',
  },
  en: {
    breadcrumbHome: 'Home',
    title: 'All movies to watch, by genre and platform',
    intro:
      'Find your next movie by browsing by genre or streaming platform. Automatically updated selection: start a room, swipe with friends and match on the right movie.',
    cta: 'Start your room',
    sectionGenres: 'Browse by genre',
    sectionPlatforms: 'Browse by streaming platform',
    sectionCombos: 'Popular combinations',
    sectionContexts: 'Browse by context',
    contextsIntro:
      'Most useful selections by occasion: couple night, with friends, family, Halloween, Christmas, short night…',
  },
  es: {
    breadcrumbHome: 'Inicio',
    title: 'Todas las películas para ver, por género y plataforma',
    intro:
      'Encuentra tu próxima película explorando por género o plataforma de streaming. Selección actualizada automáticamente: abre una sala, desliza con amigos y haz match en la película adecuada.',
    cta: 'Abre tu sala',
    sectionGenres: 'Explorar por género',
    sectionPlatforms: 'Explorar por plataforma de streaming',
    sectionCombos: 'Combinaciones populares',
    sectionContexts: 'Explorar por contexto',
    contextsIntro:
      'Las selecciones más útiles según el momento: noche en pareja, con amigos, en familia, Halloween, Navidad, noche corta…',
  },
  de: {
    breadcrumbHome: 'Start',
    title: 'Alle Filme zum Schauen, nach Genre und Plattform',
    intro:
      'Finde deinen nächsten Film durch Stöbern nach Genre oder Streaming-Plattform. Automatisch aktualisierte Auswahl: starte einen Raum, swipe mit Freunden und matche auf den richtigen Film.',
    cta: 'Starte deinen Raum',
    sectionGenres: 'Nach Genre stöbern',
    sectionPlatforms: 'Nach Streaming-Plattform stöbern',
    sectionCombos: 'Beliebte Kombinationen',
    sectionContexts: 'Nach Anlass stöbern',
    contextsIntro:
      'Die nützlichsten Auswahlen nach Anlass: Pärchen-Abend, mit Freunden, Familie, Halloween, Weihnachten, kurze Nacht…',
  },
  it: {
    breadcrumbHome: 'Home',
    title: 'Tutti i film da guardare, per genere e piattaforma',
    intro:
      'Trova il tuo prossimo film esplorando per genere o piattaforma streaming. Selezione aggiornata automaticamente: apri una room, swippa con amici e fai match sul film giusto.',
    cta: 'Apri la tua room',
    sectionGenres: 'Esplora per genere',
    sectionPlatforms: 'Esplora per piattaforma streaming',
    sectionCombos: 'Combinazioni popolari',
    sectionContexts: 'Esplora per contesto',
    contextsIntro:
      'Le selezioni più utili per occasione: serata in coppia, tra amici, in famiglia, Halloween, Natale, serata breve…',
  },
} as const;

function getCopy(locale: string) {
  return COPY[locale as Locale] ?? COPY.fr;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getCopy(locale);
  const path = '/films';
  const canonical = `${SITE_URL}/${locale}${path}`;

  return {
    title: t.title,
    description: t.intro.slice(0, 160),
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title: `${t.title} | ${SITE_NAME}`,
      description: t.intro.slice(0, 160),
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.intro.slice(0, 160),
    },
  };
}

export default async function FilmsHubPage({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const t = getCopy(locale);
  const genres = listGenres();
  const providers = listProviders();
  const contexts = listContexts();

  // Hand-picked combinations that map to common search intents.
  const HOT_COMBOS = [
    { provider: 'netflix', genre: 'horreur' },
    { provider: 'netflix', genre: 'comedie' },
    { provider: 'netflix', genre: 'thriller' },
    { provider: 'prime-video', genre: 'action' },
    { provider: 'prime-video', genre: 'drame' },
    { provider: 'disney-plus', genre: 'famille' },
    { provider: 'disney-plus', genre: 'animation' },
    { provider: 'max', genre: 'science-fiction' },
    { provider: 'apple-tv-plus', genre: 'drame' },
    { provider: 'canal-plus', genre: 'comedie' },
    { provider: 'crunchyroll', genre: 'animation' },
  ];

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.breadcrumbHome, item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Films', item: `${SITE_URL}/${locale}/films` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <SEOPageTracker pageType="hub" locale={locale} slug="films" title={t.title} />
      <div className="container mx-auto px-4 py-8 md:py-12 space-y-12 max-w-6xl">
        <header className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t.title}
            </span>
          </h1>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">{t.intro}</p>
          <Link
            href={`/${locale}/try`}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition"
          >
            {t.cta}
          </Link>
        </header>

        <section aria-labelledby="contexts-title" className="space-y-4">
          <h2 id="contexts-title" className="text-2xl font-semibold">
            {t.sectionContexts}
          </h2>
          <p className="text-muted-foreground max-w-3xl">{t.contextsIntro}</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {contexts.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${locale}/contexte/${c.slug}`}
                  className="block rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm font-medium hover:border-primary hover:text-primary transition"
                >
                  {c.title[locale as Locale] ?? c.title.fr}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="genres-title" className="space-y-4">
          <h2 id="genres-title" className="text-2xl font-semibold">
            {t.sectionGenres}
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {genres.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/${locale}/genre/${g.slug}`}
                  className="block rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm font-medium hover:border-primary hover:text-primary transition"
                >
                  {g.name[locale as Locale] ?? g.name.fr}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="platforms-title" className="space-y-4">
          <h2 id="platforms-title" className="text-2xl font-semibold">
            {t.sectionPlatforms}
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {providers.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/${locale}/plateforme/${p.slug}`}
                  className="block rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm font-medium hover:border-primary hover:text-primary transition"
                >
                  {p.name[locale as Locale] ?? p.name.fr}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="combos-title" className="space-y-4">
          <h2 id="combos-title" className="text-2xl font-semibold">
            {t.sectionCombos}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {HOT_COMBOS.map((c) => {
              const p = providers.find((x) => x.slug === c.provider);
              const g = genres.find((x) => x.slug === c.genre);
              if (!p || !g) return null;
              const providerName = p.name[locale as Locale] ?? p.name.fr;
              const genreName = g.name[locale as Locale] ?? g.name.fr;
              return (
                <li key={`${c.provider}-${c.genre}`}>
                  <Link
                    href={`/${locale}/plateforme/${c.provider}/${c.genre}`}
                    className="block rounded-2xl border border-border/60 bg-card/60 px-4 py-3 text-sm font-medium hover:border-primary hover:text-primary transition"
                  >
                    {providerName} · {genreName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}
