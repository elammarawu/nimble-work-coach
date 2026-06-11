import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { runAI } from "@/lib/api/ai.functions";
import { loadSettings } from "@/lib/storage";
import { PageHero } from "@/components/page-hero";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Summarize today's priorities",
  "Draft a polite follow-up email",
  "Give me 3 tips for deep work",
];

function ChatPage() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const fn = useServerFn(runAI);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  async function send(text?: string) {
    const value = (text ?? input).trim();
    if (!value || loading) return;
    setInput("");
    const next = [...msgs, { role: "user" as const, content: value }];
    setMsgs(next);
    setLoading(true);
    try {
      // Token-saving: only send the last 4 messages as short context.
      const ctx = next.slice(-4).map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
      const s = loadSettings();
      const { content } = await fn({
        data: { feature: "chat", userPrompt: ctx, model: s.model, tokenSaver: s.tokenSaver },
      });
      setMsgs([...next, { role: "assistant", content }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Chat failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      <PageHero
        icon={<Bot className="h-6 w-6" />}
        title="AI Chat Assistant"
        subtitle="A lightweight conversational assistant for quick workplace questions."
        badge="AI Chat"
      />

      <div className="flex h-[60vh] min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6">
          {msgs.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl gradient-bg shadow-glow">
                <Bot className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-base font-semibold">How can I help you today?</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try one of these:</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            msgs.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-bg">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed animate-fade-in ${
                    m.role === "user" ? "gradient-bg text-white" : "bg-muted text-foreground"
                  }`}
                >
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-bg">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="flex gap-1 rounded-2xl bg-muted px-4 py-3">
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" style={{ animation: "pulse-dot 1.2s infinite" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" style={{ animation: "pulse-dot 1.2s infinite", animationDelay: "0.2s" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" style={{ animation: "pulse-dot 1.2s infinite", animationDelay: "0.4s" }} />
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); void send(); }}
          className="flex items-center gap-2 border-t border-border/60 bg-background/40 p-3 backdrop-blur"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything…"
            className="flex-1 rounded-full bg-muted px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()} className="h-10 w-10 shrink-0 rounded-full gradient-bg border-0">
            {loading ? <Sparkles className="h-4 w-4 animate-pulse text-white" /> : <Send className="h-4 w-4 text-white" />}
          </Button>
        </form>
      </div>

      <AIDisclaimer />
    </div>
  );
}
