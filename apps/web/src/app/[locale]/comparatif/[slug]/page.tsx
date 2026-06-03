import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { buildLanguageAlternates, SITE_NAME, SITE_URL } from '@/lib/seo';
import { COMPARISONS, getComparisonBySlug } from '@/lib/comparisons';
import { getGenreBySlug, getProviderBySlug } from '@/lib/catalog';
import { SEOPageTracker } from '@/components/seo/SEOPageTracker';

export const dynamicParams = false;
export const revalidate = 86400;

type Params = { locale: string; slug: string };

const COPY = {
  fr: {
    breadcrumbHome: 'Accueil',
    breadcrumbCatalog: 'Comparatifs',
    cta: 'Lance ta room',
    sectionTable: 'Comparatif',
    sectionFaq: 'Questions fréquentes',
    relatedTitle: 'À voir aussi',
    relatedGenres: 'Par genre',
    relatedProviders: 'Par plateforme',
    colUs: 'Swipe Movie',
  },
  en: {
    breadcrumbHome: 'Home',
    breadcrumbCatalog: 'Comparisons',
    cta: 'Start your room',
    sectionTable: 'Comparison',
    sectionFaq: 'Frequently asked questions',
    relatedTitle: 'See also',
    relatedGenres: 'By genre',
    relatedProviders: 'By platform',
    colUs: 'Swipe Movie',
  },
  es: {
    breadcrumbHome: 'Inicio',
    breadcrumbCatalog: 'Comparativas',
    cta: 'Abre tu sala',
    sectionTable: 'Comparativa',
    sectionFaq: 'Preguntas frecuentes',
    relatedTitle: 'Ver también',
    relatedGenres: 'Por género',
    relatedProviders: 'Por plataforma',
    colUs: 'Swipe Movie',
  },
  de: {
    breadcrumbHome: 'Start',
    breadcrumbCatalog: 'Vergleiche',
    cta: 'Starte deinen Raum',
    sectionTable: 'Vergleich',
    sectionFaq: 'Häufig gestellte Fragen',
    relatedTitle: 'Auch sehenswert',
    relatedGenres: 'Nach Genre',
    relatedProviders: 'Nach Plattform',
    colUs: 'Swipe Movie',
  },
  it: {
    breadcrumbHome: 'Home',
    breadcrumbCatalog: 'Confronti',
    cta: 'Apri la tua room',
    sectionTable: 'Confronto',
    sectionFaq: 'Domande frequenti',
    relatedTitle: 'Da vedere anche',
    relatedGenres: 'Per genere',
    relatedProviders: 'Per piattaforma',
    colUs: 'Swipe Movie',
  },
} as const;

function getCopy(locale: string) {
  return COPY[locale as Locale] ?? COPY.fr;
}

export function generateStaticParams() {
  return Object.keys(COMPARISONS).flatMap((slug) => locales.map((locale) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const cmp = getComparisonBySlug(slug);
  if (!cmp) return { title: 'Page introuvable', robots: { index: false } };

  const path = `/comparatif/${cmp.slug}`;
  const canonical = `${SITE_URL}/${locale}${path}`;
  const title = cmp.title[locale as Locale] ?? cmp.title.fr;
  const description = (cmp.description[locale as Locale] ?? cmp.description.fr).slice(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      type: 'article',
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

export default async function ComparisonPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
  const cmp = getComparisonBySlug(slug);
  if (!cmp) notFound();

  const t = getCopy(locale);
  const title = cmp.title[locale as Locale] ?? cmp.title.fr;
  const intro = cmp.intro[locale as Locale] ?? cmp.intro.fr;
  const table = cmp.table[locale as Locale] ?? cmp.table.fr;
  const sections = cmp.sections[locale as Locale] ?? cmp.sections.fr;
  const faq = cmp.faq[locale as Locale] ?? cmp.faq.fr;

  const relatedGenreLinks = cmp.relatedGenres
    .map((s) => getGenreBySlug(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
    .map((g) => ({ slug: g.slug, name: g.name[locale as Locale] ?? g.name.fr }));
  const relatedProviderLinks = cmp.relatedProviders
    .map((s) => getProviderBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ slug: p.slug, name: p.name[locale as Locale] ?? p.name.fr }));

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
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
        name: title,
        item: `${SITE_URL}/${locale}/comparatif/${cmp.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <SEOPageTracker pageType="comparatif" locale={locale} slug={slug} title={title} />
      <article className="container mx-auto px-4 py-8 md:py-12 space-y-10 max-w-4xl">
        <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={`/${locale}`} className="hover:text-foreground transition">
                {t.breadcrumbHome}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/${locale}/films`} className="hover:text-foreground transition">
                {t.breadcrumbCatalog}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-foreground">
              {title}
            </li>
          </ol>
        </nav>

        <header className="space-y-5">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          {intro.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
          <Link
            href={`/${locale}/try`}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition"
          >
            {t.cta}
          </Link>
        </header>

        <section aria-labelledby="table" className="space-y-4">
          <h2 id="table" className="text-2xl font-semibold">
            {t.sectionTable}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-border/60">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-card/40">
                  <th className="text-left font-medium p-3"></th>
                  <th className="text-left font-semibold p-3 text-primary">{t.colUs}</th>
                  <th className="text-left font-medium p-3 text-muted-foreground">
                    {table.themLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => (
                  <tr key={i} className="border-b border-border/40 last:border-0">
                    <td className="p-3 font-medium">{row.feature}</td>
                    <td className="p-3">{row.us}</td>
                    <td className="p-3 text-muted-foreground">{row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {sections.map((s, i) => (
          <section key={i} className="space-y-3">
            <h2 className="text-2xl font-semibold">{s.heading}</h2>
            <p className="text-base text-muted-foreground leading-relaxed">{s.body}</p>
          </section>
        ))}

        {(relatedGenreLinks.length > 0 || relatedProviderLinks.length > 0) && (
          <section aria-labelledby="related" className="space-y-5">
            <h2 id="related" className="text-2xl font-semibold">
              {t.relatedTitle}
            </h2>
            {relatedGenreLinks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.relatedGenres}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {relatedGenreLinks.map((g) => (
                    <li key={g.slug}>
                      <Link
                        href={`/${locale}/genre/${g.slug}`}
                        className="inline-flex items-center rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-sm hover:border-primary hover:text-primary transition"
                      >
                        {g.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {relatedProviderLinks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.relatedProviders}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {relatedProviderLinks.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/${locale}/plateforme/${p.slug}`}
                        className="inline-flex items-center rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-sm hover:border-primary hover:text-primary transition"
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

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
      </article>
    </>
  );
}
