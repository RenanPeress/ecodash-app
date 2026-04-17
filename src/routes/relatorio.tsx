import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Zap, Gauge, Leaf, Cpu, Database, MemoryStick, CheckCircle2, AlertTriangle } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/relatorio")({
  component: ReportPage,
  head: () => ({
    meta: [
      { title: "Relatório de Sustentabilidade — EcoDash" },
      {
        name: "description",
        content:
          "Relatório completo de sustentabilidade do seu software: consumo de energia, eficiência e pegada de carbono.",
      },
      { property: "og:title", content: "Relatório de Sustentabilidade — EcoDash" },
      {
        property: "og:description",
        content: "Métricas detalhadas de impacto ambiental e desempenho de software verde.",
      },
    ],
  }),
});

const resources = [
  {
    icon: Cpu,
    name: "CPU",
    avg: "14.2%",
    peak: "38.7%",
    carbon: "0.18 kg",
    status: "Ótimo",
    statusType: "good" as const,
  },
  {
    icon: Database,
    name: "Data",
    avg: "2.4 GB/h",
    peak: "5.1 GB/h",
    carbon: "0.12 kg",
    status: "Bom",
    statusType: "good" as const,
  },
  {
    icon: MemoryStick,
    name: "Memory",
    avg: "128 MB",
    peak: "246 MB",
    carbon: "0.09 kg",
    status: "Atenção",
    statusType: "warn" as const,
  },
];

function ReportPage() {
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background font-sans">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar />
        <main className="p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight">
                Relatório de Sustentabilidade
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Visão consolidada do impacto ambiental do seu software.
              </p>
            </div>
            <Button
              className="gap-2 shadow-[var(--shadow-glow)]"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>

          {/* Main report card */}
          <div
            className="rounded-2xl border border-border bg-card p-6 lg:p-8"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-6 border-b border-border">
              <div className="flex items-start gap-4">
                <div
                  className="h-12 w-12 rounded-xl grid place-items-center text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Relatório
                  </p>
                  <p className="font-display text-xl font-semibold tracking-tight mt-0.5">
                    #ECO-2026-04-1729
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Emitido em {today}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium w-fit">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Verificado · Green Software Foundation
              </div>
            </div>

            {/* Summary metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <SummaryMetric
                icon={Zap}
                label="Consumo total de energia"
                value="142.8"
                unit="kWh"
                hint="-12% vs. mês anterior"
              />
              <SummaryMetric
                icon={Gauge}
                label="Índice de eficiência"
                value="0.94"
                unit="/ 1.0"
                hint="Acima da meta (0.85)"
              />
              <SummaryMetric
                icon={Leaf}
                label="Green Software"
                value="A+"
                unit="grade"
                hint="Top 5% do setor"
                highlight
              />
            </div>
          </div>

          {/* Resource breakdown table */}
          <div
            className="rounded-2xl border border-border bg-card overflow-hidden"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold tracking-tight">
                  Detalhamento por recurso
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Uso médio, picos e pegada de carbono por componente.
                </p>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5 hover:bg-primary/5">
                  <TableHead className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
                    Recurso
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">
                    Uso médio
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">
                    Pico de demanda
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">
                    Pegada de carbono
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-right pr-6">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((r) => {
                  const Icon = r.icon;
                  return (
                    <TableRow key={r.name} className="border-border hover:bg-primary/5">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{r.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{r.avg}</TableCell>
                      <TableCell className="text-sm">{r.peak}</TableCell>
                      <TableCell className="text-sm font-medium">{r.carbon}</TableCell>
                      <TableCell className="text-right pr-6">
                        <StatusBadge type={r.statusType} label={r.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="px-6 py-4 border-t border-border bg-primary/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm text-muted-foreground">
                Pegada de carbono total estimada
              </p>
              <p className="font-display text-lg font-semibold tracking-tight text-primary">
                0.39 kg CO₂e
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SummaryMetric({
  icon: Icon,
  label,
  value,
  unit,
  hint,
  highlight = false,
}: {
  icon: typeof Zap;
  label: string;
  value: string;
  unit: string;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-5 border transition ${
        highlight
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-background"
      }`}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <p className="text-xs font-medium uppercase tracking-wider">{label}</p>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <p
          className={`font-display text-3xl font-semibold tracking-tight ${
            highlight ? "text-primary" : ""
          }`}
        >
          {value}
        </p>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function StatusBadge({ type, label }: { type: "good" | "warn"; label: string }) {
  if (type === "good") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
        <CheckCircle2 className="h-3 w-3" />
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[oklch(0.96_0.05_85)] text-[oklch(0.45_0.14_75)] text-xs font-medium">
      <AlertTriangle className="h-3 w-3" />
      {label}
    </span>
  );
}
