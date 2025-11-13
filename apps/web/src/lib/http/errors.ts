export const API_ERRORS = {
  ROOMS: {
    403: "La room est pleine",
    404: "Room introuvable",
    410: "La room a expiré",
  },
  AUTH: {
    401: "Authentification requise",
    403: "Accès refusé",
  },
  MOVIES: {
    404: "Film introuvable",
    502: "Erreur lors de la récupération des films",
  },
  SWIPES: {
    400: "Swipe invalide",
    404: "Room ou film introuvable",
  },
  MATCHES: {
    404: "Aucun match trouvé",
  },
  GENERIC: {
    400: "Requête invalide",
    401: "Authentification requise",
    404: "Ressource introuvable",
    500: "Erreur serveur, veuillez réessayer plus tard",
  },
} as const

export type ApiErrorDomain = Exclude<keyof typeof API_ERRORS, "GENERIC">

export function withErrors<T extends ApiErrorDomain>(
  domain: T
): Record<number, string> {
  return { ...API_ERRORS.GENERIC, ...API_ERRORS[domain] }
}