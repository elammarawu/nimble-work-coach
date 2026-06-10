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

export const Route = createFileRoute("/research")({
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const { run, loading, output } = useAI();

  async function go(skipCache = false) {
    await run({
      feature: "research",
      userPrompt: topic,
      historyTitle: `Research: ${topic.slice(0, 40)}`,
      skipCache,
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Research Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Enter a topic or paste an article to get a concise summary, insights, and recommendations.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Topic or article</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Input</Label>
              <Textarea
                placeholder="e.g. The impact of AI on knowledge work — or paste an article excerpt"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={12}
              />
            </div>
            <Button onClick={() => go(false)} disabled={loading} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Researching…" : "Get Insights"}
            </Button>
          </CardContent>
        </Card>

        <AIOutput
          content={output}
          loading={loading}
          onRegenerate={() => go(true)}
          filename="research.txt"
          emptyHint="Enter a topic and click Get Insights."
        />
      </div>

      <AIDisclaimer />
    </div>
  );
}
