import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAI } from "@/hooks/use-ai";
import { AIOutput } from "@/components/ai-output";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { PageHero } from "@/components/page-hero";
import { FileText, Sparkles } from "lucide-react";

export const Route = createFileRoute("/meeting")({
  component: MeetingPage,
});

function MeetingPage() {
  const [notes, setNotes] = useState("");
  const { run, loading, output } = useAI();

  async function go(skipCache = false) {
    await run({ feature: "meeting", userPrompt: notes, historyTitle: `Meeting: ${notes.slice(0, 40)}`, skipCache });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <PageHero
        icon={<FileText className="h-6 w-6" />}
        title="Meeting Notes Summarizer"
        subtitle="Paste raw notes and get a structured summary with action items and deadlines."
        badge="AI Tool"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Meeting notes</h3>
            <p className="text-xs text-muted-foreground">Paste any raw notes or transcript.</p>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Paste your raw meeting notes or transcript here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={16}
              className="resize-none"
            />
          </div>
          <Button onClick={() => go(false)} disabled={loading} className="w-full gradient-bg shadow-glow border-0 text-white hover:opacity-90">
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? "Summarizing…" : "Summarize Meeting"}
          </Button>
        </div>

        <AIOutput
          content={output}
          loading={loading}
          onRegenerate={() => go(true)}
          filename="meeting-summary.txt"
          emptyHint="Paste meeting notes and click Summarize."
          emptyIcon={<FileText className="h-5 w-5 text-primary" />}
        />
      </div>

      <AIDisclaimer />
    </div>
  );
}
