import { useCallback, useEffect, useState } from "react";
import { fetchAllVersionOptions, fetchVersionDetail } from "@/lib/api/version-comparison";
import type { SoftwareVersion, SoftwareVersionOption } from "@/types/version-comparison";

interface UseVersionComparisonResult {
  options: SoftwareVersionOption[];
  versionA: SoftwareVersion | null;
  versionB: SoftwareVersion | null;
  versionAId: string;
  versionBId: string;
  isLoading: boolean;
  isLoadingA: boolean;
  isLoadingB: boolean;
  error: string | null;
  setVersionAId: (id: string) => void;
  setVersionBId: (id: string) => void;
}

export function useVersionComparison(): UseVersionComparisonResult {
  const [options, setOptions] = useState<SoftwareVersionOption[]>([]);
  const [versionAId, setVersionAIdState] = useState("");
  const [versionBId, setVersionBIdState] = useState("");
  const [versionA, setVersionA] = useState<SoftwareVersion | null>(null);
  const [versionB, setVersionB] = useState<SoftwareVersion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingA, setIsLoadingA] = useState(false);
  const [isLoadingB, setIsLoadingB] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const opts = await fetchAllVersionOptions();
        setOptions(opts);
        if (opts.length >= 1) setVersionAIdState(opts[0].versionId);
        if (opts.length >= 2) setVersionBIdState(opts[1].versionId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Falha ao carregar análises.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const loadVersion = useCallback(
    async (id: string, setter: (v: SoftwareVersion | null) => void, setBusy: (b: boolean) => void) => {
      if (!id) return;
      setBusy(true);
      try {
        const v = await fetchVersionDetail(id);
        setter(v);
      } catch {
        setter(null);
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (versionAId) void loadVersion(versionAId, setVersionA, setIsLoadingA);
  }, [versionAId, loadVersion]);

  useEffect(() => {
    if (versionBId) void loadVersion(versionBId, setVersionB, setIsLoadingB);
  }, [versionBId, loadVersion]);

  const setVersionAId = useCallback((id: string) => setVersionAIdState(id), []);
  const setVersionBId = useCallback((id: string) => setVersionBIdState(id), []);

  return {
    options,
    versionA,
    versionB,
    versionAId,
    versionBId,
    isLoading,
    isLoadingA,
    isLoadingB,
    error,
    setVersionAId,
    setVersionBId,
  };
}
