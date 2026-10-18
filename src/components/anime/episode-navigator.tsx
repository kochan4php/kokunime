"use client";

import { useTranslation } from "@/utils/i18n";
import { getProgress, nextUnwatchedEpisode, subscribeProgress } from "@/utils/progress";
import { JSX, useMemo, useSyncExternalStore } from "react";

interface EpisodeNavigatorProps {
  slug?: string | undefined;
  episodes: number[];
}

// Collapsible episode grid above the download groups: a click jumps to that
// episode's anchor; watched episodes are tinted, the next unwatched one is
// highlighted as the suggested resume point.
const EpisodeNavigator = ({ slug, episodes }: EpisodeNavigatorProps): JSX.Element | null => {
  const { t } = useTranslation();
  const entry = useSyncExternalStore(
    subscribeProgress,
    () => (slug ? getProgress(slug) : undefined),
    () => undefined,
  );

  const watched = useMemo(() => new Set(entry?.watched ?? []), [entry]);
  const next = useMemo(() => nextUnwatchedEpisode(entry?.watched ?? [], episodes), [entry, episodes]);

  if (!slug || episodes.length <= 1) return null;

  return (
    <details
      open={episodes.length <= 24}
      className="mb-6 rounded-sm border-2 border-border bg-surface shadow-[4px_4px_0_0_var(--border)]"
    >
      <summary className="select-none cursor-pointer px-3.5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-ink">
        {t("watch.nav_episodes")} <span className="text-ink-muted">({episodes.length})</span>
      </summary>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-1.5 border-t-2 border-border p-3">
        {episodes.map((episode) => {
          const isWatched = watched.has(episode);
          return (
            <button
              key={episode}
              type="button"
              onClick={() =>
                document.getElementById(`ep-${episode}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              aria-label={`${t("watch.jump_ep")} ${episode}${isWatched ? ` (${t("watch.watched")})` : ""}`}
              className={`cursor-pointer rounded-sm border-2 px-2 py-1.5 font-mono text-xs font-semibold transition-all ${
                isWatched
                  ? "border-border bg-nb-lime text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
                  : episode === next
                    ? "border-border bg-accent text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                    : "border-border bg-surface-solid text-ink-muted shadow-[2px_2px_0_0_var(--border)] motion-safe:hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none"
              }`}
            >
              {episode}
            </button>
          );
        })}
      </div>
    </details>
  );
};

export default EpisodeNavigator;
