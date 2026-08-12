import DetailHero from "./detail-hero";
import DownloadSection from "./download-section";
import InfoSide from "./info-side";
import NewSeriesSection from "./new-series-section";
import Synopsis from "./synopsis";
import Reveal from "@/components/reveal";
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
  </section>
);

export default SectionDetail;
