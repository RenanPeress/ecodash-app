import { useCallback, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ANALYSIS_INSTRUCTIONS } from "@/lib/api/code-analysis";
import { ExecutionInstructionsCard } from "./ExecutionInstructionsCard";
import { getAuthToken } from "@/lib/auth-token";
import { API_BASE_URL } from "@/lib/api/client";

function CollectorDownloadButton({
  url,
  filename,
  label,
  variant = "outline",
}: {
  url: string;
  filename: string;
  label: string;
  variant?: "default" | "outline";
}) {
  const [busy, setBusy] = useState(false);

  const handleClick = useCallback(async () => {
    setBusy(true);
    try {
      const token = getAuthToken();
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(href);
    } catch (err) {
      console.error(`[AnalysisHeader] Falha ao baixar ${filename}:`, err);
    } finally {
      setBusy(false);
    }
  }, [url, filename]);

  return (
    <Button
      type="button"
      size="lg"
      variant={variant}
      disabled={busy}
      onClick={() => void handleClick()}
      className={
        variant === "default"
          ? "gap-2 px-5 shadow-[var(--shadow-glow)]"
          : "gap-2 border-emerald-600/40 px-5 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-500/40 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
      }
      style={variant === "default" ? { background: "var(--gradient-primary)" } : undefined}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {busy ? "Baixando…" : label}
    </Button>
  );
}

export function AnalysisInstructionsSection() {
  return (
    <section aria-label="Instruções de análise de código" className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Análise</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Baixe o coletor, execute no seu software e os dados aparecem automaticamente aqui.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <CollectorDownloadButton
            url={`${API_BASE_URL}/api/collector/download/`}
            filename="ecodash-collector.py"
            label="Baixar .py"
            variant="outline"
          />
          <CollectorDownloadButton
            url={`${API_BASE_URL}/api/collector/download/windows/exe/`}
            filename="ecodash-collector.exe"
            label="Baixar .exe"
            variant="default"
          />
        </div>
      </div>

      <ExecutionInstructionsCard content={ANALYSIS_INSTRUCTIONS} />
    </section>
  );
}
