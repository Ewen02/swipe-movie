import type { Metadata } from 'next';
import {
  buildLanguageAlternates,
  localizedUrl,
  pickLocaleMeta,
  SITE_NAME,
  type PageMeta,
} from '@/lib/seo';

const PATH = '/login';

const META: Record<string, PageMeta> = {
  fr: {
    title: 'Connexion',
    description:
      'Connectez-vous à Swipe Movie pour créer des rooms, swiper avec vos amis et retrouver votre liste de films à voir, vos matchs et vos préférences personnalisées.',
    ogTitle: 'Connexion — Swipe Movie',
    ogDescription:
      'Connectez-vous pour créer des rooms, swiper avec vos amis et retrouver vos matchs personnalisés.',
  },
  en: {
    title: 'Sign in',
    description:
      'Sign in to Swipe Movie to create rooms, swipe with friends and access your watchlist, your matches and your personalized preferences.',
    ogTitle: 'Sign in — Swipe Movie',
    ogDescription:
      'Sign in to create rooms, swipe with friends and access your personalized matches.',
  },
  es: {
    title: 'Iniciar sesión',
    description:
      'Inicia sesión en Swipe Movie para crear salas, deslizar con tus amigos y acceder a tu lista, tus matches y tus preferencias personalizadas.',
    ogTitle: 'Iniciar sesión — Swipe Movie',
    ogDescription:
      'Inicia sesión para crear salas, deslizar con amigos y acceder a tus matches personalizados.',
  },
  de: {
    title: 'Anmelden',
    description:
      'Melde dich bei Swipe Movie an, um Räume zu erstellen, mit Freunden zu swipen und auf deine Watchlist, deine Matches und deine persönlichen Präferenzen zuzugreifen.',
    ogTitle: 'Anmelden — Swipe Movie',
    ogDescription:
      'Melde dich an, um Räume zu erstellen, mit Freunden zu swipen und auf deine personalisierten Matches zuzugreifen.',
  },
  it: {
    title: 'Accedi',
    description:
      'Accedi a Swipe Movie per creare room, swippare con i tuoi amici e accedere alla tua watchlist, ai tuoi match e alle tue preferenze personalizzate.',
    ogTitle: 'Accedi — Swipe Movie',
    ogDescription:
      'Accedi per creare room, swippare con amici e accedere ai tuoi match personalizzati.',
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
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
