import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { runAI } from "@/lib/api/ai.functions";
import { loadSettings, cacheKey, getCached, setCached, addHistory } from "@/lib/storage";
import type { Feature } from "@/lib/ai-prompts";

export function useAI() {
  const fn = useServerFn(runAI);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  async function run(opts: {
    feature: Exclude<Feature, never>;
    userPrompt: string;
    historyTitle?: string;
    skipCache?: boolean;
  }) {
    if (!opts.userPrompt.trim()) {
      toast.error("Please provide input first.");
      return;
    }
    const settings = loadSettings();
    const k = cacheKey(opts.feature, opts.userPrompt);
    if (!opts.skipCache) {
      const hit = getCached(k);
      if (hit) {
        setOutput(hit);
        toast.success("Loaded from cache (no API call)");
        return;
      }
    }
    setLoading(true);
    try {
      const { content } = await fn({
        data: {
          feature: opts.feature,
          userPrompt: opts.userPrompt,
          model: settings.model,
          tokenSaver: settings.tokenSaver,
        },
      });
      setOutput(content);
      setCached(k, content);
      addHistory({
        feature: opts.feature,
        title: opts.historyTitle || opts.userPrompt.slice(0, 60),
        input: opts.userPrompt,
        output: content,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI request failed");
    } finally {
      setLoading(false);
    }
  }

  return { run, loading, output, setOutput };
}
