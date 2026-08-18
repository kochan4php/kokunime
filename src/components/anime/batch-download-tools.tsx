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

  const isLargeBatch = useMemo(() => {
    const text = `${group.title} ${group.link_download.map((r) => r.resolusi).join(" ")}`;
    const gbMatch = text.match(/(\d+(?:\.\d+)?)\s*gb/i);
    if (gbMatch && parseFloat(gbMatch[1]) >= 10) return true;
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
    const ariaContent = links
      .map((url) => `${url}\n  dir=downloads\n  max-connection-per-server=4`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(ariaContent);
      setCopiedAria2(true);
      setTimeout(() => setCopiedAria2(false), 2000);
    } catch {}
  };

  const copyMarkdown = async () => {
    const lines: string[] = [
      `### ${animeTitle ?? "Anime"} - ${group.title}`,
      "",
    ];
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

  const linkCount = getLinks().length;
  if (linkCount === 0) return <></>;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isLargeBatch && (
        <span
          title="Ukuran batch ini tergolong besar (>= 10 GB). Pastikan ruang penyimpanan mencukupi."
          className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-500"
        >
          ⚠️ &gt; 10 GB
        </span>
      )}
      <button
        type="button"
        onClick={copyAll}
        title="Salin semua URL link untuk IDM / JDownloader"
        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-[11px] font-semibold tracking-wider transition-all duration-200 active:scale-95 cursor-pointer ${
          copied
            ? "border-accent bg-accent/15 text-accent"
            : "border-border bg-surface text-ink-muted hover:border-accent hover:text-ink"
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
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold transition-all cursor-pointer ${
              copiedRes === q
                ? "border-accent bg-accent/15 text-accent"
                : "border-border bg-surface text-ink-muted hover:border-accent hover:text-ink"
            }`}
          >
            <span>{copiedRes === q ? `✓ ${q}` : `📋 ${q}`}</span>
          </button>
        );
      })}

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
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold transition-all cursor-pointer ${
              copiedPlatform === p
                ? "border-accent bg-accent/15 text-accent"
                : "border-border bg-surface text-ink-muted hover:border-accent hover:text-ink"
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
        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-[11px] font-semibold tracking-wider transition-all duration-200 active:scale-95 cursor-pointer ${
          copiedAria2
            ? "border-accent bg-accent/15 text-accent"
            : "border-border bg-surface text-ink-muted hover:border-accent hover:text-ink"
        }`}
      >
        <span>{copiedAria2 ? "✓ aria2c Tersalin!" : "aria2c"}</span>
      </button>
      <button
        type="button"
        onClick={copyMarkdown}
        title="Salin link dalam format Markdown"
        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-[11px] font-semibold tracking-wider transition-all duration-200 active:scale-95 cursor-pointer ${
          copiedMd
            ? "border-accent bg-accent/15 text-accent"
            : "border-border bg-surface text-ink-muted hover:border-accent hover:text-ink"
        }`}
      >
        <span>{copiedMd ? "✓ Markdown Tersalin!" : "Markdown"}</span>
      </button>
      <button
        type="button"
        onClick={exportIdmEf2}
        title="Export file .ef2 untuk Internet Download Manager (IDM)"
        className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-ink-muted transition-all duration-200 hover:border-accent hover:text-ink active:scale-95 cursor-pointer"
      >
        <span>IDM (.ef2)</span>
      </button>
      <button
        type="button"
        onClick={exportCurlSh}
        title="Unduh bash script curl untuk download via Linux / VPS terminal"
        className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-ink-muted hover:border-accent hover:text-ink transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <span>cURL (.sh)</span>
      </button>
      <button
        type="button"
        onClick={() => setShowRawTextarea((prev) => !prev)}
        title="Buka area teks mentah untuk salin manual"
        className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-ink-muted hover:border-accent hover:text-ink transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <span>{showRawTextarea ? "✕ Tutup Teks" : "📝 Raw Teks"}</span>
      </button>
      <button
        type="button"
        onClick={() => setShowSpeedCalc((prev) => !prev)}
        title="Kalkulator Estimasi Waktu Download"
        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-[11px] font-semibold tracking-wider transition-all duration-200 active:scale-95 cursor-pointer ${
          showSpeedCalc
            ? "border-accent bg-accent/15 text-accent"
            : "border-border bg-surface text-ink-muted hover:border-accent hover:text-ink"
        }`}
      >
        <span>⏱️ Estimasi Waktu</span>
      </button>

      {showSpeedCalc && (
        <div className="w-full mt-3 rounded-2xl border border-border bg-surface-solid/95 p-4 shadow-xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
            <span className="font-display text-xs font-bold text-ink">
              ⏱️ Estimasi Waktu Unduh ({fileSizeMb >= 1000 ? `${(fileSizeMb / 1000).toFixed(1)} GB` : `${fileSizeMb} MB`})
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-ink-muted">Pilih Ukuran:</span>
              {[500, 1500, 3000, 6000].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFileSizeMb(size)}
                  className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold transition-colors cursor-pointer ${
                    fileSizeMb === size
                      ? "bg-accent text-(--accent-ink)"
                      : "bg-surface border border-border text-ink-muted hover:text-ink"
                  }`}
                >
                  {size >= 1000 ? `${size / 1000}GB` : `${size}MB`}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            <div className="rounded-xl border border-border bg-surface p-2.5 text-center">
              <span className="block text-[10px] text-ink-muted">10 Mbps (1.2 MB/s)</span>
              <strong className="mt-1 block font-bold text-amber-500">{calculateTime(fileSizeMb, 10)}</strong>
            </div>
            <div className="rounded-xl border border-border bg-surface p-2.5 text-center">
              <span className="block text-[10px] text-ink-muted">50 Mbps (6.2 MB/s)</span>
              <strong className="mt-1 block font-bold text-emerald-500">{calculateTime(fileSizeMb, 50)}</strong>
            </div>
            <div className="rounded-xl border border-border bg-surface p-2.5 text-center">
              <span className="block text-[10px] text-ink-muted">100 Mbps (12.5 MB/s)</span>
              <strong className="mt-1 block font-bold text-sky-500">{calculateTime(fileSizeMb, 100)}</strong>
            </div>
            <div className="rounded-xl border border-border bg-surface p-2.5 text-center">
              <span className="block text-[10px] text-ink-muted">1 Gbps (125 MB/s)</span>
              <strong className="mt-1 block font-bold text-accent">{calculateTime(fileSizeMb, 1000)}</strong>
            </div>
          </div>
        </div>
      )}

      {showRawTextarea && (
        <div className="w-full mt-3 rounded-2xl border border-border bg-surface-solid/95 p-4 shadow-xl backdrop-blur-md">
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
            className="w-full rounded-xl border border-border bg-surface p-2.5 font-mono text-xs text-ink focus:border-accent focus:outline-none select-all cursor-text"
          />
        </div>
      )}
    </div>
  );
};

export default BatchDownloadTools;
