import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { loadHistory, type HistoryItem } from "@/lib/storage";
import { AIDisclaimer } from "@/components/ai-disclaimer";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const features = [
  { title: "Email Generator", desc: "Draft polished emails in seconds.", url: "/email", icon: Mail },
  { title: "Meeting Summarizer", desc: "Turn notes into action items.", url: "/meeting", icon: FileText },
  { title: "Task Planner", desc: "Prioritize and schedule your day.", url: "/tasks", icon: ListChecks },
  { title: "Research Assistant", desc: "Get quick insights on any topic.", url: "/research", icon: Sparkles },
];

const tips = [
  "Batch similar tasks to reduce context switching.",
  "Use the 2-minute rule: do it now if it takes under 2 minutes.",
  "Schedule deep work in your highest-energy hours.",
  "End each day by planning the next morning's top 3 priorities.",
];

function Dashboard() {
  const [recent, setRecent] = useState<HistoryItem[]>([]);
  useEffect(() => setRecent(loadHistory().slice(0, 4)), []);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back 👋</h1>
        <p className="text-muted-foreground">Your AI productivity assistant is ready to help.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Link key={f.url} to={f.url}>
            <Card className="h-full transition-all hover:border-primary hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" className="px-0">
                  Open <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Productivity tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {tips.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="text-primary">•</span>
                  {t}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent outputs</CardTitle>
            <CardDescription>Last AI generations from this device</CardDescription>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing yet. Start with the Email Generator or Meeting Summarizer.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {recent.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-2 border-b border-border pb-2 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{r.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{r.feature}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <AIDisclaimer />
    </div>
  );
}
