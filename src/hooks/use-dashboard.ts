import { useCallback, useEffect, useState } from "react";
import {
  fetchAnaliseDetail,
  fetchAnalyses,
  fetchDashboard,
  type AnaliseDetail,
  type AnaliseItem,
  type DashboardData,
} from "@/lib/api/dashboard";

interface UseDashboardResult {
  summary: DashboardData | null;
  analyses: AnaliseItem[];
  /** Análise mais recente do usuário (ou null se não houver nenhuma). */
  lastAnalysis: AnaliseItem | null;
  /** Detalhe da última análise, com métricas de CPU/memória/tempo quando disponíveis. */
  lastDetail: AnaliseDetail | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboard(): UseDashboardResult {
  const [summary, setSummary] = useState<DashboardData | null>(null);
  const [analyses, setAnalyses] = useState<AnaliseItem[]>([]);
  const [lastDetail, setLastDetail] = useState<AnaliseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [summaryData, analysesData] = await Promise.all([fetchDashboard(), fetchAnalyses()]);
      setSummary(summaryData);
      setAnalyses(analysesData);

      const last = analysesData[0] ?? null;
      if (last) {
        // Métricas detalhadas (CPU/memória/tempo) só existem no detalhe da análise.
        const detail = await fetchAnaliseDetail(last.id).catch(() => null);
        setLastDetail(detail);
      } else {
        setLastDetail(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar o dashboard.");
      setSummary(null);
      setAnalyses([]);
      setLastDetail(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return {
    summary,
    analyses,
    lastAnalysis: analyses[0] ?? null,
    lastDetail,
    isLoading,
    error,
    refetch: loadData,
  };
}
