import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/auth-token";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { OverviewCards, OverviewCardsSkeleton } from "@/components/report/OverviewCards";
import {
  ProcessingMetricsTable,
  ProcessingMetricsTableSkeleton,
} from "@/components/report/ProcessingMetricsTable";
import { ReportHeader } from "@/components/report/ReportHeader";
import { AIInsightsPanel } from "@/components/ai/AIInsightsPanel";
import { useSustainabilityReport } from "@/hooks/use-sustainability-report";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/relatorio")({
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: "/auth" });
  },
  component: SustainabilityReportPage,
  head: () => ({
    meta: [
      { title: "Relatório de Sustentabilidade — EcoDash" },
      {
        name: "description",
        content:
          "Relatório técnico de sustentabilidade: consumo de energia, eficiência e pegada de carbono do software.",
      },
      { property: "og:title", content: "Relatório de Sustentabilidade — EcoDash" },
      {
        property: "og:description",
        content: "Métricas detalhadas de Green Software e impacto ambiental do código.",
      },
    ],
  }),
});

function SustainabilityReportPage() {
  const { summary, processingMetrics, isLoading, isExporting, error, exportData } =
    useSustainabilityReport();

  return (
    <DashboardLayout mainClassName="space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
      <ReportHeader
            analysisDate={summary?.analysisDate ?? null}
            isLoading={isLoading}
            isExporting={isExporting}
            onExport={() => void exportData()}
          />

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro ao carregar dados</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <>
              <OverviewCardsSkeleton />
              <ProcessingMetricsTableSkeleton />
            </>
          ) : summary ? (
            <>
              <OverviewCards summary={summary} />
              <ProcessingMetricsTable metrics={processingMetrics} />
            </>
          ) : !error ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-16 text-center">
              <BarChart3 className="mb-4 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm font-medium">Nenhuma análise encontrada</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Execute o coletor para registrar sua primeira análise.
              </p>
            </div>
          ) : null}

          {/* Insights gerados por IA — carrega de forma independente */}
      <AIInsightsPanel />
    </DashboardLayout>
  );
}
