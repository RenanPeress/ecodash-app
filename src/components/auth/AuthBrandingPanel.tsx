import { BarChart3, Leaf, ShieldCheck, Zap } from "lucide-react";

const highlights = [
  { icon: Zap, text: "Monitore consumo de energia em tempo real" },
  { icon: BarChart3, text: "Compare versões e otimize performance" },
  { icon: ShieldCheck, text: "Alinhado aos princípios Green Software" },
];

export function AuthBrandingPanel() {
  return (
    <div
      className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12"
      style={{ background: "var(--gradient-primary)" }}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
            <Leaf className="h-6 w-6" />
          </div>
          <span className="font-display text-2xl font-semibold tracking-tight text-white">
            EcoDash
          </span>
        </div>
        <h2 className="mt-10 max-w-md font-display text-3xl font-semibold leading-tight tracking-tight text-white">
          Sustentabilidade e performance para o seu código
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
          Acesse métricas ambientais, relatórios técnicos e benchmarks de eficiência em uma única
          plataforma.
        </p>
      </div>

      <ul className="relative z-10 space-y-4">
        {highlights.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-sm text-white/90">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10">
              <Icon className="h-4 w-4" />
            </span>
            {text}
          </li>
        ))}
      </ul>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
      />
    </div>
  );
}
