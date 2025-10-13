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