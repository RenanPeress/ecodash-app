export type EfficiencyLevel = "high" | "low";

export type SustainabilityClassification = "green-software" | "needs-optimization";

export type ProcessingStatus = "optimized" | "alert" | "critical";

/** Resposta esperada de GET /api/metrics/summary */
export interface MetricsSummaryResponse {
  analysisDate: string;
  energyConsumptionKwh: number;
  efficiency: {
    achieved: number;
    maximum: number;
    level: EfficiencyLevel;
  };
  sustainability: {
    classification: SustainabilityClassification;
    label: string;
    description: string;
  };
}

/** Item do array retornado por GET /api/metrics/processing */
export interface ProcessingMetric {
  id: string;
  resource: string;
  averageUtilizationPercent: number;
  peakDemandValue: number;
  peakDemandUnit: string;
  carbonFootprintGco2eq: number;
  status: ProcessingStatus;
}

/** Payload consolidado usado pela tela */
export interface SustainabilityReportData {
  summary: MetricsSummaryResponse;
  processingMetrics: ProcessingMetric[];
}

/** Resposta esperada de POST /api/reports/export */
export interface ExportReportPayload {
  format: "xlsx" | "csv";
  analysisDate: string;
  summary: MetricsSummaryResponse;
  processingMetrics: ProcessingMetric[];
}

export interface ExportReportResponse {
  downloadUrl: string;
  fileName: string;
}
