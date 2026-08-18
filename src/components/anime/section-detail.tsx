import DetailHero from "./detail-hero";
import DownloadSection from "./download-section";
import InfoSide from "./info-side";
import NewSeriesSection from "./new-series-section";
import Synopsis from "./synopsis";
import HistoryTracker from "./history-tracker";
import DetailToc from "./detail-toc";
import Reveal from "@/components/reveal";
import { ArrowDownIcon } from "@/components/icons";
import { AnimeDetail } from "@/interfaces";
import Link from "next/link";
import { JSX } from "react";

import BookmarkButton from "./bookmark-button";
import ShareButton from "./share-button";

const SectionDetail = ({ anime, slug }: { anime: AnimeDetail; slug: string }): JSX.Element => (
  <section className="container px-4 pb-8 pt-12 md:pb-12 md:pt-16">
    <DetailToc />
    <HistoryTracker slug={slug} title={anime.title ?? ""} image={anime.image} release={anime.release_on} />
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
    <div id="hero">
      <DetailHero anime={anime} slug={slug} />
    </div>
    <div id="synopsis" className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] scroll-mt-24">
      <Synopsis anime={anime} />
      <Reveal delay={100}>
        <div id="info">
          <InfoSide anime={anime} />
        </div>
      </Reveal>
    </div>
    <DownloadSection anime={anime} />
    <NewSeriesSection slug={slug} />

    {/* Mobile-only sticky CTA: the download action is the core task — keep it
        one tap away instead of buried below the synopsis. pb uses the iOS
        safe-area inset so the home indicator doesn't cover the button. */}
    {anime.download?.length > 0 && (
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-border bg-bg/90 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg lg:hidden">
        <BookmarkButton
          slug={slug}
          title={anime.title ?? ""}
          image={anime.image}
          release={anime.release_on}
          className="!h-11 !w-11 shrink-0 rounded-xl border border-border bg-surface text-ink"
        />
        <ShareButton
          title={anime.title ?? ""}
          className="!h-11 !w-11 shrink-0 rounded-xl border border-border bg-surface text-ink"
        />
        <a href="#download" className="btn-primary flex-1 justify-center">
          <span>Lihat Download</span>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/15">
            <ArrowDownIcon className="h-3 w-3" />
          </span>
        </a>
      </div>
    )}
  </section>
);

export default SectionDetail;
