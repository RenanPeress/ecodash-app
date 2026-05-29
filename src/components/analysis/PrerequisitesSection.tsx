import type { PrerequisiteBlock } from "@/types/code-analysis";
import { TerminalCodeBlock } from "./TerminalCodeBlock";

interface PrerequisitesSectionProps {
  items: PrerequisiteBlock[];
}

export function PrerequisitesSection({ items }: PrerequisitesSectionProps) {
  return (
    <div className="space-y-5">
      <h3 className="font-display text-base font-semibold tracking-tight">Pré-requisitos</h3>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <TerminalCodeBlock command={item.command} />
          </div>
        ))}
      </div>
    </div>
  );
}
