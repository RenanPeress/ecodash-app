import { Code, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnalyzeCodeButtonProps {
  isAnalyzing: boolean;
  onAnalyze: () => void;
  className?: string;
}

export function AnalyzeCodeButton({ isAnalyzing, onAnalyze, className }: AnalyzeCodeButtonProps) {
  return (
    <Button
      type="button"
      size="lg"
      disabled={isAnalyzing}
      onClick={onAnalyze}
      className={cn(
        "gap-2 bg-emerald-600 px-6 text-white shadow-md hover:bg-emerald-700",
        "focus-visible:ring-emerald-500/40 disabled:opacity-70",
        "dark:bg-emerald-600 dark:hover:bg-emerald-500",
        className,
      )}
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Analisando...
        </>
      ) : (
        <>
          <Code className="h-5 w-5" />
          Analisar Código
        </>
      )}
    </Button>
  );
}
