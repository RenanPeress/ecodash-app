import { Cloud, Timer } from "lucide-react";
import type { VersionComparisonColumnProps } from "@/types/version-comparison";
import {
  formatCarbonCost,
  formatExecutionTime,
} from "@/lib/version-comparison-utils";
import { cn } from "@/lib/utils";
import { VersionSelector } from "./VersionSelector";
import { QuickMetricCard } from "./QuickMetricCard";
import { CpuUsageChart } from "./CpuUsageChart";
import { MemoryAllocationChart } from "./MemoryAllocationChart";

export function VersionComparisonColumn({
  id,
  columnLabel,
  selectedVersionId,
  version,
  availableVersions,
  onVersionChange,
  isMoreEfficient,
  carbonIsBest,
  executionIsBest,
}: VersionComparisonColumnProps) {
  return (
    <section
      id={id}
      aria-label={columnLabel}
      className={cn(
        "flex flex-col gap-5 rounded-2xl p-1 transition-colors",
        isMoreEfficient && "ring-1 ring-emerald-500/20 dark:ring-emerald-400/15",
      )}
    >
      <VersionSelector
        label={columnLabel}
        selectedVersionId={selectedVersionId}
        options={availableVersions}
        onChange={onVersionChange}
        accentEfficient={isMoreEfficient}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <QuickMetricCard
          label="Custo de Carbono"
          value={formatCarbonCost(version.carbonCostGco2eq)}
          icon={Cloud}
          isBest={carbonIsBest}
        />
        <QuickMetricCard
          label="Tempo de Execução"
          value={formatExecutionTime(version.executionTimeMs)}
          icon={Timer}
          isBest={executionIsBest}
        />
      </div>

      <CpuUsageChart data={version.cpuData} accentEfficient={isMoreEfficient} />
      <MemoryAllocationChart
        data={version.memoryData}
        chartId={id}
        accentEfficient={isMoreEfficient}
      />
    </section>
  );
}
