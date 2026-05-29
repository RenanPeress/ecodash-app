import { apiFetch } from "./client";

export interface DashboardData {
  total: number;
  avg_sci: number;
  grades: Record<string, number>;
  recent: RecentAnalise[];
}

export interface RecentAnalise {
  id: number;
  software_name: string;
  sci_score: number;
  grade: string;
  created_at: string;
}

export interface AnaliseItem {
  id: number;
  software_name: string;
  sci_score: number;
  grade: string;
  region: string;
  energy_kwh: number;
  created_at: string;
}

export interface AnaliseDetail extends AnaliseItem {
  hardware_type: string;
  grid_intensity_gco2_kwh?: number;
  embodied_carbon_gco2?: number;
  metrics?: {
    duration_seconds: number;
    cpu_percent_avg: number;
    cpu_percent_peak: number;
    memory_used_mb_avg: number;
    memory_used_mb_peak: number;
    io_read_mb: number;
    io_write_mb: number;
    threads_count: number;
    process_name: string;
  };
}

export function fetchDashboard(): Promise<DashboardData> {
  return apiFetch<DashboardData>("/api/dashboard/");
}

export function fetchAnalyses(): Promise<AnaliseItem[]> {
  return apiFetch<AnaliseItem[]>("/api/analyses/");
}

export function fetchAnaliseDetail(id: number): Promise<AnaliseDetail> {
  return apiFetch<AnaliseDetail>(`/api/analyses/${id}/`);
}
