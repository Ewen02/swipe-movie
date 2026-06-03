import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { buildLanguageAlternates, SITE_NAME, SITE_URL } from '@/lib/seo';
import { getGenreBySlug, listGenres, listProviders, GENRES } from '@/lib/catalog';
import { getMoviesByGenrePublic } from '@/lib/movies-public';
import { ListingPage } from '@/components/movies/public/ListingPage';
import { SEOPageTracker } from '@/components/seo/SEOPageTracker';
import { buildMovieSlug } from '@/lib/slug';

export const dynamicParams = false;
export const revalidate = 43200; // 12h

type Params = { locale: string; slug: string };

const COPY = {
  fr: {
    breadcrumbHome: 'Accueil',
    breadcrumbCatalog: 'Films',
    titleSuffix: 'Meilleurs films',
    cta: 'Trouve ton prochain film en swipant',
    empty: 'Aucun film trouvé pour ce genre.',
    related: 'Voir aussi par plateforme',
    sectionFaq: 'Questions fréquentes',
    descTpl: (genre: string, intro: string) =>
      `${intro} Meilleurs films ${genre.toLowerCase()} à regarder : sélection mise à jour, plateformes de streaming et matching collaboratif sur Swipe Movie.`,
  },
  en: {
    breadcrumbHome: 'Home',
    breadcrumbCatalog: 'Movies',
    titleSuffix: 'Best movies',
    cta: 'Find your next movie by swiping',
    empty: 'No movies found for this genre.',
    related: 'Also browse by platform',
    sectionFaq: 'Frequently asked questions',
    descTpl: (genre: string, intro: string) =>
      `${intro} Best ${genre.toLowerCase()} movies to watch: up-to-date selection, streaming platforms and collaborative matching on Swipe Movie.`,
  },
  es: {
    breadcrumbHome: 'Inicio',
    breadcrumbCatalog: 'Películas',
    titleSuffix: 'Mejores películas',
    cta: 'Encuentra tu próxima película deslizando',
    empty: 'No se han encontrado películas para este género.',
    related: 'Explora también por plataforma',
    sectionFaq: 'Preguntas frecuentes',
    descTpl: (genre: string, intro: string) =>
      `${intro} Mejores películas ${genre.toLowerCase()} para ver: selección actualizada, plataformas de streaming y matching colaborativo en Swipe Movie.`,
  },
  de: {
    breadcrumbHome: 'Start',
    breadcrumbCatalog: 'Filme',
    titleSuffix: 'Beste Filme',
    cta: 'Finde deinen nächsten Film durch Swipen',
    empty: 'Keine Filme für dieses Genre gefunden.',
    related: 'Auch nach Plattform stöbern',
    sectionFaq: 'Häufig gestellte Fragen',
    descTpl: (genre: string, intro: string) =>
      `${intro} Beste ${genre} Filme: aktuelle Auswahl, Streaming-Plattformen und kollaboratives Matching auf Swipe Movie.`,
  },
  it: {
    breadcrumbHome: 'Home',
    breadcrumbCatalog: 'Film',
    titleSuffix: 'Migliori film',
    cta: 'Trova il tuo prossimo film swippando',
    empty: 'Nessun film trovato per questo genere.',
    related: 'Esplora anche per piattaforma',
    sectionFaq: 'Domande frequenti',
    descTpl: (genre: string, intro: string) =>
      `${intro} Migliori film ${genre.toLowerCase()} da guardare: selezione aggiornata, piattaforme di streaming e matching collaborativo su Swipe Movie.`,
  },
} as const;

function getCopy(locale: string) {
  return COPY[locale as Locale] ?? COPY.fr;
}

export function generateStaticParams() {
  return Object.keys(GENRES).flatMap((slug) => locales.map((locale) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const genre = getGenreBySlug(slug);
  if (!genre) return { title: 'Genre introuvable', robots: { index: false } };

  const t = getCopy(locale);
  const name = genre.name[locale as Locale] ?? genre.name.fr;
  const intro = genre.intro[locale as Locale] ?? genre.intro.fr;
  const path = `/genre/${slug}`;
  const canonical = `${SITE_URL}/${locale}${path}`;
  const description = t.descTpl(name, intro).slice(0, 160);
  const title = `${t.titleSuffix} ${name.toLowerCase()}`;

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

export default async function GenrePage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
  const genre = getGenreBySlug(slug);
  if (!genre) notFound();

  const t = getCopy(locale);
  const name = genre.name[locale as Locale] ?? genre.name.fr;
  const intro = genre.intro[locale as Locale] ?? genre.intro.fr;
  const sections = genre.sections?.[locale as Locale] ?? genre.sections?.fr;
  const faq = genre.faq?.[locale as Locale] ?? genre.faq?.fr;

  const movies = await getMoviesByGenrePublic(genre.tmdbId, locale, {
    page: 1,
  });

  // ItemList structured data — gives Google a hint that this is a curated list
  // of named entities, often eligible for richer SERP treatment.
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${t.titleSuffix} ${name.toLowerCase()}`,
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
      { '@type': 'ListItem', position: 3, name, item: `${SITE_URL}/${locale}/genre/${slug}` },
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

  // Internal-link facets: link this genre to the major streaming providers,
  // mirroring the combo route /plateforme/[provider]/[genre].
  const facets = (
    <section aria-labelledby="related-providers" className="space-y-3">
      <h2
        id="related-providers"
        className="text-sm font-semibold text-muted-foreground uppercase tracking-wide"
      >
        {t.related}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {listProviders()
          .slice(0, 6)
          .map((p) => (
            <li key={p.slug}>
              <Link
                href={`/${locale}/plateforme/${p.slug}/${slug}`}
                className="inline-flex items-center rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-sm hover:border-primary hover:text-primary transition"
              >
                {p.name[locale as Locale] ?? p.name.fr} · {name}
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
      <SEOPageTracker pageType="genre" locale={locale} slug={slug} title={name} genre={slug} />
      <ListingPage
        title={`${t.titleSuffix} ${name.toLowerCase()}`}
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
// Suppress lint warning: listGenres is used implicitly via GENRES generateStaticParams.
void listGenres;
