import { Sparkles, Leaf } from "lucide-react";
import type { AnaliseItem, DashboardData } from "@/lib/api/dashboard";

interface ScoreCardProps {
  lastAnalysis: AnaliseItem | null;
  summary: DashboardData | null;
}

/** Conteúdo textual derivado da nota (grade) da última análise. */
function gradeContent(grade: string | undefined): { title: string; description: string; tag: string } {
  switch (grade) {
    case "AAA":
    case "AA":
    case "A":
      return {
        tag: "OTIMIZADO",
        title: "Seu software é Sustentável",
        description:
          "Sua aplicação opera com alta eficiência energética, reduzindo o consumo de CPU e o impacto ambiental. Continue monitorando para manter as métricas dentro dos limites recomendados.",
      };
    case "B":
      return {
        tag: "ATENÇÃO",
        title: "Bom, com espaço para melhorar",
        description:
          "Sua aplicação tem desempenho razoável, mas ainda há oportunidades de otimização para reduzir o consumo de energia e o impacto ambiental.",
      };
    case "C":
    case "D":
      return {
        tag: "CRÍTICO",
        title: "Alto consumo detectado",
        description:
          "Sua aplicação está consumindo mais recursos do que o recomendado. Reveja os pontos de maior uso de CPU e memória para reduzir o impacto ambiental.",
      };
    default:
      return {
        tag: "SEM DADOS",
        title: "Nenhuma análise ainda",
        description:
          "Execute o coletor do EcoDash em sua aplicação para visualizar aqui a nota de sustentabilidade e as métricas da sua última análise.",
      };
  }
}

export function ScoreCard({ lastAnalysis, summary }: ScoreCardProps) {
  const grade = lastAnalysis?.grade;
  const { tag, title, description } = gradeContent(grade);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border p-5 sm:rounded-3xl sm:p-8 md:p-10"
      style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-soft)" }}
    >
      <div
        className="absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-primary)" }}
      />
      <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-8">
        <div
          className="mx-auto grid h-24 w-24 shrink-0 place-items-center rounded-2xl text-primary-foreground shadow-[var(--shadow-glow)] sm:mx-0 sm:h-32 sm:w-32 sm:rounded-3xl"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div className="text-center">
            <p className="text-xs font-medium tracking-widest opacity-80">SCORE</p>
            <p className="font-display text-5xl font-bold leading-none sm:text-6xl">{grade ?? "—"}</p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 text-center sm:text-left">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
              <Sparkles className="h-3 w-3" /> {tag}
            </span>
            {lastAnalysis && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                <Leaf className="h-3 w-3" /> {lastAnalysis.software_name}
              </span>
            )}
          </div>
          <h1 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 text-sm sm:flex sm:gap-6">
            <Stat
              label="SCI Score"
              value={lastAnalysis ? lastAnalysis.sci_score.toFixed(4) : "—"}
            />
            <Stat
              label="Energia"
              value={lastAnalysis ? `${lastAnalysis.energy_kwh} kWh` : "—"}
            />
            <Stat label="Análises" value={summary ? String(summary.total) : "—"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-display text-lg font-semibold text-foreground sm:text-xl">{value}</p>
      <p className="truncate text-[11px] text-muted-foreground sm:text-xs">{label}</p>
    </div>
  );
}
