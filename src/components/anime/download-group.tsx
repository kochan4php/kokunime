"use client";

import { DownloadOption, DownloadResolution, DownloadTarget } from "@/interfaces";
import DownloadPlatform from "./download-platform";
import BatchDownloadTools from "./batch-download-tools";
import EpisodeWatchedToggle from "./episode-watched-toggle";
import { parseEpisodeRange } from "@/services/scraper/sanitize";
import { useSettings } from "@/utils/settings";
import { useTranslation } from "@/utils/i18n";
import { isEpisodeWatched, toggleEpisodeWatched } from "@/utils/progress";
import { JSX, useMemo, useState } from "react";

interface DownloadGroupProps {
  group: DownloadOption;
  animeTitle?: string | undefined;
  slug?: string | undefined;
  animeTotal?: number | undefined;
  anchorId?: string | undefined;
}

const renderResolutionBadge = (res: DownloadResolution): JSX.Element => {
  const isMkv = res.container === "mkv" || /mkv/i.test(res.resolusi);
  const isMp4 = res.container === "mp4" || /mp4/i.test(res.resolusi);
  const isHevc = res.codec === "hevc" || /hevc|x265/i.test(res.resolusi);
  const isSoftsub = res.subtitle_type === "softsub" || /softsub/i.test(res.resolusi);
  const isHardsub = res.subtitle_type === "hardsub" || /hardsub/i.test(res.resolusi);
  const isBatch = /batch/i.test(res.resolusi);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-nb-yellow px-2.5 py-1 font-mono text-xs font-bold tracking-wider text-nb-ink shadow-[2px_2px_0_0_var(--border)]">
        {res.resolusi}
      </span>
      {isHevc && (
        <span className="rounded-sm border-2 border-border bg-nb-lime px-1.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink">
          HEVC 10-bit
        </span>
      )}
      {isMkv && (
        <span className="rounded-sm border-2 border-border bg-nb-purple px-1.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink">
          MKV
        </span>
      )}
      {isMp4 && (
        <span className="rounded-sm border-2 border-border bg-nb-teal px-1.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink">
          MP4
        </span>
      )}
      {isSoftsub && (
        <span className="rounded-sm border-2 border-border bg-nb-pink px-1.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink">
          Softsub
        </span>
      )}
      {isHardsub && (
        <span className="rounded-sm border-2 border-border bg-nb-orange px-1.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink">
          Hardsub
        </span>
      )}
      {isBatch && (
        <span className="rounded-sm border-2 border-border bg-nb-red px-1.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink">
          BATCH
        </span>
      )}
    </div>
  );
};

const OpenAllLinksButton = ({ links }: { links: DownloadTarget[] }): JSX.Element | null => {
  const validLinks = links.filter((l) => Boolean(l.url));
  if (validLinks.length <= 1) return null;

  const handleOpenAll = () => {
    validLinks.forEach((target) => {
      if (target.url) window.open(target.url, "_blank", "noopener,noreferrer");
    });
  };

  return (
    <button
      type="button"
      onClick={handleOpenAll}
      title="Buka semua mirror download di tab baru"
      className="inline-flex items-center gap-1 rounded-sm border-2 border-border bg-surface px-2 py-0.5 font-mono text-[10px] font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
    >
      <span>↗ Buka Semua ({validLinks.length})</span>
    </button>
  );
};

const DownloadGroup = ({ group, animeTitle, slug, animeTotal, anchorId }: DownloadGroupProps): JSX.Element => {
  const settings = useSettings();
  const { t } = useTranslation();
  const [userOverride, setUserOverride] = useState<"cards" | "matrix" | null>(null);
  const layout = userOverride ?? (settings.downloadLayout || "cards");

  // Only single-episode groups (total === 1) get a watched toggle — batch
  // groups and "Episode 01-12" ranges are not one episode.
  const episodeNumber = useMemo(() => {
    if (group.is_batch) return null;
    const range = parseEpisodeRange(group.title);
    return range.total === 1 && range.start ? range.start : null;
  }, [group.is_batch, group.title]);

  const allPlatforms = useMemo(() => {
    const set = new Set<string>();
    group.link_download.forEach((res) => {
      res.link.forEach((target) => {
        if (target.platform) set.add(target.platform.trim());
      });
    });
    return Array.from(set);
  }, [group]);

  // Opt-in auto-mark: clicking any download link of a single-episode group
  // marks that episode watched (only on the unwatched → watched transition).
  const handleCaptureClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!settings.autoMarkWatched || !slug || !episodeNumber) return;
    if (!(event.target as HTMLElement).closest("a[href]")) return;
    if (!isEpisodeWatched(slug, episodeNumber)) {
      toggleEpisodeWatched(slug, episodeNumber, { title: animeTitle, total: animeTotal });
    }
  };

  return (
    <div
      id={anchorId}
      data-episode-anchor={anchorId ? Number(anchorId.slice(3)) : undefined}
      onClickCapture={handleCaptureClick}
      className="card-shell min-w-0 max-w-full overflow-hidden border-l-[10px] border-l-(color:--nb-card) scroll-mt-28"
    >
      <div className="card-core bg-surface-solid p-3.5 sm:p-6 md:p-8 min-w-0 max-w-full overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-ink min-w-0 truncate">
              {group.title}
            </h3>
            {slug && episodeNumber ? (
              <EpisodeWatchedToggle slug={slug} episode={episodeNumber} title={animeTitle} total={animeTotal} />
            ) : null}
            {allPlatforms.length > 2 && (
              <div className="flex items-center gap-1 rounded-sm border-2 border-border bg-surface p-0.5 font-mono text-[10px] shrink-0">
                <button
                  type="button"
                  onClick={() => setUserOverride("cards")}
                  className={`rounded-sm px-2 py-0.5 transition-colors cursor-pointer ${
                    layout === "cards" ? "bg-accent text-(--accent-ink) font-bold" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {t("settings.layout_cards")}
                </button>
                <button
                  type="button"
                  onClick={() => setUserOverride("matrix")}
                  className={`rounded-sm px-2 py-0.5 transition-colors cursor-pointer ${
                    layout === "matrix" ? "bg-accent text-(--accent-ink) font-bold" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {t("settings.layout_matrix")}
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="chip">{group.link_download.length} kualitas</span>
            <BatchDownloadTools group={group} animeTitle={animeTitle} />
          </div>
        </div>

        {layout === "matrix" && allPlatforms.length > 0 ? (
          <div className="mt-5 flex flex-col gap-2 min-w-0 max-w-full">
            <div className="w-full max-w-full overflow-x-auto rounded-sm border-2 border-border bg-surface [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
              <table className="w-full min-w-max text-left text-xs border-collapse font-mono table-auto">
                <thead>
                  <tr className="border-b-2 border-border bg-surface-muted">
                    <th className="p-3 font-bold text-ink whitespace-nowrap sticky left-0 z-10 bg-surface-muted min-w-[100px] sm:min-w-[125px] border-r-2 border-border">
                      Resolusi
                    </th>
                    {allPlatforms.map((plat) => (
                      <th
                        key={plat}
                        className="p-3 font-semibold text-ink-muted whitespace-nowrap text-center min-w-[90px] sm:min-w-[105px]"
                      >
                        {plat}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-border">
                  {group.link_download.map((res, idx) => (
                    <tr key={idx} className="hover:bg-surface-muted transition-colors">
                      <td className="p-3 font-bold text-ink whitespace-nowrap sticky left-0 z-10 bg-surface-solid border-r-2 border-border">
                        {res.resolusi || "Download"}
                      </td>
                      {allPlatforms.map((plat) => {
                        const linkTarget = res.link.find((l) => l.platform.toLowerCase() === plat.toLowerCase());
                        return (
                          <td key={plat} className="p-2.5 whitespace-nowrap text-center min-w-[90px] sm:min-w-[105px]">
                            {linkTarget?.url ? (
                              <a
                                href={linkTarget.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1 rounded-sm border-2 border-border bg-accent px-2.5 py-1 text-[11px] font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                              >
                                <span>Unduh ↗</span>
                              </a>
                            ) : (
                              <span className="text-ink-muted/40 font-mono">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center font-mono text-[10px] text-ink-muted sm:hidden">
              ← Geser tabel ke kanan untuk server lainnya →
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-5">
            {group.link_download.map((res: DownloadResolution, index: number) => (
              <div key={index} className="border-t-2 border-border pt-5 first:border-0 first:pt-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {res.resolusi && renderResolutionBadge(res)}
                  <OpenAllLinksButton links={res.link} />
                </div>
                <div
                  className={`mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ${
                    res.resolusi ? "" : "mt-0"
                  }`}
                >
                  {res.link.map((platform: DownloadTarget, i: number) => (
                    <DownloadPlatform key={i} name={platform.platform} url={platform.url} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadGroup;
