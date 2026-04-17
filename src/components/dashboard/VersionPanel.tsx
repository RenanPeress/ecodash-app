import { memo } from "react";
import { Leaf, Timer } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VersionData {
  carbon: string;
  time: string;
  cpu: { name: string; value: number }[];
  memory: { name: string; value: number }[];
}

interface Props {
  title: string;
  badge: string;
  badgeVariant?: "stable" | "experimental";
  versions: string[];
  selected: string;
  onSelect: (v: string) => void;
  data: VersionData;
  accentColor: string;
}

export const VersionPanel = memo(function VersionPanel({
  title,
  badge,
  badgeVariant = "stable",
  versions,
  selected,
  onSelect,
  data,
  accentColor,
}: Props) {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-6 space-y-6"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
          <span
            className={`inline-flex items-center mt-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
              badgeVariant === "stable"
                ? "bg-primary/10 text-primary"
                : "bg-warning/15 text-foreground"
            }`}
            style={
              badgeVariant === "experimental"
                ? { color: "oklch(0.45 0.15 75)", background: "oklch(0.94 0.08 85)" }
                : undefined
            }
          >
            {badge}
          </span>
        </div>
        <Select value={selected} onValueChange={onSelect}>
          <SelectTrigger className="w-36 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {versions.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat
          icon={Leaf}
          label="Carbono"
          value={data.carbon}
          unit="kg CO₂e"
          color={accentColor}
        />
        <Stat
          icon={Timer}
          label="Execução"
          value={data.time}
          unit="segundos"
          color={accentColor}
        />
      </div>

      <ChartBlock title="Uso de CPU (%)">
        <div className="h-full flex items-center justify-center">
          <SimpleBarChart data={data.cpu} color={accentColor} />
        </div>
      </ChartBlock>

      <ChartBlock title="Alocação de Memória (MB)">
        <div className="h-full flex items-center justify-center">
          <SimpleLineChart data={data.memory} color={accentColor} />
        </div>
      </ChartBlock>
    </div>
  );
});

function Stat({
  icon: Icon,
  label,
  value,
  unit,
  color,
}: {
  icon: typeof Leaf;
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" style={{ color }} />
        {label}
      </div>
      <p className="font-display text-2xl font-semibold tracking-tight mt-1">{value}</p>
      <p className="text-[11px] text-muted-foreground">{unit}</p>
    </div>
  );
}

function ChartBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
        {title}
      </p>
      <div className="h-40 w-full">{children}</div>
    </div>
  );
}

function SimpleBarChart({ data, color }: { data: { name: string; value: number }[]; color: string }) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full h-full flex items-end justify-center gap-2 px-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-1">
          <div className="text-xs text-muted-foreground">{item.value}</div>
          <div
            className="w-8 rounded-t transition-all duration-300"
            style={{
              height: `${(item.value / maxValue) * 100}%`,
              backgroundColor: color,
              minHeight: '4px'
            }}
          />
          <div className="text-xs text-muted-foreground">{item.name}</div>
        </div>
      ))}
    </div>
  );
}

function SimpleLineChart({ data, color }: { data: { name: string; value: number }[]; color: string }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));

  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      <svg width="100%" height="100%" viewBox="0 0 200 120" className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={data.map((item, index) => {
            const x = (index / (data.length - 1)) * 180 + 10;
            const y = 100 - ((item.value - minValue) / (maxValue - minValue)) * 80 + 10;
            return `${x},${y}`;
          }).join(' ')}
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 180 + 10;
          const y = 100 - ((item.value - minValue) / (maxValue - minValue)) * 80 + 10;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
            />
          );
        })}
      </svg>
    </div>
  );
}
