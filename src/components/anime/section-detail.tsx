import DetailHero from "./detail-hero";
import DownloadSection from "./download-section";
import InfoSide from "./info-side";
import NewSeriesSection from "./new-series-section";
import Synopsis from "./synopsis";
import Reveal from "@/components/reveal";
import { ArrowDownIcon } from "@/components/icons";
import { AnimeDetail } from "@/interfaces";
import Link from "next/link";
import { JSX } from "react";

const SectionDetail = ({ anime, slug }: { anime: AnimeDetail; slug: string }): JSX.Element => (
  <section className="container px-4 pb-8 pt-12 md:pb-12 md:pt-16">
    {/* Visible breadcrumb matching the BreadcrumbList JSON-LD — required for
        the breadcrumb rich result. */}
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-xs text-ink-muted">
        <li>
          <Link href="/" className="transition-colors hover:text-accent">
            Beranda
          </Link>
        </li>
        <li aria-hidden="true">›</li>
        <li aria-current="page" className="line-clamp-1 max-w-[60vw] font-semibold text-ink">
          {anime.title}
        </li>
      </ol>
    </nav>
    <Reveal>
      <DetailHero anime={anime} />
    </Reveal>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
      <Synopsis anime={anime} />
      <Reveal delay={100}>
        <InfoSide anime={anime} />
      </Reveal>
    </div>
    <DownloadSection anime={anime} />
    <NewSeriesSection slug={slug} />

    {/* Mobile-only sticky CTA: the download action is the core task — keep it
        one tap away instead of buried below the synopsis. */}
    {anime.download?.length > 0 && (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/90 p-3 backdrop-blur-lg lg:hidden">
        <a href="#download" className="btn-primary w-full justify-center">
          Lihat Download
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/15">
            <ArrowDownIcon className="h-3.5 w-3.5" />
          </span>
        </a>
      </div>
    )}
  </section>
);

export default SectionDetail;
