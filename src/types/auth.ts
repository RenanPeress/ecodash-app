/** Credenciais enviadas para POST /api/auth/login */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Dados enviados para POST /api/auth/register */
export interface RegisterUserData {
  fullName: string;
  email: string;
  password: string;
}

/** Resposta esperada dos endpoints de autenticação */
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export type AuthMode = "login" | "register";

/** Rota de redirecionamento pós-login (spec: /analysis → /analise no app) */
export const AUTH_SUCCESS_REDIRECT = "/analise" as const;

export const AUTH_TOKEN_KEY = "token" as const;
