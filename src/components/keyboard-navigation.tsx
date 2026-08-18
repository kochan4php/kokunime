"use client";

import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SHORTCUTS = [
  { key: "⌘K / /", desc: "Pencarian Cepat / Command Palette" },
  { key: "← → ↑ ↓", desc: "Navigasi Antar Kartu Anime di Grid" },
  { key: "D", desc: "Lompat ke bagian Download (Detail Anime)" },
  { key: "T", desc: "Putar Trailer YouTube (Detail Anime)" },
  { key: "R", desc: "Buka Anime Acak / Randomizer" },
  { key: "?", desc: "Buka Panduan Pintasan Keyboard" },
  { key: "Esc", desc: "Tutup Modal / Popup Aktif" },
];

const KeyboardNavigation = (): JSX.Element | null => {
  const [showHelp, setShowHelp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        setShowHelp(false);
        return;
      }

      if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
        const cards = Array.from(document.querySelectorAll<HTMLAnchorElement>("a.group.card-shell"));
        if (cards.length > 0) {
          const currentIndex = cards.findIndex((card) => card === document.activeElement);
          if (currentIndex === -1) {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              cards[0]?.focus();
            }
          } else {
            let nextIndex = currentIndex;
            if (e.key === "ArrowRight") nextIndex = Math.min(cards.length - 1, currentIndex + 1);
            if (e.key === "ArrowLeft") nextIndex = Math.max(0, currentIndex - 1);
            if (e.key === "ArrowDown") nextIndex = Math.min(cards.length - 1, currentIndex + 4);
            if (e.key === "ArrowUp") nextIndex = Math.max(0, currentIndex - 4);

            if (nextIndex !== currentIndex) {
              e.preventDefault();
              cards[nextIndex]?.focus();
            }
          }
        }
      }

      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        router.push("/api/random");
        return;
      }

      if (e.key === "d" || e.key === "D") {
        const downloadSec = document.getElementById("download");
        if (downloadSec) {
          e.preventDefault();
          downloadSec.scrollIntoView({ behavior: "smooth" });
        }
      }

      if (e.key === "t" || e.key === "T") {
        const trailerBtn = document.querySelector<HTMLButtonElement>(
          'button[aria-label*="Trailer"], button[aria-label*="trailer"]',
        );
        if (trailerBtn) {
          e.preventDefault();
          trailerBtn.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  if (!showHelp) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={() => setShowHelp(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-surface-solid p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 font-mono text-sm font-bold text-accent">
              ⌨
            </span>
            <h2 id="shortcuts-title" className="font-display text-lg font-bold text-ink">
              Pintasan Keyboard
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowHelp(false)}
            aria-label="Tutup panduan"
            className="rounded-lg p-1.5 text-xs text-ink-muted hover:bg-surface hover:text-ink cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 divide-y divide-border/60">
          {SHORTCUTS.map((sc) => (
            <div key={sc.key} className="flex items-center justify-between py-2.5">
              <span className="text-xs text-ink-muted">{sc.desc}</span>
              <kbd className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-[11px] font-semibold text-ink shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 text-center">
          <span className="font-mono text-[11px] text-ink-muted">
            Tekan <kbd className="rounded border border-border px-1 py-0.5 text-[10px]">Esc</kbd> untuk menutup
          </span>
        </div>
      </div>
    </div>
  );
};

export default KeyboardNavigation;
