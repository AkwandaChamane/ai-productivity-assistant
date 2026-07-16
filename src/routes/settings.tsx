import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/session-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Ephemeral AI" },
      { name: "description", content: "Manage your API key and local storage preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const s = useSession();
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [draftKey, setDraftKey] = useState("");
  const [persist, setPersist] = useState(false);

  useEffect(() => {
    s.hydrate();
    setMounted(true);
  }, [s]);

  useEffect(() => {
    if (mounted) {
      setDraftKey(s.apiKey);
      setPersist(s.persistKey);
    }
  }, [mounted, s.apiKey, s.persistKey]);

  if (!mounted) return null;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything here lives in your browser only.
        </p>
      </div>

      <section className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div>
          <h2 className="text-lg font-semibold">API key</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Used only in this browser session. Not transmitted to our servers.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="apikey">API key</label>
          <div className="flex gap-2">
            <input
              id="apikey"
              type={show ? "text" : "password"}
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="rounded-md border border-input px-3 py-2 text-sm hover:bg-accent"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={persist}
            onChange={(e) => setPersist(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            <span className="font-medium">Save key in this browser</span>
            <span className="block text-muted-foreground">
              Stored in localStorage. Anyone with access to this browser could read it. Leave off to keep it in memory only.
            </span>
          </span>
        </label>

        <div className="flex gap-2">
          <button
            onClick={() => s.setApiKey(draftKey.trim(), persist)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Save key
          </button>
          <button
            onClick={() => {
              setDraftKey("");
              s.setApiKey("", false);
              setPersist(false);
            }}
            className="rounded-md border border-input px-4 py-2 text-sm hover:bg-accent"
          >
            Remove key
          </button>
        </div>

        <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="baseurl">Provider base URL</label>
            <input
              id="baseurl"
              value={s.baseUrl}
              onChange={(e) => s.setBaseUrl(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <p className="text-xs text-muted-foreground">
              OpenAI-compatible. Defaults to OpenAI.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="model">Model</label>
            <input
              id="model"
              value={s.model}
              onChange={(e) => s.setModel(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Local drafts</h2>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={s.allowDrafts}
            onChange={(e) => s.setAllowDrafts(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            <span className="font-medium">Allow saving drafts to this device</span>
            <span className="block text-muted-foreground">
              Drafts are stored in localStorage and auto-purged after 24 hours.
            </span>
          </span>
        </label>
      </section>

      <section className="space-y-3 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Responsible AI</h2>
        <p className="text-sm text-muted-foreground">
          This app operates in Ephemeral Mode: We do not store your inputs or outputs on a server
          by default. API keys you provide are used only in your browser and are not transmitted
          to our servers. If you enable "Allow saving drafts", content will be saved to your
          device's storage until you clear it or the 24-hour expiration passes. AI outputs can be
          inaccurate or biased — verify before acting. Actions that send outputs to external
          services occur via your direct authorization and may be stored by those services.
        </p>
      </section>

      <section className="space-y-3 rounded-lg border border-destructive/30 bg-card p-6">
        <h2 className="text-lg font-semibold">Clear session</h2>
        <p className="text-sm text-muted-foreground">
          Wipe key, preferences, and all local drafts. This cannot be undone.
        </p>
        <button
          onClick={() => {
            if (confirm("This will remove all AI outputs and local drafts. This action cannot be undone locally.")) {
              s.clearAll();
              setDraftKey("");
              setPersist(false);
            }
          }}
          className="rounded-md border border-destructive bg-background px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
        >
          Clear session
        </button>
      </section>
    </div>
  );
}
