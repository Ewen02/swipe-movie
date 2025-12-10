import { z } from "zod"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function parseResponse<T>(
  res: Response,
  schema: z.ZodSchema<T>,
  errors?: Record<number, string>
): Promise<T> {
  if (!res.ok) {
    // Try to extract error details from response body
    let errorMessage = errors?.[res.status] ?? "Erreur inattendue"
    let errorCode: string | undefined
    let errorDetails: Record<string, unknown> | undefined

    try {
      const text = await res.text()
      if (text) {
        const errorBody = JSON.parse(text)
        // Use backend message if available
        if (errorBody.message) {
          errorMessage = errorBody.message
        }
        errorCode = errorBody.code
        errorDetails = errorBody
      }
    } catch {
      // Ignore JSON parsing errors, use default message
    }

    throw new ApiError(errorMessage, res.status, errorCode, errorDetails)
  }
  const json = await res.json()
  return schema.parse(json)
}
