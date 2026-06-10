import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { loadSettings, saveSettings, defaultSettings, type Settings } from "@/lib/storage";
import { applyTheme } from "@/components/theme-toggle";
import { toast } from "sonner";
import { AIDisclaimer } from "@/components/ai-disclaimer";
import { PageHero } from "@/components/page-hero";
import { Settings as SettingsIcon, Trash2, Cpu, Zap, Moon } from "lucide-react";

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
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <PageHero
        icon={<SettingsIcon className="h-6 w-6" />}
        title="Settings"
        subtitle="Customize your AI experience and manage local data."
        badge="Preferences"
      />

      <SettingCard icon={<Moon className="h-4 w-4" />} title="Appearance" description="Switch between light and dark themes.">
        <div className="flex items-center justify-between">
          <Label>Dark mode</Label>
          <Switch checked={s.theme === "dark"} onCheckedChange={(v) => update("theme", v ? "dark" : "light")} />
        </div>
      </SettingCard>

      <SettingCard icon={<Cpu className="h-4 w-4" />} title="AI model" description="Choose the model used by all AI features.">
        <Select value={s.model} onValueChange={(v) => update("model", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {MODELS.map((m) => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </SettingCard>

      <SettingCard icon={<Zap className="h-4 w-4" />} title="Token-saving mode" description="Caps responses at ~400 tokens to reduce cost.">
        <div className="flex items-center justify-between">
          <Label>Enabled</Label>
          <Switch checked={s.tokenSaver} onCheckedChange={(v) => update("tokenSaver", v)} />
        </div>
      </SettingCard>

      <SettingCard icon={<Trash2 className="h-4 w-4" />} title="Local data" description="History is stored only in your browser.">
        <Button variant="outline" onClick={clearHistory} className="rounded-full">
          <Trash2 className="mr-2 h-4 w-4" /> Clear local history
        </Button>
      </SettingCard>

      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
        <h3 className="text-sm font-semibold">About Productivity AI</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          A lightweight workplace assistant for emails, meetings, planning, and research. Built with short
          prompts, response caching, and token caps to stay efficient and low-cost.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Built with React, TanStack Start, Tailwind CSS, and the Lovable AI Gateway.
        </p>
      </div>

      <AIDisclaimer />
    </div>
  );
}

function SettingCard({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-bg-soft text-primary">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
