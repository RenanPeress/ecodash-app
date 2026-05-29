import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MemoryDataPoint } from "@/types/version-comparison";

interface MemoryAllocationChartProps {
  data: MemoryDataPoint[];
  chartId: string;
  accentEfficient?: boolean;
}

const STROKE_DEFAULT = "oklch(0.45 0.1 200)";
const STROKE_EFFICIENT = "oklch(0.58 0.16 150)";

export function MemoryAllocationChart({
  data,
  chartId,
  accentEfficient = false,
}: MemoryAllocationChartProps) {
  const stroke = accentEfficient ? STROKE_EFFICIENT : STROKE_DEFAULT;
  const gradientId = `memory-fill-${chartId}`;

  return (
    <div
      className="rounded-2xl border border-border bg-card p-5"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <h3 className="font-display text-base font-semibold tracking-tight">
        Alocação de Memória ao Longo do Tempo
      </h3>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Eixo X: tempo · Eixo Y: memória RAM (MB)
      </p>

      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%" debounce={80}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              className="fill-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              unit=" MB"
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
              formatter={(value: number) => [`${value} MB`, "Memória"]}
            />
            <Area
              type="monotone"
              dataKey="memoryMb"
              stroke={stroke}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              dot={{ r: 3, fill: stroke }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
