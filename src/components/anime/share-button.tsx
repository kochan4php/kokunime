"use client";

import { JSX, useState } from "react";

interface ShareButtonProps {
  title: string;
  className?: string;
}

const ShareButton = ({ title, className = "" }: ShareButtonProps): JSX.Element => {
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
        className={`inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink-muted transition-all duration-200 hover:border-accent hover:text-accent hover:bg-surface-muted active:scale-95 cursor-pointer ${className}`}
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
        <span>{copied ? "✓ Link Disalin!" : "Bagikan"}</span>
      </button>

      {showOptions && (
        <div className="absolute right-0 top-full mt-2 z-50 flex items-center gap-1.5 rounded-2xl border border-border bg-surface-solid/95 p-1.5 shadow-2xl backdrop-blur-md">
          <a
            href={links.wa}
            target="_blank"
            rel="noopener noreferrer"
            title="Bagikan ke WhatsApp"
            onClick={() => setShowOptions(false)}
            className="flex items-center gap-1 rounded-xl bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
          >
            <span>WhatsApp</span>
          </a>
          <a
            href={links.twitter}
            target="_blank"
            rel="noopener noreferrer"
            title="Bagikan ke X (Twitter)"
            onClick={() => setShowOptions(false)}
            className="flex items-center gap-1 rounded-xl bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-400 hover:bg-sky-500 hover:text-white transition-colors"
          >
            <span>X (Twitter)</span>
          </a>
          <button
            type="button"
            onClick={() => setShowOptions(false)}
            className="rounded-lg p-1 text-xs text-ink-muted hover:text-ink cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
