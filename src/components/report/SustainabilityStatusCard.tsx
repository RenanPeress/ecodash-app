import { AlertTriangle, Leaf, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SustainabilityClassification } from "@/types/sustainability-report";
import { cn } from "@/lib/utils";

interface SustainabilityStatusCardProps {
  classification: SustainabilityClassification;
  label: string;
  description: string;
}

const classificationConfig: Record<
  SustainabilityClassification,
  {
    icon: typeof Leaf;
    badgeLabel: string;
    badgeClassName: string;
    highlightClassName: string;
  }
> = {
  "green-software": {
    icon: ShieldCheck,
    badgeLabel: "Certificado Green Software",
    badgeClassName: "bg-primary/10 text-primary border-primary/30",
    highlightClassName: "border-primary/30 bg-primary/5",
  },
  "needs-optimization": {
    icon: AlertTriangle,
    badgeLabel: "Requer Otimizações",
    badgeClassName: "bg-destructive/10 text-destructive border-destructive/20",
    highlightClassName: "border-destructive/20 bg-destructive/5",
  },
};

export function SustainabilityStatusCard({
  classification,
  label,
  description,
}: SustainabilityStatusCardProps) {
  const config = classificationConfig[classification];
  const Icon = config.icon;
  const isGreen = classification === "green-software";

  return (
    <Card
      className={cn(
        "rounded-2xl border transition hover:-translate-y-0.5",
        config.highlightClassName,
      )}
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl",
              isGreen ? "bg-primary/15 text-primary" : "bg-destructive/10 text-destructive",
            )}
          >
            <Leaf className="h-5 w-5" />
          </div>
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Status de Sustentabilidade
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Icon
            className={cn("h-8 w-8", isGreen ? "text-primary" : "text-destructive")}
          />
          <span
            className={cn(
              "font-display text-2xl font-semibold tracking-tight",
              isGreen ? "text-primary" : "text-destructive",
            )}
          >
            {label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
            config.badgeClassName,
          )}
        >
          {isGreen && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />}
          {config.badgeLabel}
        </span>
      </CardFooter>
    </Card>
  );
}

export function SustainabilityStatusCardSkeleton() {
  return (
    <Card className="rounded-2xl border-border" style={{ boxShadow: "var(--shadow-soft)" }}>
      <CardHeader className="pb-2">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="mt-3 h-4 w-44" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-3 w-full" />
      </CardContent>
      <CardFooter className="pt-0">
        <Skeleton className="h-6 w-36 rounded-full" />
      </CardFooter>
    </Card>
  );
}
