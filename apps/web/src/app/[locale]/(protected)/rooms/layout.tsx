import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mes Rooms",
  description: "Créez une room, invitez vos amis et swipez ensemble pour trouver le film parfait à regarder.",
  openGraph: {
    title: "Mes Rooms | Swipe Movie",
    description: "Créez une room, invitez vos amis et swipez ensemble pour trouver le film parfait.",
  },
  twitter: {
    title: "Mes Rooms | Swipe Movie",
    description: "Créez une room et trouvez votre film parfait avec vos amis.",
  },
  robots: {
    index: false, // Don't index protected pages
    follow: false,
  },
}

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
