import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"
import { auth } from "@/lib/auth"
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://swipe-movie.com'),
  title: {
    default: 'Swipe Movie - Trouvez votre prochain film entre amis',
    template: '%s | Swipe Movie'
  },
  description: 'Découvrez votre prochain film à regarder en swipant avec vos amis. Créez une room, invitez vos proches et trouvez le film parfait qui plaira à tout le monde grâce à notre système de match intelligent.',
  keywords: ['film', 'movie', 'swipe', 'amis', 'match', 'cinéma', 'streaming', 'netflix', 'recommendation', 'tinder for movies'],
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
    locale: 'fr_FR',
    url: 'https://swipe-movie.com',
    siteName: 'Swipe Movie',
    title: 'Swipe Movie - Trouvez votre prochain film entre amis',
    description: 'Découvrez votre prochain film à regarder en swipant avec vos amis. Système de match intelligent pour trouver le film parfait.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Swipe Movie - Trouvez votre film parfait',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swipe Movie - Trouvez votre prochain film entre amis',
    description: 'Swipez, matchez, regardez ! Trouvez le film parfait avec vos amis.',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers session={session}>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
