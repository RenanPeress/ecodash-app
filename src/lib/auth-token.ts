import { AUTH_TOKEN_KEY } from "@/types/auth";

const REFRESH_TOKEN_KEY = "refresh_token";
const USERNAME_KEY = "username";

export function saveAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveTokens(access: string, refresh: string, username?: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  if (username) localStorage.setItem(USERNAME_KEY, username);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken());
}
