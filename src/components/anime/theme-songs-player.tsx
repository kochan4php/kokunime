"use client";

import { JSX } from "react";

interface ThemeSongsPlayerProps {
  animeTitle: string;
}

export const ThemeSongsPlayer = ({ animeTitle }: ThemeSongsPlayerProps): JSX.Element => {
  const ytMusicSearch = `https://music.youtube.com/search?q=${encodeURIComponent(`${animeTitle} OST opening theme`)}`;
  const spotifySearch = `https://open.spotify.com/search/${encodeURIComponent(`${animeTitle} theme`)}`;

  return (
    <div className="mt-6 rounded-2xl border border-border/70 bg-surface p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-sm font-bold text-accent">
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
            className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-mono text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white transition-colors"
          >
            <span>▶ YouTube Music</span>
          </a>
          <a
            href={spotifySearch}
            target="_blank"
            rel="noopener noreferrer"
            title="Dengarkan di Spotify"
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-bold text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
          >
            <span>🎧 Spotify</span>
          </a>
        </div>
      </div>
    </div>
  );
};

