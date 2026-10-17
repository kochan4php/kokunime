"use client";

import { ArrowDownIcon } from "@/components/icons";
import { DownloadOption } from "@/interfaces";
import { listEpisodeNumbers } from "@/utils/episodes";
import { useTranslation } from "@/utils/i18n";
import { getProgress, nextUnwatchedEpisode, subscribeProgress } from "@/utils/progress";
import { JSX, useMemo, useSyncExternalStore } from "react";

interface ContinueWatchingProps {
  slug?: string;
  downloads?: DownloadOption[];
  variant: "hero" | "bar";
  className?: string;
}

const jumpToEpisode = (episode: number | null): void => {
  const target = episode !== null ? document.getElementById(`ep-${episode}`) : null;
  (target ?? document.getElementById("download"))?.scrollIntoView({ behavior: "smooth", block: "start" });
};

// Personal watch progress surfaced where the task is: a hero chip on desktop
// (hidden on mobile — the sticky bar covers it) and the mobile sticky bar.
// Both jump to the next unwatched episode anchor, falling back to #download
// when that group is filtered out of view.
const ContinueWatching = ({ slug, downloads, variant, className = "" }: ContinueWatchingProps): JSX.Element | null => {
  const { t } = useTranslation();
  const episodes = useMemo(() => listEpisodeNumbers(downloads), [downloads]);
  const entry = useSyncExternalStore(
    subscribeProgress,
    () => (slug ? getProgress(slug) : undefined),
    () => undefined,
  );

  const watchedCount = entry?.watched.length ?? 0;
  const next = useMemo(() => nextUnwatchedEpisode(entry?.watched ?? [], episodes), [entry, episodes]);

  if (!slug || episodes.length === 0) return null;

  if (variant === "hero") {
    if (watchedCount === 0) return null;
    return (
      <button
        type="button"
        onClick={() => jumpToEpisode(next)}
        title={`${watchedCount}/${episodes.length} ${t("watch.marked_count")}`}
        className="hidden lg:inline-flex cursor-pointer items-center gap-1.5 rounded-sm border-2 border-border bg-nb-lime px-2.5 py-1 font-mono text-[11px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
      >
        <span aria-hidden="true">{next === null ? "✓" : "▶"}</span>
        <span>{next === null ? t("watch.all_done") : `${t("watch.continue_ep")} ${next}`}</span>
        <span className="opacity-70">
          {watchedCount}/{episodes.length}
        </span>
      </button>
    );
  }

  return (
    <button type="button" onClick={() => jumpToEpisode(next)} className={className}>
      <span className="truncate">
        {watchedCount === 0
          ? t("watch.view_download")
          : next === null
            ? t("watch.all_done")
            : `${t("watch.continue_ep")} ${next}`}
      </span>
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border-2 border-nb-ink bg-nb-ink text-nb-cream">
        <ArrowDownIcon className="h-3 w-3" />
      </span>
    </button>
  );
};

export default ContinueWatching;
