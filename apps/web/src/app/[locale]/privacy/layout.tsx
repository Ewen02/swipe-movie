import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Découvrez comment Swipe Movie protège vos données personnelles et respecte votre vie privée.",
  openGraph: {
    title: "Politique de confidentialité | Swipe Movie",
    description: "Comment Swipe Movie protège vos données personnelles.",
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
