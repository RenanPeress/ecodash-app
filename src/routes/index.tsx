import { createFileRoute, redirect } from "@tanstack/react-router";
import { Cpu, Timer, MemoryStick } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MetricsChart } from "@/components/dashboard/MetricsChart";
import { HistoryPanel } from "@/components/dashboard/HistoryPanel";
import { useDashboard } from "@/hooks/use-dashboard";
import { isAuthenticated } from "@/lib/auth-token";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/auth" });
    }
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

function Dashboard() {
  const { data, isLoading } = useDashboard();

  const last = data?.recent[0];
  const metrics = last
    ? (last as unknown as { metrics?: { cpu_percent_avg?: number; memory_used_mb_avg?: number; duration_seconds?: number } }).metrics
    : null;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar />
        <main className="p-6 lg:p-8 space-y-6">
          <ScoreCard data={data} isLoading={isLoading} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <MetricCard
              icon={Cpu}
              label="Uso de CPU"
              value={metrics?.cpu_percent_avg != null ? `${metrics.cpu_percent_avg.toFixed(1)}%` : "—"}
              delta=""
              trend="down"
              positive
            />
            <MetricCard
              icon={Timer}
              label="Tempo de Execução"
              value={metrics?.duration_seconds != null ? `${metrics.duration_seconds.toFixed(2)}s` : "—"}
              delta=""
              trend="down"
              positive
            />
            <MetricCard
              icon={MemoryStick}
              label="Uso de Memória"
              value={metrics?.memory_used_mb_avg != null ? `${Math.round(metrics.memory_used_mb_avg)}MB` : "—"}
              delta=""
              trend="down"
              positive
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MetricsChart />
            </div>
            <div>
              <HistoryPanel data={data} isLoading={isLoading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
