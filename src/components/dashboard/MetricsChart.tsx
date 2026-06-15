import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { AnaliseItem } from "@/lib/api/dashboard";
import { formatDayLabel } from "@/lib/datetime";

interface MetricsChartProps {
  analyses: AnaliseItem[];
}

export function MetricsChart({ analyses }: MetricsChartProps) {
  // Últimas análises em ordem cronológica (mais antiga -> mais recente).
  const data = [...analyses]
    .slice(0, 7)
    .reverse()
    .map((a) => ({
      name: formatDayLabel(a.created_at),
      sci: Number(a.sci_score),
      energia: Number(a.energy_kwh),
    }));

  return (
    <div
      className="rounded-2xl border border-border bg-card p-4 sm:p-6"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
            Comparativo de Métricas
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            SCI Score e Energia nas análises recentes
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
          <Legend color="oklch(0.58 0.16 150)" label="SCI Score" />
          <Legend color="oklch(0.45 0.1 200)" label="Energia (kWh)" />
        </div>
      </div>

      <div className="h-52 w-full min-w-0 sm:h-72">
        {data.length === 0 ? (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            Nenhuma análise para exibir ainda.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                className="fill-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={48}
                className="fill-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                  color: "var(--foreground)",
                }}
              />
              <Line
                type="monotone"
                dataKey="sci"
                name="SCI Score"
                stroke="oklch(0.58 0.16 150)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="energia"
                name="Energia (kWh)"
                stroke="oklch(0.45 0.1 200)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
      {label}
    </div>
  );
}
