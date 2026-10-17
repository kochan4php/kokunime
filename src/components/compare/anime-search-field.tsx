"use client";

import AnimeImage from "@/components/cards/anime-image";
import { Anime } from "@/interfaces";
import { JSX, type RefObject } from "react";

interface AnimeSearchFieldProps {
  id: string;
  label: string;
  placeholder: string;
  query: string;
  onQueryChange: (value: string) => void;
  results: Anime[];
  isSearching: boolean;
  detailLoading: boolean;
  showDropdown: boolean;
  loadingText: string;
  onFocus: () => void;
  onSelect: (item: Anime) => void;
  containerRef: RefObject<HTMLDivElement | null>;
}

// One side of the compare selector: input + autocomplete dropdown.
const AnimeSearchField = ({
  id,
  label,
  placeholder,
  query,
  onQueryChange,
  results,
  isSearching,
  detailLoading,
  showDropdown,
  loadingText,
  onFocus,
  onSelect,
  containerRef,
}: AnimeSearchFieldProps): JSX.Element => (
  <div ref={containerRef} className="relative lg:col-span-5">
    <div className="flex items-center justify-between mb-1.5">
      <label htmlFor={id} className="block font-mono text-xs font-bold text-accent">
        {label}
      </label>
      {detailLoading && (
        <span className="font-mono text-[10px] text-accent animate-pulse font-bold">{loadingText}</span>
      )}
    </div>
    <div className="relative">
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={onFocus}
        className="w-full rounded-sm border-2 border-border bg-surface px-4 py-3 text-xs sm:text-sm text-ink shadow-[2px_2px_0_0_var(--border)] outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
      />
      {isSearching && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-ink-muted animate-spin">
          ⏳
        </span>
      )}
    </div>

    {showDropdown && results.length > 0 && (
      <div className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-sm border-2 border-border bg-surface-solid p-2 shadow-[6px_6px_0_0_var(--border)] space-y-1">
        {results.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(item)}
            className="flex w-full items-center gap-3 rounded-sm p-2 text-left hover:bg-nb-yellow transition-colors cursor-pointer"
          >
            <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-sm bg-surface-muted border-2 border-border">
              <AnimeImage fill sizes="36px" src={item.link.image as string} alt={item.title} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xs font-bold text-ink">{item.title}</p>
              <p className="font-mono text-[10px] text-ink-muted">
                {item.release || "Rilis"} • {item.genres?.slice(0, 2).join(", ") || "Anime"}
              </p>
            </div>
          </button>
        ))}
      </div>
    )}
  </div>
);

export default AnimeSearchField;
