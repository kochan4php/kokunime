"use client";

import { maybeAutoArchive } from "@/utils/auto-archive";
import { recordEpisodeMark, removeEpisodeMark } from "@/utils/episode-log";
import { useTranslation } from "@/utils/i18n";
import { isEpisodeWatched, subscribeProgress, toggleEpisodeWatched } from "@/utils/progress";
import { showToast } from "@/utils/toast";
import { JSX, useSyncExternalStore } from "react";

interface EpisodeWatchedToggleProps {
  slug: string;
  episode: number;
  title?: string | undefined;
  total?: number | undefined;
}

// Per-episode watched marker stored in localStorage. Local state only — this
// is a personal checklist, not a server-side watch history.
const EpisodeWatchedToggle = ({ slug, episode, title, total }: EpisodeWatchedToggleProps): JSX.Element => {
  const { t } = useTranslation();
  const watched = useSyncExternalStore(
    subscribeProgress,
    () => isEpisodeWatched(slug, episode),
    () => false,
  );

  const handleToggle = () => {
    const nowWatched = toggleEpisodeWatched(slug, episode, { title, total });
    if (nowWatched) {
      recordEpisodeMark(slug, episode);
      const archived = maybeAutoArchive(slug, title);
      showToast(archived ? `${archived} selesai — dipindah ke folder Selesai` : `Episode ${episode} ditandai ditonton`);
    } else {
      removeEpisodeMark(slug, episode);
      showToast(`Tanda episode ${episode} dihapus`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={watched}
      title={
        watched
          ? `${t("watch.unmark_ep")} ${episode} ${t("watch.as_unwatched")}`
          : `${t("watch.mark_ep")} ${episode} ${t("watch.as_watched")}`
      }
      className={`inline-flex shrink-0 items-center gap-1 rounded-sm border-2 border-border px-2 py-0.5 font-mono text-[10px] font-semibold transition-all cursor-pointer ${
        watched
          ? "bg-nb-lime text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
          : "bg-surface text-ink-muted shadow-[2px_2px_0_0_var(--border)] motion-safe:hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none"
      }`}
    >
      <span aria-hidden="true">{watched ? "✓" : "○"}</span>
      <span>{watched ? t("watch.marked_short") : t("watch.mark_short")}</span>
    </button>
  );
};

export default EpisodeWatchedToggle;
