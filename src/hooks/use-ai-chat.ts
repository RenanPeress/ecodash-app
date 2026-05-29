import { useCallback, useState } from "react";
import { sendChatMessage } from "@/lib/api/ai";
import type { ChatMessage } from "@/types/ai";

interface UseAIChatResult {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearError: () => void;
}

export function useAIChat(): UseAIChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      // Envia histórico completo (backend limita a 10 mensagens internamente)
      const history = [...messages, userMsg];
      const res = await sendChatMessage(trimmed, history.slice(0, -1));
      const assistantMsg: ChatMessage = { role: "assistant", content: res.response };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao comunicar com a IA";
      setError(msg);
      // Remove a mensagem do usuário do histórico em caso de erro
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearError = useCallback(() => setError(null), []);

  return { messages, isLoading, error, sendMessage, clearError };
}
