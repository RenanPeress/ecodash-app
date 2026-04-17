import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { AlertTriangle, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/comparacao")({
  component: ComparisonPage,
  head: () => ({
    meta: [
      { title: "Comparação de Versões — EcoDash" },
      {
        name: "description",
        content:
          "Compare lado a lado o consumo de carbono, CPU, memória e tempo de execução entre versões do seu software.",
      },
      { property: "og:title", content: "Comparação de Versões — EcoDash" },
      {
        property: "og:description",
        content: "Compare métricas de sustentabilidade entre versões estáveis e experimentais.",
      },
    ],
  }),
});

function ComparisonPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar />
        <main className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-semibold tracking-tight">
                Comparação de Versões
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Avalie o impacto ambiental e o desempenho lado a lado.
              </p>
            </div>

            <Alert className="max-w-2xl mx-auto">
              <Clock className="h-4 w-4" />
              <AlertTitle>Funcionalidade Temporariamente Indisponível</AlertTitle>
              <AlertDescription>
                A página de comparação está passando por otimizações para melhorar a performance.
                Esta funcionalidade estará disponível em breve. Enquanto isso, você pode continuar
                usando as outras ferramentas do EcoDash.
              </AlertDescription>
            </Alert>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted">
                <AlertTriangle className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Volte em breve para acessar a comparação de versões!
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
