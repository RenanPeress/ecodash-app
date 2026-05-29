import { useEffect, useState } from "react";
import { fetchDashboard, type DashboardData } from "@/lib/api/dashboard";

interface UseDashboardResult {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Erro ao carregar dashboard"),
      )
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, error };
}
