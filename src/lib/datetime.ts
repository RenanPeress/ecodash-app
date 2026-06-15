/** Tempo relativo curto em pt-BR a partir de uma data ISO. Ex.: "há 2 min", "ontem", "3 d". */
export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  if (Number.isNaN(diffMs)) return "";

  const sec = Math.round(diffMs / 1000);
  const min = Math.round(sec / 60);
  const hour = Math.round(min / 60);
  const day = Math.round(hour / 24);

  if (sec < 60) return "agora";
  if (min < 60) return `há ${min} min`;
  if (hour < 24) return `há ${hour} h`;
  if (day === 1) return "ontem";
  if (day < 7) return `${day} d`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

/** Rótulo curto de data para eixos de gráfico. Ex.: "15/01". */
export function formatDayLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}
