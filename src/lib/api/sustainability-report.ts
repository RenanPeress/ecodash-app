import type {
  ExportReportPayload,
  ExportReportResponse,
  MetricsSummaryResponse,
  ProcessingMetric,
  ProcessingStatus,
} from "@/types/sustainability-report";
import { API_BASE_URL, parseErrorMessage } from "./client";
import { getAuthToken } from "@/lib/auth-token";
import type { AnaliseDetail } from "./dashboard";

const API_BASE = `${API_BASE_URL}/api`;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(parseErrorMessage(text, response.status));
  }
  return response.json() as Promise<T>;
}

/** GET /api/metrics/summary */
export async function fetchMetricsSummary(): Promise<MetricsSummaryResponse> {
  const response = await fetch(`${API_BASE}/metrics/summary`);
  return handleResponse<MetricsSummaryResponse>(response);
}

/** GET /api/metrics/processing */
export async function fetchProcessingMetrics(): Promise<ProcessingMetric[]> {
  const response = await fetch(`${API_BASE}/metrics/processing`);
  return handleResponse<ProcessingMetric[]>(response);
}

/** POST /api/reports/export */
export async function exportReportData(
  payload: ExportReportPayload,
): Promise<ExportReportResponse> {
  const response = await fetch(`${API_BASE}/reports/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<ExportReportResponse>(response);
}

/** GET /api/analyses/<pk>/export/pdf/ */
export async function exportAnalysisPDF(pk: number): Promise<Blob> {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE}/analyses/${pk}/export/pdf/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(parseErrorMessage(text, response.status));
  }
  return response.blob();
}

// ── Mappers: AnaliseDetail → tipos da tela de Relatório ──────────────────────

const GRADE_EFFICIENCY: Record<string, number> = {
  AAA: 97, AA: 90, A: 75, B: 55, C: 30, D: 10,
};

export function mapAnaliseToSummary(a: AnaliseDetail): MetricsSummaryResponse {
  const efficiency = GRADE_EFFICIENCY[a.grade] ?? 50;
  const isGreen = ["AAA", "AA", "A"].includes(a.grade);
  return {
    analysisDate: a.created_at,
    energyConsumptionKwh: a.energy_kwh,
    efficiency: {
      achieved: efficiency,
      maximum: 100,
      level: isGreen ? "high" : "low",
    },
    sustainability: {
      classification: isGreen ? "green-software" : "needs-optimization",
      label: isGreen ? "Green Software" : "Requer Otimização",
      description: isGreen
        ? "Software classificado dentro dos padrões de eficiência ambiental."
        : "Software com impacto ambiental acima do recomendado.",
    },
  };
}

function cpuStatus(avg: number): ProcessingStatus {
  if (avg < 30) return "optimized";
  if (avg < 70) return "alert";
  return "critical";
}

export function mapAnaliseToProcessingMetrics(a: AnaliseDetail): ProcessingMetric[] {
  const m = a.metrics;
  if (!m) return [];

  const sciTotal = a.sci_score;
  const cpuWeight = m.cpu_percent_avg;
  const memWeight = m.memory_used_mb_avg / 10;
  const ioWeight = (m.io_read_mb + m.io_write_mb) * 5;
  const totalWeight = cpuWeight + memWeight + ioWeight || 1;

  const cpuGco2 = Math.round((sciTotal * cpuWeight) / totalWeight * 1000);
  const memGco2 = Math.round((sciTotal * memWeight) / totalWeight * 1000);
  const ioGco2 = Math.round((sciTotal * ioWeight) / totalWeight * 1000);

  const metrics: ProcessingMetric[] = [
    {
      id: "cpu",
      resource: "CPU",
      averageUtilizationPercent: m.cpu_percent_avg,
      peakDemandValue: m.cpu_percent_peak,
      peakDemandUnit: "%",
      carbonFootprintGco2eq: cpuGco2,
      status: cpuStatus(m.cpu_percent_avg),
    },
    {
      id: "memory",
      resource: "Memória",
      averageUtilizationPercent: Math.min(m.memory_used_mb_avg, 100),
      peakDemandValue: m.memory_used_mb_peak,
      peakDemandUnit: "MB",
      carbonFootprintGco2eq: memGco2,
      status: cpuStatus(m.memory_used_mb_avg / (m.memory_used_mb_peak || 1) * 100),
    },
  ];

  if (m.io_read_mb + m.io_write_mb > 0) {
    metrics.push({
      id: "io",
      resource: "I/O de Disco",
      averageUtilizationPercent: Math.min((m.io_read_mb + m.io_write_mb) * 2, 100),
      peakDemandValue: Math.round((m.io_read_mb + m.io_write_mb) * 100) / 100,
      peakDemandUnit: "MB",
      carbonFootprintGco2eq: ioGco2,
      status: ioGco2 > 50 ? "alert" : "optimized",
    });
  }

  return metrics;
}

// ── Mock data (mantido apenas como fallback de desenvolvimento) ───────────────

/** Dados simulados — mantidos apenas para referência */
export const MOCK_SUMMARY: MetricsSummaryResponse = {
  analysisDate: "2026-05-29T14:32:00.000Z",
  energyConsumptionKwh: 142.8,
  efficiency: {
    achieved: 94,
    maximum: 100,
    level: "high",
  },
  sustainability: {
    classification: "green-software",
    label: "Green Software",
    description: "Software classificado dentro dos padrões de eficiência ambiental.",
  },
};

export const MOCK_PROCESSING_METRICS: ProcessingMetric[] = [
  {
    id: "cpu",
    resource: "CPU",
    averageUtilizationPercent: 14.2,
    peakDemandValue: 38.7,
    peakDemandUnit: "%",
    carbonFootprintGco2eq: 180,
    status: "optimized",
  },
  {
    id: "memory",
    resource: "Memória",
    averageUtilizationPercent: 62.5,
    peakDemandValue: 246,
    peakDemandUnit: "MB",
    carbonFootprintGco2eq: 92,
    status: "alert",
  },
  {
    id: "disk",
    resource: "Disco",
    averageUtilizationPercent: 28.4,
    peakDemandValue: 5.1,
    peakDemandUnit: "GB/h",
    carbonFootprintGco2eq: 120,
    status: "optimized",
  },
  {
    id: "network",
    resource: "Rede",
    averageUtilizationPercent: 81.3,
    peakDemandValue: 124,
    peakDemandUnit: "Mbps",
    carbonFootprintGco2eq: 210,
    status: "critical",
  },
];

export async function fetchMetricsSummaryMock(): Promise<MetricsSummaryResponse> {
  await delay(900);
  return MOCK_SUMMARY;
}

export async function fetchProcessingMetricsMock(): Promise<ProcessingMetric[]> {
  await delay(1200);
  return MOCK_PROCESSING_METRICS;
}

export async function exportReportDataMock(
  payload: ExportReportPayload,
): Promise<ExportReportResponse> {
  await delay(600);
  console.info("[exportReportDataMock] POST /api/reports/export", payload);
  return {
    downloadUrl: "/downloads/relatorio-sustentabilidade.xlsx",
    fileName: "relatorio-sustentabilidade.xlsx",
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
