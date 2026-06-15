import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/auth-token";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AnalysisInstructionsSection } from "@/components/analysis/AnalysisInstructionsSection";

export const Route = createFileRoute("/analise")({
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: "/auth" });
  },
  component: AnalysisPage,
  head: () => ({
    meta: [
      { title: "Análise — EcoDash" },
      {
        name: "description",
        content:
          "Configure o SCI Client e inicie a análise de sustentabilidade do seu código com instruções passo a passo.",
      },
      { property: "og:title", content: "Análise — EcoDash" },
      {
        property: "og:description",
        content: "Instruções de execução e botão para analisar código com foco em Green Software.",
      },
    ],
  }),
});

function AnalysisPage() {
  return (
    <DashboardLayout>
      <AnalysisInstructionsSection />
    </DashboardLayout>
  );
}
