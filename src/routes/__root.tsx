import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { EphemeralBadge } from "../components/EphemeralBadge";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-baby-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong.</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-baby-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ephemeral AI — Client-side email, meeting & research assistant" },
      {
        name: "description",
        content:
          "Privacy-first AI tools that run entirely in your browser. No accounts, no server logs. Bring your own API key.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Ephemeral AI Assistant" },
      {
        property: "og:description",
        content: "Client-side AI email, meeting notes, and research tools. No accounts, no logs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <header className="border-b border-border bg-header text-primary-foreground">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
            <Link to="/" className="flex items-center gap-2 rounded-sm text-sm font-semibold tracking-tight transition-colors duration-200 hover:text-baby-red focus-visible:text-baby-red focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-baby-red focus-visible:ring-offset-2 focus-visible:ring-offset-header">
              <span className="inline-block h-2 w-2 rounded-full bg-primary-foreground" />
              Ephemeral AI
            </Link>
            <nav className="hidden gap-4 text-sm text-primary-foreground/80 sm:flex [&_a]:rounded-sm [&_a]:transition-colors [&_a]:duration-200 [&_a]:hover:text-baby-red [&_a]:focus-visible:text-baby-red [&_a]:focus-visible:outline-none [&_a]:focus-visible:ring-3 [&_a]:focus-visible:ring-baby-red [&_a]:focus-visible:ring-offset-2 [&_a]:focus-visible:ring-offset-header">
              <Link to="/email" activeProps={{ className: "text-baby-red font-medium transition-colors duration-200" }}>Email</Link>
              <Link to="/meeting" activeProps={{ className: "text-baby-red font-medium transition-colors duration-200" }}>Meeting</Link>
              <Link to="/research" activeProps={{ className: "text-baby-red font-medium transition-colors duration-200" }}>Research</Link>
              <Link to="/settings" activeProps={{ className: "text-baby-red font-medium transition-colors duration-200" }}>Settings</Link>
            </nav>
            <EphemeralBadge />
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          <Outlet />
        </main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-muted-foreground">
            Ephemeral mode — data stays on your device by default. AI outputs can be incorrect; verify before sharing.
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}
