import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthPage } from "@/components/auth/AuthPage";
import { isAuthenticated } from "@/lib/auth-token";

export const Route = createFileRoute("/auth")({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthRoute,
  head: () => ({
    meta: [
      { title: "Autenticação — EcoDash" },
      {
        name: "description",
        content: "Entre ou cadastre-se na plataforma EcoDash para monitorar a sustentabilidade do seu software.",
      },
    ],
  }),
});

function AuthRoute() {
  return <AuthPage />;
}
