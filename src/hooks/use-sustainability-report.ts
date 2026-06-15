import { useCallback, useEffect, useState } from "react";
import {
  exportAnalysisPDF,
  fetchMetricsSummaryMock,
  fetchProcessingMetricsMock,
} from "@/lib/api/sustainability-report";
import { fetchAnalyses } from "@/lib/api/dashboard";
import type { MetricsSummaryResponse, ProcessingMetric } from "@/types/sustainability-report";

interface UseSustainabilityReportResult {
  summary: MetricsSummaryResponse | null;
  processingMetrics: ProcessingMetric[];
  isLoading: boolean;
  isExporting: boolean;
  error: string | null;
  exportData: () => Promise<void>;
  refetch: () => void;
}

export function useSustainabilityReport(): UseSustainabilityReportResult {
  const [summary, setSummary] = useState<MetricsSummaryResponse | null>(null);
  const [processingMetrics, setProcessingMetrics] = useState<ProcessingMetric[]>([]);
  const [latestAnalysisId, setLatestAnalysisId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [summaryData, processingData, analyses] = await Promise.all([
        fetchMetricsSummaryMock(),
        fetchProcessingMetricsMock(),
        fetchAnalyses(),
      ]);
      setSummary(summaryData);
      setProcessingMetrics(processingData);
      setLatestAnalysisId(analyses[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar o relatório.");
      setSummary(null);
      setProcessingMetrics([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const exportData = useCallback(async () => {
    if (!latestAnalysisId) return;

    setIsExporting(true);
    try {
      const blob = await exportAnalysisPDF(latestAnalysisId);
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `ecodash-relatorio-${latestAnalysisId}.pdf`;
      a.click();
      URL.revokeObjectURL(href);
    } catch (err) {
      console.error("[useSustainabilityReport] Falha na exportação:", err);
    } finally {
      setIsExporting(false);
    }
  }, [latestAnalysisId]);

  return {
    summary,
    processingMetrics,
    isLoading,
    isExporting,
    error,
    exportData,
    refetch: loadData,
  };
}
