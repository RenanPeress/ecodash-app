import { Check, ClipboardCopy } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface TerminalCodeBlockProps {
  command: string;
  className?: string;
}

export function TerminalCodeBlock({ command, className }: TerminalCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [command]);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg bg-slate-900 dark:bg-slate-950",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => void handleCopy()}
        aria-label={copied ? "Comando copiado" : "Copiar comando"}
        className={cn(
          "absolute right-2 top-2 rounded-md p-1.5 text-slate-400 transition",
          "opacity-0 group-hover:opacity-100 focus:opacity-100",
          "hover:bg-slate-800 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
      </button>
      <pre className="overflow-x-auto p-4 pr-12 font-mono text-sm leading-relaxed text-slate-200">
        <code>{command}</code>
      </pre>
    </div>
  );
}
