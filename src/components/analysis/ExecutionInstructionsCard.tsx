import { ExternalLink, HelpCircle } from "lucide-react";
import type { AnalysisInstructionsContent } from "@/types/code-analysis";
import { PrerequisitesSection } from "./PrerequisitesSection";
import { InstallationStepsSection } from "./InstallationStepsSection";

interface ExecutionInstructionsCardProps {
  content: AnalysisInstructionsContent;
}

export function ExecutionInstructionsCard({ content }: ExecutionInstructionsCardProps) {
  return (
    <article
      className="rounded-2xl border border-border bg-card"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="border-b border-border px-6 py-5">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          Instruções de Execução
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure o SCI Client localmente antes de iniciar a análise na plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 px-6 py-6 lg:grid-cols-2 lg:gap-10">
        <PrerequisitesSection items={content.prerequisites} />
        <InstallationStepsSection steps={content.installationSteps} />
      </div>

      <footer className="border-t border-border px-6 py-4">
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
