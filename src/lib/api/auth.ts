import type { AuthResponse, LoginCredentials, RegisterUserData } from "@/types/auth";
import { saveTokens } from "@/lib/auth-token";

interface BackendAuthResponse {
  id: number;
  username: string;
  access: string;
  refresh: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    // Tenta extrair mensagem de erro do JSON Django
    try {
      const json = JSON.parse(text) as Record<string, unknown>;
      const msg = json.error ?? json.detail ?? json.non_field_errors ?? Object.values(json)[0];
      throw new Error(String(msg));
    } catch {
      throw new Error(text || `Erro ${res.status}`);
    }
  }
  return res.json() as Promise<T>;
}

function mapBackend(data: BackendAuthResponse, email: string): AuthResponse {
  saveTokens(data.access, data.refresh, data.username);
  return {
    token: data.access,
    user: { id: String(data.id), fullName: data.username, email },
  };
}

/** POST /api/auth/login/ */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const res = await fetch("/api/auth/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: credentials.email, password: credentials.password }),
  });
  const data = await handleResponse<BackendAuthResponse>(res);
  return mapBackend(data, credentials.email);
}

/** POST /api/auth/signup/ */
export async function registerUser(data: RegisterUserData): Promise<AuthResponse> {
  const res = await fetch("/api/auth/signup/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: data.email, email: data.email, password: data.password }),
  });
  const result = await handleResponse<BackendAuthResponse>(res);
  return mapBackend(result, data.email);
}
