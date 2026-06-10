import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loadSettings, saveSettings, defaultSettings, type Settings } from "@/lib/storage";
import { applyTheme } from "@/components/theme-toggle";
import { toast } from "sonner";
import { AIDisclaimer } from "@/components/ai-disclaimer";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const MODELS = [
  { id: "google/gemini-3-flash-preview", label: "Gemini 3 Flash (fast, default)" },
  { id: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite (cheapest)" },
  { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash (balanced)" },
  { id: "openai/gpt-5-mini", label: "GPT-5 Mini" },
  { id: "openai/gpt-5", label: "GPT-5 (best quality)" },
];

function SettingsPage() {
  const [s, setS] = useState<Settings>(defaultSettings);

  useEffect(() => setS(loadSettings()), []);

  function update<K extends keyof Settings>(k: K, v: Settings[K]) {
    const next = { ...s, [k]: v };
    setS(next);
    saveSettings(next);
    if (k === "theme") applyTheme(v as "light" | "dark");
    toast.success("Settings saved");
  }

  function clearHistory() {
    localStorage.removeItem("pai.history");
    toast.success("History cleared");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings & About</h1>
        <p className="text-sm text-muted-foreground">Customize your Productivity AI experience.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark mode</Label>
              <p className="text-xs text-muted-foreground">Toggle between light and dark themes.</p>
            </div>
            <Switch
              checked={s.theme === "dark"}
              onCheckedChange={(v) => update("theme", v ? "dark" : "light")}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Label>AI model</Label>
              <p className="text-xs text-muted-foreground">Used for all AI features.</p>
            </div>
            <div className="w-64">
              <Select value={s.model} onValueChange={(v) => update("model", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Token-saving mode</Label>
              <p className="text-xs text-muted-foreground">Caps responses at ~400 tokens to reduce cost.</p>
            </div>
            <Switch checked={s.tokenSaver} onCheckedChange={(v) => update("tokenSaver", v)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data</CardTitle>
          <CardDescription>All history is stored locally in your browser.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={clearHistory}>Clear local history</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">About Productivity AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Productivity AI is a lightweight workplace assistant for drafting emails, summarizing meetings,
            planning tasks, and quick research. It uses short prompts, response caching, and token caps to
            stay efficient and low-cost.
          </p>
          <p>Built with React, TanStack Start, Tailwind CSS, and the Lovable AI Gateway.</p>
        </CardContent>
      </Card>

      <AIDisclaimer />
    </div>
  );
}
