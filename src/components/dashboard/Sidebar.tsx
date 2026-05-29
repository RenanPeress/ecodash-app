import { useState } from "react";
import {
  LayoutDashboard, BarChart3, GitCompareArrows, FileText,
  HelpCircle, User, Leaf, Mail, BookOpen, MessageSquare, LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getStoredUsername, clearAuthToken } from "@/lib/auth-token";

const main = [
  { icon: LayoutDashboard, label: "Dashboard",  to: "/" },
  { icon: BarChart3,        label: "Análise",   to: "/analise" },
  { icon: GitCompareArrows, label: "Comparação",to: "/comparacao" },
  { icon: FileText,         label: "Relatório", to: "/relatorio" },
];

export function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [helpOpen, setHelpOpen]       = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const username = getStoredUsername() ?? "Usuário";

  function handleLogout() {
    clearAuthToken();
    void navigate({ to: "/auth" });
  }

  return (
    <>
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border bg-card/60 backdrop-blur-sm z-20">
        <div className="flex items-center gap-2 px-6 h-16 border-b border-border select-none">
          <div className="grid place-items-center h-9 w-9 rounded-xl text-primary-foreground shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-primary)" }}>
            <Leaf className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">EcoDash</span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Menu</p>
          {main.map(it => (
            <NavItem key={it.label} {...it} active={pathname === it.to} />
          ))}
        </nav>

        <div className="px-3 pb-6 space-y-1 border-t border-border pt-4">
          <ActionItem icon={HelpCircle} label="Ajuda"  onClick={() => setHelpOpen(true)} />
          <ActionItem icon={User}       label="Conta"  onClick={() => setAccountOpen(true)} />
        </div>
      </aside>

      {/* Help */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />Ajuda — EcoDash
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <HelpSection icon={BookOpen} title="Como funciona?"
              text="O EcoDash coleta métricas de CPU, memória e tempo de execução do seu software e calcula o Score de Impacto de Carbono (SCI) seguindo os princípios do Green Software Foundation." />
            <HelpSection icon={BarChart3} title="Como analisar meu código?"
              text="Acesse a aba Análise, baixe o script coletor Python e execute-o no seu projeto. O script envia as métricas automaticamente para o dashboard." />
            <HelpSection icon={GitCompareArrows} title="Como comparar versões?"
              text="Na aba Comparação você pode selecionar duas versões e visualizar diferenças de eficiência energética, CPU, memória e pegada de carbono lado a lado." />
            <div className="border-t border-border pt-4 flex items-center gap-2 text-xs">
              <Mail className="h-4 w-4 shrink-0" />
              <span>Dúvidas? <a href="mailto:suporte@ecodash.dev"
                className="text-primary underline-offset-4 hover:underline">suporte@ecodash.dev</a></span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Account */}
      <Dialog open={accountOpen} onOpenChange={setAccountOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />Minha Conta
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
              <div className="h-12 w-12 rounded-full grid place-items-center text-primary-foreground font-semibold text-lg shrink-0"
                style={{ background: "var(--gradient-primary)" }}>
                {username.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{username}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Usuário EcoDash</p>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <InfoRow label="Usuário" value={username} />
              <InfoRow label="Plano"   value="Gratuito" />
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground">Para alterar dados, entre em contato com o suporte.</span>
            </div>
            <Button variant="destructive" className="w-full gap-2"
              onClick={() => { setAccountOpen(false); handleLogout(); }}>
              <LogOut className="h-4 w-4" />Sair da conta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function NavItem({ icon: Icon, label, to, active }: {
  icon: typeof LayoutDashboard; label: string; to: string; active?: boolean;
}) {
  return (
    <Link to={to}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      }`}>
      <Icon className="h-4.5 w-4.5 shrink-0" size={18} />
      <span>{label}</span>
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
    </Link>
  );
}

function ActionItem({ icon: Icon, label, onClick }: {
  icon: typeof HelpCircle; label: string; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all">
      <Icon className="h-4.5 w-4.5 shrink-0" size={18} />
      <span>{label}</span>
    </button>
  );
}

function HelpSection({ icon: Icon, title, text }: { icon: typeof BookOpen; title: string; text: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
      <div>
        <p className="font-medium text-foreground text-sm">{title}</p>
        <p className="mt-0.5 leading-relaxed">{text}</p>
      </div>
    </div>
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
