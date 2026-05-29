import { useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { loginUserMock, registerUserMock } from "@/lib/api/auth";
import { saveAuthToken } from "@/lib/auth-token";
import type { LoginCredentials, RegisterUserData } from "@/types/auth";
import { AUTH_SUCCESS_REDIRECT } from "@/types/auth";

interface UseAuthActionsResult {
  isLoading: boolean;
  apiError: string | null;
  handleLogin: (credentials: LoginCredentials) => Promise<void>;
  handleRegister: (data: RegisterUserData) => Promise<void>;
  clearApiError: () => void;
}

export function useAuthActions(): UseAuthActionsResult {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const clearApiError = useCallback(() => setApiError(null), []);

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);
      setApiError(null);

      try {
        // Substituir loginUserMock por loginUser (fetch/axios → POST /api/auth/login)
        const response = await loginUserMock(credentials);

        saveAuthToken(response.token);
        // localStorage.setItem('token', response.token) — equivalente via saveAuthToken

        navigate({ to: AUTH_SUCCESS_REDIRECT });
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Falha ao entrar. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    },
    [navigate],
  );

  const handleRegister = useCallback(
    async (data: RegisterUserData) => {
      setIsLoading(true);
      setApiError(null);

      try {
        // Substituir registerUserMock por registerUser (fetch/axios → POST /api/auth/register)
        const response = await registerUserMock(data);

        saveAuthToken(response.token);

        navigate({ to: AUTH_SUCCESS_REDIRECT });
      } catch (err) {
        setApiError(
          err instanceof Error ? err.message : "Falha ao criar conta. Tente novamente.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [navigate],
  );

  return {
    isLoading,
    apiError,
    handleLogin,
    handleRegister,
    clearApiError,
  };
}
