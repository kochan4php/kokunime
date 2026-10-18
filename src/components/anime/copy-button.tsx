"use client";

import { JSX } from "react";
import { showToast } from "@/utils/toast";

interface CopyButtonProps {
  url?: string | undefined;
  text?: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

// One-tap copy for download managers or anime titles. The toast is the single
// live-region announcement: a live region inside every button would repeat the
// same label dozens of times per page.
const CopyButton = ({
  url,
  text,
  label = "Salin",
  copiedLabel = "✓ Tersalin",
  className = "",
}: CopyButtonProps): JSX.Element => {
  const target = text || url;

  if (!target) return <span aria-hidden className="w-11" />;

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(target);
      showToast(copiedLabel);
    } catch {
      // clipboard blocked — nothing we can do, stay quiet
    }
  };

  return (
    <button
      type="button"
      onClick={() => void copy()}
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-sm border-2 px-3 font-mono text-[11px] font-semibold uppercase tracking-wider transition-all duration-150 cursor-pointer border-border bg-surface text-ink-muted shadow-[2px_2px_0_0_var(--border)] motion-safe:hover:-translate-y-0.5 hover:bg-nb-yellow hover:text-nb-ink active:translate-y-0 active:shadow-none ${className}`}
    >
      {label}
    </button>
  );
};

export default CopyButton;
