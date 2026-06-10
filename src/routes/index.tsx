import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Lightbulb, ArrowUpRight, Sparkles, Zap, Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { loadHistory, type HistoryItem } from "@/lib/storage";
import { AIDisclaimer } from "@/components/ai-disclaimer";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const features = [
  { title: "Email Generator", desc: "Draft polished emails in seconds", url: "/email", icon: Mail, accent: "from-blue-500 to-cyan-500" },
  { title: "Meeting Summarizer", desc: "Turn notes into action items", url: "/meeting", icon: FileText, accent: "from-violet-500 to-fuchsia-500" },
  { title: "Task Planner", desc: "Prioritize and schedule your day", url: "/tasks", icon: ListChecks, accent: "from-emerald-500 to-teal-500" },
  { title: "Research Assistant", desc: "Quick insights on any topic", url: "/research", icon: Lightbulb, accent: "from-amber-500 to-orange-500" },
];

const tips = [
  "Batch similar tasks to reduce context switching.",
  "Use the 2-minute rule: do it now if it takes under 2 minutes.",
  "Schedule deep work in your highest-energy hours.",
  "End each day by planning the next morning's top 3 priorities.",
];

function Dashboard() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  useEffect(() => setHistory(loadHistory()), []);

  const stats = [
    { label: "AI generations", value: history.length, icon: Sparkles },
    { label: "This week", value: history.filter((h) => Date.now() - h.createdAt < 7 * 24 * 3600 * 1000).length, icon: TrendingUp },
    { label: "Time saved", value: `${history.length * 5}m`, icon: Clock },
    { label: "Favorites", value: history.filter((h) => h.favorite).length, icon: Zap },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 sm:p-10 shadow-soft">
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-brand-soft)" }} />
        <div className="pointer-events-none absolute -top-32 -right-20 h-80 w-80 rounded-full blur-3xl opacity-50 gradient-bg" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full blur-3xl opacity-30 gradient-bg" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> All systems ready
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">
            Work smarter with <span className="gradient-text">Productivity AI</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
            Your premium workplace assistant for emails, meetings, planning, and research — built to keep you focused and your costs low.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to="/email"
              className="inline-flex items-center gap-1.5 rounded-full gradient-bg px-4 py-2 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4" /> Try Email Generator
            </Link>
            <Link
              to="/tasks"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-accent"
            >
              Plan my day
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="group rounded-2xl border border-border/60 bg-card p-4 shadow-soft card-hover">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg-soft text-primary">
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">{s.value}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">AI Tools</h2>
            <p className="text-sm text-muted-foreground">Pick a tool to get started</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <Link
              key={f.url}
              to={f.url}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-soft card-hover"
            >
              <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${f.accent} opacity-10 blur-2xl transition-opacity group-hover:opacity-25`} />
              <div className="relative flex items-start gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${f.accent} text-white shadow-soft`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold tracking-tight">{f.title}</h3>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tips + Activity */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-bg-soft text-primary">
              <Lightbulb className="h-4 w-4" />
            </div>
            <h3 className="font-semibold tracking-tight">Productivity tips</h3>
          </div>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {tips.map((t) => (
              <li key={t} className="flex gap-2.5">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-bg-soft text-primary">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="font-semibold tracking-tight">Recent activity</h3>
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing yet. Start with any AI tool above.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {history.slice(0, 5).map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-border/60 hover:bg-muted/40"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{r.title}</p>
                    <p className="text-xs capitalize text-muted-foreground">{r.feature}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <AIDisclaimer />
    </div>
  );
}
