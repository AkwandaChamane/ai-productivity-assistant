import { create } from "zustand";

const KEY_STORAGE = "ephemeral.apiKey";
const CONSENT_KEY = "ephemeral.saveKeyConsent";
const DRAFT_CONSENT = "ephemeral.draftsConsent";
const BASE_URL_KEY = "ephemeral.baseUrl";
const MODEL_KEY = "ephemeral.model";

type State = {
  apiKey: string;
  baseUrl: string;
  model: string;
  persistKey: boolean;
  allowDrafts: boolean;
  hydrated: boolean;
  setApiKey: (k: string, persist: boolean) => void;
  setBaseUrl: (u: string) => void;
  setModel: (m: string) => void;
  setAllowDrafts: (v: boolean) => void;
  clearAll: () => void;
  hydrate: () => void;
};

export const useSession = create<State>((set, get) => ({
  apiKey: "",
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-4o-mini",
  persistKey: false,
  allowDrafts: false,
  hydrated: false,

  hydrate: () => {
    if (typeof window === "undefined" || get().hydrated) return;
    try {
      const persist = localStorage.getItem(CONSENT_KEY) === "1";
      const key = persist ? localStorage.getItem(KEY_STORAGE) || "" : "";
      const baseUrl = localStorage.getItem(BASE_URL_KEY) || "https://api.openai.com/v1";
      const model = localStorage.getItem(MODEL_KEY) || "gpt-4o-mini";
      const allowDrafts = localStorage.getItem(DRAFT_CONSENT) === "1";
      set({ apiKey: key, persistKey: persist, baseUrl, model, allowDrafts, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },

  setApiKey: (k, persist) => {
    set({ apiKey: k, persistKey: persist });
    try {
      if (persist) {
        localStorage.setItem(CONSENT_KEY, "1");
        localStorage.setItem(KEY_STORAGE, k);
      } else {
        localStorage.removeItem(CONSENT_KEY);
        localStorage.removeItem(KEY_STORAGE);
      }
    } catch {}
  },

  setBaseUrl: (u) => {
    set({ baseUrl: u });
    try {
      localStorage.setItem(BASE_URL_KEY, u);
    } catch {}
  },

  setModel: (m) => {
    set({ model: m });
    try {
      localStorage.setItem(MODEL_KEY, m);
    } catch {}
  },

  setAllowDrafts: (v) => {
    set({ allowDrafts: v });
    try {
      if (v) localStorage.setItem(DRAFT_CONSENT, "1");
      else {
        localStorage.removeItem(DRAFT_CONSENT);
        // Purge any drafts
        Object.keys(localStorage)
          .filter((k) => k.startsWith("ephemeral.draft."))
          .forEach((k) => localStorage.removeItem(k));
      }
    } catch {}
  },

  clearAll: () => {
    set({ apiKey: "", persistKey: false, allowDrafts: false });
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith("ephemeral."))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}
  },
}));
