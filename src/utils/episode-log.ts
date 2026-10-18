import { STORAGE_KEYS } from "@/utils/storage-keys";

// Timestamped log of episode marks ("tandai ditonton"), which progress
// entries alone cannot provide — they only keep the last updatedAt. Powers
// the weekly goal ring on /stats.
interface EpisodeMark {
  slug: string;
  episode: number;
  at: number;
}

const STORAGE_KEY = STORAGE_KEYS.episodeLog;
const EVENT_NAME = "kokunime:episode-log";
const MAX_MARKS = 3000;

const getStorage = () => (typeof window !== "undefined" ? window.localStorage : null);

const EMPTY_MARKS: EpisodeMark[] = [];
let cachedList: EpisodeMark[] = EMPTY_MARKS;
let lastRawData: string | null = null;

const sanitizeMark = (raw: unknown): EpisodeMark | null => {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<EpisodeMark>;
  if (typeof candidate.slug !== "string" || !candidate.slug) return null;
  if (typeof candidate.episode !== "number" || !Number.isFinite(candidate.episode)) return null;
  return {
    slug: candidate.slug,
    episode: Math.floor(candidate.episode),
    at: typeof candidate.at === "number" && Number.isFinite(candidate.at) ? candidate.at : Date.now(),
  };
};

export const getEpisodeMarks = (): EpisodeMark[] => {
  const storage = getStorage();
  if (!storage) return EMPTY_MARKS;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === lastRawData) return cachedList;
    lastRawData = raw;
    if (!raw) {
      cachedList = EMPTY_MARKS;
      return cachedList;
    }
    const parsed = JSON.parse(raw) as unknown;
    cachedList = Array.isArray(parsed)
      ? parsed.map(sanitizeMark).filter((mark): mark is EpisodeMark => mark !== null)
      : EMPTY_MARKS;
    return cachedList;
  } catch {
    return EMPTY_MARKS;
  }
};

const persist = (list: EpisodeMark[]): void => {
  const storage = getStorage();
  if (!storage) return;
  try {
    const trimmed = list.slice(-MAX_MARKS);
    const serialized = JSON.stringify(trimmed);
    storage.setItem(STORAGE_KEY, serialized);
    lastRawData = serialized;
    cachedList = trimmed;
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {}
};

export const recordEpisodeMark = (slug: string, episode: number): void => {
  if (!slug || !Number.isFinite(episode) || episode <= 0) return;
  persist([...getEpisodeMarks(), { slug, episode: Math.floor(episode), at: Date.now() }]);
};

// Unmarking removes the most recent matching entry so the weekly count
// tracks the real state as closely as a log can.
export const removeEpisodeMark = (slug: string, episode: number): void => {
  if (!slug || !Number.isFinite(episode)) return;
  const list = [...getEpisodeMarks()];
  for (let index = list.length - 1; index >= 0; index--) {
    const mark = list[index];
    if (mark && mark.slug === slug && mark.episode === Math.floor(episode)) {
      list.splice(index, 1);
      break;
    }
  }
  persist(list);
};

export const countMarksSince = (timestamp: number): number =>
  getEpisodeMarks().filter((mark) => mark.at >= timestamp).length;

// Monday 00:00 local time — the start of the current ISO week.
export const startOfWeek = (now = Date.now()): number => {
  const date = new Date(now);
  const day = (date.getDay() + 6) % 7; // Monday = 0
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day);
  return date.getTime();
};

export const subscribeEpisodeMarks = (listener: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  const handleEvent = () => {
    getEpisodeMarks();
    listener();
  };
  window.addEventListener(EVENT_NAME, handleEvent);
  window.addEventListener("storage", handleEvent);
  return () => {
    window.removeEventListener(EVENT_NAME, handleEvent);
    window.removeEventListener("storage", handleEvent);
  };
};
