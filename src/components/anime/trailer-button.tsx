"use client";

import { JSX, useRef, useState } from "react";

interface TrailerButtonProps {
  trailerUrl?: string;
  title: string;
}

const TrailerButton = ({ trailerUrl, title }: TrailerButtonProps): JSX.Element | null => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (!trailerUrl) return null;

  const openModal = () => {
    setIsOpen(true);
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsTheaterMode(false);
    dialogRef.current?.close();
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        title="Tonton Trailer Resmi (Shortcut: T)"
        className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-display text-xs font-bold text-accent transition-all duration-200 hover:bg-accent hover:text-(--accent-ink) active:scale-95"
      >
        <span>▶</span>
        <span>Trailer</span>
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeModal();
        }}
        onKeyDown={(e) => {
          if (e.key === "f" || e.key === "F") {
            e.preventDefault();
            toggleFullscreen();
          }
        }}
        className={`backdrop:backdrop-blur-md m-auto w-full rounded-2xl border border-border bg-surface-solid p-0 text-ink shadow-2xl transition-all duration-300 ${
          isTheaterMode ? "max-w-6xl backdrop:bg-black/95" : "max-w-3xl backdrop:bg-black/80"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <h3 className="line-clamp-1 font-display text-sm font-bold text-ink">Trailer: {title}</h3>
            <button
              type="button"
              onClick={() => setIsTheaterMode((prev) => !prev)}
              title="Perbesar layar dan redupkan suasana sekitar (Mode Bioskop)"
              className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold transition-all cursor-pointer ${
                isTheaterMode
                  ? "bg-amber-400 text-black font-bold shadow-md"
                  : "border border-border bg-surface text-ink-muted hover:text-ink"
              }`}
            >
              <span>{isTheaterMode ? "🎦 Bioskop: ON" : "🎦 Mode Bioskop"}</span>
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              title="Layar Penuh (Shortcut: F)"
              className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer"
            >
              <span>{isFullscreen ? "⤓ Normal" : "⤢ Fullscreen (F)"}</span>
            </button>
            <a
              href={trailerUrl.replace("/embed/", "/watch?v=")}
              target="_blank"
              rel="noopener noreferrer"
              title="Buka langsung di YouTube untuk fitur playback speed 2x dan 4K"
              className="hidden sm:inline-flex rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer"
            >
              <span>↗ YouTube</span>
            </a>
          </div>
          <button
            type="button"
            onClick={closeModal}
            aria-label="Tutup trailer"
            className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface hover:text-ink cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div ref={containerRef} className="relative aspect-video w-full bg-black">
          {isOpen && (
            <iframe
              src={trailerUrl}
              title={`Trailer ${title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="h-full w-full border-0"
            />
          )}
        </div>
      </dialog>
    </>
  );
};

export default TrailerButton;
