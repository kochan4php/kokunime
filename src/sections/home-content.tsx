import FeaturedHero from "@/sections/featured-hero";
import LatestGrid from "@/sections/latest-grid";
import RecommendationSection from "@/sections/recommendation-section";
import HomeHistoryStrip from "@/components/home-history-strip";
import ReleaseWatcher from "@/components/release-watcher";
import SearchForm from "@/components/search-form";
import { getBlurDataUrl } from "@/lib/blur";
import { getAnimePerPage } from "@/services/scraper";
import { animeSlug } from "@/utils/endpoint-slug";
import Link from "next/link";
import { JSX } from "react";

interface HomeSectionProps {
  page: number;
  basePath?: string | undefined;
}

// Front-page shortcut board. One flat sticker colour per tile keeps the
// sticker-wall look while the hrefs stay the single source of truth.
const QUICK_LINKS = [
  { href: "/genres", label: "Genre", icon: "🎭", note: "50+ kategori", tone: "bg-nb-yellow" },
  { href: "/seasons", label: "Musim", icon: "📅", note: "Jadwal & arsip", tone: "bg-nb-teal" },
  { href: "/bookmarks", label: "Bookmark", icon: "🔖", note: "Koleksi pribadi", tone: "bg-nb-pink" },
  { href: "/compare", label: "Bandingkan", icon: "⚖️", note: "Adu spek anime", tone: "bg-nb-lime" },
  { href: "/roulette", label: "Roulette", icon: "🎲", note: "Anime acak", tone: "bg-nb-purple" },
  { href: "/wrapped", label: "Wrapped", icon: "🎁", note: "Rekap tahunan", tone: "bg-nb-orange" },
];

// Split into two async sections so the hero and the catalog grid each stream
// inside their own Suspense boundary (see app/page.tsx). Both await the same
// cached upstream call, so the cache single-flight dedupes the fetch.
export const HomeHeroSection = async (): Promise<JSX.Element> => {
  const { anime = [], pagination } = await getAnimePerPage(1);
  const blurDataURL = await getBlurDataUrl(anime[0]?.link?.image);
  const edition = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <>
      <section className="container px-4 pt-6 md:pt-10">
        {/* Masthead: edition date + real catalog size, magazine style. */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-2 border-border bg-surface-solid px-3.5 py-2 shadow-[3px_3px_0_0_var(--border)]">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink">Edisi {edition}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted">
            {pagination?.total_page ? `${pagination.total_page} halaman katalog` : "Katalog"} · batch + episode · sub
            indo
          </p>
        </div>

        {/* Front page: feature hero on the left; a working sidebar on the
            right. The sidebar comes first on mobile so search stays close to
            the fold — finding one title is the main job here. */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="order-2 min-w-0 lg:order-1">
            <FeaturedHero featured={anime[0]} items={anime} blurDataURL={blurDataURL} />
          </div>

          <aside className="order-1 flex flex-col gap-5 lg:order-2">
            <div className="card-shell">
              <div className="card-core p-4">
                <h2 className="font-display text-lg font-black uppercase tracking-tight">Cari cepat</h2>
                <p className="mt-1 text-xs text-ink-muted">Ketik judul anime, lalu Enter.</p>
                <div className="mt-3">
                  <SearchForm inputClassName="h-12 pl-10 text-sm" />
                </div>
              </div>
            </div>

            <nav aria-label="Pintasan" className="grid grid-cols-2 gap-3">
              {QUICK_LINKS.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col gap-1 border-2 border-border p-3 text-nb-ink shadow-[3px_3px_0_0_var(--border)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${item.tone} ${
                    index % 2 === 0 ? "-rotate-[0.6deg]" : "rotate-[0.6deg]"
                  }`}
                >
                  <span aria-hidden="true" className="text-xl leading-none">
                    {item.icon}
                  </span>
                  <span className="font-display text-sm font-black uppercase tracking-tight">{item.label}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wide opacity-70">{item.note}</span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      </section>
      <HomeHistoryStrip />
    </>
  );
};

export const HomeLatestSection = async ({ page, basePath }: HomeSectionProps): Promise<JSX.Element> => {
  const { anime = [], pagination } = await getAnimePerPage(page);
  const releaseItems = anime
    .map((item) => ({ slug: animeSlug(item?.link?.endpoint), title: item.title ?? "", release: item.release }))
    .filter((item) => Boolean(item.slug));
  return (
    <>
      <ReleaseWatcher items={releaseItems} />
      <LatestGrid anime={anime} pagination={pagination} basePath={basePath} />
    </>
  );
};

const HomeContent = async ({ page, basePath }: HomeSectionProps): Promise<JSX.Element> => (
  <>
    <HomeHeroSection />
    <HomeLatestSection page={page} basePath={basePath} />
    <RecommendationSection />
  </>
);

export default HomeContent;
