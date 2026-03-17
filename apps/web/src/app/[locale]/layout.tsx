import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers"
import { Analytics } from "@vercel/analytics/react"
import { PWAInstallBanner } from "@/components/pwa/PWAInstallBanner"
import { CookieConsent } from "@/components/gdpr/CookieConsent"
import { ConditionalAnalytics } from "@/components/gdpr/ConditionalAnalytics"
import { PostHogProvider } from "@/components/providers/PostHogProvider"
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadataByLocale: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string; twitterTitle: string; twitterDescription: string; ogLocale: string; keywords: string[] }> = {
  fr: {
    title: 'Swipe Movie - Trouvez votre prochain film entre amis',
    description: 'Découvrez votre prochain film à regarder en swipant avec vos amis. Créez une room, invitez vos proches et trouvez le film parfait qui plaira à tout le monde grâce à notre système de match intelligent.',
    ogTitle: 'Swipe Movie - Trouvez votre prochain film entre amis',
    ogDescription: 'Découvrez votre prochain film à regarder en swipant avec vos amis. Système de match intelligent pour trouver le film parfait.',
    twitterTitle: 'Swipe Movie - Trouvez votre prochain film entre amis',
    twitterDescription: 'Swipez, matchez, regardez ! Trouvez le film parfait avec vos amis.',
    ogLocale: 'fr_FR',
    keywords: ['film', 'movie', 'swipe', 'amis', 'match', 'cinéma', 'streaming', 'netflix', 'recommendation', 'tinder for movies'],
  },
  en: {
    title: 'Swipe Movie - Find your next movie with friends',
    description: 'Discover your next movie to watch by swiping with friends. Create a room, invite your crew, and find the perfect movie everyone will love with our smart matching system.',
    ogTitle: 'Swipe Movie - Find your next movie with friends',
    ogDescription: 'Discover your next movie by swiping with friends. Smart matching to find the perfect movie for everyone.',
    twitterTitle: 'Swipe Movie - Find your next movie with friends',
    twitterDescription: 'Swipe, match, watch! Find the perfect movie with friends.',
    ogLocale: 'en_US',
    keywords: ['movie', 'film', 'swipe', 'friends', 'match', 'cinema', 'streaming', 'netflix', 'recommendation', 'tinder for movies'],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = metadataByLocale[locale] ?? metadataByLocale.fr!;

  return {
    metadataBase: new URL('https://swipe-movie.com'),
    title: {
      default: t.title,
      template: '%s | Swipe Movie',
    },
    description: t.description,
    keywords: t.keywords,
    authors: [{ name: 'Swipe Movie Team' }],
    creator: 'Swipe Movie',
    publisher: 'Swipe Movie',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: t.ogLocale,
      url: 'https://swipe-movie.com',
      siteName: 'Swipe Movie',
      title: t.ogTitle,
      description: t.ogDescription,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: t.ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.twitterTitle,
      description: t.twitterDescription,
      images: ['/og-image.png'],
      creator: '@swipemovie',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
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
