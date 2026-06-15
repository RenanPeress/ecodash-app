import type { SoftwareVersion, SoftwareVersionOption } from "@/types/version-comparison";
import { apiFetch } from "./client";
import type { AnaliseDetail, AnaliseItem } from "./dashboard";

export function mapAnaliseToSoftwareVersion(a: AnaliseDetail): SoftwareVersion {
  const m = a.metrics;
  const durationS = m?.duration_seconds ?? 0;

  const cpuData = m
    ? [
        { core: "Média", usagePercent: m.cpu_percent_avg },
        { core: "Pico", usagePercent: m.cpu_percent_peak },
      ]
    : [{ core: "Média", usagePercent: 0 }, { core: "Pico", usagePercent: 0 }];

  const memoryData = m
    ? buildMemoryTimeSeries(m.memory_used_mb_avg, m.memory_used_mb_peak, durationS)
    : [{ time: "0s", memoryMb: 0 }];

  const label = `#${a.id} — ${a.software_name} (${a.grade})`;

  return {
    versionId: String(a.id),
    label,
    carbonCostGco2eq: Math.round(a.sci_score * 1000) / 1000,
    executionTimeMs: Math.round(durationS * 1000),
    cpuData,
    memoryData,
  };
}

function buildMemoryTimeSeries(
  avg: number,
  peak: number,
  durationS: number,
): { time: string; memoryMb: number }[] {
  const steps = Math.max(4, Math.min(8, Math.ceil(durationS)));
  const points: { time: string; memoryMb: number }[] = [];
  const peakAt = Math.floor(steps * 0.4);
  for (let i = 0; i <= steps; i++) {
    const t = Math.round((durationS * i) / steps);
    let mem: number;
    if (i === 0) {
      mem = avg * 0.7;
    } else if (i === peakAt) {
      mem = peak;
    } else if (i > peakAt) {
      mem = peak - (peak - avg) * ((i - peakAt) / (steps - peakAt));
    } else {
      mem = avg * 0.7 + (peak - avg * 0.7) * (i / peakAt);
    }
    points.push({ time: `${t}s`, memoryMb: Math.round(mem * 10) / 10 });
  }
  return points;
}

export function analiseItemToOption(a: AnaliseItem): SoftwareVersionOption {
  return {
    versionId: String(a.id),
    label: `#${a.id} — ${a.software_name} (${a.grade})`,
  };
}

export async function fetchAllVersionOptions(): Promise<SoftwareVersionOption[]> {
  const analyses = await apiFetch<AnaliseItem[]>("/api/analyses/");
  return analyses.map(analiseItemToOption);
}

export async function fetchVersionDetail(id: string): Promise<SoftwareVersion> {
  const detail = await apiFetch<AnaliseDetail>(`/api/analyses/${id}/`);
  return mapAnaliseToSoftwareVersion(detail);
}
