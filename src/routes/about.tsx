import { createFileRoute } from "@tanstack/react-router";
import { Info, Target, Lightbulb, ShieldCheck, Sparkles, Zap, Cpu, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

const SECTIONS = [
  {
    icon: Target,
    title: "Problem",
    body: "Professionals spend hours each week drafting routine emails, formatting meeting notes, planning tasks, and researching topics — time that could be spent on higher-value work.",
  },
  {
    icon: Lightbulb,
    title: "Solution",
    body: "An AI-powered workplace assistant that automates repetitive knowledge-work tasks through a clean, single-purpose dashboard with reusable prompt templates.",
  },
  {
    icon: Cpu,
    title: "AI Tools Used",
    body: "Lovable AI Gateway with Google Gemini (Flash) and OpenAI GPT models. Switchable from Settings. Server functions keep API keys safe and prompts on the server.",
  },
  {
    icon: Sparkles,
    title: "Prompt Engineering",
    body: "Short, role-specific system prompts per feature. Strict output formats (JSON for emails, markdown sections for summaries) reduce post-processing and token use.",
  },
  {
    icon: Zap,
    title: "Productivity Benefits",
    body: "Faster drafting, structured meeting outputs, prioritized task plans, and digestible research — all reusable, exportable, and stored locally for instant recall.",
  },
  {
    icon: ShieldCheck,
    title: "Responsible AI",
    body: "Visible disclaimers on every page, human-in-the-loop editing, bias awareness reminders, and no transmission of user data to third parties beyond the AI request.",
  },
];

const PRACTICES = [
  "Short, scoped prompts per feature",
  "Token-saving mode caps responses at ~400 tokens",
  "Session-level response caching to avoid repeat calls",
  "Local storage for history — no database required",
  "Model selection (Gemini Flash / GPT) for cost control",
  "Strict output formats reduce parsing and retries",
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <PageHero
        icon={<Info className="h-6 w-6" />}
        title="Project Overview"
        subtitle="AI Workplace Productivity Assistant — built to demonstrate real-world productivity gains through responsible, low-cost AI."
        badge="About"
      />

      <section className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <div key={s.title} className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft card-hover">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg-soft text-primary">
                <s.icon className="h-4 w-4" />
              </div>
              <h3 className="font-semibold tracking-tight">{s.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
        <h3 className="text-base font-semibold tracking-tight">Low-cost AI strategy</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The app is engineered to stay fast and inexpensive — even on limited AI credits.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {PRACTICES.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 shadow-soft">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-foreground">Responsible AI Statement</p>
            <p className="text-muted-foreground">
              AI-generated content may contain inaccuracies or reflect bias from training data. Always
              review outputs before professional use, validate facts, and ensure communication aligns
              with your organization's policies. A human should remain in the loop for any consequential decision.
            </p>
          </div>
        </div>
      </section>

      <div className="rounded-2xl border border-border/60 bg-card p-5 text-xs text-muted-foreground shadow-soft">
        Built with React, TanStack Start, Tailwind CSS, and the Lovable AI Gateway.
      </div>
    </div>
  );
}
