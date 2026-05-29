import { useCallback, useState } from "react";
import { startCodeAnalysisMock } from "@/lib/api/code-analysis";
import type { StartAnalysisResponse } from "@/types/code-analysis";

interface UseCodeAnalysisResult {
  isAnalyzing: boolean;
  error: string | null;
  lastResult: StartAnalysisResponse | null;
  startAnalysis: () => Promise<void>;
  resetError: () => void;
}

export function useCodeAnalysis(): UseCodeAnalysisResult {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<StartAnalysisResponse | null>(null);

  const startAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await startCodeAnalysisMock({ source: "web-ui" });
      setLastResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao iniciar a análise.");
      setLastResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const resetError = useCallback(() => setError(null), []);

  return {
    isAnalyzing,
    error,
    lastResult,
    startAnalysis,
    resetError,
  };
}
