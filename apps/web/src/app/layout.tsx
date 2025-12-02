// Root layout - passes through to [locale] layout
// next-intl requires the [locale] layout to provide html/body
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
