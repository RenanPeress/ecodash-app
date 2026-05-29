import { useCallback, useEffect, useRef, useState } from "react";
import {
  Search,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  BarChart3,
  GitCompareArrows,
  FileText,
  Moon,
  Sun,
  Monitor,
  X,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { getStoredUsername, clearAuthToken } from "@/lib/auth-token";
import { fetchDashboard } from "@/lib/api/dashboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/", desc: "Visão geral de métricas" },
  { icon: BarChart3, label: "Análise", to: "/analise", desc: "Analisar seu código" },
  { icon: GitCompareArrows, label: "Comparação", to: "/comparacao", desc: "Comparar versões de software" },
  { icon: FileText, label: "Relatório", to: "/relatorio", desc: "Relatório de sustentabilidade" },
];

type SearchResult =
  | { kind: "route"; label: string; desc: string; to: string; icon: typeof LayoutDashboard }
  | { kind: "analysis"; label: string; desc: string; to: string };

export function Topbar() {
  const navigate = useNavigate();
  const username = getStoredUsername() ?? "Usuário";
  const initials = username.slice(0, 2).toUpperCase();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleLogout() {
    clearAuthToken();
    void navigate({ to: "/auth" });
  }

  const runSearch = useCallback(async (q: string) => {
    const lower = q.toLowerCase().trim();

    const routeMatches: SearchResult[] = NAV_ITEMS
      .filter((r) => r.label.toLowerCase().includes(lower) || r.desc.toLowerCase().includes(lower))
      .map((r) => ({ kind: "route" as const, ...r }));

    let analysisMatches: SearchResult[] = [];
    try {
      const data = await fetchDashboard();
      analysisMatches = data.recent
        .filter((a) => a.software_name.toLowerCase().includes(lower))
        .slice(0, 4)
        .map((a) => ({
          kind: "analysis" as const,
          label: a.software_name,
          desc: `Grade ${a.grade} · SCI ${a.sci_score.toFixed(4)}`,
          to: "/relatorio",
        }));
    } catch {
      // silently ignore API errors in search
    }

    setResults([...routeMatches, ...analysisMatches]);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(NAV_ITEMS.map((r) => ({ kind: "route" as const, ...r })));
      return;
    }
    void runSearch(query);
  }, [query, runSearch]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSelect(to: string) {
    setSearchOpen(false);
    setQuery("");
    void navigate({ to: to as "/" });
  }

  function handleSearchFocus() {
    setSearchOpen(true);
    if (!query.trim()) {
      setResults(NAV_ITEMS.map((r) => ({ kind: "route" as const, ...r })));
    }
  }

  function handleClear() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <>
      <header className="sticky top-0 z-10 h-16 border-b border-border bg-background">
        <div className="h-full px-6 flex items-center gap-4">
          {/* Search */}
          <div ref={searchRef} className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleSearchFocus}
              onKeyDown={(e) => {
                if (e.key === "Escape") { setSearchOpen(false); inputRef.current?.blur(); }
                if (e.key === "Enter" && results.length > 0) handleSelect(results[0].to);
              }}
              placeholder="Buscar métricas, análises..."
              className="w-full h-10 pl-10 pr-8 rounded-xl bg-muted/60 border border-transparent focus:border-primary/40 focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10 text-sm transition"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 grid place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/60 transition"
              >
                <X size={12} />
              </button>
            )}

            {/* Dropdown */}
            {searchOpen && results.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-50">
                {results.some((r) => r.kind === "route") && (
                  <p className="px-3 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Navegação
                  </p>
                )}
                {results
                  .filter((r) => r.kind === "route")
                  .map((r) => (
                    <SearchRow
                      key={r.to + r.label}
                      result={r}
                      onSelect={() => handleSelect(r.to)}
                    />
                  ))}

                {results.some((r) => r.kind === "analysis") && (
                  <p className="px-3 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-t border-border mt-1">
                    Análises recentes
                  </p>
                )}
                {results
                  .filter((r) => r.kind === "analysis")
                  .map((r, i) => (
                    <SearchRow
                      key={`analysis-${i}`}
                      result={r}
                      onSelect={() => handleSelect(r.to)}
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <IconBtn onClick={() => setNotificationsOpen(true)} title="Notificações">
              <Bell size={18} />
            </IconBtn>
            <IconBtn onClick={() => setSettingsOpen(true)} title="Configurações">
              <Settings size={18} />
            </IconBtn>
            <div className="ml-2 flex items-center gap-3 pl-3 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-tight truncate max-w-[140px]">{username}</p>
                <p className="text-xs text-muted-foreground">Usuário EcoDash</p>
              </div>
              <div
                className="h-9 w-9 rounded-full grid place-items-center text-primary-foreground font-semibold text-sm"
                style={{ background: "var(--gradient-primary)" }}
              >
                {initials}
              </div>
            </div>
            <IconBtn onClick={handleLogout} title="Sair">
              <LogOut size={18} />
            </IconBtn>
          </div>
        </div>
      </header>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Configurações
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <SettingSection title="Aparência">
              <div className="grid grid-cols-3 gap-2">
                <ThemeBtn icon={Sun} label="Claro" />
                <ThemeBtn icon={Moon} label="Escuro" />
                <ThemeBtn icon={Monitor} label="Sistema" active />
              </div>
            </SettingSection>

            <SettingSection title="Conta">
              <div className="space-y-2 text-sm">
                <InfoRow label="Usuário" value={username} />
                <InfoRow label="Plano" value="Gratuito" />
              </div>
            </SettingSection>

            <button
              type="button"
              onClick={() => {
                setSettingsOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-destructive border border-destructive/30 hover:bg-destructive/10 transition"
            >
              <LogOut className="h-4 w-4" />
              Sair da conta
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notificações
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center space-y-2">
            <Bell className="h-10 w-10 text-muted-foreground/30 mx-auto" />
            <p className="text-sm font-medium text-muted-foreground">Nenhuma notificação</p>
            <p className="text-xs text-muted-foreground/70">
              Alertas sobre suas análises aparecerão aqui.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SearchRow({
  result,
  onSelect,
}: {
  result: SearchResult;
  onSelect: () => void;
}) {
  const Icon = result.kind === "route" ? (result as { icon: typeof LayoutDashboard }).icon : FileText;
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent/50 transition text-left"
    >
      <div className="h-7 w-7 rounded-lg bg-primary/10 grid place-items-center shrink-0">
        <Icon className="h-3.5 w-3.5 text-primary" size={14} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground leading-tight truncate">{result.label}</p>
        <p className="text-xs text-muted-foreground truncate">{result.desc}</p>
      </div>
    </button>
  );
}

function IconBtn({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="relative h-10 w-10 grid place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition"
    >
      {children}
    </button>
  );
}

function SettingSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

function ThemeBtn({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Sun;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-lg border text-xs font-medium transition ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
