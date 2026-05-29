import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData } from "@/lib/api/dashboard";

const gradeStyles: Record<string, string> = {
  AAA: "bg-primary/10 text-primary",
  AA: "bg-primary/10 text-primary",
  A: "bg-primary/10 text-primary",
  B: "bg-[oklch(0.78_0.16_75/0.15)] text-[oklch(0.55_0.16_75)]",
  C: "bg-destructive/10 text-destructive",
  D: "bg-destructive/15 text-destructive",
};

interface HistoryPanelProps {
  data: DashboardData | null;
  isLoading: boolean;
}

export function HistoryPanel({ data, isLoading }: HistoryPanelProps) {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-6 h-full"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">Histórico Recente</h2>
          <p className="text-xs text-muted-foreground">Últimas análises</p>
        </div>
      </div>

      {isLoading ? (
        <ul className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-3 w-12" />
            </li>
          ))}
        </ul>
      ) : !data || data.recent.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhuma análise encontrada.
        </p>
      ) : (
        <ul className="space-y-2">
          {data.recent.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/40 transition cursor-pointer"
            >
              <div
                className={`h-10 w-10 rounded-xl grid place-items-center font-display font-semibold text-xs ${
                  gradeStyles[item.grade] ?? gradeStyles["B"]
                }`}
              >
                {item.grade}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.software_name}</p>
                <p className="text-xs text-muted-foreground">
                  SCI: {item.sci_score.toLocaleString("pt-BR", { maximumSignificantDigits: 3 })} gCO₂
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ptBR })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
