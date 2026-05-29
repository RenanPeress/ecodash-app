import { useCallback, useState } from "react";
import { fetchAnalyses } from "@/lib/api/dashboard";
import { fetchAISummary, fetchAIRecommendations } from "@/lib/api/ai";
import type { Recommendation } from "@/types/ai";

interface UseAIAnalysisResult {
  analysisId: number | null;
  summary: string | null;
  recommendations: Recommendation[];
  isLoadingSummary: boolean;
  isLoadingRecs: boolean;
  summaryError: string | null;
  recsError: string | null;
  hasData: boolean;
  triggered: boolean;
  generate: () => void;
}

export function useAIAnalysis(): UseAIAnalysisResult {
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [recsError, setRecsError] = useState<string | null>(null);
  const [hasData, setHasData] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const generate = useCallback(() => {
    if (triggered) return;
    setTriggered(true);

    fetchAnalyses()
      .then((list) => {
        if (list.length === 0) {
          setSummaryError("Nenhuma análise encontrada. Execute o script coletor primeiro.");
          return;
        }
        const id = list[0].id;
        setAnalysisId(id);
        setHasData(true);

        setIsLoadingSummary(true);
        fetchAISummary(id)
          .then((res) => setSummary(res.summary))
          .catch((e: unknown) =>
            setSummaryError(e instanceof Error ? e.message : "Erro ao carregar resumo"),
          )
          .finally(() => setIsLoadingSummary(false));

        setIsLoadingRecs(true);
        fetchAIRecommendations(id)
          .then((res) => setRecommendations(res.recommendations))
          .catch((e: unknown) =>
            setRecsError(e instanceof Error ? e.message : "Erro ao carregar recomendações"),
          )
          .finally(() => setIsLoadingRecs(false));
      })
      .catch((e: unknown) => {
        setSummaryError(e instanceof Error ? e.message : "Erro ao buscar análises");
      });
  }, [triggered]);

  return {
    analysisId,
    summary,
    recommendations,
    isLoadingSummary,
    isLoadingRecs,
    summaryError,
    recsError,
    hasData,
    triggered,
    generate,
  };
}
