import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CpuDataPoint } from "@/types/version-comparison";

interface CpuUsageChartProps {
  data: CpuDataPoint[];
  accentEfficient?: boolean;
}

const BAR_COLOR_DEFAULT = "oklch(0.58 0.16 150)";
const BAR_COLOR_EFFICIENT = "oklch(0.62 0.17 155)";

export function CpuUsageChart({ data, accentEfficient = false }: CpuUsageChartProps) {
  const barColor = accentEfficient ? BAR_COLOR_EFFICIENT : BAR_COLOR_DEFAULT;

  return (
    <div
      className="rounded-2xl border border-border bg-card p-4 sm:p-5"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <h3 className="font-display text-sm font-semibold tracking-tight sm:text-base">Uso de CPU</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Consumo por núcleo e picos de processamento (%)
      </p>

      <div className="mt-4 h-48 w-full min-w-0 sm:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis
              dataKey="core"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              className="fill-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              unit="%"
              className="fill-muted-foreground"
            />
            <Tooltip
              cursor={{ fill: "oklch(0.58 0.16 150 / 0.08)" }}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                fontSize: 12,
                color: "var(--foreground)",
              }}
              formatter={(value: number) => [`${value}%`, "Utilização"]}
            />
            <Bar dataKey="usagePercent" fill={barColor} radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
