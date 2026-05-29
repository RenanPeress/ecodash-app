import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/auth-token";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
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
    <div className="min-h-screen bg-background font-sans">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar />
        <main className="p-6 lg:p-8">
          <AnalysisInstructionsSection />
        </main>
      </div>
    </div>
  );
}
