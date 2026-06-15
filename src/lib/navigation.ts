import {
  LayoutDashboard,
  BarChart3,
  GitCompareArrows,
  FileText,
  type LucideIcon,
} from "lucide-react";

export interface NavItemConfig {
  icon: LucideIcon;
  label: string;
  to: string;
  desc?: string;
}

export const MAIN_NAV: NavItemConfig[] = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/", desc: "Visão geral de métricas" },
  { icon: BarChart3, label: "Análise", to: "/analise", desc: "Analisar seu código" },
  {
    icon: GitCompareArrows,
    label: "Comparação",
    to: "/comparacao",
    desc: "Comparar versões de software",
  },
  {
    icon: FileText,
    label: "Relatório",
    to: "/relatorio",
    desc: "Relatório de sustentabilidade",
  },
];
