"use client";

import { JSX } from "react";

interface ThemeSongsPlayerProps {
  animeTitle: string;
}

export const ThemeSongsPlayer = ({ animeTitle }: ThemeSongsPlayerProps): JSX.Element => {
  const ytMusicSearch = `https://music.youtube.com/search?q=${encodeURIComponent(`${animeTitle} OST opening theme`)}`;
  const spotifySearch = `https://open.spotify.com/search/${encodeURIComponent(`${animeTitle} theme`)}`;

  return (
    <div className="mt-6 rounded-sm border-2 border-border bg-surface p-4 shadow-[2px_2px_0_0_var(--border)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border-2 border-border bg-nb-pink text-sm font-bold text-nb-ink">
            🎵
          </span>
          <div className="min-w-0">
            <h4 className="font-display text-sm font-bold text-ink">Lagu Tema & Soundtrack (OST)</h4>
            <p className="text-xs text-ink-muted truncate">Dengarkan lagu Opening & Ending {animeTitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href={ytMusicSearch}
            target="_blank"
            rel="noopener noreferrer"
            title="Dengarkan di YouTube Music"
            className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-nb-red px-3 py-1 font-mono text-xs font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
          >
            <span>▶ YouTube Music</span>
          </a>
          <a
            href={spotifySearch}
            target="_blank"
            rel="noopener noreferrer"
            title="Dengarkan di Spotify"
            className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-nb-lime px-3 py-1 font-mono text-xs font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
          >
            <span>🎧 Spotify</span>
          </a>
        </div>
      </div>
    </div>
  );
};
