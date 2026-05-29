import { Sparkles, Leaf, AlertTriangle, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData } from "@/lib/api/dashboard";

const GRADE_CONFIG: Record<
  string,
  { label: string; tag: string; description: string; isGreen: boolean }
> = {
  AAA: {
    label: "Excepcional",
    tag: "Green Software",
    description:
      "Sua aplicação opera com eficiência energética máxima, praticamente sem impacto ambiental mensurável.",
    isGreen: true,
  },
  AA: {
    label: "Excelente",
    tag: "Green Software",
    description:
      "Sua aplicação opera com altíssima eficiência energética, reduzindo significativamente o impacto ambiental.",
    isGreen: true,
  },
  A: {
    label: "Sustentável",
    tag: "Green Software",
    description:
      "Sua aplicação opera com alta eficiência energética, reduzindo o consumo de CPU e o impacto ambiental.",
    isGreen: true,
  },
  B: {
    label: "Moderado",
    tag: "Em observação",
    description:
      "Seu software tem desempenho aceitável, mas há oportunidades claras de melhoria na eficiência energética.",
    isGreen: false,
  },
  C: {
    label: "Necessita Melhoria",
    tag: "Não Sustentável",
    description:
      "O software apresenta consumo elevado de recursos. Recomendamos uma revisão das rotinas mais custosas.",
    isGreen: false,
  },
  D: {
    label: "Crítico",
    tag: "Não Sustentável",
    description:
      "Consumo de recursos muito acima do esperado. Otimização urgente é necessária para tornar o software viável.",
    isGreen: false,
  },
};

function gradeToEfficiency(grade: string): number {
  const map: Record<string, number> = { AAA: 100, AA: 98, A: 92, B: 75, C: 50, D: 25 };
  return map[grade] ?? 50;
}

interface ScoreCardProps {
  data: DashboardData | null;
  isLoading: boolean;
}

export function ScoreCard({ data, isLoading }: ScoreCardProps) {
  if (isLoading) return <ScoreCardSkeleton />;

  if (!data || data.total === 0) return <ScoreCardEmpty />;

  const lastGrade = data.recent[0]?.grade ?? "B";
  const config = GRADE_CONFIG[lastGrade] ?? GRADE_CONFIG["B"];
  const efficiency = gradeToEfficiency(lastGrade);
  const softwareName = data.recent[0]?.software_name ?? "—";
  const avgSci = data.avg_sci.toLocaleString("pt-BR", { maximumSignificantDigits: 4 });

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-8 md:p-10 border border-border"
      style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-soft)" }}
    >
      <div
        className="absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-20 blur-2xl"
        style={{ background: "var(--gradient-primary)" }}
      />
      <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div
          className="shrink-0 h-32 w-32 rounded-3xl grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)]"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div className="text-center">
            <p className="text-xs font-medium opacity-80 tracking-widest">SCORE</p>
            <p className="font-display text-6xl font-bold leading-none">{lastGrade}</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
              <Sparkles className="h-3 w-3" /> {config.label.toUpperCase()}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
              {config.isGreen ? (
                <Leaf className="h-3 w-3" />
              ) : (
                <AlertTriangle className="h-3 w-3" />
              )}{" "}
              {config.tag}
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            {config.label}: {softwareName}
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
            {config.description}
          </p>

          <div className="mt-6 flex gap-6 text-sm">
            <Stat label="Eficiência" value={`${efficiency}%`} />
            <Stat label="SCI médio" value={`${avgSci} gCO₂`} />
            <Stat label="Análises" value={String(data.total)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ScoreCardEmpty() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-8 md:p-10 border border-dashed border-border"
      style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex flex-col items-center text-center gap-3 py-4">
        <TrendingDown className="h-12 w-12 text-muted-foreground/40" />
        <h2 className="font-display text-xl font-semibold text-muted-foreground">
          Nenhuma análise ainda
        </h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Vá para a aba <strong>Análise</strong>, baixe o script coletor e execute-o no seu
          software para ver os resultados aqui.
        </p>
      </div>
    </div>
  );
}

function ScoreCardSkeleton() {
  return (
    <div
      className="rounded-3xl p-8 md:p-10 border border-border"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex flex-col md:flex-row gap-8">
        <Skeleton className="h-32 w-32 rounded-3xl shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  );
}
