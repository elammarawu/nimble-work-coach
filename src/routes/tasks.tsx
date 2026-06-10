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

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});

function TasksPage() {
  const [tasks, setTasks] = useState("");
  const { run, loading, output } = useAI();

  async function go(skipCache = false) {
    await run({
      feature: "tasks",
      userPrompt: tasks,
      historyTitle: `Plan: ${tasks.slice(0, 40)}`,
      skipCache,
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Task Planner</h1>
        <p className="text-sm text-muted-foreground">
          List your tasks with priorities or deadlines — get a prioritized daily/weekly plan.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tasks (one per line)</Label>
              <Textarea
                placeholder={`Finish Q4 report — due Friday\nPrep slides for Monday demo\nReview PRs\nSchedule 1:1 with new hire`}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                rows={12}
              />
            </div>
            <Button onClick={() => go(false)} disabled={loading} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Planning…" : "Generate Plan"}
            </Button>
          </CardContent>
        </Card>

        <AIOutput
          content={output}
          loading={loading}
          onRegenerate={() => go(true)}
          filename="plan.txt"
          emptyHint="Add tasks and click Generate Plan."
        />
      </div>

      <AIDisclaimer />
    </div>
  );
}
