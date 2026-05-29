import { apiFetch } from "./client";
import type { Recommendation, ChatMessage } from "@/types/ai";

export function fetchAISummary(analysisId: number): Promise<{ summary: string }> {
  return apiFetch(`/api/analyses/${analysisId}/summary/`);
}

export function fetchAIRecommendations(
  analysisId: number,
): Promise<{ recommendations: Recommendation[] }> {
  return apiFetch(`/api/analyses/${analysisId}/recommendations/`);
}

export function sendChatMessage(
  message: string,
  history: ChatMessage[],
): Promise<{ response: string }> {
  return apiFetch("/api/chat/", {
    method: "POST",
    body: JSON.stringify({ message, history }),
  });
}
