import { useEffect, useRef, useState } from "react";
import { Bot, Send, X, Leaf, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAIChat } from "@/hooks/use-ai-chat";
import { isAuthenticated } from "@/lib/auth-token";
import { useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/ai";

// ── Message bubble ─────────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <div className="shrink-0 h-7 w-7 rounded-full bg-primary/10 grid place-items-center">
          <Bot className="h-3.5 w-3.5 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-sm bg-primary text-primary-foreground"
            : "rounded-tl-sm bg-muted text-foreground",
        )}
      >
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="shrink-0 h-7 w-7 rounded-full bg-primary/10 grid place-items-center">
        <Bot className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground mr-1">Processando</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Welcome message ────────────────────────────────────────────────────────────

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Olá! Sou o EcoDash Assistant, especializado em Software Carbon Intensity (SCI). Posso responder perguntas sobre suas análises, explicar conceitos de Green Software e ajudar a interpretar seus resultados. Como posso ajudar?",
};

// ── Chat panel ─────────────────────────────────────────────────────────────────

function ChatPanel({ onClose }: { onClose: () => void }) {
  const { messages, isLoading, error, sendMessage, clearError } = useAIChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const allMessages = [WELCOME, ...messages];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function submitMessage() {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    void sendMessage(text);
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    submitMessage();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter envia; Shift+Enter faz nova linha
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  }

  return (
    <div
      className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden"
      style={{
        width: "min(380px, calc(100vw - 2rem))",
        height: "min(520px, calc(100vh - 6rem))",
        boxShadow: "0 20px 60px -10px rgba(0,0,0,0.25), 0 4px 16px -4px rgba(0,0,0,0.12)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0"
        style={{ background: "var(--gradient-card)" }}
      >
        <div
          className="h-8 w-8 rounded-xl grid place-items-center text-primary-foreground shrink-0"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Leaf className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">EcoDash Assistant</p>
          <p className="text-xs text-muted-foreground">Especialista em SCI · Claude Opus</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground shrink-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
        {allMessages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="flex-1 text-xs">{error}</span>
            <button
              onClick={clearError}
              className="text-xs underline underline-offset-2 hover:no-underline shrink-0"
            >
              OK
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input — textarea com Shift+Enter para nova linha */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 flex items-end gap-2 border-t border-border px-3 py-3 bg-background"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Pergunte sobre suas análises SCI…"
          rows={1}
          className="flex-1 min-w-0 rounded-xl bg-muted/60 border border-transparent px-3 py-2 text-sm resize-none focus:outline-none focus:border-primary/40 focus:bg-card focus:ring-2 focus:ring-primary/10 transition disabled:opacity-50 max-h-28 overflow-y-auto"
          style={{ fieldSizing: "content" } as React.CSSProperties}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="h-9 w-9 rounded-xl shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}

// ── FAB + widget ───────────────────────────────────────────────────────────────

export function ChatWidget() {
  const { pathname } = useLocation();
  const [authed, setAuthed] = useState(isAuthenticated());
  const [open, setOpen] = useState(false);

  // Re-check auth on every route change (handles login and logout)
  useEffect(() => {
    const ok = isAuthenticated();
    setAuthed(ok);
    if (!ok) setOpen(false);
  }, [pathname]);

  if (!authed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && <ChatPanel onClose={() => setOpen(false)} />}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar chat IA" : "Abrir chat IA"}
        className={cn(
          "grid h-12 w-12 place-items-center rounded-2xl transition-all duration-200 sm:h-14 sm:w-14",
          "focus:outline-none focus:ring-4 focus:ring-primary/30",
          open
            ? "bg-muted text-foreground shadow-md"
            : "text-primary-foreground hover:scale-110 active:scale-95",
        )}
        style={open ? {} : { background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
      >
        {open ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Bot className="h-5 w-5 sm:h-6 sm:w-6" />}
      </button>
    </div>
  );
}
