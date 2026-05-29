import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/auth/AuthPage";

export const Route = createFileRoute("/auth")({
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
