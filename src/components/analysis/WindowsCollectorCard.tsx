import { Download, Loader2, Monitor, Settings2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/lib/auth-token";
import { API_BASE_URL } from "@/lib/api/client";
import { TerminalCodeBlock } from "./TerminalCodeBlock";

function DownloadButton({
  url,
  filename,
  label,
  variant = "outline",
}: {
  url: string;
  filename: string;
  label: string;
  variant?: "outline" | "default";
}) {
  const [busy, setBusy] = useState(false);

  const handleClick = useCallback(async () => {
    setBusy(true);
    try {
      const token = getAuthToken();
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Erro ${res.status}`);
      }
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(href);
    } catch (err) {
      console.error(`[WindowsCollector] Falha ao baixar ${filename}:`, err);
    } finally {
      setBusy(false);
    }
  }, [url, filename]);

  return (
    <Button
      size="sm"
      variant={variant}
      onClick={() => void handleClick()}
      disabled={busy}
      className={
        variant === "default"
          ? "gap-2 shadow-[var(--shadow-glow)]"
          : "gap-2 border-emerald-600/40 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-500/40 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
      }
      style={variant === "default" ? { background: "var(--gradient-primary)" } : undefined}
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
      {busy ? "Baixando…" : label}
    </Button>
  );
}

const EXE_URL = `${API_BASE_URL}/api/collector/download/windows/exe/`;
const CONF_URL = `${API_BASE_URL}/api/collector/download/windows/config/`;

const STEPS = [
  {
    num: 1,
    icon: <Monitor className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
    title: "Baixar o executável",
    description:
      "Baixe o ecodash-collector.exe — não requer Python instalado. Coloque-o em uma pasta de fácil acesso.",
    download: { url: EXE_URL, filename: "ecodash-collector.exe", label: "Baixar .exe (~15 MB)" },
  },
  {
    num: 2,
    icon: <Settings2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
    title: "Baixar a configuração",
    description:
      "Baixe o ecodash.conf com o seu token pessoal. Coloque-o na mesma pasta que o .exe.",
    download: { url: CONF_URL, filename: "ecodash.conf", label: "Baixar ecodash.conf" },
  },
  {
    num: 3,
    title: "Executar pelo Prompt de Comando",
    description: "Abra o cmd na pasta onde estão os dois arquivos e execute:",
    command: "ecodash-collector.exe python seu_script.py",
  },
];

export function WindowsCollectorCard() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-display text-base font-semibold tracking-tight">
          Instalação — Windows
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Executável standalone — nenhuma instalação de Python necessária para o usuário final.
        </p>
      </div>

      <ol className="space-y-6">
        {STEPS.map((step) => (
          <li key={step.num} className="flex gap-3">
            <span
              aria-hidden
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
            >
              {step.num}
            </span>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-sm font-medium">
                Passo {step.num} — {step.title}
              </p>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              {step.download && (
                <DownloadButton
                  url={step.download.url}
                  filename={step.download.filename}
                  label={step.download.label}
                  variant={step.num === 1 ? "default" : "outline"}
                />
              )}
              {step.command && <TerminalCodeBlock command={step.command} />}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
