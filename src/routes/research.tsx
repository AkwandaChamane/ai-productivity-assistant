import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ApiKeyGate } from "@/components/ApiKeyGate";
import { OutputActions } from "@/components/OutputActions";
import { useSession } from "@/lib/session-store";
import { researchPrompt } from "@/lib/prompts";
import { AiError, chatCompletion } from "@/lib/ai-client";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Ephemeral AI" },
      {
        name: "description",
        content: "Summarize articles and get findings, recommendations, and confidence — in-browser.",
      },
    ],
  }),
  component: () => (
    <ApiKeyGate>
      <ResearchTool />
    </ApiKeyGate>
  ),
});

function ResearchTool() {
  const { provider, apiKey, baseUrl, model } = useSession();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const text = await chatCompletion(
        { provider, apiKey, baseUrl, model },
        researchPrompt({ input }),
      );
      setOutput(text);
    } catch (err) {
      setError(err instanceof AiError ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">AI Research Assistant</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste article text or notes. URL fetching from the browser is usually blocked by CORS —
          paste the content directly for best results.
        </p>
      </header>

      <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-card p-6">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Content to analyze</span>
          <textarea
            required
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            placeholder="Paste the article or notes here…"
            className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>

      {output && (
        <section className="space-y-3 rounded-lg border border-dashed border-input bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Analysis</h2>
            <OutputActions tool="research" content={output} filenameBase="research-analysis" />
          </div>
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            rows={20}
            className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
          />
        </section>
      )}
    </div>
  );
}
