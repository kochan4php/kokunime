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
      className={`inline-flex shrink-0 items-center justify-center rounded-sm border-2 px-3 font-mono text-[11px] font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
        copied
          ? "border-border bg-nb-lime text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
          : "border-border bg-surface text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 hover:bg-nb-yellow hover:text-nb-ink active:translate-y-0 active:shadow-none"
      } ${className}`}
    >
      {copied ? copiedLabel : label}
    </button>
  );
};

export default CopyButton;
