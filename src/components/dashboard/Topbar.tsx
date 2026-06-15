import { useCallback, useEffect, useRef, useState } from "react";
import {
  Search, Bell, Settings, LogOut, FileText, Menu, X,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { getStoredUsername, clearAuthToken } from "@/lib/auth-token";
import { fetchDashboard } from "@/lib/api/dashboard";
import { MAIN_NAV } from "@/lib/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ThemeSelector } from "@/components/theme/ThemeSelector";

type SearchResult =
  | { kind: "route"; label: string; desc: string; to: string; icon: (typeof MAIN_NAV)[number]["icon"] }
  | { kind: "analysis"; label: string; desc: string; to: string };

interface TopbarProps {
  onOpenMobileNav?: () => void;
}

export function Topbar({ onOpenMobileNav }: TopbarProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const username = getStoredUsername() ?? "Usuário";
  const initials = username.slice(0, 2).toUpperCase();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleLogout() {
    clearAuthToken();
    void navigate({ to: "/auth" });
  }

  const runSearch = useCallback(async (q: string) => {
    const lower = q.toLowerCase().trim();
    const routeMatches: SearchResult[] = MAIN_NAV.filter(
      (r) =>
        r.label.toLowerCase().includes(lower) ||
        (r.desc?.toLowerCase().includes(lower) ?? false),
    ).map((r) => ({ kind: "route" as const, ...r, desc: r.desc ?? "" }));

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
      /* ignore API errors in search */
    }

    setResults([...routeMatches, ...analysisMatches]);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      if (isMobile) setSearchOpen(false);
      return;
    }
    void runSearch(trimmed);
  }, [query, runSearch, isMobile]);

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
    if (isMobile && !query.trim()) return;
    setSearchOpen(true);
  }

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        {/* Mobile: barra superior com menu e ações */}
        <div className="flex h-14 items-center gap-2 border-b border-border px-3 md:hidden">
          <button
            type="button"
            title="Abrir menu"
            aria-label="Abrir menu de navegação"
            onClick={onOpenMobileNav}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:bg-accent/50 hover:text-foreground"
          >
            <Menu size={20} />
          </button>
          <p className="min-w-0 flex-1 truncate font-display text-base font-semibold tracking-tight">
            EcoDash
          </p>
          <div className="flex shrink-0 items-center gap-0.5">
            <IconBtn onClick={() => setBellOpen(true)} title="Notificações">
              <Bell size={18} />
            </IconBtn>
            <IconBtn onClick={() => setSettingsOpen(true)} title="Configurações">
              <Settings size={18} />
            </IconBtn>
            <div
              className="ml-1 grid h-9 w-9 place-items-center rounded-full text-sm font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              {initials}
            </div>
          </div>
        </div>

        {/* Busca + ações desktop (busca full-width no mobile) */}
        <div className="flex h-14 items-center gap-3 px-3 md:h-16 md:gap-4 md:px-6">
          <div ref={searchRef} className="relative min-w-0 flex-1 md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim()) setSearchOpen(true);
              }}
              onFocus={handleSearchFocus}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSearchOpen(false);
                  inputRef.current?.blur();
                }
                if (e.key === "Enter" && results.length > 0) handleSelect(results[0].to);
              }}
              placeholder={isMobile ? "Buscar análises..." : "Buscar métricas, análises..."}
              className="h-10 w-full rounded-xl border border-transparent bg-muted/60 pl-10 pr-8 text-sm transition focus:border-primary/40 focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSearchOpen(false);
                  inputRef.current?.focus();
                }}
                className="absolute right-2.5 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition hover:bg-accent/60 hover:text-foreground"
              >
                <X size={12} />
              </button>
            )}
            {searchOpen && results.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                {results.some((r) => r.kind === "route") && (
                  <p className="px-3 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Navegação
                  </p>
                )}
                {results
                  .filter((r) => r.kind === "route")
                  .map((r) => (
                    <SearchRow key={r.to + r.label} result={r} onSelect={() => handleSelect(r.to)} />
                  ))}
                {results.some((r) => r.kind === "analysis") && (
                  <p className="mt-1 border-t border-border px-3 pb-1 pt-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Análises recentes
                  </p>
                )}
                {results
                  .filter((r) => r.kind === "analysis")
                  .map((r, i) => (
                    <SearchRow key={`a-${i}`} result={r} onSelect={() => handleSelect(r.to)} />
                  ))}
              </div>
            )}
          </div>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <IconBtn onClick={() => setBellOpen(true)} title="Notificações">
              <Bell size={18} />
            </IconBtn>
            <IconBtn onClick={() => setSettingsOpen(true)} title="Configurações">
              <Settings size={18} />
            </IconBtn>
            <div className="ml-2 flex items-center gap-3 border-l border-border pl-3">
              <div className="hidden text-right sm:block">
                <p className="max-w-[140px] truncate text-sm font-medium leading-tight">{username}</p>
                <p className="text-xs text-muted-foreground">Usuário EcoDash</p>
              </div>
              <div
                className="grid h-9 w-9 place-items-center rounded-full text-sm font-semibold text-primary-foreground"
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
              <ThemeSelector />
            </SettingSection>
            <SettingSection title="Conta">
              <div className="space-y-1 text-sm">
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
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Sair da conta
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={bellOpen} onOpenChange={setBellOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notificações
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-6 text-center">
            <Bell className="mx-auto h-10 w-10 text-muted-foreground/30" />
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

function SearchRow({ result, onSelect }: { result: SearchResult; onSelect: () => void }) {
  const Icon = result.kind === "route" ? result.icon : FileText;
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-accent/50"
    >
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10">
        <Icon className="h-3.5 w-3.5 text-primary" size={14} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium leading-tight text-foreground">{result.label}</p>
        <p className="truncate text-xs text-muted-foreground">{result.desc}</p>
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
      className="relative grid h-10 w-10 place-items-center rounded-xl text-muted-foreground transition hover:bg-accent/50 hover:text-foreground"
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 py-1.5 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
