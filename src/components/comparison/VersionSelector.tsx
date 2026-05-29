import type { SoftwareVersionOption } from "@/types/version-comparison";
import { cn } from "@/lib/utils";

interface VersionSelectorProps {
  label: string;
  selectedVersionId: string;
  options: SoftwareVersionOption[];
  onChange: (versionId: string) => void;
  accentEfficient?: boolean;
}

export function VersionSelector({
  label,
  selectedVersionId,
  options,
  onChange,
  accentEfficient = false,
}: VersionSelectorProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5 transition-colors",
        accentEfficient
          ? "border-emerald-500/30 bg-emerald-500/5 dark:border-emerald-400/25 dark:bg-emerald-400/5"
          : "border-border",
      )}
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <label htmlFor={`select-${label}`} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <select
        id={`select-${label}`}
        value={selectedVersionId}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground",
          "shadow-sm transition focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {options.map((option) => (
          <option key={option.versionId} value={option.versionId}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
