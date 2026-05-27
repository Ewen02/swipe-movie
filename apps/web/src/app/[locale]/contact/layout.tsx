import type { Metadata } from 'next';
import {
  buildLanguageAlternates,
  localizedUrl,
  pickLocaleMeta,
  SITE_NAME,
  type PageMeta,
} from '@/lib/seo';

const PATH = '/contact';

const META: Record<string, PageMeta> = {
  fr: {
    title: 'Contact — Swipe Movie',
    description:
      "Une question, une suggestion, un partenariat ? L'équipe Swipe Movie répond à toutes vos demandes. Contactez-nous directement et nous reviendrons vers vous rapidement.",
    ogTitle: 'Contact — Swipe Movie',
    ogDescription:
      "Question, suggestion, partenariat ? Contactez l'équipe Swipe Movie, nous répondons rapidement.",
  },
  en: {
    title: 'Contact — Swipe Movie',
    description:
      "Got a question, a suggestion or a partnership idea? The Swipe Movie team replies to every message. Reach out and we'll get back to you quickly.",
    ogTitle: 'Contact — Swipe Movie',
    ogDescription:
      'Question, suggestion or partnership? Reach out to the Swipe Movie team, we reply quickly.',
  },
  es: {
    title: 'Contacto — Swipe Movie',
    description:
      '¿Una pregunta, una sugerencia o una idea de colaboración? El equipo de Swipe Movie responde a todos los mensajes. Contáctanos y te responderemos rápido.',
    ogTitle: 'Contacto — Swipe Movie',
    ogDescription:
      'Pregunta, sugerencia o colaboración? Contacta al equipo Swipe Movie, respondemos rápido.',
  },
  de: {
    title: 'Kontakt — Swipe Movie',
    description:
      'Eine Frage, ein Vorschlag oder eine Partnerschaftsidee? Das Swipe-Movie-Team antwortet auf jede Nachricht. Schreib uns und wir melden uns schnell zurück.',
    ogTitle: 'Kontakt — Swipe Movie',
    ogDescription:
      'Frage, Vorschlag oder Partnerschaft? Kontaktiere das Swipe-Movie-Team, wir antworten schnell.',
  },
  it: {
    title: 'Contatto — Swipe Movie',
    description:
      "Una domanda, un suggerimento o un'idea di partnership? Il team di Swipe Movie risponde a tutti i messaggi. Contattaci e ti rispondiamo rapidamente.",
    ogTitle: 'Contatto — Swipe Movie',
    ogDescription:
      'Domanda, suggerimento o partnership? Contatta il team Swipe Movie, rispondiamo rapidamente.',
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

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
