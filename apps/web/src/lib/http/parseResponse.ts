import { z } from "zod"

export async function parseResponse<T>(
  res: Response,
  schema: z.ZodSchema<T>,
  errors?: Record<number, string>
): Promise<T> {
  if (!res.ok) {
    const message = errors?.[res.status] ?? "Erreur inattendue"
    throw new Error(message)
  }
  const json = await res.json()
  // console.log(schema.parse(json))
  return schema.parse(json)
}