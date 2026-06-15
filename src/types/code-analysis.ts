/** Payload enviado para POST /api/analysis/start */
export interface StartAnalysisPayload {
  source?: "web-ui";
}

/** Resposta esperada de POST /api/analysis/start */
export interface StartAnalysisResponse {
  analysisId: string;
  status: "queued" | "running" | "completed";
  message?: string;
}

export interface InstallationStep {
  step: number;
  title: string;
  description: string;
  command: string;
  downloadUrl?: string;
  downloadFilename?: string;
}

export interface PrerequisiteBlock {
  description: string;
  command: string;
}

export interface AnalysisInstructionsContent {
  documentationUrl: string;
  prerequisites: PrerequisiteBlock[];
  installationSteps: InstallationStep[];
}
