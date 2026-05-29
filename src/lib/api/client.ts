import { getAuthToken } from "@/lib/auth-token";

export function authHeaders(extra?: HeadersInit): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extra ?? {}),
  };
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: authHeaders(init?.headers),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `Erro ${res.status}`);
  }
  return res.json() as Promise<T>;
}
