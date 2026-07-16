# Ephemeral AI Assistant — Plan

A single-page app with three AI tools (Email Generator, Meeting Notes Summarizer, Research Assistant) that runs fully client-side. No accounts, no server storage, no telemetry. The user supplies their own OpenAI-compatible API key which lives in memory (or opt-in `localStorage`).

## Scope

**In:** UI, prompt templates, client-side AI calls with user's key, ephemeral session state, optional local drafts, export (copy / download MD / download PDF), clear-session, responsible-AI copy.

**Out (explicitly):** Auth, database, server logging, Lovable Cloud/AI Gateway, OAuth integrations to Slack/Gmail/Asana (deferred — export via copy/download only in v1), server-side URL fetching, telemetry.

## Routes (TanStack Start)

- `/` — Landing with ephemeral-mode notice, tool picker, API-key setup, three tool cards.
- `/email` — Smart Email Generator.
- `/meeting` — Meeting Notes Summarizer.
- `/research` — Research Assistant.
- `/settings` — API key management, local-draft toggle, responsible-AI text, clear-session.

Each route gets its own `head()` with unique title/description/OG tags. Root shell keeps the ephemeral badge in header + one-line responsible-AI footer.

## Core UX

- First-run modal: ephemeral-mode explanation + "Enter API key" field (in-memory by default, "Save key in this browser" opt-in checkbox).
- Persistent header badge: "Ephemeral session — no account".
- Footer: "Ephemeral mode — data stays on your device by default. AI outputs can be incorrect; verify before sharing."
- Every tool page: input form → Generate → editable output → action row (Copy, Download MD, Download PDF, Save local template [if opt-in]).
- Settings: API-key field with show/hide + remove; toggle "Allow saving drafts to this device (24h expiry)"; "Clear session" button with confirm.
- Error states: invalid key, quota/rate-limit, CORS fetch failure — each with the microcopy from the spec.

## Client-Side Architecture

- **State:** React state + a small Zustand (or context) store for API key + session outputs, all in memory.
- **Optional persistence:** thin `localStorage` wrapper gated by consent flag; stores drafts with timestamp; auto-purges entries older than 24h on load; "Clear session" wipes it.
- **AI calls:** `fetch` directly from the browser to `https://api.openai.com/v1/chat/completions` (or user-selected compatible base URL in Settings) using the in-memory key. No proxy, no server function. Handle 401 / 429 / network with the specified microcopy.
- **PDF export:** `jspdf` (pure client). MD export = `Blob` download. Copy = `navigator.clipboard`.
- **STT / URL fetch:** Not in v1. Meeting tool accepts pasted transcript; Research tool accepts pasted text (URL field shows CORS notice asking user to paste content). Flagged as v2.

## Prompt Templates

Embed the three system+user templates from the spec verbatim in a `src/lib/prompts.ts` module, exposed as pure functions that interpolate form values (`RecipientName`, `Tone`, `Length`, `ContextBullets`, `Transcript`, `Input`). Templates viewable/editable in Settings → Prompts (edits kept in memory unless local-draft storage enabled).

## Design

Clean, minimal, trust-forward (this is a privacy-first app). Neutral palette, one accent color, generous whitespace, clear "ephemeral" visual language (subtle dotted borders on session surfaces, badge chip in header). Semantic tokens defined in `src/styles.css` — no hardcoded colors in components. Will confirm palette/typography direction after plan approval if you'd like design options.

## File Plan

```text
src/
  routes/
    __root.tsx         # header badge, footer, ephemeral notice
    index.tsx          # landing + tool picker + first-run key modal
    email.tsx
    meeting.tsx
    research.tsx
    settings.tsx
  components/
    ApiKeyGate.tsx     # blocks tools until key present
    EphemeralBadge.tsx
    OutputActions.tsx  # copy / download md / download pdf
    ToolShell.tsx      # shared form+output layout
  lib/
    prompts.ts         # 3 prompt templates
    ai-client.ts       # fetch wrapper, error mapping
    session-store.ts   # zustand: key, outputs, consent flags
    local-drafts.ts    # opt-in localStorage w/ 24h expiry
    pdf.ts             # jspdf helper
```

## Dependencies to Add

`zustand`, `jspdf`. (Everything else — React, TanStack Start, Tailwind, shadcn primitives — is in the template.)

## Out of Scope for v1 (call out to user)

- Browser STT (Web Speech API) for the Meeting tool
- Client-side URL fetching for Research tool
- OAuth send-to-Slack/Gmail/Asana
- Prompt editing UI (templates ship read-only in v1; edit-in-Settings if you want it now)

Confirm and I'll build, or tell me to fold any v2 items into v1.
