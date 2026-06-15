import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  positive?: boolean;
}

export function MetricCard({ icon: Icon, label, value, delta, trend, positive = true }: Props) {
  const Trend = trend === "down" ? TrendingDown : TrendingUp;
  const good = positive;
  return (
    <div
      className="rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 sm:p-6"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-start justify-between">
        <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center">
          <Icon className="h-5 w-5" />
        </div>
        {delta && trend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              good ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
            }`}
          >
            <Trend className="h-3 w-3" /> {delta}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm text-muted-foreground sm:mt-5">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{value}</p>
    </div>
  );
}
