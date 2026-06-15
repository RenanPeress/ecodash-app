import { createFileRoute, redirect } from "@tanstack/react-router";
import { Cpu, Timer, MemoryStick, AlertTriangle } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MetricsChart } from "@/components/dashboard/MetricsChart";
import { HistoryPanel } from "@/components/dashboard/HistoryPanel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDashboard } from "@/hooks/use-dashboard";
import { isAuthenticated } from "@/lib/auth-token";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: "/auth" });
  },
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "EcoDash — Green Software Dashboard" },
      {
        name: "description",
        content:
          "EcoDash monitora a sustentabilidade do seu software: CPU, tempo de execução, memória e impacto ambiental em tempo real.",
      },
    ],
  }),
});

/** Formata um número com casas decimais, ou "—" quando indisponível. */
function fmt(value: number | undefined, suffix: string, digits = 0): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(digits)}${suffix}`;
}

function Dashboard() {
  const { summary, analyses, lastAnalysis, lastDetail, isLoading, error } = useDashboard();
  const metrics = lastDetail?.metrics;

  return (
    <DashboardLayout>
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar o dashboard</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-4 sm:space-y-6">
          <div className="h-44 animate-pulse rounded-3xl bg-muted/60" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            <div className="h-36 animate-pulse rounded-2xl bg-muted/60" />
            <div className="h-36 animate-pulse rounded-2xl bg-muted/60" />
            <div className="h-36 animate-pulse rounded-2xl bg-muted/60" />
          </div>
          <div className="h-72 animate-pulse rounded-2xl bg-muted/60" />
        </div>
      ) : (
        <>
          <ScoreCard lastAnalysis={lastAnalysis} summary={summary} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            <MetricCard
              icon={Cpu}
              label="Uso de CPU"
              value={fmt(metrics?.cpu_percent_avg, "%", 1)}
            />
            <MetricCard
              icon={Timer}
              label="Tempo de Execução"
              value={fmt(metrics?.duration_seconds, "s", 2)}
            />
            <MetricCard
              icon={MemoryStick}
              label="Uso de Memória"
              value={fmt(metrics?.memory_used_mb_avg, "MB", 0)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            <div className="lg:col-span-2">
              <MetricsChart analyses={analyses} />
            </div>
            <div>
              <HistoryPanel analyses={analyses} />
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
