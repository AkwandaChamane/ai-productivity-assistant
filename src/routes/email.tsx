import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ApiKeyGate } from "@/components/ApiKeyGate";
import { OutputActions } from "@/components/OutputActions";
import { useSession } from "@/lib/session-store";
import { emailPrompt, type EmailInput } from "@/lib/prompts";
import { AiError, chatCompletion } from "@/lib/ai-client";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Ephemeral AI" },
      {
        name: "description",
        content: "Generate formal, friendly, or persuasive emails privately in your browser.",
      },
    ],
  }),
  component: () => (
    <ApiKeyGate>
      <EmailTool />
    </ApiKeyGate>
  ),
});

function EmailTool() {
  const { apiKey, baseUrl, model } = useSession();
  const [form, setForm] = useState<EmailInput>({
    recipientName: "",
    purpose: "",
    tone: "Friendly",
    length: "Medium",
    contextBullets: "",
  });
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
        { apiKey, baseUrl, model },
        emailPrompt(form),
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
        <h1 className="text-3xl font-semibold tracking-tight">Smart Email Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the context; output is editable. Nothing is stored on our servers.
        </p>
      </header>

      <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Recipient name (optional)">
            <input
              value={form.recipientName}
              onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Purpose">
            <input
              required
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              placeholder="e.g. Follow up on proposal"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Tone">
            <select
              value={form.tone}
              onChange={(e) => setForm({ ...form, tone: e.target.value as EmailInput["tone"] })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option>Formal</option>
              <option>Friendly</option>
              <option>Persuasive</option>
            </select>
          </Field>
          <Field label="Length">
            <select
              value={form.length}
              onChange={(e) => setForm({ ...form, length: e.target.value as EmailInput["length"] })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option>Short</option>
              <option>Medium</option>
              <option>Long</option>
            </select>
          </Field>
        </div>
        <Field label="Context bullets">
          <textarea
            required
            value={form.contextBullets}
            onChange={(e) => setForm({ ...form, contextBullets: e.target.value })}
            rows={5}
            placeholder="- Key point 1&#10;- Key point 2"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </Field>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate email"}
        </button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>

      {output && (
        <section className="space-y-3 rounded-lg border border-dashed border-input bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Draft</h2>
            <OutputActions tool="email" content={output} filenameBase="email-draft" />
          </div>
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            rows={16}
            className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
          />
        </section>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
