import type { Metadata } from 'next';
import {
  buildLanguageAlternates,
  localizedUrl,
  pickLocaleMeta,
  SITE_NAME,
  type PageMeta,
} from '@/lib/seo';

const PATH = '/terms';

const META: Record<string, PageMeta> = {
  fr: {
    title: "Conditions d'utilisation",
    description:
      "Consultez les conditions générales d'utilisation de Swipe Movie : règles de la plateforme, droits et responsabilités des utilisateurs, propriété intellectuelle et modifications du service.",
    ogTitle: "Conditions d'utilisation — Swipe Movie",
    ogDescription:
      'Règles de la plateforme, droits et responsabilités des utilisateurs Swipe Movie.',
  },
  en: {
    title: 'Terms of Service',
    description:
      "Read Swipe Movie's terms of service: platform rules, user rights and responsibilities, intellectual property and service changes.",
    ogTitle: 'Terms of Service — Swipe Movie',
    ogDescription: 'Platform rules, user rights and responsibilities on Swipe Movie.',
  },
  es: {
    title: 'Términos de uso',
    description:
      'Consulta los términos de uso de Swipe Movie: reglas de la plataforma, derechos y responsabilidades de los usuarios, propiedad intelectual y cambios del servicio.',
    ogTitle: 'Términos de uso — Swipe Movie',
    ogDescription:
      'Reglas de la plataforma, derechos y responsabilidades de los usuarios en Swipe Movie.',
  },
  de: {
    title: 'Nutzungsbedingungen',
    description:
      'Lies die Nutzungsbedingungen von Swipe Movie: Plattformregeln, Nutzerrechte und -pflichten, geistiges Eigentum und Serviceänderungen.',
    ogTitle: 'Nutzungsbedingungen — Swipe Movie',
    ogDescription: 'Plattformregeln, Nutzerrechte und -pflichten auf Swipe Movie.',
  },
  it: {
    title: "Termini d'uso",
    description:
      "Leggi i termini d'uso di Swipe Movie: regole della piattaforma, diritti e responsabilità degli utenti, proprietà intellettuale e modifiche al servizio.",
    ogTitle: "Termini d'uso — Swipe Movie",
    ogDescription:
      'Regole della piattaforma, diritti e responsabilità degli utenti su Swipe Movie.',
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
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
