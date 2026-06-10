import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAI } from "@/hooks/use-ai";
import { AIOutput } from "@/components/ai-output";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/meeting")({
  component: MeetingPage,
});

function MeetingPage() {
  const [notes, setNotes] = useState("");
  const { run, loading, output } = useAI();

  async function go(skipCache = false) {
    await run({
      feature: "meeting",
      userPrompt: notes,
      historyTitle: `Meeting: ${notes.slice(0, 40)}`,
      skipCache,
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Meeting Notes Summarizer</h1>
        <p className="text-sm text-muted-foreground">
          Paste raw notes and get a structured summary with action items.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Meeting notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Paste notes</Label>
              <Textarea
                placeholder="Paste your raw meeting notes or transcript here…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={14}
              />
            </div>
            <Button onClick={() => go(false)} disabled={loading} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Summarizing…" : "Summarize"}
            </Button>
          </CardContent>
        </Card>

        <AIOutput
          content={output}
          loading={loading}
          onRegenerate={() => go(true)}
          filename="meeting-summary.txt"
          emptyHint="Paste your meeting notes and click Summarize."
        />
      </div>

      <AIDisclaimer />
    </div>
  );
}
