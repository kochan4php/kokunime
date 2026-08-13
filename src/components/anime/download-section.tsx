import DownloadGroup from "./download-group";
import Reveal from "@/components/reveal";
import { AnimeDetail, DownloadOption } from "@/interfaces";
import { JSX } from "react";

const DownloadSection = ({ anime }: { anime: AnimeDetail }): JSX.Element => {
  const downloads = anime.download ?? [];

  // Never render an empty "Pilih Kualitas" section (e.g. an upstream parse
  // that produced no groups) — a header with nothing under it looks broken.
  if (downloads.length === 0) return <></>;

  return (
    <div id="download" className="mt-16 scroll-mt-28">
      <Reveal>
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Download
          </span>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink">Pilih Kualitas</h2>
        </div>
      </Reveal>
      <div className="grid gap-6">
        {downloads.map((group: DownloadOption, index: number) => (
          <Reveal key={index} delay={index * 80}>
            <DownloadGroup group={group} />
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default DownloadSection;
