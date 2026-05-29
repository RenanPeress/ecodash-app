import type { SoftwareVersion } from "@/types/version-comparison";

export function formatExecutionTime(ms: number): string {
  if (ms < 1000) {
    return `${ms.toLocaleString("pt-BR")} ms`;
  }
  return `${(ms / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} s`;
}

export function formatCarbonCost(gco2eq: number): string {
  return `${gco2eq.toLocaleString("pt-BR")} gCO₂eq`;
}

/** Versão mais eficiente = menor custo de carbono; empate resolvido pelo menor tempo de execução */
export function resolveMoreEfficientVersion(
  versionA: SoftwareVersion,
  versionB: SoftwareVersion,
): "a" | "b" | "tie" {
  if (versionA.carbonCostGco2eq !== versionB.carbonCostGco2eq) {
    return versionA.carbonCostGco2eq < versionB.carbonCostGco2eq ? "a" : "b";
  }
  if (versionA.executionTimeMs !== versionB.executionTimeMs) {
    return versionA.executionTimeMs < versionB.executionTimeMs ? "a" : "b";
  }
  return "tie";
}

export function isBestCarbonCost(value: number, other: number): boolean {
  return value < other;
}

export function isBestExecutionTime(value: number, other: number): boolean {
  return value < other;
}
