import { useCallback, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ComparisonHeader } from "@/components/comparison/ComparisonHeader";
import { VersionComparisonColumn } from "@/components/comparison/VersionComparisonColumn";
import {
  getVersionById,
  getVersionOptions,
  MOCK_SOFTWARE_VERSIONS,
} from "@/lib/api/version-comparison";
import {
  isBestCarbonCost,
  isBestExecutionTime,
  resolveMoreEfficientVersion,
} from "@/lib/version-comparison-utils";

export const Route = createFileRoute("/comparacao")({
  component: ComparisonPage,
  head: () => ({
    meta: [
      { title: "Comparação de Versões — EcoDash" },
      {
        name: "description",
        content:
          "Compare benchmarks de eficiência energética e performance entre diferentes versões de software.",
      },
      { property: "og:title", content: "Comparação de Versões — EcoDash" },
      {
        property: "og:description",
        content: "Compare consumo de carbono, CPU, memória e tempo de execução lado a lado.",
      },
    ],
  }),
});

function ComparisonPage() {
  const versionOptions = useMemo(() => getVersionOptions(), []);

  const [versionAId, setVersionAId] = useState(MOCK_SOFTWARE_VERSIONS[0].versionId);
  const [versionBId, setVersionBId] = useState(MOCK_SOFTWARE_VERSIONS[1].versionId);

  const handleVersionAChange = useCallback((id: string) => setVersionAId(id), []);
  const handleVersionBChange = useCallback((id: string) => setVersionBId(id), []);

  const versionA = getVersionById(versionAId)!;
  const versionB = getVersionById(versionBId)!;

  const efficiencyWinner = resolveMoreEfficientVersion(versionA, versionB);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Sidebar />
      <div className="md:ml-64">
        <Topbar />
        <main className="p-6 lg:p-8">
          <ComparisonHeader />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8">
            <VersionComparisonColumn
              id="version-a"
              columnLabel="Versão A"
              selectedVersionId={versionAId}
              version={versionA}
              availableVersions={versionOptions}
              onVersionChange={handleVersionAChange}
              isMoreEfficient={efficiencyWinner === "a"}
              carbonIsBest={isBestCarbonCost(
                versionA.carbonCostGco2eq,
                versionB.carbonCostGco2eq,
              )}
              executionIsBest={isBestExecutionTime(
                versionA.executionTimeMs,
                versionB.executionTimeMs,
              )}
            />

            <VersionComparisonColumn
              id="version-b"
              columnLabel="Versão B"
              selectedVersionId={versionBId}
              version={versionB}
              availableVersions={versionOptions}
              onVersionChange={handleVersionBChange}
              isMoreEfficient={efficiencyWinner === "b"}
              carbonIsBest={isBestCarbonCost(
                versionB.carbonCostGco2eq,
                versionA.carbonCostGco2eq,
              )}
              executionIsBest={isBestExecutionTime(
                versionB.executionTimeMs,
                versionA.executionTimeMs,
              )}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
