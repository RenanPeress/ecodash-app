const builds = [
  { id: "#2481", time: "há 2 min", grade: "A", branch: "main" },
  { id: "#2480", time: "há 1 h", grade: "A", branch: "feat/cache" },
  { id: "#2479", time: "há 3 h", grade: "B", branch: "main" },
  { id: "#2478", time: "ontem", grade: "A", branch: "fix/loop" },
  { id: "#2477", time: "ontem", grade: "C", branch: "experiment" },
  { id: "#2476", time: "2d", grade: "B", branch: "main" },
];

const gradeStyles: Record<string, string> = {
  A: "bg-primary/10 text-primary",
  B: "bg-[oklch(0.78_0.16_75/0.15)] text-[oklch(0.55_0.16_75)]",
  C: "bg-destructive/10 text-destructive",
};

export function HistoryPanel() {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-6 h-full"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">Histórico Recente</h2>
          <p className="text-xs text-muted-foreground">Últimas execuções</p>
        </div>
        <button className="text-xs font-medium text-primary hover:underline">Ver tudo</button>
      </div>

      <ul className="space-y-2">
        {builds.map((b) => (
          <li
            key={b.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/40 transition cursor-pointer"
          >
            <div
              className={`h-10 w-10 rounded-xl grid place-items-center font-display font-semibold ${
                gradeStyles[b.grade]
              }`}
            >
              {b.grade}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Build {b.id}</p>
              <p className="text-xs text-muted-foreground truncate">{b.branch}</p>
            </div>
            <span className="text-xs text-muted-foreground">{b.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
