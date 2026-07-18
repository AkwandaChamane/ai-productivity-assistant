import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ephemeral AI — Private, in-browser AI tools" },
      {
        name: "description",
        content:
          "Three focused AI tools that run in your browser: email generator, meeting notes summarizer, research assistant. No accounts, no server storage.",
      },
    ],
  }),
  component: Index,
});

const tools = [
  {
    to: "/email" as const,
    title: "Smart Email Generator",
    desc: "Draft formal, friendly, or persuasive emails with the right tone and length.",
  },
  {
    to: "/meeting" as const,
    title: "Meeting Notes Summarizer",
    desc: "Paste a transcript, get TL;DR, decisions, action items, and open questions.",
  },
  {
    to: "/research" as const,
    title: "AI Research Assistant",
    desc: "Turn articles or notes into an executive summary, findings, and recommendations.",
  },
];

function Index() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          AI tools that never leave your browser.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Works out of the box with built-in Lovable AI — no signup, no key. Prefer full ephemeral
          mode? Bring your own OpenAI-compatible key in Settings and calls go straight from your
          browser to your provider.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/email"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-baby-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Try the email generator
          </Link>
          <Link
            to="/settings"
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-baby-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Settings & API key
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-baby-blue/50 focus-visible:border-baby-blue/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-baby-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <h2 className="text-base font-semibold group-hover:text-baby-blue group-focus-visible:text-baby-blue">{t.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
          </Link>
        ))}
      </section>

      <section className="rounded-lg border border-dashed border-input bg-accent/30 p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">How ephemeral mode works.</strong>{" "}
        Your API key stays in memory (or in this browser only, if you opt in). Prompts and outputs
        never touch our servers. You can clear the entire session at any time from Settings.
      </section>
    </div>
  );
}
