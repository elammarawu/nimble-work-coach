import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAI } from "@/hooks/use-ai";
import { AIOutput } from "@/components/ai-output";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { PageHero } from "@/components/page-hero";
import { ListChecks, Sparkles } from "lucide-react";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});

function TasksPage() {
  const [tasks, setTasks] = useState("");
  const { run, loading, output } = useAI();

  async function go(skipCache = false) {
    await run({ feature: "tasks", userPrompt: tasks, historyTitle: `Plan: ${tasks.slice(0, 40)}`, skipCache });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <PageHero
        icon={<ListChecks className="h-6 w-6" />}
        title="AI Task Planner"
        subtitle="List your tasks — get a prioritized daily and weekly plan with urgency labels."
        badge="AI Tool"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Your tasks</h3>
            <p className="text-xs text-muted-foreground">One task per line. Add deadlines if you have them.</p>
          </div>
          <div className="space-y-2">
            <Label>Tasks</Label>
            <Textarea
              placeholder={`Finish Q4 report — due Friday\nPrep slides for Monday demo\nReview PRs\nSchedule 1:1 with new hire`}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              rows={14}
              className="resize-none font-mono text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-red-400">[P1] Urgent</span>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-amber-400">[P2] Important</span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-400">[P3] Nice-to-have</span>
          </div>
          <Button onClick={() => go(false)} disabled={loading} className="w-full gradient-bg shadow-glow border-0 text-white hover:opacity-90">
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? "Planning…" : "Generate Plan"}
          </Button>
        </div>

        <AIOutput
          content={output}
          loading={loading}
          onRegenerate={() => go(true)}
          filename="plan.txt"
          emptyHint="Add tasks and click Generate Plan."
          emptyIcon={<ListChecks className="h-5 w-5 text-primary" />}
        />
      </div>

      <AIDisclaimer />
    </div>
  );
}
