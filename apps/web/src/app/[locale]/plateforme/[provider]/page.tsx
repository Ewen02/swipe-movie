import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { buildLanguageAlternates, SITE_NAME, SITE_URL } from '@/lib/seo';
import { getProviderBySlug, listGenres, PROVIDERS } from '@/lib/catalog';
import { getMoviesByGenrePublic } from '@/lib/movies-public';
import { ListingPage } from '@/components/movies/public/ListingPage';
import { SEOPageTracker } from '@/components/seo/SEOPageTracker';
import { buildMovieSlug } from '@/lib/slug';

export const dynamicParams = false;
export const revalidate = 43200; // 12h

type Params = { locale: string; provider: string };

const COPY = {
  fr: {
    breadcrumbHome: 'Accueil',
    breadcrumbCatalog: 'Plateformes',
    titlePrefix: 'Meilleurs films sur',
    cta: 'Lance une room pour choisir ton film',
    empty: 'Aucun film trouvé sur cette plateforme.',
    relatedGenres: 'Explore par genre',
    sectionFaq: 'Questions fréquentes',
    descTpl: (provider: string, intro: string) =>
      `${intro} Sélection des meilleurs films à regarder sur ${provider}, mise à jour automatiquement.`,
  },
  en: {
    breadcrumbHome: 'Home',
    breadcrumbCatalog: 'Platforms',
    titlePrefix: 'Best movies on',
    cta: 'Start a room to pick a movie',
    empty: 'No movies found on this platform.',
    relatedGenres: 'Explore by genre',
    sectionFaq: 'Frequently asked questions',
    descTpl: (provider: string, intro: string) =>
      `${intro} Hand-picked best movies on ${provider}, updated automatically.`,
  },
  es: {
    breadcrumbHome: 'Inicio',
    breadcrumbCatalog: 'Plataformas',
    titlePrefix: 'Mejores películas en',
    cta: 'Abre una sala para elegir una película',
    empty: 'No se han encontrado películas en esta plataforma.',
    relatedGenres: 'Explora por género',
    sectionFaq: 'Preguntas frecuentes',
    descTpl: (provider: string, intro: string) =>
      `${intro} Selección de las mejores películas en ${provider}, actualizada automáticamente.`,
  },
  de: {
    breadcrumbHome: 'Start',
    breadcrumbCatalog: 'Plattformen',
    titlePrefix: 'Beste Filme auf',
    cta: 'Starte einen Raum, um einen Film zu wählen',
    empty: 'Keine Filme auf dieser Plattform gefunden.',
    relatedGenres: 'Nach Genre stöbern',
    sectionFaq: 'Häufig gestellte Fragen',
    descTpl: (provider: string, intro: string) =>
      `${intro} Handverlesene beste Filme auf ${provider}, automatisch aktualisiert.`,
  },
  it: {
    breadcrumbHome: 'Home',
    breadcrumbCatalog: 'Piattaforme',
    titlePrefix: 'Migliori film su',
    cta: 'Apri una room per scegliere un film',
    empty: 'Nessun film trovato su questa piattaforma.',
    relatedGenres: 'Esplora per genere',
    sectionFaq: 'Domande frequenti',
    descTpl: (provider: string, intro: string) =>
      `${intro} Selezione dei migliori film su ${provider}, aggiornata automaticamente.`,
  },
} as const;

function getCopy(locale: string) {
  return COPY[locale as Locale] ?? COPY.fr;
}

function regionForLocale(locale: string): string {
  return locale === 'en' ? 'US' : 'FR';
}

export function generateStaticParams() {
  return Object.keys(PROVIDERS).flatMap((provider) =>
    locales.map((locale) => ({ locale, provider })),
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, provider } = await params;
  const p = getProviderBySlug(provider);
  if (!p) return { title: 'Plateforme introuvable', robots: { index: false } };

  const t = getCopy(locale);
  const name = p.name[locale as Locale] ?? p.name.fr;
  const intro = p.intro[locale as Locale] ?? p.intro.fr;
  const path = `/plateforme/${provider}`;
  const canonical = `${SITE_URL}/${locale}${path}`;
  const description = t.descTpl(name, intro).slice(0, 160);
  const title = `${t.titlePrefix} ${name}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
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

export default async function PlatformPage({ params }: { params: Promise<Params> }) {
  const { locale, provider } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
  const p = getProviderBySlug(provider);
  if (!p) notFound();

  const t = getCopy(locale);
  const name = p.name[locale as Locale] ?? p.name.fr;
  const intro = p.intro[locale as Locale] ?? p.intro.fr;
  const sections = p.sections?.[locale as Locale] ?? p.sections?.fr;
  const faq = p.faq?.[locale as Locale] ?? p.faq?.fr;

  // Genre 0 = all genres in the existing API; couple with watchProviders + region
  // to get the platform-wide top.
  const movies = await getMoviesByGenrePublic(0, locale, {
    watchProviders: [p.tmdbId],
    region: regionForLocale(locale),
    page: 1,
  });

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${t.titlePrefix} ${name}`,
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
        name,
        item: `${SITE_URL}/${locale}/plateforme/${provider}`,
      },
    ],
  };

  const faqLd = faq
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

  const facets = (
    <section aria-labelledby="related-genres" className="space-y-3">
      <h2
        id="related-genres"
        className="text-sm font-semibold text-muted-foreground uppercase tracking-wide"
      >
        {t.relatedGenres}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {listGenres()
          .slice(0, 10)
          .map((g) => (
            <li key={g.slug}>
              <Link
                href={`/${locale}/plateforme/${provider}/${g.slug}`}
                className="inline-flex items-center rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-sm hover:border-primary hover:text-primary transition"
              >
                {name} · {g.name[locale as Locale] ?? g.name.fr}
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );

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
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}
      <SEOPageTracker pageType="plateforme" locale={locale} slug={provider} title={name} provider={provider} />
      <ListingPage
        title={`${t.titlePrefix} ${name}`}
        intro={intro}
        movies={movies}
        locale={locale}
        emptyLabel={t.empty}
        breadcrumbs={[
          { label: t.breadcrumbHome, href: `/${locale}` },
          { label: t.breadcrumbCatalog, href: `/${locale}/films` },
          { label: name },
        ]}
        ctaLabel={t.cta}
        ctaHref={`/${locale}/try`}
        facets={facets}
      />
      {(sections && sections.length > 0) || (faq && faq.length > 0) ? (
        <div className="container mx-auto px-4 pb-12 md:pb-16 space-y-10 max-w-4xl">
          {sections?.map((s, i) => (
            <section key={i} className="space-y-3">
              <h2 className="text-2xl font-semibold">{s.heading}</h2>
              <p className="text-base text-muted-foreground leading-relaxed">{s.body}</p>
            </section>
          ))}

          {faq && faq.length > 0 ? (
            <section aria-labelledby="faq" className="space-y-4">
              <h2 id="faq" className="text-2xl font-semibold">
                {t.sectionFaq}
              </h2>
              <dl className="space-y-4">
                {faq.map((f, i) => (
                  <div key={i} className="rounded-2xl border border-border/60 bg-card/40 p-5">
                    <dt className="font-medium mb-2">{f.question}</dt>
                    <dd className="text-muted-foreground leading-relaxed">{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
