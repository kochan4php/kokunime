"use client";

import { JSX, useState } from "react";

interface ShareButtonProps {
  title: string;
  className?: string;
  showLabel?: boolean;
  dropdownPlacement?: "top" | "bottom";
}

const ShareButton = ({
  title,
  className = "",
  showLabel = true,
  dropdownPlacement = "bottom",
}: ShareButtonProps): JSX.Element => {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;
    const shareData = {
      title: `${title} · Kokunime`,
      text: `Download ${title} Subtitle Indonesia di Kokunime: ${url}`,
      url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShowOptions(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const getShareLinks = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = encodeURIComponent(`Download ${title} Subtitle Indonesia di Kokunime:\n${url}`);
    return {
      wa: `https://api.whatsapp.com/send?text=${text}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
    };
  };

  const links = getShareLinks();

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={handleShare}
        aria-label="Bagikan anime ini"
        title="Bagikan anime"
        className={`inline-flex items-center justify-center gap-2 rounded-sm border-2 border-border bg-surface px-4 py-2 text-sm font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 motion-safe:hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        {showLabel && <span>{copied ? "✓ Link Disalin!" : "Bagikan"}</span>}
      </button>

      {showOptions && (
        <div
          className={`absolute z-50 flex items-center gap-1.5 rounded-sm border-2 border-border bg-surface-solid p-1.5 shadow-[6px_6px_0_0_var(--border)] ${
            dropdownPlacement === "top" ? "bottom-full mb-2 left-0" : "top-full mt-2 right-0"
          }`}
        >
          <a
            href={links.wa}
            target="_blank"
            rel="noopener noreferrer"
            title="Bagikan ke WhatsApp"
            onClick={() => setShowOptions(false)}
            className="flex items-center gap-1 rounded-sm border-2 border-border bg-nb-lime px-2.5 py-1 text-xs font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            <span>WhatsApp</span>
          </a>
          <a
            href={links.twitter}
            target="_blank"
            rel="noopener noreferrer"
            title="Bagikan ke X (Twitter)"
            onClick={() => setShowOptions(false)}
            className="flex items-center gap-1 rounded-sm border-2 border-border bg-nb-ink px-2.5 py-1 text-xs font-bold text-nb-cream shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            <span>X (Twitter)</span>
          </a>
          <button
            type="button"
            onClick={() => setShowOptions(false)}
            className="rounded-sm p-1 text-xs text-ink-muted hover:text-ink cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
