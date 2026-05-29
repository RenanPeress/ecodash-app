import { useCallback, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { loginUser, registerUser } from "@/lib/api/auth";
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
        await loginUser(credentials);
        void navigate({ to: AUTH_SUCCESS_REDIRECT });
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
        await registerUser(data);
        void navigate({ to: AUTH_SUCCESS_REDIRECT });
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

  return { isLoading, apiError, handleLogin, handleRegister, clearApiError };
}
