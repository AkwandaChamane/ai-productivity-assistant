import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useSession } from "@/lib/session-store";

export function ApiKeyGate({ children }: { children: ReactNode }) {
  const { provider, apiKey, hydrated, hydrate } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    hydrate();
    setMounted(true);
  }, [hydrate]);

  if (!mounted || !hydrated) return null;

  // Lovable built-in AI needs no user key.
  if (provider === "lovable") return <>{children}</>;

  if (!apiKey) {
    return (
      <div className="rounded-lg border border-dashed border-input bg-card p-6">
        <h2 className="text-lg font-semibold">API key required</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You're on the custom-provider mode. Add your key or switch to the built-in AI in Settings.
        </p>
        <Link
          to="/settings"
          className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Open Settings
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
