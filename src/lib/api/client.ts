import { getAuthToken } from "@/lib/auth-token";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

export function authHeaders(extra?: HeadersInit): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extra ?? {}),
  };
}

/**
 * Extrai uma mensagem de erro legível do corpo da resposta.
 * Quando o backend retorna JSON (ex.: {"error":"Credenciais inválidas"}),
 * devolve apenas a mensagem; caso contrário, o texto bruto ou um fallback.
 */
export function parseErrorMessage(text: string, status: number): string {
  if (text) {
    try {
      const json = JSON.parse(text) as Record<string, unknown>;
      const msg = json.error ?? json.detail ?? json.message ?? json.non_field_errors ?? Object.values(json)[0];
      if (msg != null) return Array.isArray(msg) ? String(msg[0]) : String(msg);
    } catch {
      return text;
    }
  }
  return `Erro ${status}`;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: authHeaders(init?.headers),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(parseErrorMessage(text, res.status));
  }
  return res.json() as Promise<T>;
}
