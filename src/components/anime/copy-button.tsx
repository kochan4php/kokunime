"use client";

import { JSX, useState } from "react";

// One-tap copy for download managers — the core action on this site.
const CopyButton = ({ url }: { url?: string }): JSX.Element => {
  const [copied, setCopied] = useState(false);

  if (!url) return <span aria-hidden className="w-11" />;

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — nothing we can do, stay quiet
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Link tersalin" : "Salin link download"}
      title="Salin link"
      // aria-live: announce the "✓ Tersalin" status change to screen
      // readers (WCAG 4.1.3 — a label swap alone is not reliably announced).
      aria-live="polite"
      className={`inline-flex shrink-0 items-center justify-center rounded-full border px-3 font-mono text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 ${
        copied
          ? "border-accent bg-accent/10 text-accent"
          : "border-border bg-surface text-ink-muted hover:border-accent hover:text-accent"
      }`}
    >
      {copied ? "✓ Tersalin" : "Salin"}
    </button>
  );
};

export default CopyButton;
