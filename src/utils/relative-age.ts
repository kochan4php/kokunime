export type AgeBucket = "today" | "yesterday" | "recent" | "older" | "unknown";

export interface RelativeAge {
  minutesAgo?: number;
  bucket: AgeBucket;
}

const NUMBER_WORDS: Record<string, number> = {
  satu: 1,
  dua: 2,
  tiga: 3,
  empat: 4,
  lima: 5,
  enam: 6,
  tujuh: 7,
  delapan: 8,
  sembilan: 9,
  sepuluh: 10,
};

// Upstream release strings are relative ("5 menit lalu", "2 jam lalu", "3 hari
// lalu", "minggu lalu") — bucket them for the /update timeline.
export const parseRelativeAge = (raw?: string | null): RelativeAge => {
  const text = raw?.trim().toLowerCase() ?? "";
  if (!text) return { bucket: "unknown" };
  // Upstream's dominant format: "Released on 5:00 pm" — a same-day release
  // time with no date component.
  if (/^released on \d{1,2}:\d{2}\s*(am|pm)/.test(text)) return { bucket: "today" };
  if (/baru saja|detik|just now/.test(text)) return { minutesAgo: 0, bucket: "today" };
  if (/kemarin|yesterday/.test(text)) return { bucket: "yesterday" };

  const match = text.match(/(\d[\d.,]*|[a-z]+)\s*(menit|minute|jam|hour|hari|day|minggu|week|bulan|month|tahun|year)/);
  if (!match?.[1] || !match[2]) return { bucket: "unknown" };

  const value = Number(match[1]) || NUMBER_WORDS[match[1]] || 0;
  const unit = match[2];

  if (/menit|minute/.test(unit)) return { minutesAgo: value, bucket: "today" };
  if (/jam|hour/.test(unit)) {
    const minutesAgo = value * 60;
    return { minutesAgo, bucket: minutesAgo >= 24 * 60 ? "yesterday" : "today" };
  }
  if (/hari|day/.test(unit))
    return { minutesAgo: value * 24 * 60, bucket: value <= 1 ? "yesterday" : value <= 7 ? "recent" : "older" };
  if (/minggu|week/.test(unit)) return { bucket: value <= 1 ? "recent" : "older" };
  if (/bulan|month/.test(unit)) return { bucket: value <= 1 ? "recent" : "older" };
  return { bucket: "older" }; // tahun / year
};
