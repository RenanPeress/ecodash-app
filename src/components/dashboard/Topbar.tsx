import { Search, Bell, Settings } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 h-16 border-b border-border bg-background">
      <div className="h-full px-6 flex items-center gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar métricas..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/60 border border-transparent focus:border-primary/40 focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 text-sm transition"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <IconBtn>
            <Bell className="h-4.5 w-4.5" size={18} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[oklch(var(--warning))]" style={{ background: "oklch(0.78 0.16 75)" }} />
          </IconBtn>
          <IconBtn>
            <Settings className="h-4.5 w-4.5" size={18} />
          </IconBtn>
          <div className="ml-2 flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-tight">Ana Verde</p>
              <p className="text-xs text-muted-foreground">Engenheira</p>
            </div>
            <div
              className="h-9 w-9 rounded-full grid place-items-center text-primary-foreground font-semibold text-sm"
              style={{ background: "var(--gradient-primary)" }}
            >
              AV
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="relative h-10 w-10 grid place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition">
      {children}
    </button>
  );
}
