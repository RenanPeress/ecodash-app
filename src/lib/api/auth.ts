import type { AuthResponse, LoginCredentials, RegisterUserData } from "@/types/auth";

const API_BASE = "/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(message || `Erro na requisição: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

/** POST /api/auth/login */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return handleResponse<AuthResponse>(response);
}

/** POST /api/auth/register */
export async function registerUser(data: RegisterUserData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<AuthResponse>(response);
}

/** Simulações locais — substituir pelas funções acima quando o back-end estiver disponível */
export async function loginUserMock(credentials: LoginCredentials): Promise<AuthResponse> {
  await delay(1200);
  console.info("[loginUserMock] POST /api/auth/login", credentials.email);
  return {
    token: `mock-jwt-${Date.now()}`,
    user: {
      id: "user-001",
      fullName: "Usuário EcoDash",
      email: credentials.email,
    },
  };
}

export async function registerUserMock(data: RegisterUserData): Promise<AuthResponse> {
  await delay(1400);
  console.info("[registerUserMock] POST /api/auth/register", data.email);
  return {
    token: `mock-jwt-${Date.now()}`,
    user: {
      id: `user-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
    },
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
