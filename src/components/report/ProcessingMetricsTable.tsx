import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProcessingMetric, ProcessingStatus } from "@/types/sustainability-report";
import { cn } from "@/lib/utils";

interface ProcessingMetricsTableProps {
  metrics: ProcessingMetric[];
}

const statusConfig: Record<
  ProcessingStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  optimized: {
    label: "Otimizado",
    icon: CheckCircle2,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  alert: {
    label: "Alerta",
    icon: AlertTriangle,
    className:
      "border-[oklch(0.78_0.16_75/0.3)] bg-[oklch(0.96_0.05_85)] text-[oklch(0.45_0.14_75)] dark:bg-[oklch(0.35_0.08_75)] dark:text-[oklch(0.85_0.12_85)]",
  },
  critical: {
    label: "Crítico",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

function StatusBadge({ status }: { status: ProcessingStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        config.className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function formatPeakDemand(value: number, unit: string): string {
  return unit === "%"
    ? `${value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
    : `${value.toLocaleString("pt-BR")} ${unit}`;
}

function MetricMobileCard({ metric }: { metric: ProcessingMetric }) {
  return (
    <article className="rounded-xl border border-border bg-background p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-foreground">{metric.resource}</h3>
        <StatusBadge status={metric.status} />
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Utilização média</dt>
          <dd className="mt-0.5 font-medium">
            {metric.averageUtilizationPercent.toLocaleString("pt-BR", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
            %
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Pico de demanda</dt>
          <dd className="mt-0.5 font-medium">
            {formatPeakDemand(metric.peakDemandValue, metric.peakDemandUnit)}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs text-muted-foreground">Pegada de carbono</dt>
          <dd className="mt-0.5 font-medium">
            {metric.carbonFootprintGco2eq.toLocaleString("pt-BR")} gCO₂eq
          </dd>
        </div>
      </dl>
    </article>
  );
}

export function ProcessingMetricsTable({ metrics }: ProcessingMetricsTableProps) {
  return (
    <section
      aria-label="Métricas de processamento bruto"
      className="overflow-hidden rounded-2xl border border-border bg-card"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="border-b border-border px-4 py-4 sm:px-6 sm:py-5">
        <h2 className="font-display text-base font-semibold tracking-tight sm:text-lg">
          Métricas de Processamento Bruto
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
          Utilização média, picos de demanda e pegada de carbono por recurso do sistema.
        </p>
      </div>

      {/* Mobile: cards */}
      <div className="space-y-3 p-4 md:hidden">
        {metrics.map((metric) => (
          <MetricMobileCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Desktop: tabela */}
      <div className="hidden overflow-x-auto md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/5 hover:bg-primary/5">
              <TableHead className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
                Recurso do Sistema
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Utilização Média
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Pico de Demanda
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Pegada de Carbono
              </TableHead>
              <TableHead className="pr-6 text-right text-xs font-medium uppercase tracking-wider">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric) => (
              <TableRow key={metric.id} className="border-border hover:bg-primary/5">
                <TableCell className="px-6 py-4 font-medium">{metric.resource}</TableCell>
                <TableCell className="text-sm">
                  {metric.averageUtilizationPercent.toLocaleString("pt-BR", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                  %
                </TableCell>
                <TableCell className="text-sm">
                  {formatPeakDemand(metric.peakDemandValue, metric.peakDemandUnit)}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {metric.carbonFootprintGco2eq.toLocaleString("pt-BR")} gCO₂eq
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <StatusBadge status={metric.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

const SKELETON_ROWS = 4;

export function ProcessingMetricsTableSkeleton() {
  return (
    <section
      aria-label="Carregando métricas de processamento"
      className="overflow-hidden rounded-2xl border border-border bg-card"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="space-y-2 border-b border-border px-4 py-4 sm:px-6 sm:py-5">
        <Skeleton className="h-6 w-full max-w-xs sm:w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="space-y-3 p-4 md:hidden">
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-xl" />
        ))}
      </div>
      <div className="hidden space-y-4 p-6 md:block">
        <Skeleton className="h-8 w-full" />
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    </section>
  );
}
