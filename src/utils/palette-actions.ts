import { fuzzyScore } from "@/utils/fuzzy";

export interface PaletteAction {
  id: string;
  label: string;
  hint: string;
  /** Navigation target; empty for actions handled client-side via kind. */
  href: string;
  /** Runs against the current page instead of navigating. */
  kind?: "copy-url" | "open-url";
}

// ">" action mode list — navigation shortcuts, no network.
const PALETTE_ACTIONS: PaletteAction[] = [
  { id: "update", label: "Update terbaru", hint: "Timeline rilis per hari", href: "/update" },
  { id: "indeks", label: "Indeks A–Z", hint: "Telusuri judul per abjad", href: "/indeks" },
  { id: "genres", label: "Daftar genre", hint: "Anime per genre", href: "/genres" },
  { id: "seasons", label: "Daftar musim", hint: "Anime per season", href: "/seasons" },
  { id: "bookmarks", label: "Anime tersimpan", hint: "Bookmark, riwayat & antrean", href: "/bookmarks" },
  { id: "stats", label: "Statistik saya", hint: "Rekap lokal perangkat", href: "/stats" },
  { id: "wrapped", label: "Wrapped tahunan", hint: "Perjalanan nonton setahun", href: "/wrapped" },
  { id: "compare", label: "Komparasi anime", hint: "Adu dua judul", href: "/compare" },
  { id: "roulette", label: "Roulette anime", hint: "Pilih acak untuk ditonton", href: "/roulette" },
  { id: "settings", label: "Pengaturan & tema", hint: "Aksen, font, data", href: "/settings" },
  { id: "api", label: "Dokumentasi API", hint: "Endpoint JSON publik", href: "/api" },
  { id: "copy-url", label: "Salin tautan halaman", hint: "URL halaman ini ke papan klip", href: "", kind: "copy-url" },
  { id: "open-url", label: "Buka di tab baru", hint: "Duplikat halaman ini", href: "", kind: "open-url" },
];

export const isActionQuery = (query: string): boolean => query.startsWith(">");

// ">" action mode: the search fallback stays pinned first, the rest is fuzzy
// filtered over label+hint with the same scorer as search.
export const buildPaletteActions = (query: string): PaletteAction[] => {
  if (!isActionQuery(query)) return [];
  const actionQuery = query.slice(1).trim().toLowerCase();
  if (!actionQuery) return PALETTE_ACTIONS;

  const ranked = PALETTE_ACTIONS.map((action) => ({
    action,
    score: fuzzyScore(actionQuery, `${action.label} ${action.hint}`),
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.action);

  return [
    {
      id: "search",
      label: `Cari “${actionQuery}”`,
      hint: "Cari di katalog",
      href: `/search/${encodeURIComponent(actionQuery)}`,
    },
    ...ranked,
  ];
};
