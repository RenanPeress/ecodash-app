import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickMetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  isBest?: boolean;
}

export function QuickMetricCard({ label, value, icon: Icon, isBest = false }: QuickMetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        isBest
          ? "border-emerald-500/30 bg-emerald-500/5 dark:border-emerald-400/25 dark:bg-emerald-400/5"
          : "border-border bg-background",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            isBest ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
          )}
        />
      </div>
      <p
        className={cn(
          "mt-2 font-display text-xl font-semibold tracking-tight",
          isBest && "text-emerald-700 dark:text-emerald-300",
        )}
      >
        {value}
      </p>
      {isBest && (
        <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
          Melhor desempenho
        </p>
      )}
    </div>
  );
}
