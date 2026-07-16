import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useSession } from "@/lib/session-store";

export function ApiKeyGate({ children }: { children: ReactNode }) {
  const { apiKey, hydrated, hydrate } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  if (!mounted || !hydrated) return null;

  if (!apiKey) {
    return (
      <div className="rounded-lg border border-dashed border-input bg-card p-6">
        <h2 className="text-lg font-semibold">API key required</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This tool calls the AI provider directly from your browser using your own key.
          Nothing is sent to our servers.
        </p>
        <Link
          to="/settings"
          className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Add your key in Settings
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
