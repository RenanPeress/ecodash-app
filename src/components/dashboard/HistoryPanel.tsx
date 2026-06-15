import { useNavigate } from "@tanstack/react-router";
import type { AnaliseItem } from "@/lib/api/dashboard";
import { formatRelativeTime } from "@/lib/datetime";

interface HistoryPanelProps {
  analyses: AnaliseItem[];
}

const gradeStyles: Record<string, string> = {
  AAA: "bg-primary/10 text-primary",
  AA: "bg-primary/10 text-primary",
  A: "bg-primary/10 text-primary",
  B: "bg-[oklch(0.78_0.16_75/0.15)] text-[oklch(0.55_0.16_75)]",
  C: "bg-destructive/10 text-destructive",
  D: "bg-destructive/10 text-destructive",
};

export function HistoryPanel({ analyses }: HistoryPanelProps) {
  const navigate = useNavigate();
  const recent = analyses.slice(0, 6);

  return (
    <div
      className="h-full rounded-2xl border border-border bg-card p-4 sm:p-6"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">Histórico Recente</h2>
          <p className="text-xs text-muted-foreground">Últimas análises</p>
        </div>
        <button
          type="button"
          onClick={() => void navigate({ to: "/relatorio" })}
          className="text-xs font-medium text-primary hover:underline"
        >
          Ver tudo
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="grid place-items-center py-10 text-center text-sm text-muted-foreground">
          Nenhuma análise registrada ainda.
        </div>
      ) : (
        <ul className="space-y-2">
          {recent.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/40 transition cursor-pointer"
            >
              <div
                className={`h-10 w-10 rounded-xl grid place-items-center font-display text-sm font-semibold ${
                  gradeStyles[a.grade] ?? "bg-muted text-muted-foreground"
                }`}
              >
                {a.grade}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{a.software_name}</p>
                <p className="text-xs text-muted-foreground truncate">{a.region}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatRelativeTime(a.created_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
