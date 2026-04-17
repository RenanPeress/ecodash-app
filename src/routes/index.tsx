import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Timer, MemoryStick } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MetricsChart } from "@/components/dashboard/MetricsChart";
import { HistoryPanel } from "@/components/dashboard/HistoryPanel";

export const Route = createFileRoute("/")({
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
  return (
    <div className="min-h-screen bg-background font-sans">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar />
        <main className="p-6 lg:p-8 space-y-6">
          <ScoreCard />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <MetricCard
              icon={Cpu}
              label="Uso de CPU"
              value="14.2%"
              delta="-2.4%"
              trend="down"
              positive
            />
            <MetricCard
              icon={Timer}
              label="Tempo de Execução"
              value="0.84s"
              delta="-0.12s"
              trend="down"
              positive
            />
            <MetricCard
              icon={MemoryStick}
              label="Uso de Memória"
              value="128MB"
              delta="-8MB"
              trend="down"
              positive
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MetricsChart />
            </div>
            <div>
              <HistoryPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
