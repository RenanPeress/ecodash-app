import { Download, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import type { InstallationStep } from "@/types/code-analysis";
import { getAuthToken } from "@/lib/auth-token";
import { TerminalCodeBlock } from "./TerminalCodeBlock";

interface InstallationStepsSectionProps {
  steps: InstallationStep[];
}

function DownloadScriptButton({ url, filename }: { url: string; filename: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
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
      console.error("Falha ao baixar o script:", err);
    } finally {
      setIsDownloading(false);
    }
  }, [url, filename]);

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => void handleDownload()}
      disabled={isDownloading}
      className="mt-1 gap-2 border-emerald-600/40 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-500/40 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
    >
      {isDownloading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
      {isDownloading ? "Baixando…" : `Baixar ${filename}`}
    </Button>
  );
}

export function InstallationStepsSection({ steps }: InstallationStepsSectionProps) {
  return (
    <div className="space-y-5">
      <h3 className="font-display text-base font-semibold tracking-tight">
        Passo a Passo de Instalação
      </h3>

      <ol className="space-y-6">
        {steps.map((step) => (
          <li key={step.step} className="relative pl-0">
            <div className="flex gap-3">
              <span
                aria-hidden
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
              >
                {step.step}
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm font-medium">
                  Passo {step.step} — {step.title}
                </p>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                {step.downloadUrl && step.downloadFilename && (
                  <DownloadScriptButton url={step.downloadUrl} filename={step.downloadFilename} />
                )}
                <TerminalCodeBlock command={step.command} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
