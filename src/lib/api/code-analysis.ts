import type {
  AnalysisInstructionsContent,
  StartAnalysisPayload,
  StartAnalysisResponse,
} from "@/types/code-analysis";
import { API_BASE_URL, parseErrorMessage } from "./client";

const API_BASE = `${API_BASE_URL}/api`;

/** POST /api/analysis/start — inicia a análise de código no back-end */
export async function startCodeAnalysis(
  payload: StartAnalysisPayload = {},
): Promise<StartAnalysisResponse> {
  const response = await fetch(`${API_BASE}/analysis/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(parseErrorMessage(text, response.status));
  }

  return response.json() as Promise<StartAnalysisResponse>;
}

/** Simulação local — substituir por startCodeAnalysis quando o back-end estiver disponível */
export async function startCodeAnalysisMock(
  payload: StartAnalysisPayload = {},
): Promise<StartAnalysisResponse> {
  await delay(1800);
  console.info("[startCodeAnalysisMock] POST /api/analysis/start", payload);
  return {
    analysisId: `analysis-${Date.now()}`,
    status: "queued",
    message: "Análise enfileirada com sucesso.",
  };
}

export const ANALYSIS_INSTRUCTIONS: AnalysisInstructionsContent = {
  documentationUrl: "/INSTALACAO_SCI_Client.pdf",
  prerequisites: [
    {
      description: "Verifique se o Python 3 está instalado:",
      command: "python3 --version",
    },
    {
      description: "Caso não esteja instalado, execute:",
      command: "sudo apt update && sudo apt install python3 python3-venv -y",
    },
  ],
  installationSteps: [
    {
      step: 1,
      title: "Baixar o script",
      description: "Baixe o script e mova para a pasta home:",
      command: "mv ~/Downloads/ecodash-collector.py ~/",
      downloadUrl: `${API_BASE_URL}/api/collector/download/`,
      downloadFilename: "ecodash-collector.py",
    },
    {
      step: 2,
      title: "Criar o ambiente virtual",
      description: "Isole as dependências sem afetar o Python do sistema:",
      command: "python3 -m venv ~/.sci-env",
    },
    {
      step: 3,
      title: "Instalar a dependência",
      description: "Instala o psutil dentro do ambiente virtual:",
      command: "~/.sci-env/bin/pip install psutil",
    },
    {
      step: 4,
      title: "Criar atalho permanente (opcional)",
      description: "Para não precisar digitar o caminho completo toda vez:",
      command:
        "echo \"alias sci='~/.sci-env/bin/python3 ~/user_sci_client.py'\" >> ~/.bashrc && source ~/.bashrc",
    },
    {
      step: 5,
      title: "Usar o SCI Client",
      description: "Execute passando o comando do seu software:",
      command: "sci python3 seu_script.py",
    },
  ],
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
