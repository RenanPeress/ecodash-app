import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/lib/auth-token";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ComparisonHeader } from "@/components/comparison/ComparisonHeader";
import { VersionComparisonColumn } from "@/components/comparison/VersionComparisonColumn";
import {
  isBestCarbonCost,
  isBestExecutionTime,
  resolveMoreEfficientVersion,
} from "@/lib/version-comparison-utils";
import { useVersionComparison } from "@/hooks/use-version-comparison";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, GitCompare, Loader2 } from "lucide-react";

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
  const {
    options,
    versionA,
    versionB,
    versionAId,
    versionBId,
    isLoading,
    error,
    setVersionAId,
    setVersionBId,
  } = useVersionComparison();

  const efficiencyWinner =
    versionA && versionB ? resolveMoreEfficientVersion(versionA, versionB) : null;

  return (
    <DashboardLayout>
      <ComparisonHeader />

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar análises</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : options.length < 2 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <GitCompare className="mb-4 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm font-medium">Análises insuficientes para comparação</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Execute o coletor pelo menos 2 vezes para comparar resultados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-8">
          <VersionComparisonColumn
            id="version-a"
            columnLabel="Versão A"
            selectedVersionId={versionAId}
            version={versionA ?? options[0] as never}
            availableVersions={options}
            onVersionChange={setVersionAId}
            isMoreEfficient={efficiencyWinner === "a"}
            carbonIsBest={
              versionA && versionB
                ? isBestCarbonCost(versionA.carbonCostGco2eq, versionB.carbonCostGco2eq)
                : false
            }
            executionIsBest={
              versionA && versionB
                ? isBestExecutionTime(versionA.executionTimeMs, versionB.executionTimeMs)
                : false
            }
          />

          <VersionComparisonColumn
            id="version-b"
            columnLabel="Versão B"
            selectedVersionId={versionBId}
            version={versionB ?? options[1] as never}
            availableVersions={options}
            onVersionChange={setVersionBId}
            isMoreEfficient={efficiencyWinner === "b"}
            carbonIsBest={
              versionA && versionB
                ? isBestCarbonCost(versionB.carbonCostGco2eq, versionA.carbonCostGco2eq)
                : false
            }
            executionIsBest={
              versionA && versionB
                ? isBestExecutionTime(versionB.executionTimeMs, versionA.executionTimeMs)
                : false
            }
          />
        </div>
      )}
    </DashboardLayout>
  );
}
