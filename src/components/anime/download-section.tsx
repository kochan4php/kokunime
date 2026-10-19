"use client";

import DownloadGroup from "./download-group";
import EpisodeNavigator from "./episode-navigator";
import { DownloadGuideModal } from "./download-guide-modal";
import Reveal from "@/components/reveal";
import SectionHeader from "@/components/section-header";
import { AnimeDetail, DownloadOption, LinkHealthSnapshot } from "@/interfaces";
import { parseEpisodeRange } from "@/services/scraper/sanitize";
import { listEpisodeNumbers } from "@/utils/episodes";
import { parseTotalEpisodes } from "@/utils/progress";
import { JSX, useMemo, useState } from "react";

const DownloadSection = ({
  anime,
  slug,
  linkHealth,
}: {
  anime: AnimeDetail;
  slug?: string;
  linkHealth?: LinkHealthSnapshot | null | undefined;
}): JSX.Element => {
  const downloads = useMemo(() => anime.download ?? [], [anime.download]);
  const totalEpisodes = useMemo(() => parseTotalEpisodes(anime.total_episode), [anime.total_episode]);
  const episodeNumbers = useMemo(() => listEpisodeNumbers(downloads), [downloads]);
  const [selectedRes, setSelectedRes] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "batch" | "episode">("all");

  const hasBatch = useMemo(() => downloads.some((g) => g.is_batch), [downloads]);
  const hasEpisode = useMemo(() => downloads.some((g) => g.is_batch === false), [downloads]);
  const showTypeFilter = hasBatch && hasEpisode;

  const availableResolutions = useMemo(() => {
    const set = new Set<string>();
    downloads.forEach((g) => {
      g.link_download.forEach((r) => {
        if (r.resolusi) set.add(r.resolusi.trim());
      });
    });
    return Array.from(set);
  }, [downloads]);

  const filteredDownloads = useMemo(() => {
    let list = downloads;
    if (typeFilter === "batch") {
      list = list.filter((g) => g.is_batch);
    } else if (typeFilter === "episode") {
      list = list.filter((g) => g.is_batch === false);
    }

    if (selectedRes === "all") return list;
    return list
      .map((g) => ({
        ...g,
        link_download: g.link_download.filter((r) => r.resolusi?.trim() === selectedRes),
      }))
      .filter((g) => g.link_download.length > 0);
  }, [downloads, selectedRes, typeFilter]);

  // Never render an empty "Pilih Kualitas" section (e.g. an upstream parse
  // that produced no groups) — a header with nothing under it looks broken.
  if (downloads.length === 0) return <></>;

  return (
    <div
      id="download"
      data-anime-slug={slug}
      data-anime-title={anime.title}
      data-anime-total={totalEpisodes}
      className="mt-16 scroll-mt-28"
    >
      <Reveal>
        <SectionHeader
          kicker="Download"
          title="Pilih Kualitas"
          tone="lime"
          className="mb-6"
          aside={<DownloadGuideModal />}
        />
      </Reveal>

      {/* Filters live below the header: a full row of resolution chips would
          squeeze the title if it sat in the header's aside column. */}
      {(showTypeFilter || availableResolutions.length > 1) && (
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          {showTypeFilter && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTypeFilter("all")}
                className={`rounded-sm border-2 px-2.5 py-0.5 font-mono text-xs transition-all cursor-pointer ${
                  typeFilter === "all"
                    ? "border-border bg-accent font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                    : "border-border bg-surface text-ink-muted hover:text-ink"
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("batch")}
                className={`rounded-sm border-2 px-2.5 py-0.5 font-mono text-xs transition-all cursor-pointer ${
                  typeFilter === "batch"
                    ? "border-border bg-accent font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                    : "border-border bg-surface text-ink-muted hover:text-ink"
                }`}
              >
                📦 Batch
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("episode")}
                className={`rounded-sm border-2 px-2.5 py-0.5 font-mono text-xs transition-all cursor-pointer ${
                  typeFilter === "episode"
                    ? "border-border bg-accent font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                    : "border-border bg-surface text-ink-muted hover:text-ink"
                }`}
              >
                🎬 Satuan
              </button>
            </div>
          )}

          {availableResolutions.length > 1 && (
            <div className="flex w-full items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted shrink-0">Resolusi:</span>
              <button
                type="button"
                onClick={() => setSelectedRes("all")}
                className={`rounded-sm border-2 px-3 py-1 font-mono text-xs transition-all shrink-0 cursor-pointer ${
                  selectedRes === "all"
                    ? "border-border bg-accent font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                    : "border-border bg-surface text-ink-muted hover:text-ink"
                }`}
              >
                Semua
              </button>
              {availableResolutions.map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setSelectedRes(res)}
                  className={`rounded-sm border-2 px-3 py-1 font-mono text-xs transition-all shrink-0 cursor-pointer ${
                    selectedRes === res
                      ? "border-border bg-accent font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                      : "border-border bg-surface text-ink-muted hover:text-ink"
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <EpisodeNavigator slug={slug} episodes={episodeNumbers} />
      <div className="nb-cycle grid gap-6 min-w-0 max-w-full overflow-hidden">
        {(() => {
          // First occurrence of an episode number wins the anchor id — the
          // keyboard/shortcut jump must land on exactly one group.
          const anchored = new Set<number>();
          return filteredDownloads.map((group: DownloadOption, index: number) => {
            let anchorId: string | undefined;
            if (!group.is_batch) {
              const range = parseEpisodeRange(group.title);
              if (range.total === 1 && range.start && !anchored.has(range.start)) {
                anchored.add(range.start);
                anchorId = `ep-${range.start}`;
              }
            }
            return (
              <Reveal
                key={`${group.title}-${selectedRes}-${typeFilter}-${index}`}
                delay={index * 80}
                className="min-w-0 max-w-full overflow-hidden"
              >
                <DownloadGroup
                  group={group}
                  animeTitle={anime.title}
                  slug={slug}
                  animeTotal={totalEpisodes}
                  anchorId={anchorId}
                  linkHealth={linkHealth}
                />
              </Reveal>
            );
          });
        })()}
      </div>
    </div>
  );
};

export default DownloadSection;
