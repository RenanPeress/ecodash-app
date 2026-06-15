import type {
  ExportReportPayload,
  ExportReportResponse,
  MetricsSummaryResponse,
  ProcessingMetric,
} from "@/types/sustainability-report";
import { API_BASE_URL, parseErrorMessage } from "./client";

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

/** Dados simulados — substituir pelas funções acima quando o back-end estiver disponível */
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
