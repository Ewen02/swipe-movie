import { getServerSession } from "next-auth";

export async function apiFetch(input: string, init: RequestInit = {}) {
  const session = await getServerSession();
  const headers = new Headers(init.headers);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const access = (session as any)?.accessToken;
  if (access) headers.set("Authorization", `Bearer ${access}`);
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${input}`, { ...init, headers });
}