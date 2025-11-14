import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à Swipe Movie pour créer des rooms et trouver votre prochain film à regarder avec vos amis.",
  openGraph: {
    title: "Connexion | Swipe Movie",
    description: "Connectez-vous pour créer des rooms et trouver votre film parfait avec vos amis.",
  },
  twitter: {
    title: "Connexion | Swipe Movie",
    description: "Connectez-vous pour créer des rooms et trouver votre film parfait avec vos amis.",
  },
  robots: {
    index: false, // Don't index login page
    follow: true,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
