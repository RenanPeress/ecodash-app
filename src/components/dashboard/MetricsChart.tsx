    import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Seg", cpu: 18, tempo: 1.1, memoria: 140 },
  { name: "Ter", cpu: 16, tempo: 0.95, memoria: 132 },
  { name: "Qua", cpu: 22, tempo: 1.3, memoria: 150 },
  { name: "Qui", cpu: 14, tempo: 0.84, memoria: 128 },
  { name: "Sex", cpu: 12, tempo: 0.78, memoria: 120 },
  { name: "Sáb", cpu: 10, tempo: 0.7, memoria: 115 },
  { name: "Dom", cpu: 14, tempo: 0.84, memoria: 128 },
];

export function MetricsChart() {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-6"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Comparativo de Métricas
          </h2>
          <p className="text-sm text-muted-foreground">CPU, Tempo e Memória nos últimos 7 dias</p>
        </div>
        <div className="flex gap-4 text-xs">
          <Legend color="oklch(0.58 0.16 150)" label="CPU %" />
          <Legend color="oklch(0.78 0.18 145)" label="Tempo (s)" />
          <Legend color="oklch(0.45 0.1 200)" label="Memória (MB)" />
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.02 145)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="oklch(0.5 0.03 155)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="oklch(0.5 0.03 155)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.92 0.02 145)",
                borderRadius: 12,
                fontSize: 12,
                boxShadow: "0 8px 24px -12px oklch(0.5 0.1 150 / 0.2)",
              }}
            />
            <Line
              type="monotone"
              dataKey="cpu"
              stroke="oklch(0.58 0.16 150)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="tempo"
              stroke="oklch(0.78 0.18 145)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="memoria"
              stroke="oklch(0.45 0.1 200)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </div>
  );
}
