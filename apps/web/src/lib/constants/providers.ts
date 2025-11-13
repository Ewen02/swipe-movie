// Streaming providers with their TMDb IDs
export const WATCH_PROVIDERS = [
  { id: 8, name: "Netflix", logo: "🎬" },
  { id: 119, name: "Prime Video", logo: "📺" },
  { id: 337, name: "Disney+", logo: "✨" },
  { id: 350, name: "Apple TV+", logo: "🍎" },
  { id: 531, name: "Paramount+", logo: "⭐" },
] as const

export function getProviderById(id: number) {
  return WATCH_PROVIDERS.find((p) => p.id === id)
}

export function getProvidersByIds(ids: number[]) {
  return ids.map((id) => getProviderById(id)).filter(Boolean)
}
