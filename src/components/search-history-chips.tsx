"use client";

import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import { STORAGE_KEYS } from "@/utils/storage-keys";

const RECENT_KEY = STORAGE_KEYS.recentSearches;
const MAX_RECENT = 8;

const getRecent = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? list.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
};

const writeRecent = (list: string[]): void => {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // Storage full/blocked — chips just do not update.
  }
};

// Search-history chips under the results title: shows recent queries, records
// the current one, and allows removing single entries or clearing all.
const SearchHistoryChips = ({ query }: { query: string }): JSX.Element | null => {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    if (query.trim()) {
      const next = [query, ...getRecent().filter((item) => item.toLowerCase() !== query.toLowerCase())].slice(
        0,
        MAX_RECENT,
      );
      writeRecent(next);
    }
    setRecent(getRecent());
  }, [query]);

  const removeChip = (value: string): void => {
    const next = getRecent().filter((item) => item !== value);
    writeRecent(next);
    setRecent(next);
  };

  const clearAll = (): void => {
    writeRecent([]);
    setRecent([]);
  };

  const visible = recent.filter((item) => item.toLowerCase() !== query.trim().toLowerCase());
  if (visible.length === 0) return null;

  return (
    <div role="group" className="mt-4 flex flex-wrap items-center gap-1.5 print:hidden" aria-label="Pencarian terakhir">
      <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">Terakhir:</span>
      {visible.map((item) => (
        <span
          key={item}
          className="inline-flex items-center overflow-hidden rounded-sm border-2 border-border bg-surface shadow-[2px_2px_0_0_var(--border)]"
        >
          <Link
            href={`/search/${encodeURIComponent(item)}`}
            className="px-2 py-0.5 font-mono text-[11px] text-ink-muted transition-colors hover:text-ink"
          >
            {item}
          </Link>
          <button
            type="button"
            onClick={() => removeChip(item)}
            aria-label={`Hapus ${item} dari riwayat pencarian`}
            className="border-l-2 border-border px-1.5 py-0.5 font-mono text-[11px] text-ink-muted transition-colors hover:bg-nb-red hover:text-nb-ink cursor-pointer"
          >
            ✕
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={clearAll}
        className="font-mono text-[10px] text-ink-muted underline decoration-dotted transition-colors hover:text-ink cursor-pointer"
      >
        Bersihkan
      </button>
    </div>
  );
};

export default SearchHistoryChips;
