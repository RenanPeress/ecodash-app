import type { SoftwareVersion, SoftwareVersionOption } from "@/types/version-comparison";
import { API_BASE_URL, parseErrorMessage } from "./client";

/** Catálogo simulado — substituir por GET /api/versions quando o back-end estiver disponível */
export const MOCK_SOFTWARE_VERSIONS: SoftwareVersion[] = [
  {
    versionId: "v2.1.0",
    label: "v2.1.0 — Estável (Green)",
    carbonCostGco2eq: 142,
    executionTimeMs: 840,
    cpuData: [
      { core: "Core 1", usagePercent: 18 },
      { core: "Core 2", usagePercent: 22 },
      { core: "Core 3", usagePercent: 14 },
      { core: "Core 4", usagePercent: 11 },
    ],
    memoryData: [
      { time: "0s", memoryMb: 96 },
      { time: "2s", memoryMb: 118 },
      { time: "4s", memoryMb: 128 },
      { time: "6s", memoryMb: 124 },
      { time: "8s", memoryMb: 112 },
      { time: "10s", memoryMb: 105 },
    ],
  },
  {
    versionId: "v2.0.0",
    label: "v2.0.0 — LTS",
    carbonCostGco2eq: 198,
    executionTimeMs: 1120,
    cpuData: [
      { core: "Core 1", usagePercent: 28 },
      { core: "Core 2", usagePercent: 31 },
      { core: "Core 3", usagePercent: 24 },
      { core: "Core 4", usagePercent: 19 },
    ],
    memoryData: [
      { time: "0s", memoryMb: 112 },
      { time: "2s", memoryMb: 148 },
      { time: "4s", memoryMb: 172 },
      { time: "6s", memoryMb: 168 },
      { time: "8s", memoryMb: 154 },
      { time: "10s", memoryMb: 140 },
    ],
  },
  {
    versionId: "v2.2.0-beta",
    label: "v2.2.0-beta — Experimental",
    carbonCostGco2eq: 118,
    executionTimeMs: 720,
    cpuData: [
      { core: "Core 1", usagePercent: 15 },
      { core: "Core 2", usagePercent: 19 },
      { core: "Core 3", usagePercent: 12 },
      { core: "Core 4", usagePercent: 9 },
    ],
    memoryData: [
      { time: "0s", memoryMb: 88 },
      { time: "2s", memoryMb: 102 },
      { time: "4s", memoryMb: 110 },
      { time: "6s", memoryMb: 108 },
      { time: "8s", memoryMb: 98 },
      { time: "10s", memoryMb: 92 },
    ],
  },
  {
    versionId: "v1.9.4",
    label: "v1.9.4 — Legado",
    carbonCostGco2eq: 265,
    executionTimeMs: 1580,
    cpuData: [
      { core: "Core 1", usagePercent: 38 },
      { core: "Core 2", usagePercent: 42 },
      { core: "Core 3", usagePercent: 35 },
      { core: "Core 4", usagePercent: 29 },
    ],
    memoryData: [
      { time: "0s", memoryMb: 140 },
      { time: "2s", memoryMb: 186 },
      { time: "4s", memoryMb: 210 },
      { time: "6s", memoryMb: 204 },
      { time: "8s", memoryMb: 192 },
      { time: "10s", memoryMb: 178 },
    ],
  },
];

export function getVersionOptions(): SoftwareVersionOption[] {
  return MOCK_SOFTWARE_VERSIONS.map(({ versionId, label }) => ({ versionId, label }));
}

export function getVersionById(versionId: string): SoftwareVersion | undefined {
  return MOCK_SOFTWARE_VERSIONS.find((v) => v.versionId === versionId);
}

/** GET /api/versions/:versionId — placeholder para integração futura */
export async function fetchVersionById(versionId: string): Promise<SoftwareVersion> {
  const response = await fetch(`${API_BASE_URL}/api/versions/${versionId}`);
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(parseErrorMessage(text, response.status));
  }
  return response.json() as Promise<SoftwareVersion>;
}
