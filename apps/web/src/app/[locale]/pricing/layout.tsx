import type { Metadata } from 'next';
import {
  buildLanguageAlternates,
  localizedUrl,
  pickLocaleMeta,
  SITE_NAME,
  type PageMeta,
} from '@/lib/seo';

const PATH = '/pricing';

const META: Record<string, PageMeta> = {
  fr: {
    title: 'Tarifs Swipe Movie — Gratuit & Premium',
    description:
      "Swipe Movie est gratuit pour commencer. Passez Premium pour des rooms illimitées, plus d'utilisateurs par room, des recommandations avancées et l'accès à toutes les plateformes de streaming.",
    ogTitle: 'Tarifs — Swipe Movie',
    ogDescription:
      'Gratuit pour commencer. Premium pour des rooms illimitées et des recommandations avancées.',
  },
  en: {
    title: 'Swipe Movie Pricing — Free & Premium',
    description:
      'Swipe Movie is free to start. Upgrade to Premium for unlimited rooms, more users per room, advanced recommendations and access to all streaming platforms.',
    ogTitle: 'Pricing — Swipe Movie',
    ogDescription: 'Free to start. Premium for unlimited rooms and advanced recommendations.',
  },
  es: {
    title: 'Precios Swipe Movie — Gratis y Premium',
    description:
      'Swipe Movie es gratis para empezar. Pasa a Premium para salas ilimitadas, más usuarios por sala, recomendaciones avanzadas y acceso a todas las plataformas de streaming.',
    ogTitle: 'Precios — Swipe Movie',
    ogDescription:
      'Gratis para empezar. Premium para salas ilimitadas y recomendaciones avanzadas.',
  },
  de: {
    title: 'Swipe Movie Preise — Kostenlos & Premium',
    description:
      'Swipe Movie ist kostenlos zum Starten. Upgrade auf Premium für unbegrenzte Räume, mehr Nutzer pro Raum, erweiterte Empfehlungen und Zugriff auf alle Streaming-Plattformen.',
    ogTitle: 'Preise — Swipe Movie',
    ogDescription:
      'Kostenlos zum Starten. Premium für unbegrenzte Räume und erweiterte Empfehlungen.',
  },
  it: {
    title: 'Prezzi Swipe Movie — Gratis e Premium',
    description:
      'Swipe Movie è gratis per iniziare. Passa a Premium per room illimitate, più utenti per room, raccomandazioni avanzate e accesso a tutte le piattaforme di streaming.',
    ogTitle: 'Prezzi — Swipe Movie',
    ogDescription: 'Gratis per iniziare. Premium per room illimitate e raccomandazioni avanzate.',
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

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
