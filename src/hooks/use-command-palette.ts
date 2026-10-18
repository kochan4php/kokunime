"use client";

import { Anime } from "@/interfaces";
import { buildPaletteActions, isActionQuery, type PaletteAction } from "@/utils/palette-actions";
import { fuzzyScore } from "@/utils/fuzzy";
import { clearRecentSearches, getRecentSearches, saveRecentSearch } from "@/utils/recent-searches";
import { showToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { type FormEvent, type RefObject, useEffect, useRef, useState } from "react";

// Shared across mounts: the palette is mounted once per layout, but the cache
// survives close/reopen so repeat queries are instant.
const clientSearchCache = new Map<string, Anime[]>();

interface UseCommandPaletteResult {
  dialogRef: RefObject<HTMLDialogElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  setQuery: (value: string) => void;
  recent: string[];
  liveResults: Anime[];
  isLoading: boolean;
  isClosing: boolean;
  isActionMode: boolean;
  actions: PaletteAction[];
  openPalette: () => void;
  closePalette: () => void;
  clearHistory: () => void;
  handleSearch: (query: string) => void;
  handleFormSubmit: (e: FormEvent) => void;
  runAction: (action: PaletteAction) => void;
}

export const useCommandPalette = (): UseCommandPaletteResult => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [liveResults, setLiveResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();

  const openPalette = () => {
    setIsClosing(false);
    setRecent(getRecentSearches());
    setQuery("");
    setLiveResults([]);
    dialogRef.current?.showModal();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const closePalette = () => {
    if (isClosing || !dialogRef.current?.open) return;
    setIsClosing(true);
    setTimeout(() => {
      dialogRef.current?.close();
      setIsClosing(false);
      setQuery("");
    }, 180);
  };

  const clearHistory = () => {
    clearRecentSearches();
    setRecent([]);
  };

  const handleSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    saveRecentSearch(trimmed);
    closePalette();
    router.push(`/search/${encodeURIComponent(trimmed)}`);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isActionMode) {
      const first = actions[0];
      if (first) runAction(first);
      return;
    }
    handleSearch(query);
  };

  const isActionMode = isActionQuery(query);
  const actions = buildPaletteActions(query);

  const runAction = (action: PaletteAction) => {
    closePalette();
    if (action.kind === "copy-url") {
      navigator.clipboard
        ?.writeText(window.location.href)
        .then(() => showToast("Tautan halaman disalin"))
        .catch(() => {});
      return;
    }
    if (action.kind === "open-url") {
      window.open(window.location.href, "_blank", "noopener");
      return;
    }
    router.push(action.href);
  };

  // Keyboard shortcut: Ctrl+K or / to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) {
          closePalette();
        } else {
          openPalette();
        }
      } else if (e.key === "/" && !isInput && !dialogRef.current?.open) {
        e.preventDefault();
        openPalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced search for live results with instant in-memory client cache
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (query.startsWith(">") || trimmed.length < 2) {
      setLiveResults([]);
      setIsLoading(false);
      return;
    }

    if (clientSearchCache.has(trimmed)) {
      setLiveResults(clientSearchCache.get(trimmed) || []);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        const results = (data.results || []) as Anime[];
        // Client-side fuzzy re-rank: server order is upstream relevance, but
        // prefix/substring hits on the exact title should float to the top.
        const ranked = [...results].sort((a, b) => fuzzyScore(trimmed, b.title) - fuzzyScore(trimmed, a.title));
        clientSearchCache.set(trimmed, ranked);
        setLiveResults(ranked);
      } catch (error) {
        if ((error as Error)?.name !== "AbortError") setLiveResults([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 180);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return {
    dialogRef,
    inputRef,
    query,
    setQuery,
    recent,
    liveResults,
    isLoading,
    isClosing,
    isActionMode,
    actions,
    openPalette,
    closePalette,
    clearHistory,
    handleSearch,
    handleFormSubmit,
    runAction,
  };
};
