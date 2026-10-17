"use client";

import { DownloadOption } from "@/interfaces";
import { JSX, useMemo, useState } from "react";

interface BatchDownloadToolsProps {
  group: DownloadOption;
  animeTitle?: string;
}

const BatchDownloadTools = ({ group, animeTitle }: BatchDownloadToolsProps): JSX.Element => {
  const [copied, setCopied] = useState(false);
  const [copiedAria2, setCopiedAria2] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [showMoreTools, setShowMoreTools] = useState(false);

  const isLargeBatch = useMemo(() => {
    const text = `${group.title} ${group.link_download.map((r) => r.resolusi).join(" ")}`;
    const gbMatch = text.match(/(\d+(?:\.\d+)?)\s*gb/i);
    const gbValue = gbMatch?.[1];
    if (gbValue && parseFloat(gbValue) >= 10) return true;
    return false;
  }, [group]);

  const getLinks = (): string[] => {
    const urls: string[] = [];
    group.link_download.forEach((res) => {
      res.link.forEach((target) => {
        if (target.url) urls.push(target.url);
      });
    });
    return urls;
  };

  const getDetailedText = (): string => {
    const lines: string[] = [
      `# ${animeTitle ?? "Anime"} - ${group.title}`,
      `# Sumber: Kokunime (https://kokunime.netlify.app)`,
      "",
    ];
    group.link_download.forEach((res) => {
      if (res.resolusi) lines.push(`[${res.resolusi}]`);
      res.link.forEach((target) => {
        if (target.url) lines.push(`${target.platform}: ${target.url}`);
      });
      lines.push("");
    });
    return lines.join("\n").trim();
  };

  const copyAll = async () => {
    const links = getLinks();
    if (links.length === 0) return;
    try {
      await navigator.clipboard.writeText(links.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  const copyAria2 = async () => {
    const links = getLinks();
    if (links.length === 0) return;
    const ariaContent = links.map((url) => `${url}\n  dir=downloads\n  max-connection-per-server=4`).join("\n");
    try {
      await navigator.clipboard.writeText(ariaContent);
      setCopiedAria2(true);
      setTimeout(() => setCopiedAria2(false), 2000);
    } catch {}
  };

  const copyMarkdown = async () => {
    const lines: string[] = [`### ${animeTitle ?? "Anime"} - ${group.title}`, ""];
    group.link_download.forEach((res) => {
      if (res.resolusi) lines.push(`**${res.resolusi}**`);
      const links = res.link.map((target) => `[${target.platform}](${target.url})`).join(" | ");
      if (links) lines.push(links);
      lines.push("");
    });
    const mdContent = lines.join("\n").trim();
    try {
      await navigator.clipboard.writeText(mdContent);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    } catch {}
  };

  const exportTxt = () => {
    const text = getDetailedText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeTitle = (animeTitle || group.title || "download-links")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    a.href = url;
    a.download = `${safeTitle}-links.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportIdmEf2 = () => {
    const links = getLinks();
    if (links.length === 0) return;
    const ef2Content = links.map((url) => `<\n${url}\n>`).join("\n");
    const blob = new Blob([ef2Content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeTitle = (animeTitle || group.title || "idm-links")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    a.href = url;
    a.download = `${safeTitle}.ef2`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCurlSh = () => {
    const links = getLinks();
    if (links.length === 0) return;
    const shContent =
      `#!/usr/bin/env bash\n# Download script for ${animeTitle ?? "Anime"} - ${group.title}\nmkdir -p downloads && cd downloads\n\n` +
      links.map((url) => `curl -L -O -C - "${url}"`).join("\n");
    const blob = new Blob([shContent], { type: "application/x-sh;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeTitle = (animeTitle || group.title || "download-script")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    a.href = url;
    a.download = `download-${safeTitle}.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [showSpeedCalc, setShowSpeedCalc] = useState(false);
  const [showRawTextarea, setShowRawTextarea] = useState(false);
  const [fileSizeMb, setFileSizeMb] = useState(1500);

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

  const [copiedRes, setCopiedRes] = useState<string | null>(null);

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

  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

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

  const exportDlc = () => {
    const links = getLinks();
    if (links.length === 0) return;
    // Standard JDownloader DLC text container
    const dlcHeader = `<dlc>\n  <header>\n    <generator>\n      <app>Kokunime</app>\n      <version>1.0</version>\n      <url>https://kokunime.netlify.app</url>\n    </generator>\n  </header>\n  <content>\n    <package name="${animeTitle ?? "Kokunime Batch"}">\n`;
    const dlcFooter = `    </package>\n  </content>\n</dlc>`;
    const dlcLinks = links.map((url) => `      <file>\n        <url>${url}</url>\n      </file>`).join("\n");
    const dlcContent = `${dlcHeader}${dlcLinks}\n${dlcFooter}`;
    const blob = new Blob([dlcContent], { type: "application/xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeTitle = (animeTitle || group.title || "jdownloader-links")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    a.href = url;
    a.download = `${safeTitle}.dlc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isLargeBatch && (
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

      {showMoreTools && (
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
                className={`inline-flex items-center gap-1 rounded-sm border-2 px-2.5 py-1 font-mono text-[10px] font-semibold transition-all cursor-pointer ${
                  copiedPlatform === p
                    ? "border-border bg-nb-lime text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
                    : "border-border bg-surface text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none"
                }`}
              >
                <span>{copiedPlatform === p ? `✓ ${p}` : `📦 ${p}`}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={copyAria2}
            title="Salin format untuk aria2c (aria2c -i list.txt)"
            className={`inline-flex items-center gap-1 rounded-sm border-2 px-2.5 py-1 font-mono text-[10px] font-semibold transition-all cursor-pointer ${
              copiedAria2
                ? "border-border bg-nb-lime text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
                : "border-border bg-surface text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none"
            }`}
          >
            <span>{copiedAria2 ? "✓ aria2c Tersalin!" : "aria2c"}</span>
          </button>
          <button
            type="button"
            onClick={copyMarkdown}
            title="Salin link dalam format Markdown"
            className={`inline-flex items-center gap-1 rounded-sm border-2 px-2.5 py-1 font-mono text-[10px] font-semibold transition-all cursor-pointer ${
              copiedMd
                ? "border-border bg-nb-lime text-nb-ink shadow-[2px_2px_0_0_var(--border)]"
                : "border-border bg-surface text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none"
            }`}
          >
            <span>{copiedMd ? "✓ Markdown Tersalin!" : "Markdown"}</span>
          </button>
          <button
            type="button"
            onClick={exportTxt}
            title="Unduh daftar tautan sebagai file teks (.txt)"
            className="inline-flex items-center gap-1 rounded-sm border-2 border-border bg-surface px-2.5 py-1 font-mono text-[10px] font-semibold shadow-[2px_2px_0_0_var(--border)] text-ink-muted transition-all hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
          >
            <span>📄 .txt</span>
          </button>
          <button
            type="button"
            onClick={exportIdmEf2}
            title="Export file .ef2 untuk Internet Download Manager (IDM)"
            className="inline-flex items-center gap-1 rounded-sm border-2 border-border bg-surface px-2.5 py-1 font-mono text-[10px] font-semibold shadow-[2px_2px_0_0_var(--border)] text-ink-muted transition-all hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
          >
            <span>IDM (.ef2)</span>
          </button>
          <button
            type="button"
            onClick={exportDlc}
            title="Export file .dlc untuk JDownloader 2"
            className="inline-flex items-center gap-1 rounded-sm border-2 border-border bg-surface px-2.5 py-1 font-mono text-[10px] font-semibold shadow-[2px_2px_0_0_var(--border)] text-ink-muted transition-all hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
          >
            <span>JDownloader (.dlc)</span>
          </button>
          <button
            type="button"
            onClick={exportCurlSh}
            title="Unduh bash script curl untuk download via Linux / VPS terminal"
            className="inline-flex items-center gap-1 rounded-sm border-2 border-border bg-surface px-2.5 py-1 font-mono text-[10px] font-semibold shadow-[2px_2px_0_0_var(--border)] text-ink-muted hover:-translate-y-0.5 hover:text-ink transition-all active:translate-y-0 active:shadow-none cursor-pointer"
          >
            <span>cURL (.sh)</span>
          </button>
          <button
            type="button"
            onClick={() => setShowRawTextarea((prev) => !prev)}
            title="Buka area teks mentah untuk salin manual"
            className="inline-flex items-center gap-1 rounded-sm border-2 border-border bg-surface px-2.5 py-1 font-mono text-[10px] font-semibold shadow-[2px_2px_0_0_var(--border)] text-ink-muted hover:-translate-y-0.5 hover:text-ink transition-all active:translate-y-0 active:shadow-none cursor-pointer"
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
      )}

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
            value={getLinks().join("\n")}
            onClick={(e) => e.currentTarget.select()}
            className="w-full rounded-sm border-2 border-border bg-surface p-2.5 font-mono text-xs text-ink shadow-[2px_2px_0_0_var(--border)] focus:border-accent focus:outline-none select-all cursor-text"
          />
        </div>
      )}
    </div>
  );
};

export default BatchDownloadTools;
