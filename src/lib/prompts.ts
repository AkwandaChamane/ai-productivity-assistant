export type EmailInput = {
  recipientName: string;
  purpose: string;
  tone: "Formal" | "Friendly" | "Persuasive";
  length: "Short" | "Medium" | "Long";
  contextBullets: string;
};

export type MeetingInput = {
  transcript: string;
};

export type ResearchInput = {
  input: string;
};

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export function emailPrompt(v: EmailInput): ChatMessage[] {
  return [
    {
      role: "system",
      content: "You are a professional workplace writing assistant.",
    },
    {
      role: "user",
      content: `Write an email to "${v.recipientName || "{{RecipientName}}"}" with purpose "${v.purpose}". Tone: ${v.tone}. Include these points: ${v.contextBullets}. Subject: provide one concise suggestion. Keep body length: ${v.length}. Use placeholders like {{RecipientName}} where appropriate. End with a clear call-to-action. Mark uncertain facts with [VERIFY].`,
    },
  ];
}

export function meetingPrompt(v: MeetingInput): ChatMessage[] {
  return [
    {
      role: "system",
      content:
        "You are an objective meeting summarizer trained to extract clear decisions and assignable tasks.",
    },
    {
      role: "user",
      content: `Given the transcript/text below, produce:

- TL;DR (1–2 sentences)
- Key Decisions (list)
- Action Items — for each: task description, suggested assignee (if mentioned), suggested deadline (if mentioned or inferred; if inferred mark with [INFERRED]), priority
- Open Questions
- Suggested next steps

Annotate any content that seems uncertain with [VERIFY]. Keep outputs concise and use a table-like bullet format.

Transcript:
${v.transcript}`,
    },
  ];
}

export function researchPrompt(v: ResearchInput): ChatMessage[] {
  return [
    { role: "system", content: "You are a concise research analyst." },
    {
      role: "user",
      content: `Analyze the following content/URL(s): ${v.input}. Produce:

- Executive summary (2–4 sentences)
- Top findings (3–6 bullets) with one-sentence supporting evidence for each
- Top 3 actionable recommendations with suggested owner and timeframe
- Confidence level (High/Medium/Low) with one-line rationale
- Sources cited (list URLs or paste excerpts)

If information is missing, note what additional data is needed and mark uncertain statements with [VERIFY].`,
    },
  ];
}
