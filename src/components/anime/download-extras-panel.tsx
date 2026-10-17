"use client";

import { DownloadOption } from "@/interfaces";
import {
  buildAria2,
  buildCurlSh,
  buildDetailedText,
  buildDlc,
  buildIdmEf2,
  buildMarkdown,
  collectLinks,
  safeFilename,
  triggerDownload,
} from "@/utils/download-export";
import { JSX, useState } from "react";

interface DownloadExtrasPanelProps {
  group: DownloadOption;
  animeTitle?: string | undefined;
}

const EXTRA_BUTTON_CLASS =
  "inline-flex items-center gap-1 rounded-sm border-2 border-border bg-surface px-2.5 py-1 font-mono text-[10px] font-semibold shadow-[2px_2px_0_0_var(--border)] text-ink-muted transition-all hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer";

const copiedButtonClass = (copied: boolean): string =>
  `inline-flex items-center gap-1 rounded-sm border-2 px-2.5 py-1 font-mono text-[10px] font-semibold transition-all cursor-pointer ${
    copied
      ? "border-border bg-nb-lime text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
      : "border-border bg-surface text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none"
  }`;

const calculateTime = (mb: number, mbps: number): string => {
  const totalSeconds = (mb * 8) / mbps;
  if (totalSeconds < 60) return `${Math.round(totalSeconds)} dtk`;
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.round(totalSeconds % 60);
  if (mins < 60) return `${mins}m ${secs}s`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs}j ${remMins}m`;
};

// The "advanced export" half of the batch tools: provider/quality copy, file
// exports, raw text and the speed estimator.
const DownloadExtrasPanel = ({ group, animeTitle }: DownloadExtrasPanelProps): JSX.Element => {
  const [copiedAria2, setCopiedAria2] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  const [showSpeedCalc, setShowSpeedCalc] = useState(false);
  const [showRawTextarea, setShowRawTextarea] = useState(false);
  const [fileSizeMb, setFileSizeMb] = useState(1500);

  const copyPlatform = async (plat: string) => {
    const urls: string[] = [];
    group.link_download.forEach((res) => {
      res.link.forEach((target) => {
        if (target.platform.toLowerCase().includes(plat.toLowerCase()) && target.url) {
          urls.push(target.url);
        }
      });
    });
    if (urls.length === 0) return;
    try {
      await navigator.clipboard.writeText(urls.join("\n"));
      setCopiedPlatform(plat);
      setTimeout(() => setCopiedPlatform(null), 2000);
    } catch {}
  };

  const copyAria2 = async () => {
    const links = collectLinks(group);
    if (links.length === 0) return;
    try {
      await navigator.clipboard.writeText(buildAria2(links));
      setCopiedAria2(true);
      setTimeout(() => setCopiedAria2(false), 2000);
    } catch {}
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(buildMarkdown(group, animeTitle));
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    } catch {}
  };

  const exportTxt = () => {
    const safeTitle = safeFilename(animeTitle || group.title || "download-links");
    triggerDownload(buildDetailedText(group, animeTitle), `${safeTitle}-links.txt`, "text/plain;charset=utf-8");
  };

  const exportIdmEf2 = () => {
    const links = collectLinks(group);
    if (links.length === 0) return;
    const safeTitle = safeFilename(animeTitle || group.title || "idm-links");
    triggerDownload(buildIdmEf2(links), `${safeTitle}.ef2`, "text/plain;charset=utf-8");
  };

  const exportDlc = () => {
    const links = collectLinks(group);
    if (links.length === 0) return;
    const safeTitle = safeFilename(animeTitle || group.title || "jdownloader-links");
    triggerDownload(buildDlc(links, animeTitle), `${safeTitle}.dlc`, "application/xml;charset=utf-8");
  };

  const exportCurlSh = () => {
    const links = collectLinks(group);
    if (links.length === 0) return;
    const safeTitle = safeFilename(animeTitle || group.title || "download-script");
    triggerDownload(
      buildCurlSh(links, group, animeTitle),
      `download-${safeTitle}.sh`,
      "application/x-sh;charset=utf-8",
    );
  };

  return (
    <>
      <div className="w-full mt-2 flex flex-wrap items-center gap-1.5 rounded-sm border-2 border-border bg-surface-muted p-2.5 animate-in fade-in duration-200">
        {["GDrive", "Mega", "Mediafire", "Acefile"].map((p) => {
          const hasP = group.link_download.some((r) =>
            r.link.some((t) => t.platform.toLowerCase().includes(p.toLowerCase())),
          );
          if (!hasP) return null;
          return (
            <button
              key={p}
              type="button"
              onClick={() => copyPlatform(p)}
              title={`Salin semua link khusus provider ${p}`}
              className={copiedButtonClass(copiedPlatform === p)}
            >
              <span>{copiedPlatform === p ? `✓ ${p}` : `📦 ${p}`}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={copyAria2}
          title="Salin format untuk aria2c (aria2c -i list.txt)"
          className={copiedButtonClass(copiedAria2)}
        >
          <span>{copiedAria2 ? "✓ aria2c Tersalin!" : "aria2c"}</span>
        </button>
        <button
          type="button"
          onClick={copyMarkdown}
          title="Salin link dalam format Markdown"
          className={copiedButtonClass(copiedMd)}
        >
          <span>{copiedMd ? "✓ Markdown Tersalin!" : "Markdown"}</span>
        </button>
        <button
          type="button"
          onClick={exportTxt}
          title="Unduh daftar tautan sebagai file teks (.txt)"
          className={EXTRA_BUTTON_CLASS}
        >
          <span>📄 .txt</span>
        </button>
        <button
          type="button"
          onClick={exportIdmEf2}
          title="Export file .ef2 untuk Internet Download Manager (IDM)"
          className={EXTRA_BUTTON_CLASS}
        >
          <span>IDM (.ef2)</span>
        </button>
        <button
          type="button"
          onClick={exportDlc}
          title="Export file .dlc untuk JDownloader 2"
          className={EXTRA_BUTTON_CLASS}
        >
          <span>JDownloader (.dlc)</span>
        </button>
        <button
          type="button"
          onClick={exportCurlSh}
          title="Unduh bash script curl untuk download via Linux / VPS terminal"
          className={EXTRA_BUTTON_CLASS}
        >
          <span>cURL (.sh)</span>
        </button>
        <button
          type="button"
          onClick={() => setShowRawTextarea((prev) => !prev)}
          title="Buka area teks mentah untuk salin manual"
          className={EXTRA_BUTTON_CLASS}
        >
          <span>{showRawTextarea ? "✕ Tutup Teks" : "📝 Raw Teks"}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowSpeedCalc((prev) => !prev)}
          title="Kalkulator Estimasi Waktu Download"
          className={`inline-flex items-center gap-1 rounded-sm border-2 px-2.5 py-1 font-mono text-[10px] font-semibold transition-all active:scale-95 cursor-pointer ${
            showSpeedCalc
              ? "border-border bg-nb-lime text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
              : "border-border bg-surface text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none"
          }`}
        >
          <span>⏱️ Estimasi Waktu</span>
        </button>
      </div>

      {showSpeedCalc && (
        <div className="w-full mt-3 rounded-sm border-2 border-border bg-surface-solid p-4 shadow-[6px_6px_0_0_var(--border)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-border pb-3">
            <span className="font-display text-xs font-bold text-ink">
              ⏱️ Estimasi Waktu Unduh ({fileSizeMb >= 1000 ? `${(fileSizeMb / 1000).toFixed(1)} GB` : `${fileSizeMb} MB`}
              )
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-ink-muted">Pilih Ukuran:</span>
              {[500, 1500, 3000, 6000].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFileSizeMb(size)}
                  className={`rounded-sm border-2 px-2 py-0.5 font-mono text-[10px] font-semibold transition-colors cursor-pointer ${
                    fileSizeMb === size
                      ? "border-border bg-accent text-(--accent-ink)"
                      : "border-border bg-surface text-ink-muted hover:text-ink"
                  }`}
                >
                  {size >= 1000 ? `${size / 1000}GB` : `${size}MB`}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            <div className="rounded-sm border-2 border-border bg-surface p-2.5 text-center shadow-[2px_2px_0_0_var(--border)]">
              <span className="block text-[10px] text-ink-muted">10 Mbps (1.2 MB/s)</span>
              <strong className="mt-1 inline-block rounded-sm border-2 border-border bg-nb-orange px-1.5 font-bold text-nb-ink">
                {calculateTime(fileSizeMb, 10)}
              </strong>
            </div>
            <div className="rounded-sm border-2 border-border bg-surface p-2.5 text-center shadow-[2px_2px_0_0_var(--border)]">
              <span className="block text-[10px] text-ink-muted">50 Mbps (6.2 MB/s)</span>
              <strong className="mt-1 inline-block rounded-sm border-2 border-border bg-nb-lime px-1.5 font-bold text-nb-ink">
                {calculateTime(fileSizeMb, 50)}
              </strong>
            </div>
            <div className="rounded-sm border-2 border-border bg-surface p-2.5 text-center shadow-[2px_2px_0_0_var(--border)]">
              <span className="block text-[10px] text-ink-muted">100 Mbps (12.5 MB/s)</span>
              <strong className="mt-1 inline-block rounded-sm border-2 border-border bg-nb-teal px-1.5 font-bold text-nb-ink">
                {calculateTime(fileSizeMb, 100)}
              </strong>
            </div>
            <div className="rounded-sm border-2 border-border bg-surface p-2.5 text-center shadow-[2px_2px_0_0_var(--border)]">
              <span className="block text-[10px] text-ink-muted">1 Gbps (125 MB/s)</span>
              <strong className="mt-1 inline-block rounded-sm border-2 border-border bg-nb-yellow px-1.5 font-bold text-nb-ink">
                {calculateTime(fileSizeMb, 1000)}
              </strong>
            </div>
          </div>
        </div>
      )}

      {showRawTextarea && (
        <div className="w-full mt-3 rounded-sm border-2 border-border bg-surface-solid p-4 shadow-[6px_6px_0_0_var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-display text-xs font-bold text-ink">
              📝 Salin Manual (Klik teks untuk Select All / Ctrl + A)
            </span>
            <button
              type="button"
              onClick={() => setShowRawTextarea(false)}
              className="font-mono text-xs text-ink-muted hover:text-ink cursor-pointer"
            >
              ✕ Tutup
            </button>
          </div>
          <textarea
            readOnly
            rows={5}
            value={collectLinks(group).join("\n")}
            onClick={(e) => e.currentTarget.select()}
            className="w-full rounded-sm border-2 border-border bg-surface p-2.5 font-mono text-xs text-ink shadow-[2px_2px_0_0_var(--border)] focus:border-accent focus:outline-none select-all cursor-text"
          />
        </div>
      )}
    </>
  );
};

export default DownloadExtrasPanel;
