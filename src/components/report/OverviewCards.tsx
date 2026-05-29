import type { MetricsSummaryResponse } from "@/types/sustainability-report";
import { EnergyConsumptionCard, EnergyConsumptionCardSkeleton } from "./EnergyConsumptionCard";
import { EfficiencyIndexCard, EfficiencyIndexCardSkeleton } from "./EfficiencyIndexCard";
import {
  SustainabilityStatusCard,
  SustainabilityStatusCardSkeleton,
} from "./SustainabilityStatusCard";

interface OverviewCardsProps {
  summary: MetricsSummaryResponse;
}

export function OverviewCards({ summary }: OverviewCardsProps) {
  return (
    <section
      aria-label="Visão geral de sustentabilidade"
      className="grid grid-cols-1 gap-5 md:grid-cols-3"
    >
      <EnergyConsumptionCard valueKwh={summary.energyConsumptionKwh} />
      <EfficiencyIndexCard
        achieved={summary.efficiency.achieved}
        maximum={summary.efficiency.maximum}
        level={summary.efficiency.level}
      />
      <SustainabilityStatusCard
        classification={summary.sustainability.classification}
        label={summary.sustainability.label}
        description={summary.sustainability.description}
      />
    </section>
  );
}

export function OverviewCardsSkeleton() {
  return (
    <section
      aria-label="Carregando visão geral"
      className="grid grid-cols-1 gap-5 md:grid-cols-3"
    >
      <EnergyConsumptionCardSkeleton />
      <EfficiencyIndexCardSkeleton />
      <SustainabilityStatusCardSkeleton />
    </section>
  );
}
