// This is the root layout - it only passes through to the [locale] layout
// The actual layout configuration is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
