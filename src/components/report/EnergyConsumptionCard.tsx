import { Zap } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface EnergyConsumptionCardProps {
  valueKwh: number;
}

export function EnergyConsumptionCard({ valueKwh }: EnergyConsumptionCardProps) {
  return (
    <Card
      className="rounded-2xl border-border transition hover:-translate-y-0.5"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Zap className="h-5 w-5" />
          </div>
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Consumo de Energia
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {valueKwh.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </span>
          <span className="text-sm font-medium text-muted-foreground">kWh</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Consumo total de energia estimado no período analisado.
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <span className="text-xs text-muted-foreground">Quilowatts-hora (kWh)</span>
      </CardFooter>
    </Card>
  );
}

export function EnergyConsumptionCardSkeleton() {
  return (
    <Card className="rounded-2xl border-border" style={{ boxShadow: "var(--shadow-soft)" }}>
      <CardHeader className="pb-2">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="mt-3 h-4 w-40" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  );
}
