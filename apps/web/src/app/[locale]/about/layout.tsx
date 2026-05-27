import type { Metadata } from 'next';
import {
  buildLanguageAlternates,
  localizedUrl,
  pickLocaleMeta,
  SITE_NAME,
  type PageMeta,
} from '@/lib/seo';

const PATH = '/about';

const META: Record<string, PageMeta> = {
  fr: {
    title: 'À propos de Swipe Movie',
    description:
      'Découvrez la mission de Swipe Movie : aider tout le monde à choisir un film ou une série en groupe sans débat interminable, grâce à un swipe collaboratif et un matching intelligent.',
    ogTitle: 'À propos — Swipe Movie',
    ogDescription:
      'Notre mission : aider tout le monde à choisir un film ou une série à plusieurs sans débat interminable.',
  },
  en: {
    title: 'About Swipe Movie',
    description:
      "Learn about Swipe Movie's mission: help everyone pick a movie or series together without endless debates, thanks to collaborative swiping and smart matching.",
    ogTitle: 'About — Swipe Movie',
    ogDescription:
      'Our mission: help everyone pick a movie or series together without endless debates.',
  },
  es: {
    title: 'Sobre Swipe Movie',
    description:
      'Descubre la misión de Swipe Movie: ayudar a todos a elegir una película o serie entre varios sin debates interminables, gracias al swipe colaborativo y al matching inteligente.',
    ogTitle: 'Sobre — Swipe Movie',
    ogDescription:
      'Nuestra misión: ayudar a todos a elegir una película o serie entre varios sin debates interminables.',
  },
  de: {
    title: 'Über Swipe Movie',
    description:
      'Erfahre mehr über die Mission von Swipe Movie: Allen helfen, gemeinsam einen Film oder eine Serie ohne endlose Debatten zu wählen — dank kollaborativem Swipen und smartem Matching.',
    ogTitle: 'Über — Swipe Movie',
    ogDescription:
      'Unsere Mission: Allen helfen, ohne endlose Debatten gemeinsam einen Film oder eine Serie zu wählen.',
  },
  it: {
    title: 'Su Swipe Movie',
    description:
      'Scopri la missione di Swipe Movie: aiutare tutti a scegliere un film o una serie in gruppo senza dibattiti infiniti, grazie allo swipe collaborativo e al matching intelligente.',
    ogTitle: 'Su — Swipe Movie',
    ogDescription:
      'La nostra missione: aiutare tutti a scegliere un film o una serie in gruppo senza dibattiti infiniti.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = pickLocaleMeta(META, locale);
  const canonical = localizedUrl(locale, PATH);

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(PATH),
    },
    openGraph: {
      title: `${t.ogTitle} | ${SITE_NAME}`,
      description: t.ogDescription,
      url: canonical,
      type: 'website',
    },
    twitter: {
      title: t.ogTitle,
      description: t.ogDescription,
    },
  };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
