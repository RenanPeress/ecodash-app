import { useMemo, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/auth-token";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
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
  beforeLoad: () => {
    if (!isAuthenticated()) throw redirect({ to: "/auth" });
  },
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

  const versionA = getVersionById(versionAId)!;
  const versionB = getVersionById(versionBId)!;

  const efficiencyWinner = resolveMoreEfficientVersion(versionA, versionB);

  return (
    <DashboardLayout>
      <ComparisonHeader />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-8">
            <VersionComparisonColumn
              id="version-a"
              columnLabel="Versão A"
              selectedVersionId={versionAId}
              version={versionA}
              availableVersions={versionOptions}
              onVersionChange={setVersionAId}
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
              onVersionChange={setVersionBId}
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
    </DashboardLayout>
  );
}
