const PREFIX = "ephemeral.draft.";
const TTL_MS = 24 * 60 * 60 * 1000;

type Draft = { savedAt: number; content: string };

export function purgeExpiredDrafts() {
  if (typeof window === "undefined") return;
  const now = Date.now();
  for (const k of Object.keys(localStorage)) {
    if (!k.startsWith(PREFIX)) continue;
    try {
      const v = JSON.parse(localStorage.getItem(k) || "{}") as Draft;
      if (!v.savedAt || now - v.savedAt > TTL_MS) localStorage.removeItem(k);
    } catch {
      localStorage.removeItem(k);
    }
  }
}

export function saveDraft(tool: string, content: string) {
  try {
    const key = `${PREFIX}${tool}.${Date.now()}`;
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), content }));
  } catch {}
}

export function listDrafts(tool: string): { key: string; savedAt: number; content: string }[] {
  if (typeof window === "undefined") return [];
  purgeExpiredDrafts();
  const out: { key: string; savedAt: number; content: string }[] = [];
  for (const k of Object.keys(localStorage)) {
    if (!k.startsWith(`${PREFIX}${tool}.`)) continue;
    try {
      const v = JSON.parse(localStorage.getItem(k) || "{}") as Draft;
      out.push({ key: k, savedAt: v.savedAt, content: v.content });
    } catch {}
  }
  return out.sort((a, b) => b.savedAt - a.savedAt);
}

export function removeDraft(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {}
}
