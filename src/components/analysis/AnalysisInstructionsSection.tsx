import { Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ANALYSIS_INSTRUCTIONS } from "@/lib/api/code-analysis";
import { useCodeAnalysis } from "@/hooks/use-code-analysis";
import { AnalyzeCodeButton } from "./AnalyzeCodeButton";
import { ExecutionInstructionsCard } from "./ExecutionInstructionsCard";

export function AnalysisInstructionsSection() {
  const { isAnalyzing, error, lastResult, startAnalysis, downloadScript } = useCodeAnalysis();

  return (
    <section aria-label="Instruções de análise de código" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Análise</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure o ambiente local e dispare a análise de sustentabilidade do seu código.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={downloadScript}
            className="gap-2"
          >
            <Download className="h-5 w-5" />
            Baixar Script Coletor
          </Button>
          <AnalyzeCodeButton
            isAnalyzing={isAnalyzing}
            onAnalyze={() => void startAnalysis()}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {lastResult && !isAnalyzing && (
        <Alert>
          <AlertDescription>
            Análise registrada com sucesso. ID:{" "}
            <span className="font-mono font-medium">{lastResult.analysisId}</span>
            {lastResult.message ? ` — ${lastResult.message}` : null}
          </AlertDescription>
        </Alert>
      )}

      <ExecutionInstructionsCard content={ANALYSIS_INSTRUCTIONS} />
    </section>
  );
}
