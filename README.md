
AI Workplace Productivity Assistant
Project Overview
AI Workplace Productivity Assistant is a modern, responsive web application that helps professionals automate workplace tasks using AI — without accounts, registration, or server-side logging. The app runs in ephemeral mode: AI requests are made from the user's browser using their own API key (free account), and no persistent server-side database is used by default. The UI is clean, SaaS-style, using a light-blue and white color palette and optimized for desktop, tablet, and mobile.

Features Implemented
Smart Email Generator
Generate professional emails with selectable tones: Formal, Friendly, Persuasive
Subject suggestions, editable rich-text output, placeholders (e.g., {{RecipientName}})
Tone slider, copy/download/export, save local templates (optional, opt-in)
Meeting Notes Summarizer
Paste transcript or capture audio via browser STT (client-side)
Extract TL;DR, Key Decisions, Action Items (assignee, suggested deadline), Open Questions, Next Steps
Editable extracted items and export options (PDF/Markdown, user-authorized integrations)
AI Research Assistant
Paste article text or URLs (client-side fetch where permitted)
Produce executive summary, key findings with evidence, actionable recommendations, confidence level, and sources
Editable outputs and export/share options
App UX & Privacy
Modern dashboard UI with sidebar navigation and responsive layouts
Ephemeral-first flows: no registration, session badge, clear "Clear session" action
Structured prompt templates exposed and editable for advanced users
Responsible AI disclaimer, PII redaction option, and human-approval toggle for high-impact actions
Technologies & Tools Used
Frontend framework: React / Vue / Svelte (implementation choice)
Styling: Tailwind CSS / CSS Modules / Styled Components (implementation choice)
AI: Client-side API calls to user-chosen AI provider (user supplies API key)
Transcription (optional): Web Speech API (browser STT) or third-party STT via user account
Build & Dev Tools: Node.js, npm / yarn, Vite / Webpack / Next.js (implementation choice)
Exports & Integrations: Client-side export (PDF/Markdown) and OAuth-initiated direct integrations (Gmail/Outlook/Slack/Trello/Asana)
Local storage: optional localStorage usage only with explicit user opt-in
Setup Instructions
Clone the repository

git clone
cd
Install dependencies

npm install
or
yarn install
Configure environment (client-side / ephemeral)

The app is designed to run without server-side accounts or a database by default.
Users provide their own AI API key in the browser at runtime. Do NOT commit any secrets.
For development only, you may pre-fill a key locally via a .env file — never commit it.
Start the dev server

npm run dev
or
yarn dev
Open the app in your browser (e.g., http://localhost:3000)
Using the app (ephemeral mode)

On first load the app shows an ephemeral-mode notice.
Paste or enter your AI API key in the browser prompt component. Keys are used in-memory by default; enabling "Save Key in Browser" requires explicit opt-in.
Create emails, summarize meetings, or run research queries. Inputs and outputs remain local unless explicitly exported or shared.
Use "Clear session" to wipe all in-memory and optionally stored local data.
Production build

npm run build
or
yarn build
Host static assets on any static host (Netlify, Vercel, GitHub Pages, S3 + CloudFront). Avoid server-side endpoints unless intentionally added and documented.
Security & Privacy Notes
Ephemeral-first: no server-side logging or database by default.
API keys must never be committed to the repo. If local key storage is enabled, inform users and provide expiry/clear options.
Prefer client-side STT and client-initiated fetches. If adding server proxying, disclose what is uploaded and obtain explicit consent.
Responsible AI: AI outputs may be incorrect or biased — always verify before sending or acting on generated content.
Contributing
Contributions welcome. Open issues for feature requests or bugs. If you add server-side components, document data handling changes and update the README privacy section.

License
Add your preferred license file (e.g., MIT)
