import type { ChatMessage } from "./prompts";

export type AiConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

export class AiError extends Error {
  constructor(
    message: string,
    public kind: "auth" | "rate" | "network" | "unknown",
  ) {
    super(message);
  }
}

export async function chatCompletion(
  cfg: AiConfig,
  messages: ChatMessage[],
): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${cfg.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: cfg.model,
        messages,
        temperature: 0.7,
      }),
    });
  } catch (e) {
    throw new AiError(
      "Network error — check your connection or CORS settings on the provider.",
      "network",
    );
  }

  if (res.status === 401) {
    throw new AiError(
      "AI request failed: invalid key. Check your API key in Settings.",
      "auth",
    );
  }
  if (res.status === 429) {
    throw new AiError(
      "AI request failed: quota exceeded or rate-limited. Try a different key or shorten prompt.",
      "rate",
    );
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new AiError(`AI request failed (${res.status}): ${text.slice(0, 200)}`, "unknown");
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return json.choices?.[0]?.message?.content ?? "";
}
