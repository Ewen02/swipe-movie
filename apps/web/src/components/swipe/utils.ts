// Gradient colors based on movie rating
export const getGradientByRating = (rating: number): string => {
  if (rating >= 8) return "from-emerald-600 via-teal-600 to-cyan-600"
  if (rating >= 7) return "from-blue-600 via-indigo-600 to-purple-600"
  if (rating >= 6) return "from-violet-600 via-purple-600 to-fuchsia-600"
  if (rating >= 5) return "from-orange-600 via-amber-600 to-yellow-600"
  return "from-rose-600 via-pink-600 to-red-600"
}

// Enhanced stack effect - cards are more visible and offset
export const stackStyles = {
  0: { rotate: 0, scale: 1, y: 0, opacity: 1 },
  1: { rotate: 3, scale: 0.95, y: 8, opacity: 0.9 },
  2: { rotate: -2, scale: 0.90, y: 16, opacity: 0.75 },
} as const
