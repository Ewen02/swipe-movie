import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { Providers } from '../providers';
import { Analytics } from '@vercel/analytics/react';
import { PWAInstallBanner } from '@/components/pwa/PWAInstallBanner';
import { CookieConsent } from '@/components/gdpr/CookieConsent';
import { ConditionalAnalytics } from '@/components/gdpr/ConditionalAnalytics';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import {
  SITE_URL,
  SITE_NAME,
  TWITTER_HANDLE,
  buildLanguageAlternates,
  localizedUrl,
} from '@/lib/seo';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

type LocaleMeta = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  ogLocale: string;
  keywords: string[];
};

const metadataByLocale: Record<string, LocaleMeta> = {
  fr: {
    title: 'Swipe Movie — Trouvez votre prochain film ou série entre amis',
    description:
      "Swipe Movie est l'app collaborative qui vous aide à choisir le film ou la série parfaite à regarder à plusieurs. Créez une room, swipez ensemble et trouvez instantanément un match qui fait l'unanimité.",
    ogTitle: 'Swipe Movie — Trouvez votre prochain film ou série entre amis',
    ogDescription:
      'Créez une room, swipez à plusieurs et trouvez instantanément le film ou la série parfaite. Matching intelligent, 100% gratuit pour commencer.',
    twitterTitle: 'Swipe Movie — Trouvez votre prochain film entre amis',
    twitterDescription:
      "Swipez, matchez, regardez. L'app collaborative pour choisir un film en groupe en quelques secondes.",
    ogLocale: 'fr_FR',
    keywords: [
      'swipe movie',
      'application film',
      'choisir un film à plusieurs',
      'film entre amis',
      'tinder pour films',
      'recommandation films',
      'matching films',
      'série à regarder',
      'soirée film',
      'Netflix',
      'Prime Video',
      'Disney+',
      'streaming',
      'TMDB',
      'film en couple',
      'app film collaborative',
    ],
  },
  en: {
    title: 'Swipe Movie — Find your next movie or series with friends',
    description:
      'Swipe Movie is the collaborative app that helps you decide what to watch together. Create a room, swipe with friends and instantly find a movie or series everyone agrees on.',
    ogTitle: 'Swipe Movie — Find your next movie or series with friends',
    ogDescription:
      'Create a room, swipe together and instantly match on the perfect movie or series. Smart matching, free to start.',
    twitterTitle: 'Swipe Movie — Find your next movie with friends',
    twitterDescription:
      'Swipe, match, watch. The collaborative app to pick a movie with friends in seconds.',
    ogLocale: 'en_US',
    keywords: [
      'swipe movie',
      'movie app',
      'pick a movie with friends',
      'tinder for movies',
      'movie matching',
      'group movie picker',
      'what to watch tonight',
      'movie recommendation',
      'series recommendation',
      'movie night',
      'Netflix',
      'Prime Video',
      'Disney+',
      'streaming',
      'TMDB',
      'couple movie picker',
    ],
  },
  es: {
    title: 'Swipe Movie — Encuentra tu próxima película o serie con amigos',
    description:
      'Swipe Movie es la app colaborativa que te ayuda a decidir qué ver juntos. Crea una sala, desliza con tus amigos y encuentra al instante una película o serie con la que todos estén de acuerdo.',
    ogTitle: 'Swipe Movie — Encuentra tu próxima película o serie con amigos',
    ogDescription:
      'Crea una sala, desliza juntos y haz match al instante con la película o serie perfecta. Matching inteligente, gratis para empezar.',
    twitterTitle: 'Swipe Movie — Encuentra tu próxima película con amigos',
    twitterDescription:
      'Desliza, haz match y mira. La app colaborativa para elegir una película con amigos en segundos.',
    ogLocale: 'es_ES',
    keywords: [
      'swipe movie',
      'app de películas',
      'elegir película con amigos',
      'tinder para películas',
      'matching de películas',
      'qué ver esta noche',
      'recomendación películas',
      'recomendación series',
      'noche de cine',
      'Netflix',
      'Prime Video',
      'Disney+',
      'streaming',
      'TMDB',
      'app película en pareja',
    ],
  },
  de: {
    title: 'Swipe Movie — Finde deinen nächsten Film oder deine nächste Serie mit Freunden',
    description:
      'Swipe Movie ist die kollaborative App, die euch hilft zu entscheiden, was ihr zusammen schaut. Erstellt einen Raum, swiped mit Freunden und findet sofort einen Film oder eine Serie, mit der alle einverstanden sind.',
    ogTitle: 'Swipe Movie — Finde deinen nächsten Film oder deine nächste Serie mit Freunden',
    ogDescription:
      'Erstellt einen Raum, swiped gemeinsam und matched sofort auf den perfekten Film oder die perfekte Serie. Smartes Matching, kostenlos zum Starten.',
    twitterTitle: 'Swipe Movie — Finde deinen nächsten Film mit Freunden',
    twitterDescription:
      'Swipen, matchen, schauen. Die kollaborative App, um in Sekunden einen Film mit Freunden zu wählen.',
    ogLocale: 'de_DE',
    keywords: [
      'swipe movie',
      'film app',
      'film mit freunden auswählen',
      'tinder für filme',
      'film matching',
      'was schauen heute abend',
      'film empfehlung',
      'serien empfehlung',
      'filmabend',
      'Netflix',
      'Prime Video',
      'Disney+',
      'streaming',
      'TMDB',
      'film paar app',
    ],
  },
  it: {
    title: 'Swipe Movie — Trova il tuo prossimo film o serie con gli amici',
    description:
      "Swipe Movie è l'app collaborativa che ti aiuta a decidere cosa guardare insieme. Crea una room, swippa con i tuoi amici e trova subito un film o una serie su cui tutti sono d'accordo.",
    ogTitle: 'Swipe Movie — Trova il tuo prossimo film o serie con gli amici',
    ogDescription:
      "Crea una room, swippate insieme e fate match all'istante sul film o sulla serie perfetta. Matching intelligente, gratuito per iniziare.",
    twitterTitle: 'Swipe Movie — Trova il tuo prossimo film con gli amici',
    twitterDescription:
      "Swippa, matcha, guarda. L'app collaborativa per scegliere un film con gli amici in pochi secondi.",
    ogLocale: 'it_IT',
    keywords: [
      'swipe movie',
      'app film',
      'scegliere film con amici',
      'tinder per film',
      'matching film',
      'cosa guardare stasera',
      'consigli film',
      'consigli serie',
      'serata cinema',
      'Netflix',
      'Prime Video',
      'Disney+',
      'streaming',
      'TMDB',
      'app film coppia',
    ],
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark light',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = metadataByLocale[locale] ?? metadataByLocale.fr!;
  const canonical = localizedUrl(locale, '');

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t.title,
      template: `%s | ${SITE_NAME}`,
    },
    description: t.description,
    applicationName: SITE_NAME,
    keywords: t.keywords,
    authors: [{ name: 'Swipe Movie Team', url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: 'entertainment',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical,
      languages: buildLanguageAlternates(''),
    },
    openGraph: {
      type: 'website',
      locale: t.ogLocale,
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => metadataByLocale[l]?.ogLocale ?? l),
      url: canonical,
      siteName: SITE_NAME,
      title: t.ogTitle,
      description: t.ogDescription,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: t.ogTitle,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.twitterTitle,
      description: t.twitterDescription,
      images: ['/og-image.png'],
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.webmanifest',
    verification: {
      google: 'ooXy6Jzoj7Xc12F2QWs2tuuJ-ILeCz4HEunHnLtSeio',
    },
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': SITE_NAME,
    },
  };
}

const STRUCTURED_DESCRIPTIONS: Record<Locale, string> = {
  fr: 'Application collaborative pour choisir un film ou une série à regarder à plusieurs grâce à un système de swipe et de matching intelligent.',
  en: 'Collaborative app to pick a movie or series to watch together using a smart swipe-and-match system.',
  es: 'App colaborativa para elegir una película o serie a ver entre varios gracias a un sistema de swipe y matching inteligente.',
  de: 'Kollaborative App, um per Swipe-and-Match-System gemeinsam einen Film oder eine Serie auszuwählen.',
  it: 'App collaborativa per scegliere un film o una serie da guardare insieme grazie a un sistema di swipe e matching intelligente.',
};

function getStructuredData(locale: Locale) {
  const description = STRUCTURED_DESCRIPTIONS[locale] ?? STRUCTURED_DESCRIPTIONS.fr;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      sameAs: ['https://twitter.com/swipemovie'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description,
      inLanguage: locale,
      publisher: { '@id': `${SITE_URL}#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      operatingSystem: 'Web, iOS, Android',
      applicationCategory: 'EntertainmentApplication',
      description,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
      aggregateRating: undefined,
    },
  ];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const jsonLd = getStructuredData(locale as Locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <script
          type="application/ld+json"
          // JSON-LD must be inlined; payload built from a typed object above.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <PWAInstallBanner />
            <CookieConsent />
          </Providers>
        </NextIntlClientProvider>
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <ConditionalAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <PostHogProvider />
      </body>
    </html>
  );
}
