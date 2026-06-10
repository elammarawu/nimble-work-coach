import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAI } from "@/hooks/use-ai";
import { AIOutput } from "@/components/ai-output";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/email")({
  component: EmailPage,
});

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("client");
  const [tone, setTone] = useState("formal");
  const { run, loading, output } = useAI();

  function buildPrompt() {
    return `Purpose: ${purpose}\nRecipient type: ${recipient}\nTone: ${tone}`;
  }

  async function generate(skipCache = false) {
    await run({
      feature: "email",
      userPrompt: buildPrompt(),
      historyTitle: `Email: ${purpose.slice(0, 40)}`,
      skipCache,
    });
  }

  // Try to parse JSON output for nicer rendering.
  let parsed: { subject?: string; body?: string } | null = null;
  try {
    const match = output.match(/\{[\s\S]*\}/);
    if (match) parsed = JSON.parse(match[0]);
  } catch {
    parsed = null;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Smart Email Generator</h1>
        <p className="text-sm text-muted-foreground">Generate polished emails tailored to your audience.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Purpose</Label>
              <Textarea
                placeholder="e.g. Request a project status update by Friday"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
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
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="informal">Informal</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={() => generate(false)} disabled={loading} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Generating…" : "Generate Email"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {parsed?.subject ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{parsed.subject}</p>
              </CardContent>
            </Card>
          ) : null}
          <AIOutput
            content={parsed?.body || output}
            loading={loading}
            onRegenerate={() => generate(true)}
            filename="email.txt"
            emptyHint="Fill in the details and click Generate."
          />
        </div>
      </div>

      <AIDisclaimer />
    </div>
  );
}
