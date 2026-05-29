import type { InstallationStep } from "@/types/code-analysis";
import { TerminalCodeBlock } from "./TerminalCodeBlock";

interface InstallationStepsSectionProps {
  steps: InstallationStep[];
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
                <TerminalCodeBlock command={step.command} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
