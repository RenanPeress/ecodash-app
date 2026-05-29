import { useCallback, useEffect, useState } from "react";
import {
  exportReportDataMock,
  fetchMetricsSummaryMock,
  fetchProcessingMetricsMock,
} from "@/lib/api/sustainability-report";
import type {
  ExportReportPayload,
  MetricsSummaryResponse,
  ProcessingMetric,
} from "@/types/sustainability-report";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [summaryData, processingData] = await Promise.all([
        fetchMetricsSummaryMock(),
        fetchProcessingMetricsMock(),
      ]);
      setSummary(summaryData);
      setProcessingMetrics(processingData);
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
    if (!summary) return;

    setIsExporting(true);
    try {
      const payload: ExportReportPayload = {
        format: "xlsx",
        analysisDate: summary.analysisDate,
        summary,
        processingMetrics,
      };
      const result = await exportReportDataMock(payload);
      console.info("[useSustainabilityReport] Exportação concluída:", result);
    } catch (err) {
      console.error("[useSustainabilityReport] Falha na exportação:", err);
    } finally {
      setIsExporting(false);
    }
  }, [summary, processingMetrics]);

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
