export type ImpactLevel = "alto" | "medio" | "baixo";

export interface Recommendation {
  title: string;
  description: string;
  impact: ImpactLevel;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
