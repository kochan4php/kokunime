"use client";

import { JSX, useRef, useState } from "react";

interface TrailerButtonProps {
  trailerUrl?: string;
  title: string;
}

const TrailerButton = ({ trailerUrl, title }: TrailerButtonProps): JSX.Element | null => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resumeTime, setResumeTime] = useState<number | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"16/9" | "21/9" | "4/3">("16/9");
  const [isPipMode, setIsPipMode] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!trailerUrl) return null;

  const getStorageKey = () => `koku_trailer_ts_${encodeURIComponent(title)}`;

  const openModal = () => {
    try {
      const saved = localStorage.getItem(getStorageKey());
      if (saved) {
        setResumeTime(parseInt(saved, 10));
      }
    } catch {}
    setIsOpen(true);
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsTheaterMode(false);
    dialogRef.current?.close();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const cycleAspectRatio = () => {
    setAspectRatio((prev) => (prev === "16/9" ? "21/9" : prev === "21/9" ? "4/3" : "16/9"));
  };

  const togglePip = () => {
    setIsPipMode((prev) => !prev);
    if (!isPipMode) setIsTheaterMode(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        title="Tonton Trailer Resmi (Shortcut: T)"
        className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 font-display text-xs font-bold text-accent transition-all duration-200 hover:bg-accent hover:text-(--accent-ink) active:scale-95 cursor-pointer"
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
        className={`backdrop:backdrop-blur-md rounded-2xl border border-border bg-surface-solid p-0 text-ink shadow-2xl transition-all duration-300 ${
          isPipMode
            ? "fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-50 m-0 w-80 max-w-sm backdrop:bg-transparent shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            : isTheaterMode
              ? "m-auto w-[94vw] max-w-6xl backdrop:bg-black/95"
              : "m-auto w-[94vw] max-w-3xl backdrop:bg-black/80"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-3.5 py-2.5 sm:px-4 sm:py-3 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto [scrollbar-width:none] min-w-0 flex-1">
            <h3 className="line-clamp-1 font-display text-xs sm:text-sm font-bold text-ink shrink-0">Trailer: {title}</h3>
            {!isPipMode && (
              <button
                type="button"
                onClick={() => setIsTheaterMode((prev) => !prev)}
                title="Perbesar layar dan redupkan suasana sekitar (Mode Bioskop)"
                className={`hidden sm:inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold transition-all cursor-pointer shrink-0 ${
                  isTheaterMode
                    ? "bg-amber-400 text-black font-bold shadow-md"
                    : "border border-border bg-surface text-ink-muted hover:text-ink"
                }`}
              >
                <span>{isTheaterMode ? "🎦 Bioskop: ON" : "🎦 Mode Bioskop"}</span>
              </button>
            )}
            <button
              type="button"
              onClick={togglePip}
              title="Mini Player Mengambang (Picture-in-Picture)"
              className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold transition-all cursor-pointer shrink-0 ${
                isPipMode
                  ? "bg-accent text-(--accent-ink) font-bold"
                  : "border border-border bg-surface text-ink-muted hover:text-ink"
              }`}
            >
              <span>{isPipMode ? "🔲 Normal" : "🔲 PiP"}</span>
            </button>
            <button
              type="button"
              onClick={cycleAspectRatio}
              title="Ganti Rasio Aspek Video (16:9 / 21:9 / 4:3)"
              className="hidden sm:inline-flex rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer shrink-0"
            >
              <span>📐 {aspectRatio}</span>
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              title="Layar Penuh (Shortcut: F)"
              className="rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[10px] font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer shrink-0"
            >
              <span>{isFullscreen ? "⤓ Normal" : "⤢ Fullscreen"}</span>
            </button>
            <a
              href={trailerUrl.replace("/embed/", "/watch?v=")}
              target="_blank"
              rel="noopener noreferrer"
              title="Buka langsung di YouTube untuk fitur playback speed 2x dan 4K"
              className="hidden sm:inline-flex rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer shrink-0"
            >
              <span>↗ YouTube</span>
            </a>
            {resumeTime && resumeTime > 5 && (
              <span className="hidden md:inline-block rounded-full bg-accent/15 border border-accent/30 px-2 py-0.5 font-mono text-[10px] text-accent shrink-0">
                Resume {Math.floor(resumeTime / 60)}:{(resumeTime % 60).toString().padStart(2, "0")}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeModal}
            aria-label="Tutup trailer"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface hover:text-ink cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div
          ref={containerRef}
          className={`relative w-full bg-black ${
            aspectRatio === "21/9" ? "aspect-21/9" : aspectRatio === "4/3" ? "aspect-4/3" : "aspect-video"
          }`}
        >
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
        <div className="flex flex-wrap items-center justify-between border-t border-border px-4 py-2 text-xs font-mono text-ink-muted">
          <div className="flex items-center gap-3">
            <span>Pintasan:</span>
            <span>
              <kbd className="rounded bg-surface px-1.5 py-0.5 font-bold">F</kbd> Layar Penuh
            </span>
            <span>
              <kbd className="rounded bg-surface px-1.5 py-0.5 font-bold">Esc</kbd> Tutup
            </span>
          </div>
          <span className="hidden sm:inline">Subtitle: ID / JP Audio • Multi-Resolution</span>
        </div>
      </dialog>
    </>
  );
};

export default TrailerButton;
