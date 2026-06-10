import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { runAI } from "@/lib/api/ai.functions";
import { loadSettings } from "@/lib/storage";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const fn = useServerFn(runAI);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next = [...msgs, { role: "user" as const, content: text }];
    setMsgs(next);
    setLoading(true);
    try {
      // Keep memory short to save tokens: only last 4 messages.
      const ctx = next.slice(-4).map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
      const settings = loadSettings();
      const { content } = await fn({
        data: { feature: "chat", userPrompt: ctx, model: settings.model, tokenSaver: settings.tokenSaver },
      });
      setMsgs([...next, { role: "assistant", content }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Chat failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full gradient-bg shadow-glow transition-transform hover:scale-110 active:scale-95"
        aria-label="Open AI chat"
      >
        {open ? <X className="h-6 w-6 text-white" /> : <Bot className="h-6 w-6 text-white" />}
      </button>

      {open && (
        <div className="animate-fade-in fixed bottom-24 right-6 z-40 flex h-[520px] w-[min(380px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl glass shadow-glow">
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">AI Assistant</p>
              <p className="text-[11px] text-muted-foreground">Ask anything · short answers</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
                <Bot className="mb-2 h-8 w-8 opacity-40" />
                <p>How can I help you today?</p>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "gradient-bg text-white"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl bg-muted px-4 py-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" style={{ animation: "pulse-dot 1.2s infinite", animationDelay: "0s" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" style={{ animation: "pulse-dot 1.2s infinite", animationDelay: "0.2s" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" style={{ animation: "pulse-dot 1.2s infinite", animationDelay: "0.4s" }} />
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); void send(); }}
            className="flex items-center gap-2 border-t border-border/60 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-full bg-muted px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} className="h-9 w-9 shrink-0 rounded-full gradient-bg">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
