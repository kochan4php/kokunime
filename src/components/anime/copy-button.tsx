"use client";

import { JSX, useState } from "react";

interface CopyButtonProps {
  url?: string;
  text?: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

// One-tap copy for download managers or anime titles.
const CopyButton = ({
  url,
  text,
  label = "Salin",
  copiedLabel = "✓ Tersalin",
  className = "",
}: CopyButtonProps): JSX.Element => {
  const [copied, setCopied] = useState(false);
  const target = text || url;

  if (!target) return <span aria-hidden className="w-11" />;

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(target);
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
      aria-label={copied ? "Teks tersalin" : label}
      title={label}
      aria-live="polite"
      className={`inline-flex shrink-0 items-center justify-center rounded-full border px-3 font-mono text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 cursor-pointer ${
        copied
          ? "border-accent bg-accent/10 text-accent"
          : "border-border bg-surface text-ink-muted hover:border-accent hover:text-accent"
      } ${className}`}
    >
      {copied ? copiedLabel : label}
    </button>
  );
};

export default CopyButton;
