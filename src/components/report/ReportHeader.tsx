import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarClock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportHeaderProps {
  analysisDate: string | null;
  isLoading: boolean;
  isExporting: boolean;
  onExport: () => void;
}

export function formatAnalysisDate(isoDate: string): string {
  const date = parseISO(isoDate);
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function ReportHeader({
  analysisDate,
  isLoading,
  isExporting,
  onExport,
}: ReportHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Relatório de Sustentabilidade
          </h1>
          <p className="text-sm text-muted-foreground">
            Visão técnica detalhada do desempenho ambiental do código.
          </p>
        </div>

        <Button
          className="gap-2 shrink-0 shadow-[var(--shadow-glow)]"
          style={{ background: "var(--gradient-primary)" }}
          onClick={onExport}
          disabled={isLoading || isExporting || !analysisDate}
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exportando..." : "Exportar Dados"}
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-4 w-72" />
      ) : analysisDate ? (
        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarClock className="h-4 w-4" />
          Análise realizada em:{" "}
          <span className="font-medium text-foreground">{formatAnalysisDate(analysisDate)}</span>
        </p>
      ) : null}
    </header>
  );
}
