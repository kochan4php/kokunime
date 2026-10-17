"use client";

import { isEpisodeWatched, subscribeProgress, toggleEpisodeWatched } from "@/utils/progress";
import { JSX, useSyncExternalStore } from "react";

interface EpisodeWatchedToggleProps {
  slug: string;
  episode: number;
  title?: string;
  total?: number;
}

// Per-episode watched marker stored in localStorage. Local state only — this
// is a personal checklist, not a server-side watch history.
const EpisodeWatchedToggle = ({ slug, episode, title, total }: EpisodeWatchedToggleProps): JSX.Element => {
  const watched = useSyncExternalStore(
    subscribeProgress,
    () => isEpisodeWatched(slug, episode),
    () => false,
  );

  return (
    <button
      type="button"
      onClick={() => toggleEpisodeWatched(slug, episode, { title, total })}
      aria-pressed={watched}
      title={watched ? `Tandai Episode ${episode} belum ditonton` : `Tandai Episode ${episode} sudah ditonton`}
      className={`inline-flex shrink-0 items-center gap-1 rounded-sm border-2 border-border px-2 py-0.5 font-mono text-[10px] font-semibold transition-all cursor-pointer ${
        watched
          ? "bg-nb-lime text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
          : "bg-surface text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none"
      }`}
    >
      <span aria-hidden="true">{watched ? "✓" : "○"}</span>
      <span>{watched ? "Sudah" : "Tandai"}</span>
    </button>
  );
};

export default EpisodeWatchedToggle;
