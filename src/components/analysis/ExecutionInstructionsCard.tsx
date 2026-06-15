import { useState } from "react";
import { ExternalLink, HelpCircle } from "lucide-react";
import type { AnalysisInstructionsContent } from "@/types/code-analysis";
import { PrerequisitesSection } from "./PrerequisitesSection";
import { InstallationStepsSection } from "./InstallationStepsSection";
import { WindowsCollectorCard } from "./WindowsCollectorCard";

interface ExecutionInstructionsCardProps {
  content: AnalysisInstructionsContent;
}

type Platform = "linux" | "windows";

export function ExecutionInstructionsCard({ content }: ExecutionInstructionsCardProps) {
  const [platform, setPlatform] = useState<Platform>("linux");

  return (
    <article
      className="rounded-2xl border border-border bg-card"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="border-b border-border px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
              Instruções de Execução
            </h2>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Configure o SCI Client localmente antes de iniciar a análise na plataforma.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-muted/40 p-1 text-sm">
            <button
              onClick={() => setPlatform("linux")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                platform === "linux"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🐧 Linux / macOS
            </button>
            <button
              onClick={() => setPlatform("windows")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                platform === "windows"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🪟 Windows
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-4 py-4 sm:px-6 sm:py-6">
        {platform === "linux" ? (
          <>
            <PrerequisitesSection items={content.prerequisites} />
            <InstallationStepsSection steps={content.installationSteps} />
          </>
        ) : (
          <WindowsCollectorCard />
        )}
      </div>

      <footer className="border-t border-border px-4 py-4 sm:px-6">
        <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <HelpCircle className="h-4 w-4 shrink-0" />
          <a
            href={content.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-emerald-700 underline-offset-4 transition hover:underline dark:text-emerald-400"
          >
            Consulte a documentação completa para mais detalhes.
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </p>
      </footer>
    </article>
  );
}
