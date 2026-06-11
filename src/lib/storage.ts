// Lightweight localStorage helpers for settings + history (no DB needed).

export type Settings = {
  theme: "light" | "dark";
  model: string;
  tokenSaver: boolean;
};

const SETTINGS_KEY = "pai.settings";
const HISTORY_KEY = "pai.history";

export const defaultSettings: Settings = {
  theme: "dark",
  model: "google/gemini-3-flash-preview",
  tokenSaver: true,
};

export function loadSettings(): Settings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(s: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export type HistoryItem = {
  id: string;
  feature: "email" | "meeting" | "tasks" | "research" | "chat";
  title: string;
  input: string;
  output: string;
  favorite?: boolean;
  createdAt: number;
};

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 50)));
}

export function addHistory(item: Omit<HistoryItem, "id" | "createdAt">) {
  const items = loadHistory();
  const next: HistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  items.unshift(next);
  saveHistory(items);
  return next;
}

export function toggleFavorite(id: string) {
  const items = loadHistory().map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i));
  saveHistory(items);
}

export function deleteHistory(id: string) {
  saveHistory(loadHistory().filter((i) => i.id !== id));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

const cache = new Map<string, string>();
export function cacheKey(feature: string, input: string) {
  return `${feature}::${input}`;
}
export function getCached(k: string) {
  return cache.get(k);
}
export function setCached(k: string, v: string) {
  cache.set(k, v);
}
