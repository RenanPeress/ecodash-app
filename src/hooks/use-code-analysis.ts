import { useCallback, useState } from "react";
import { getAuthToken } from "@/lib/auth-token";
import type { StartAnalysisResponse } from "@/types/code-analysis";

interface UseCodeAnalysisResult {
  isAnalyzing: boolean;
  error: string | null;
  lastResult: StartAnalysisResponse | null;
  startAnalysis: () => Promise<void>;
  resetError: () => void;
  downloadScript: () => void;
}

export function useCodeAnalysis(): UseCodeAnalysisResult {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<StartAnalysisResponse | null>(null);

  const downloadScript = useCallback(() => {
    const token = getAuthToken();
    if (!token) {
      setError("Você precisa estar autenticado para baixar o script.");
      return;
    }
    const link = document.createElement("a");
    link.href = "/api/collector/download/";
    link.setAttribute("download", "ecodash-collector.py");
    // A requisição precisa do Bearer token — abre em nova aba para que o Django sirva o arquivo
    // O download via fetch+blob garante que o header seja enviado
    void fetch("/api/collector/download/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Falha ao baixar o script");
        return r.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Erro ao baixar o script");
      });
  }, []);

  const startAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Envia uma análise de demonstração para mostrar o fluxo completo
      const token = getAuthToken();
      const res = await fetch("/api/analyses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          software_name: "demo-app (teste via UI)",
          sci_score: 0.42,
          grade: "A",
          energy_kwh: 0.00000583,
          region: "BR",
          hardware_type: "laptop",
          metrics: {
            duration_seconds: 1.24,
            cpu_percent_avg: 14.2,
            cpu_percent_peak: 38.7,
            memory_used_mb_avg: 128.0,
            memory_used_mb_peak: 246.0,
            io_read_mb: 0.5,
            io_write_mb: 0.1,
            threads_count: 4,
            process_name: "demo-app",
            pid: 0,
          },
          grid_intensity_gco2_kwh: 100.0,
          embodied_carbon_gco2: 0.0000012,
          functional_unit: 1.0,
          label: "A - Green Software",
          timestamp: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = (await res.json()) as { id: number; grade: string; sci_score: number };
      setLastResult({
        analysisId: String(data.id),
        status: "completed",
        message: `Grade ${data.grade} | SCI ${data.sci_score.toFixed(6)} gCO₂eq`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao iniciar a análise.");
      setLastResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const resetError = useCallback(() => setError(null), []);

  return { isAnalyzing, error, lastResult, startAnalysis, resetError, downloadScript };
}
