import { Sparkles, TrendingDown, AlertTriangle, Lightbulb, Bot, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Recommendation, ImpactLevel } from "@/types/ai";
import { useAIAnalysis } from "@/hooks/use-ai-analysis";
import { cn } from "@/lib/utils";

// ── Recommendation card ───────────────────────────────────────────────────────

const impactConfig: Record<ImpactLevel, { label: string; className: string }> = {
  alto: {
    label: "Alto impacto",
    className:
      "border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/40 dark:bg-destructive/20",
  },
  medio: {
    label: "Médio impacto",
    className:
      "border-[oklch(0.78_0.16_75/0.4)] bg-[oklch(0.97_0.04_85)] text-[oklch(0.45_0.14_75)] dark:bg-[oklch(0.30_0.08_75)] dark:text-[oklch(0.82_0.12_85)]",
  },
  baixo: {
    label: "Baixo impacto",
    className: "border-primary/30 bg-primary/10 text-primary",
  },
};

function ImpactIcon({ impact }: { impact: ImpactLevel }) {
  if (impact === "alto") return <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />;
  if (impact === "medio") return <TrendingDown className="h-4 w-4 shrink-0 mt-0.5" />;
  return <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />;
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const cfg = impactConfig[rec.impact];
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border p-4 transition hover:-translate-y-0.5",
        cfg.className,
      )}
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <ImpactIcon impact={rec.impact} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="text-sm font-semibold leading-snug">{rec.title}</p>
          <Badge variant="outline" className={cn("text-xs font-medium border", cfg.className)}>
            {cfg.label}
          </Badge>
        </div>
        <p className="text-sm leading-relaxed opacity-85">{rec.description}</p>
      </div>
    </div>
  );
}

function RecommendationSkeleton() {
  return (
    <div className="rounded-xl border border-border p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-5 w-24 rounded-full ml-auto" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

// ── Idle state (before trigger) ────────────────────────────────────────────────

function IdlePrompt({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div
        className="h-14 w-14 rounded-2xl grid place-items-center"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Sparkles className="h-7 w-7 text-primary-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">
          Análise inteligente com IA
        </p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Clique para gerar um resumo e recomendações personalizadas para reduzir o SCI da sua análise.
        </p>
      </div>
      <Button
        onClick={onGenerate}
        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500"
      >
        <Sparkles className="h-4 w-4" />
        Gerar Insights com IA
      </Button>
    </div>
  );
}

// ── Main panel ─────────────────────────────────────────────────────────────────

export function AIInsightsPanel() {
  const {
    summary,
    recommendations,
    isLoadingSummary,
    isLoadingRecs,
    summaryError,
    recsError,
    triggered,
    generate,
  } = useAIAnalysis();

  const isAnyLoading = isLoadingSummary || isLoadingRecs;

  return (
    <section
      aria-label="Insights gerados por IA"
      className="overflow-hidden rounded-2xl border border-border bg-card"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">Insights por IA</h2>
          <p className="text-xs text-muted-foreground">
            Análise e recomendações geradas pelo EcoDash Assistant
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {isAnyLoading && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Processando com Claude Opus...
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            Claude Opus
          </span>
        </div>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* Idle — show trigger button */}
        {!triggered && <IdlePrompt onGenerate={generate} />}

        {/* Summary */}
        {triggered && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Resumo da Análise
            </h3>
            {isLoadingSummary ? (
              <div className="space-y-2 py-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : summaryError ? (
              <Alert variant="destructive" className="py-3">
                <AlertDescription className="text-xs">{summaryError}</AlertDescription>
              </Alert>
            ) : summary ? (
              <p className="text-sm leading-relaxed text-muted-foreground bg-primary/5 border border-primary/15 rounded-xl px-4 py-3">
                {summary}
              </p>
            ) : null}
          </div>
        )}

        {/* Recommendations */}
        {triggered && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Recomendações para Reduzir o SCI
            </h3>
            {isLoadingRecs ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <RecommendationSkeleton key={i} />
                ))}
              </div>
            ) : recsError ? (
              <Alert variant="destructive" className="py-3">
                <AlertDescription className="text-xs">{recsError}</AlertDescription>
              </Alert>
            ) : recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((rec, i) => (
                  <RecommendationCard key={i} rec={rec} />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
