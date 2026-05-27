import type { Metadata } from 'next';
import {
  buildLanguageAlternates,
  localizedUrl,
  pickLocaleMeta,
  SITE_NAME,
  type PageMeta,
} from '@/lib/seo';

const PATH = '/privacy';

const META: Record<string, PageMeta> = {
  fr: {
    title: 'Politique de confidentialité',
    description:
      'Découvrez comment Swipe Movie collecte, traite et protège vos données personnelles, vos cookies et vos préférences, en conformité avec le RGPD et les meilleures pratiques de sécurité.',
    ogTitle: 'Politique de confidentialité — Swipe Movie',
    ogDescription:
      'Comment Swipe Movie protège vos données personnelles, en conformité avec le RGPD.',
  },
  en: {
    title: 'Privacy Policy',
    description:
      'Learn how Swipe Movie collects, processes and protects your personal data, cookies and preferences, in compliance with GDPR and security best practices.',
    ogTitle: 'Privacy Policy — Swipe Movie',
    ogDescription: 'How Swipe Movie protects your personal data, GDPR compliant.',
  },
  es: {
    title: 'Política de privacidad',
    description:
      'Descubre cómo Swipe Movie recopila, trata y protege tus datos personales, cookies y preferencias, en conformidad con el RGPD y las mejores prácticas de seguridad.',
    ogTitle: 'Política de privacidad — Swipe Movie',
    ogDescription: 'Cómo Swipe Movie protege tus datos personales, conforme al RGPD.',
  },
  de: {
    title: 'Datenschutzrichtlinie',
    description:
      'Erfahre, wie Swipe Movie deine personenbezogenen Daten, Cookies und Präferenzen sammelt, verarbeitet und schützt — DSGVO-konform und nach Sicherheitsbest-Practices.',
    ogTitle: 'Datenschutzrichtlinie — Swipe Movie',
    ogDescription: 'Wie Swipe Movie deine personenbezogenen Daten schützt, DSGVO-konform.',
  },
  it: {
    title: 'Informativa privacy',
    description:
      'Scopri come Swipe Movie raccoglie, tratta e protegge i tuoi dati personali, cookie e preferenze, in conformità con il GDPR e le best practice di sicurezza.',
    ogTitle: 'Informativa privacy — Swipe Movie',
    ogDescription: 'Come Swipe Movie protegge i tuoi dati personali, conforme al GDPR.',
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
      type: 'article',
    },
    twitter: {
      title: t.ogTitle,
      description: t.ogDescription,
    },
  };
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
