import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe Swipe Movie pour toute question, suggestion ou problème. Nous sommes là pour vous aider à trouver votre prochain film.",
  openGraph: {
    title: "Contact | Swipe Movie",
    description: "Contactez l'équipe Swipe Movie pour toute question, suggestion ou problème.",
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
