"use client";

import { DownloadOption } from "@/interfaces";
import DownloadExtrasPanel from "@/components/anime/download-extras-panel";
import { collectLinks, isLargeBatch } from "@/utils/download-export";
import { JSX, useMemo, useState } from "react";

interface BatchDownloadToolsProps {
  group: DownloadOption;
  animeTitle?: string | undefined;
}

const BatchDownloadTools = ({ group, animeTitle }: BatchDownloadToolsProps): JSX.Element => {
  const [copied, setCopied] = useState(false);
  const [showMoreTools, setShowMoreTools] = useState(false);
  const [copiedRes, setCopiedRes] = useState<string | null>(null);

  const largeBatch = useMemo(() => isLargeBatch(group), [group]);

  const copyAll = async () => {
    const links = collectLinks(group);
    if (links.length === 0) return;
    try {
      await navigator.clipboard.writeText(links.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  const copyQuality = async (qualityMatch: string) => {
    const urls: string[] = [];
    group.link_download.forEach((res) => {
      if (res.resolusi.toLowerCase().includes(qualityMatch.toLowerCase())) {
        res.link.forEach((target) => {
          if (target.url) urls.push(target.url);
        });
      }
    });
    if (urls.length === 0) return;
    try {
      await navigator.clipboard.writeText(urls.join("\n"));
      setCopiedRes(qualityMatch);
      setTimeout(() => setCopiedRes(null), 2000);
    } catch {}
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {largeBatch && (
        <span
          title="Ukuran batch ini tergolong besar (>= 10 GB). Pastikan ruang penyimpanan mencukupi."
          className="inline-flex items-center gap-1 rounded-sm border-2 border-border bg-nb-red px-2 py-0.5 font-mono text-[10px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
        >
          ⚠️ &gt; 10 GB
        </span>
      )}
      <button
        type="button"
        onClick={copyAll}
        title="Salin semua URL link untuk IDM / JDownloader"
        className={`inline-flex items-center gap-1 rounded-sm border-2 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider transition-all duration-150 cursor-pointer ${
          copied
            ? "border-border bg-nb-lime text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
            : "border-border bg-surface text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none"
        }`}
      >
        <span>{copied ? "✓ Tersalin!" : "Salin Semua URL"}</span>
      </button>

      {["1080p", "720p", "480p"].map((q) => {
        const hasQ = group.link_download.some((r) => r.resolusi.toLowerCase().includes(q));
        if (!hasQ) return null;
        return (
          <button
            key={q}
            type="button"
            onClick={() => copyQuality(q)}
            title={`Salin semua link resolusi ${q}`}
            className={`inline-flex items-center gap-1 rounded-sm border-2 px-2 py-0.5 sm:px-2.5 sm:py-1 font-mono text-[10px] font-semibold transition-all duration-150 cursor-pointer ${
              copiedRes === q
                ? "border-border bg-nb-lime text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
                : "border-border bg-surface text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none"
            }`}
          >
            <span>{copiedRes === q ? `✓ ${q}` : `📋 ${q}`}</span>
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => setShowMoreTools((prev) => !prev)}
        title="Buka opsi ekspor lanjutan (Provider, IDM, DLC, aria2c, cURL, Markdown, Estimasi)"
        className={`inline-flex items-center gap-1 rounded-sm border-2 px-2.5 py-1 font-mono text-[10px] font-semibold transition-all duration-150 cursor-pointer ${
          showMoreTools
            ? "border-border bg-accent text-(--accent-ink) font-bold shadow-[2px_2px_0_0_var(--border)]"
            : "border-border bg-surface text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none"
        }`}
      >
        <span>{showMoreTools ? "🛠️ Tutup Opsi ▲" : "🛠️ Opsi Ekspor ▼"}</span>
      </button>

      {showMoreTools && <DownloadExtrasPanel group={group} animeTitle={animeTitle} />}
    </div>
  );
};

export default BatchDownloadTools;
