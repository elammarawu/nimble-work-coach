import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAI } from "@/hooks/use-ai";
import { AIOutput } from "@/components/ai-output";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { PageHero } from "@/components/page-hero";
import { Lightbulb, Search, Sparkles } from "lucide-react";

export const Route = createFileRoute("/research")({
  component: ResearchPage,
});

const SUGGESTED = [
  "Impact of AI on knowledge work",
  "Best practices for async communication",
  "Trends in product analytics 2025",
];

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const { run, loading, output } = useAI();

  async function go(skipCache = false) {
    await run({ feature: "research", userPrompt: topic, historyTitle: `Research: ${topic.slice(0, 40)}`, skipCache });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <PageHero
        icon={<Lightbulb className="h-6 w-6" />}
        title="AI Research Assistant"
        subtitle="Enter a topic or paste an article — get a concise TL;DR, insights, and recommendations."
        badge="AI Tool"
      />

      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Search a topic or paste article text…"
            rows={3}
            className="w-full resize-none rounded-2xl border border-border bg-background/60 py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => setTopic(s)}
                className="rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
          <Button onClick={() => go(false)} disabled={loading} className="gradient-bg shadow-glow border-0 text-white hover:opacity-90">
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? "Researching…" : "Get Insights"}
          </Button>
        </div>
      </div>

      <AIOutput
        content={output}
        loading={loading}
        onRegenerate={() => go(true)}
        filename="research.txt"
        emptyHint="Search a topic above to get AI insights."
        emptyIcon={<Lightbulb className="h-5 w-5 text-primary" />}
      />

      <AIDisclaimer />
    </div>
  );
}
