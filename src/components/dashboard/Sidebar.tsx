import { LayoutDashboard, BarChart3, GitCompareArrows, FileText, HelpCircle, User, Leaf } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

const main = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: BarChart3, label: "Análise", to: "/analise" },
  { icon: GitCompareArrows, label: "Comparação", to: "/comparacao" },
  { icon: FileText, label: "Relatório", to: "/relatorio" },
];
const bottom = [
  { icon: HelpCircle, label: "Ajuda", to: "/" },
  { icon: User, label: "Conta", to: "/auth" },
];

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border bg-card z-20">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
        <div
          className="grid place-items-center h-9 w-9 rounded-xl text-primary-foreground shadow-[var(--shadow-glow)]"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Leaf className="h-5 w-5" />
        </div>
        <span className="font-display text-xl font-semibold tracking-tight">EcoDash</span>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        {main.map((it) => (
          <NavItem key={it.label} {...it} active={pathname === it.to} />
        ))}
      </nav>

      <div className="px-3 pb-6 space-y-1 border-t border-border pt-4">
        {bottom.map((it) => (
          <NavItem key={it.label} {...it} />
        ))}
      </div>
    </aside>
  );
}

function NavItem({
  icon: Icon,
  label,
  to,
  active,
}: {
  icon: typeof LayoutDashboard;
  label: string;
  to: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      }`}
    >
      <Icon className="h-4.5 w-4.5" size={18} />
      <span>{label}</span>
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
    </Link>
  );
}
