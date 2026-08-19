"use client";

import { DownloadOption, DownloadResolution, DownloadTarget } from "@/interfaces";
import DownloadPlatform from "./download-platform";
import BatchDownloadTools from "./batch-download-tools";
import { useSettings } from "@/utils/settings";
import { useTranslation } from "@/utils/i18n";
import { JSX, useMemo, useState } from "react";

interface DownloadGroupProps {
  group: DownloadOption;
  animeTitle?: string;
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
      <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-muted px-2.5 py-1 font-mono text-xs font-bold tracking-wider text-ink border border-border">
        {res.resolusi}
      </span>
      {isHevc && (
        <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
          HEVC 10-bit
        </span>
      )}
      {isMkv && (
        <span className="rounded bg-purple-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-purple-400 border border-purple-500/20">
          MKV
        </span>
      )}
      {isMp4 && (
        <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-400 border border-cyan-500/20">
          MP4
        </span>
      )}
      {isSoftsub && (
        <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
          Softsub
        </span>
      )}
      {isHardsub && (
        <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-400 border border-amber-500/20">
          Hardsub
        </span>
      )}
      {isBatch && (
        <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-400 border border-amber-500/20">
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
      className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[10px] font-semibold text-ink-muted transition-all hover:border-accent hover:text-ink active:scale-95 cursor-pointer"
    >
      <span>↗ Buka Semua ({validLinks.length})</span>
    </button>
  );
};

const DownloadGroup = ({ group, animeTitle }: DownloadGroupProps): JSX.Element => {
  const settings = useSettings();
  const { t } = useTranslation();
  const [userOverride, setUserOverride] = useState<"cards" | "matrix" | null>(null);
  const layout = userOverride ?? (settings.downloadLayout || "cards");

  const allPlatforms = useMemo(() => {
    const set = new Set<string>();
    group.link_download.forEach((res) => {
      res.link.forEach((target) => {
        if (target.platform) set.add(target.platform.trim());
      });
    });
    return Array.from(set);
  }, [group]);

  return (
    <div className="card-shell min-w-0 max-w-full overflow-hidden">
      <div className="card-core p-3.5 sm:p-6 md:p-8 min-w-0 max-w-full overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-ink min-w-0 truncate">
              {group.title}
            </h3>
            {allPlatforms.length > 2 && (
              <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-0.5 font-mono text-[10px] shrink-0">
                <button
                  type="button"
                  onClick={() => setUserOverride("cards")}
                  className={`rounded-full px-2 py-0.5 transition-colors cursor-pointer ${
                    layout === "cards" ? "bg-accent text-(--accent-ink) font-bold" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {t("settings.layout_cards")}
                </button>
                <button
                  type="button"
                  onClick={() => setUserOverride("matrix")}
                  className={`rounded-full px-2 py-0.5 transition-colors cursor-pointer ${
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
            <div className="w-full max-w-full overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
              <table className="w-full min-w-max text-left text-xs border-collapse font-mono table-auto">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/60">
                    <th className="p-3 font-bold text-ink whitespace-nowrap sticky left-0 z-10 bg-surface-muted min-w-[100px] sm:min-w-[125px] border-r border-border shadow-[2px_0_6px_rgba(0,0,0,0.06)]">
                      Resolusi
                    </th>
                    {allPlatforms.map((plat) => (
                      <th key={plat} className="p-3 font-semibold text-ink-muted whitespace-nowrap text-center min-w-[90px] sm:min-w-[105px]">
                        {plat}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {group.link_download.map((res, idx) => (
                    <tr key={idx} className="hover:bg-surface-muted/30 transition-colors">
                      <td className="p-3 font-bold text-ink whitespace-nowrap sticky left-0 z-10 bg-surface-solid border-r border-border shadow-[2px_0_6px_rgba(0,0,0,0.06)]">
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
                                className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-surface-solid px-2.5 py-1 text-[11px] font-semibold text-accent hover:border-accent hover:bg-accent/10 transition-all active:scale-95"
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
              <div key={index} className="border-t border-border pt-5 first:border-0 first:pt-0">
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
