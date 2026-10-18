"use client";

import AnimeSearchField from "@/components/compare/anime-search-field";
import { useAnimeSearch } from "@/hooks/use-anime-search";
import { Anime } from "@/interfaces";
import { useTranslation } from "@/utils/i18n";
import { JSX } from "react";

type Side = "a" | "b" | "c";
type Pane = ReturnType<typeof useAnimeSearch>;

const PRESET_COMPARISONS = [
  { label: "Naruto vs Bleach", queryA: "Naruto", queryB: "Bleach" },
  { label: "Jujutsu Kaisen vs Kimetsu no Yaiba", queryA: "Jujutsu Kaisen", queryB: "Kimetsu no Yaiba" },
  { label: "One Piece vs Shingeki no Kyojin", queryA: "One Piece", queryB: "Shingeki no Kyojin" },
  { label: "Frieren vs Mushoku Tensei", queryA: "Frieren", queryB: "Mushoku Tensei" },
  { label: "Solo Leveling vs Mashle", queryA: "Solo Leveling", queryB: "Mashle" },
  { label: "Spy x Family vs Oshi no Ko", queryA: "Spy x Family", queryB: "Oshi no Ko" },
];

interface CompareSelectorProps {
  paneA: Pane;
  paneB: Pane;
  paneC: Pane;
  readyAB: boolean;
  hasA: boolean;
  hasB: boolean;
  hasThird: boolean;
  isOverallLoading: boolean;
  loadingA: boolean;
  loadingB: boolean;
  loadingC: boolean;
  shareCopied: boolean;
  onSelect: (side: Side) => (item: Anime) => void;
  onSwap: () => void;
  onClearThird: () => void;
  onPreset: (queryA: string, queryB: string) => void;
  onExportCard: () => void;
  onCopyShare: () => void;
}

// Top card: the A/B pickers, the optional third slot and quick presets.
const CompareSelector = ({
  paneA,
  paneB,
  paneC,
  readyAB,
  hasA,
  hasB,
  hasThird,
  isOverallLoading,
  loadingA,
  loadingB,
  loadingC,
  shareCopied,
  onSelect,
  onSwap,
  onClearThird,
  onPreset,
  onExportCard,
  onCopyShare,
}: CompareSelectorProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="card-shell overflow-visible">
      <div className="card-core p-5 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-border pb-4">
          <div>
            <span className="chip">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              {t("compare.select_header")}
            </span>
            <h2 className="mt-1 font-display text-lg sm:text-xl font-bold text-ink">{t("compare.select_header")}</h2>
          </div>

          {readyAB && !isOverallLoading && (
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={onExportCard}
                title="Unduh kartu perbandingan sebagai PNG"
                className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-surface px-3.5 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
              >
                🖼️ PNG
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                title="Cetak halaman perbandingan"
                className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-surface px-3.5 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
              >
                🖨️ Cetak
              </button>
              <button
                type="button"
                onClick={onCopyShare}
                className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-surface px-3.5 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
              >
                <span>{shareCopied ? `✓ ${t("common.copied")}` : `🔗 ${t("compare.share")}`}</span>
              </button>
            </div>
          )}
        </div>

        {/* Search Inputs & Swap */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          <AnimeSearchField
            id="input-anime-a"
            label={`🔴 ${t("compare.anime_a")}`}
            placeholder={t("compare.placeholder_a")}
            query={paneA.query}
            onQueryChange={paneA.setQuery}
            results={paneA.results}
            isSearching={paneA.isSearching}
            detailLoading={loadingA}
            showDropdown={paneA.showDropdown}
            loadingText={t("common.loading")}
            onFocus={() => {
              if (paneA.results.length > 0 && paneA.query !== paneA.selectedTitle.current) {
                paneA.setShowDropdown(true);
              }
            }}
            onSelect={onSelect("a")}
            containerRef={paneA.containerRef}
          />

          {/* Swap Button (1 col) */}
          <div className="flex justify-center lg:col-span-1 py-1 lg:py-0">
            <button
              type="button"
              onClick={onSwap}
              title="Tukar Posisi Anime A dan B"
              disabled={(!hasA && !hasB) || isOverallLoading}
              className="flex h-11 w-11 items-center justify-center rounded-sm border-2 border-border bg-surface text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:bg-nb-yellow hover:text-nb-ink active:translate-y-0 active:shadow-none disabled:opacity-40 cursor-pointer"
            >
              <span className="text-base font-bold">⇄</span>
            </button>
          </div>

          <AnimeSearchField
            id="input-anime-b"
            label={`🔵 ${t("compare.anime_b")}`}
            placeholder={t("compare.placeholder_b")}
            query={paneB.query}
            onQueryChange={paneB.setQuery}
            results={paneB.results}
            isSearching={paneB.isSearching}
            detailLoading={loadingB}
            showDropdown={paneB.showDropdown}
            loadingText={t("common.loading")}
            onFocus={() => {
              if (paneB.results.length > 0 && paneB.query !== paneB.selectedTitle.current) {
                paneB.setShowDropdown(true);
              }
            }}
            onSelect={onSelect("b")}
            containerRef={paneB.containerRef}
          />
        </div>

        {/* Optional third title: extra column for the dashboard, clears with ✕ */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          <AnimeSearchField
            id="input-anime-c"
            label={`🟣 ${t("compare.anime_c")} · ${t("compare.optional")}`}
            placeholder={t("compare.placeholder_c")}
            query={paneC.query}
            onQueryChange={paneC.setQuery}
            results={paneC.results}
            isSearching={paneC.isSearching}
            detailLoading={loadingC}
            showDropdown={paneC.showDropdown}
            loadingText={t("common.loading")}
            onFocus={() => {
              if (paneC.results.length > 0 && paneC.query !== paneC.selectedTitle.current) {
                paneC.setShowDropdown(true);
              }
            }}
            onSelect={onSelect("c")}
            containerRef={paneC.containerRef}
          />

          <div className="flex justify-center lg:col-span-1 py-1 lg:py-0">
            <button
              type="button"
              onClick={onClearThird}
              title="Hapus anime ketiga"
              disabled={!hasThird || isOverallLoading}
              className="flex h-11 w-11 items-center justify-center rounded-sm border-2 border-border bg-surface text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:bg-nb-red hover:text-nb-ink active:translate-y-0 active:shadow-none disabled:opacity-40 cursor-pointer"
            >
              <span className="text-base font-bold">✕</span>
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-ink-muted">⚡ {t("compare.quick_examples")}</span>
            {PRESET_COMPARISONS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                disabled={isOverallLoading}
                onClick={() => onPreset(preset.queryA, preset.queryB)}
                className="rounded-sm border-2 border-border bg-surface px-3 py-1 font-mono text-xs text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:bg-nb-purple hover:text-nb-ink active:translate-y-0 active:shadow-none disabled:opacity-50 cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareSelector;
