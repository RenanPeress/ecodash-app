import { useCallback, useEffect, useState } from "react";
import { fetchAnalyses, fetchAnaliseDetail, type AnaliseDetail } from "@/lib/api/dashboard";
import type {
  ExportReportPayload,
  MetricsSummaryResponse,
  ProcessingMetric,
  ProcessingStatus,
  SustainabilityClassification,
} from "@/types/sustainability-report";

function gradeToEfficiency(grade: string): { achieved: number; level: "high" | "low" } {
  const map: Record<string, number> = { AAA: 100, AA: 98, A: 92, B: 75, C: 50, D: 25 };
  const achieved = map[grade] ?? 50;
  return { achieved, level: achieved >= 75 ? "high" : "low" };
}

function gradeToSustainability(grade: string): {
  classification: SustainabilityClassification;
  label: string;
  description: string;
} {
  const isGreen = ["AAA", "AA", "A"].includes(grade);
  return {
    classification: (isGreen ? "green-software" : "needs-optimization") as SustainabilityClassification,
    label: isGreen ? "Green Software" : "Necessita Otimização",
    description: isGreen
      ? "Software classificado dentro dos padrões de eficiência ambiental."
      : "O software apresenta oportunidades de melhoria na eficiência energética.",
  };
}

function cpuStatus(avg: number): ProcessingStatus {
  if (avg < 30) return "optimized";
  if (avg < 60) return "alert";
  return "critical";
}
function memStatus(mb: number): ProcessingStatus {
  if (mb < 256) return "optimized";
  if (mb < 1024) return "alert";
  return "critical";
}
function ioStatus(mb: number): ProcessingStatus {
  if (mb < 50) return "optimized";
  if (mb < 200) return "alert";
  return "critical";
}

function mapToReport(detail: AnaliseDetail): {
  summary: MetricsSummaryResponse;
  metrics: ProcessingMetric[];
} {
  const { achieved, level } = gradeToEfficiency(detail.grade);
  const gridIntensity = detail.grid_intensity_gco2_kwh ?? 100;
  const embodied = detail.embodied_carbon_gco2 ?? 0;

  const summary: MetricsSummaryResponse = {
    analysisDate: detail.created_at,
    energyConsumptionKwh: detail.energy_kwh,
    efficiency: { achieved, maximum: 100, level },
    sustainability: gradeToSustainability(detail.grade),
  };

  const m = detail.metrics;
  if (!m) {
    return { summary, metrics: [] };
  }

  const cpuCarbon = detail.energy_kwh * gridIntensity * 0.7 + embodied * 0.5;
  const memCarbon = detail.energy_kwh * gridIntensity * 0.2 + embodied * 0.3;
  const ioCarbon = detail.energy_kwh * gridIntensity * 0.1 + embodied * 0.2;

  const processingMetrics: ProcessingMetric[] = [
    {
      id: "cpu",
      resource: "CPU",
      averageUtilizationPercent: m.cpu_percent_avg,
      peakDemandValue: m.cpu_percent_peak,
      peakDemandUnit: "%",
      carbonFootprintGco2eq: parseFloat(cpuCarbon.toFixed(6)),
      status: cpuStatus(m.cpu_percent_avg),
    },
    {
      id: "memory",
      resource: "Memória",
      averageUtilizationPercent: Math.min((m.memory_used_mb_avg / 8192) * 100, 100),
      peakDemandValue: m.memory_used_mb_peak,
      peakDemandUnit: "MB",
      carbonFootprintGco2eq: parseFloat(memCarbon.toFixed(6)),
      status: memStatus(m.memory_used_mb_avg),
    },
    {
      id: "io",
      resource: "I/O Disco",
      averageUtilizationPercent: Math.min(((m.io_read_mb + m.io_write_mb) / 100) * 100, 100),
      peakDemandValue: parseFloat((m.io_read_mb + m.io_write_mb).toFixed(3)),
      peakDemandUnit: "MB",
      carbonFootprintGco2eq: parseFloat(ioCarbon.toFixed(6)),
      status: ioStatus(m.io_read_mb + m.io_write_mb),
    },
  ];

  return { summary, metrics: processingMetrics };
}

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
      const analyses = await fetchAnalyses();
      if (analyses.length === 0) {
        setSummary(null);
        setProcessingMetrics([]);
        return;
      }
      const detail = await fetchAnaliseDetail(analyses[0].id);
      const { summary: s, metrics: m } = mapToReport(detail);
      setSummary(s);
      setProcessingMetrics(m);
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
      console.info("[exportData] payload:", payload);
      // Endpoint de exportação ainda não implementado no backend
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      console.error("Falha na exportação:", err);
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
