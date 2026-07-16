import type { ChatMessage } from "./prompts";
import { lovableChat } from "./ai.functions";

export type AiConfig = {
  provider: "lovable" | "custom";
  apiKey: string;
  baseUrl: string;
  model: string;
};

export class AiError extends Error {
  constructor(
    message: string,
    public kind: "auth" | "rate" | "credits" | "network" | "unknown",
  ) {
    super(message);
  }
}

export async function chatCompletion(
  cfg: AiConfig,
  messages: ChatMessage[],
): Promise<string> {
  if (cfg.provider === "lovable") {
    try {
      const { content } = await lovableChat({ data: { messages } });
      return content;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("RATE_LIMIT"))
        throw new AiError("Rate limit reached on the built-in AI. Wait a moment and try again.", "rate");
      if (msg.includes("CREDITS_EXHAUSTED"))
        throw new AiError(
          "Built-in AI credits exhausted for this workspace. Add credits in Lovable, or add your own API key in Settings.",
          "credits",
        );
      throw new AiError(`AI request failed: ${msg}`, "unknown");
    }
  }

  // Custom provider: direct browser fetch with user's key
  if (!cfg.apiKey) {
    throw new AiError("No API key set. Add one in Settings or switch to the built-in AI.", "auth");
  }

  let res: Response;
  try {
    res = await fetch(`${cfg.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({ model: cfg.model, messages, temperature: 0.7 }),
    });
  } catch {
    throw new AiError(
      "Network error — check your connection or CORS settings on the provider.",
      "network",
    );
  }

  if (res.status === 401)
    throw new AiError("Invalid API key. Check your key in Settings.", "auth");
  if (res.status === 429)
    throw new AiError("Rate-limited or quota exceeded on your provider.", "rate");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new AiError(`AI request failed (${res.status}): ${text.slice(0, 200)}`, "unknown");
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return json.choices?.[0]?.message?.content ?? "";
}
