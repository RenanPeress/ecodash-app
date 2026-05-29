import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { OverviewCards, OverviewCardsSkeleton } from "@/components/report/OverviewCards";
import {
  ProcessingMetricsTable,
  ProcessingMetricsTableSkeleton,
} from "@/components/report/ProcessingMetricsTable";
import { ReportHeader } from "@/components/report/ReportHeader";
import { useSustainabilityReport } from "@/hooks/use-sustainability-report";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/relatorio")({
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
    <div className="min-h-screen bg-background font-sans">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar />
        <main className="space-y-6 p-6 lg:space-y-8 lg:p-8">
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
          ) : null}
        </main>
      </div>
    </div>
  );
}
