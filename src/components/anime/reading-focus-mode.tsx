"use client";

import { JSX, useState } from "react";

interface ReadingFocusModeProps {
  synopsis: string;
  title: string;
}

const ReadingFocusMode = ({ synopsis, title }: ReadingFocusModeProps): JSX.Element => {
  const [isFocus, setIsFocus] = useState(false);

  if (!synopsis) return <></>;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsFocus(true)}
        title="Mode fokus membaca sinopsis tanpa distraksi"
        className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-muted transition-colors hover:border-accent hover:text-ink cursor-pointer"
      >
        <span>📖 Mode Baca</span>
      </button>

      {isFocus && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Mode Fokus Membaca ${title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface-solid p-6 md:p-8 text-ink shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-lg font-bold text-accent">{title}</h3>
              <button
                type="button"
                onClick={() => setIsFocus(false)}
                className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs font-semibold text-ink-muted hover:text-ink cursor-pointer"
              >
                ✕ Tutup
              </button>
            </div>
            <div className="text-base leading-relaxed tracking-wide text-ink/90 whitespace-pre-line space-y-4 font-sans">
              {synopsis}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsFocus(false)}
                className="rounded-full bg-accent px-4 py-1.5 font-display text-xs font-bold text-(--accent-ink) hover:opacity-90 cursor-pointer"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReadingFocusMode;
