"use client";

import { Anime } from "@/interfaces";
import { type RefObject, useEffect, useRef, useState } from "react";

// Module-level cache: a Map created inside the component was rebuilt every
// render, so lookups always missed.
const searchCache = new Map<string, Anime[]>();

interface UseAnimeSearchResult {
  query: string;
  /** User typing — clears the "selected" marker so search resumes. */
  setQuery: (value: string) => void;
  /** Programmatic update (selection, preset, swap) — keeps the marker. */
  syncSelected: (value: string) => void;
  results: Anime[];
  isSearching: boolean;
  showDropdown: boolean;
  setShowDropdown: (open: boolean) => void;
  selectedTitle: RefObject<string>;
  containerRef: RefObject<HTMLDivElement | null>;
  /** Applies the UI half of selecting a result; the caller loads the detail. */
  select: (item: Anime) => void;
}

export const useAnimeSearch = (initialTitle: string): UseAnimeSearchResult => {
  const [query, setQueryState] = useState(initialTitle);
  const [results, setResults] = useState<Anime[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const selectedTitle = useRef(initialTitle);
  const containerRef = useRef<HTMLDivElement>(null);

  const setQuery = (value: string) => {
    selectedTitle.current = "";
    setQueryState(value);
  };

  const syncSelected = (value: string) => {
    selectedTitle.current = value;
    setQueryState(value);
    setShowDropdown(false);
    setResults([]);
  };

  const select = (item: Anime) => {
    selectedTitle.current = item.title;
    setShowDropdown(false);
    setResults([]);
    setQueryState(item.title);
  };

  // Click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce with instant in-memory client cache
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed || trimmed.length < 2 || query === selectedTitle.current) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    if (searchCache.has(trimmed)) {
      const cachedList = searchCache.get(trimmed) || [];
      if (query !== selectedTitle.current) {
        setResults(cachedList);
        setShowDropdown(cachedList.length > 0);
      }
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        const nextResults = (data.results || []) as Anime[];
        searchCache.set(trimmed, nextResults);
        if (query !== selectedTitle.current) {
          setResults(nextResults);
          setShowDropdown(nextResults.length > 0);
        }
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [query]);

  return {
    query,
    setQuery,
    syncSelected,
    results,
    isSearching,
    showDropdown,
    setShowDropdown,
    selectedTitle,
    containerRef,
    select,
  };
};
