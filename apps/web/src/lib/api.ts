import { getSession } from "next-auth/react"

import { auth } from "@/lib/auth"

export async function apiFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  let access: string | undefined

  if (typeof window === "undefined") {
    const session = await auth()
    access = session?.accessToken
  } else {
    const session = await getSession()
    access = session?.accessToken as string | undefined
  }

  if (access) headers.set("Authorization", `Bearer ${access}`)

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${input}`, { ...init, headers })
}

// Helpers REST
export async function GET(input: string, init: RequestInit = {}) {
  return apiFetch(input, { ...init, method: "GET" })
}

export async function POST(input: string, init: RequestInit = {}) {
  return apiFetch(input, {
    ...init,
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
  })
}

export async function PUT(input: string, init: RequestInit = {}) {
  return apiFetch(input, { ...init, method: "PUT" })
}

export async function DELETE(input: string, init: RequestInit = {}) {
  return apiFetch(input, { ...init, method: "DELETE" })
}
