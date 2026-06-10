import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SYSTEM_PROMPTS, type Feature } from "../ai-prompts";

// Single shared AI call used by all features to keep architecture simple and cheap.
const InputSchema = z.object({
  feature: z.enum(["email", "meeting", "tasks", "research", "chat"]),
  userPrompt: z.string().min(1).max(8000),
  model: z.string().optional(),
  tokenSaver: z.boolean().optional(),
});

export const runAI = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const model = data.model || "google/gemini-3-flash-preview";
    const system = SYSTEM_PROMPTS[data.feature as Feature];
    const maxTokens = data.tokenSaver ? 400 : 1000;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: system },
          { role: "user", content: data.userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit exceeded. Please wait and try again.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to your workspace.");
      throw new Error(`AI error (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content ?? "";
    return { content };
  });
