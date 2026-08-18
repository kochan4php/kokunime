"use client";

import DownloadGroup from "./download-group";
import Reveal from "@/components/reveal";
import { AnimeDetail, DownloadOption } from "@/interfaces";
import { JSX, useMemo, useState } from "react";

const DownloadSection = ({ anime }: { anime: AnimeDetail }): JSX.Element => {
  const downloads = useMemo(() => anime.download ?? [], [anime.download]);
  const [selectedRes, setSelectedRes] = useState<string>("all");

  const availableResolutions = useMemo(() => {
    const set = new Set<string>();
    downloads.forEach((g) => {
      g.link_download.forEach((r) => {
        if (r.resolusi) set.add(r.resolusi.trim());
      });
    });
    return Array.from(set);
  }, [downloads]);

  const filteredDownloads = useMemo(() => {
    if (selectedRes === "all") return downloads;
    return downloads
      .map((g) => ({
        ...g,
        link_download: g.link_download.filter((r) => r.resolusi?.trim() === selectedRes),
      }))
      .filter((g) => g.link_download.length > 0);
  }, [downloads, selectedRes]);

  // Never render an empty "Pilih Kualitas" section (e.g. an upstream parse
  // that produced no groups) — a header with nothing under it looks broken.
  if (downloads.length === 0) return <></>;

  return (
    <div id="download" className="mt-16 scroll-mt-28">
      <Reveal>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Download
            </span>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">Pilih Kualitas</h2>
          </div>

          {availableResolutions.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">Resolusi:</span>
              <button
                type="button"
                onClick={() => setSelectedRes("all")}
                className={`rounded-full px-3 py-1 font-mono text-xs transition-all ${
                  selectedRes === "all"
                    ? "border border-accent/40 bg-accent/15 font-bold text-accent"
                    : "border border-border bg-surface text-ink-muted hover:text-ink"
                }`}
              >
                Semua
              </button>
              {availableResolutions.map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setSelectedRes(res)}
                  className={`rounded-full px-3 py-1 font-mono text-xs transition-all ${
                    selectedRes === res
                      ? "border border-accent/40 bg-accent/15 font-bold text-accent"
                      : "border border-border bg-surface text-ink-muted hover:text-ink"
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          )}
        </div>
      </Reveal>
      <div className="grid gap-6">
        {filteredDownloads.map((group: DownloadOption, index: number) => (
          <Reveal key={`${group.title}-${selectedRes}-${index}`} delay={index * 80}>
            <DownloadGroup group={group} animeTitle={anime.title} />
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default DownloadSection;
