import { Gauge } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { EfficiencyLevel } from "@/types/sustainability-report";
import { cn } from "@/lib/utils";

interface EfficiencyIndexCardProps {
  achieved: number;
  maximum: number;
  level: EfficiencyLevel;
}

const levelConfig: Record<
  EfficiencyLevel,
  { label: string; className: string }
> = {
  high: {
    label: "Eficiência Alta",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  low: {
    label: "Eficiência Baixa",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function EfficiencyIndexCard({ achieved, maximum, level }: EfficiencyIndexCardProps) {
  const percentage = maximum > 0 ? Math.min((achieved / maximum) * 100, 100) : 0;
  const badge = levelConfig[level];

  return (
    <Card
      className="rounded-2xl border-border transition hover:-translate-y-0.5"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Gauge className="h-5 w-5" />
          </div>
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Índice de Eficiência
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight">
            {achieved}
            <span className="text-base font-normal text-muted-foreground"> / {maximum}</span>
          </span>
          <span className="text-sm font-medium text-primary">{percentage.toFixed(0)}%</span>
        </div>
        <Progress value={percentage} className="h-2.5" />
        <p className="text-xs text-muted-foreground">
          Total atingido em relação ao máximo possível de eficiência operacional.
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
            badge.className,
          )}
        >
          {badge.label}
        </span>
      </CardFooter>
    </Card>
  );
}

export function EfficiencyIndexCardSkeleton() {
  return (
    <Card className="rounded-2xl border-border" style={{ boxShadow: "var(--shadow-soft)" }}>
      <CardHeader className="pb-2">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="mt-3 h-4 w-40" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-2.5 w-full rounded-full" />
        <Skeleton className="h-3 w-full" />
      </CardContent>
      <CardFooter className="pt-0">
        <Skeleton className="h-6 w-28 rounded-full" />
      </CardFooter>
    </Card>
  );
}
