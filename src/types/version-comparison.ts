/** Ponto de dados para o gráfico de barras de CPU (por núcleo ou pico) */
export interface CpuDataPoint {
  core: string;
  usagePercent: number;
}

/** Ponto de dados para o gráfico de memória ao longo do tempo */
export interface MemoryDataPoint {
  time: string;
  memoryMb: number;
}

/** Representa uma versão de software analisada — resposta esperada de GET /api/versions/:id */
export interface SoftwareVersion {
  versionId: string;
  label: string;
  carbonCostGco2eq: number;
  executionTimeMs: number;
  cpuData: CpuDataPoint[];
  memoryData: MemoryDataPoint[];
}

/** Opção resumida para popular os selects — resposta esperada de GET /api/versions */
export interface SoftwareVersionOption {
  versionId: string;
  label: string;
}

export type ComparisonColumnId = "version-a" | "version-b";

export interface VersionComparisonColumnProps {
  id: ComparisonColumnId;
  columnLabel: string;
  selectedVersionId: string;
  version: SoftwareVersion;
  availableVersions: SoftwareVersionOption[];
  onVersionChange: (versionId: string) => void;
  isMoreEfficient: boolean;
  carbonIsBest: boolean;
  executionIsBest: boolean;
}
