import { useState } from "react";
import { Leaf } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthActions } from "@/hooks/use-auth-actions";
import type { AuthMode } from "@/types/auth";
import { AuthBrandingPanel } from "./AuthBrandingPanel";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const { isLoading, apiError, handleLogin, handleRegister, clearApiError } = useAuthActions();

  const switchMode = (next: AuthMode) => {
    clearApiError();
    setMode(next);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AuthBrandingPanel />

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div
              className="grid h-10 w-10 place-items-center rounded-xl text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Leaf className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">EcoDash</span>
          </div>

          <div
            className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8"
            key={mode}
          >
            <div className="mb-6">
              <h1 className="font-display text-2xl font-semibold tracking-tight">
                {mode === "login" ? "Entrar na plataforma" : "Criar sua conta"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "login"
                  ? "Acesse suas métricas de sustentabilidade e relatórios."
                  : "Cadastre-se para começar a analisar seu software."}
              </p>
            </div>

            {apiError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            {mode === "login" ? (
              <LoginForm
                isLoading={isLoading}
                onSubmit={handleLogin}
                onForgotPassword={() => {
                  // Placeholder: integrar com POST /api/auth/forgot-password
                  console.info("[Auth] Recuperação de senha — endpoint pendente");
                }}
              />
            ) : (
              <RegisterForm
                isLoading={isLoading}
                onSubmit={async (values) => {
                  await handleRegister({
                    fullName: values.fullName,
                    email: values.email,
                    password: values.password,
                  });
                }}
              />
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  Não tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="font-medium text-emerald-700 underline-offset-4 transition hover:underline dark:text-emerald-400"
                  >
                    Cadastre-se
                  </button>
                </>
              ) : (
                <>
                  Já possui uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-medium text-emerald-700 underline-offset-4 transition hover:underline dark:text-emerald-400"
                  >
                    Entrar
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
