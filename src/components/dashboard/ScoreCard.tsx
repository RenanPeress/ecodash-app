import { Sparkles, Leaf } from "lucide-react";

export function ScoreCard() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-8 md:p-10 border border-border"
      style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-soft)" }}
    >
      <div
        className="absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-primary)" }}
      />
      <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div
          className="shrink-0 h-32 w-32 rounded-3xl grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)]"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div className="text-center">
            <p className="text-xs font-medium opacity-80 tracking-widest">SCORE</p>
            <p className="font-display text-6xl font-bold leading-none">A</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide">
              <Sparkles className="h-3 w-3" /> OTIMIZADO
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
              <Leaf className="h-3 w-3" /> Green Software
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Seu software é Sustentável
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
            Sua aplicação opera com alta eficiência energética, reduzindo o consumo de CPU e o impacto
            ambiental. Continue monitorando para manter as métricas dentro dos limites recomendados.
          </p>

          <div className="mt-6 flex gap-6 text-sm">
            <Stat label="Eficiência" value="92%" />
            <Stat label="CO₂ evitado" value="3.4 kg" />
            <Stat label="Energia" value="-28%" />
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
