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
        className="rounded-sm border-2 border-border bg-surface px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
      >
        <span>📖 Mode Baca</span>
      </button>

      {isFocus && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Mode Fokus Membaca ${title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-sm border-2 border-border bg-surface-solid p-6 md:p-8 text-ink shadow-[6px_6px_0_0_var(--border)]">
            <div className="mb-4 flex items-center justify-between border-b-2 border-border pb-3">
              <h3 className="font-display text-lg font-bold text-accent-text">{title}</h3>
              <button
                type="button"
                onClick={() => setIsFocus(false)}
                className="rounded-sm border-2 border-border bg-surface px-3 py-1 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:text-ink cursor-pointer"
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
                className="rounded-sm border-2 border-border bg-accent px-4 py-1.5 font-display text-xs font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
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
