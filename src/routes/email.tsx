import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAI } from "@/hooks/use-ai";
import { AIOutput } from "@/components/ai-output";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { PageHero } from "@/components/page-hero";
import { Mail, Sparkles } from "lucide-react";

export const Route = createFileRoute("/email")({
  component: EmailPage,
});

const TONES = [
  { id: "formal", label: "Formal" },
  { id: "informal", label: "Informal" },
  { id: "persuasive", label: "Persuasive" },
];

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("client");
  const [tone, setTone] = useState("formal");
  const { run, loading, output } = useAI();

  function build() {
    return `Purpose: ${purpose}\nRecipient type: ${recipient}\nTone: ${tone}`;
  }
  async function generate(skipCache = false) {
    await run({ feature: "email", userPrompt: build(), historyTitle: `Email: ${purpose.slice(0, 40)}`, skipCache });
  }

  let parsed: { subject?: string; body?: string } | null = null;
  try {
    const m = output.match(/\{[\s\S]*\}/);
    if (m) parsed = JSON.parse(m[0]);
  } catch { parsed = null; }

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <PageHero
        icon={<Mail className="h-6 w-6" />}
        title="Smart Email Generator"
        subtitle="Generate polished, audience-aware emails in seconds."
        badge="AI Tool"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft space-y-5">
          <div>
            <h3 className="text-sm font-semibold">Email details</h3>
            <p className="text-xs text-muted-foreground">Tell the AI what you need.</p>
          </div>

          <div className="space-y-2">
            <Label>Purpose</Label>
            <Textarea
              placeholder="e.g. Request a project status update by Friday"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                    tone === t.id
                      ? "border-transparent gradient-bg text-white shadow-glow"
                      : "border-border bg-background/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Recipient</Label>
            <Select value={recipient} onValueChange={setRecipient}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="team member">Team member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => generate(false)} disabled={loading} className="w-full gradient-bg shadow-glow border-0 text-white hover:opacity-90">
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? "Generating…" : "Generate Email"}
          </Button>
        </div>

        {/* Output */}
        <div className="space-y-4">
          {parsed?.subject && (
            <div className="animate-fade-in rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Subject</p>
              <p className="mt-1 font-semibold">{parsed.subject}</p>
            </div>
          )}
          <AIOutput
            content={parsed?.body || output}
            loading={loading}
            onRegenerate={() => generate(true)}
            filename="email.txt"
            emptyHint="Fill in the details and click Generate."
            emptyIcon={<Mail className="h-5 w-5 text-primary" />}
          />
        </div>
      </div>

      <AIDisclaimer />
    </div>
  );
}
