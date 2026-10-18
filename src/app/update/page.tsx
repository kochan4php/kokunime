import MainLayout from "@/layouts/main-layout";
import AnimeGrid from "@/components/cards/anime-grid";
import UpdateIcsButton from "@/components/update-ics-button";
import ReleaseWatcher from "@/components/release-watcher";
import { getAnimePerPage } from "@/services/scraper";
import { Anime } from "@/interfaces";
import { AgeBucket, parseRelativeAge } from "@/utils/relative-age";
import { animeSlug } from "@/utils/endpoint-slug";
import { SITE_URL } from "@/lib/site";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import Breadcrumbs from "@/components/breadcrumbs";
import SectionHeader from "@/components/section-header";
import { Metadata } from "next";
import { JSX } from "react";

// On-demand ISR (5 min): a timeline only changes when upstream posts new
// releases, so every visitor sees the same cached render.
export const revalidate = 300;

const BUCKET_META: { key: AgeBucket; label: string; hint: string }[] = [
  { key: "today", label: "Hari Ini", hint: "Baru saja diperbarui" },
  { key: "yesterday", label: "Kemarin", hint: "Sehari terakhir" },
  { key: "recent", label: "Beberapa Hari Lalu", hint: "Dalam seminggu terakhir" },
  { key: "older", label: "Lebih Lama", hint: "Lebih dari seminggu lalu" },
  { key: "unknown", label: "Tanpa Tanggal", hint: "Waktu rilis tidak tersedia" },
];

export const metadata: Metadata = {
  title: "Update Terbaru Anime",
  description:
    "Anime yang baru diperbarui hari ini: episode baru, batch baru, dan lanjutan tontonan — dikelompokkan per hari.",
  alternates: { canonical: "/update" },
  openGraph: {
    title: "Update Terbaru Anime · Kokunime",
    description: "Timeline rilis & update anime terbaru per hari.",
    url: `${SITE_URL}/update`,
  },
};

const UpdatePage = async (): Promise<JSX.Element> => {
  const { anime = [] } = await getAnimePerPage(1);

  const groups = new Map<AgeBucket, Anime[]>();
  for (const item of anime) {
    const { bucket } = parseRelativeAge(item.release);
    groups.set(bucket, [...(groups.get(bucket) ?? []), item]);
  }

  // Weekly calendar reminders for everything touched within the past week.
  const calendarEvents = anime
    .filter((item) => ["today", "yesterday", "recent"].includes(parseRelativeAge(item.release).bucket))
    .map((item) => ({ title: item.title ?? "", slug: animeSlug(item?.link?.endpoint) }))
    .filter((item): item is { title: string; slug: string } => Boolean(item.slug && item.title))
    .slice(0, 20)
    .map((item) => ({ title: item.title, url: `${SITE_URL}/anime/${item.slug}` }));

  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(buildSubpageBreadcrumbJsonLd([{ name: "Update", url: "/update" }])),
          }}
          suppressHydrationWarning
        />
        <Breadcrumbs items={[{ name: "Update" }]} />
        <SectionHeader
          kicker="Timeline"
          title="Update Terbaru"
          titleAs="h1"
          tone="lime"
          className="mb-8"
          description="Anime yang baru diperbarui, dikelompokkan per hari. Ingin rutin mengecek? Simpan pengingat mingguan ke kalender Anda."
          aside={<UpdateIcsButton events={calendarEvents} />}
        />

        <ReleaseWatcher
          items={anime
            .map((item) => ({ slug: animeSlug(item?.link?.endpoint), title: item.title ?? "", release: item.release }))
            .filter((item) => Boolean(item.slug))}
        />

        <nav aria-label="Lompat ke kelompok update" className="mt-6 flex flex-wrap gap-1.5">
          {BUCKET_META.map(({ key, label }) => {
            const count = groups.get(key)?.length ?? 0;
            if (count === 0) return null;
            return (
              <a
                key={key}
                href={`#update-${key}`}
                className="rounded-sm border-2 border-border bg-surface px-3 py-1 font-mono text-[11px] font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:bg-nb-yellow hover:text-nb-ink active:translate-y-0 active:shadow-none"
              >
                {label} · {count}
              </a>
            );
          })}
        </nav>

        {anime.length === 0 ? (
          <div className="card-shell mt-10">
            <div className="card-core p-10 text-center">
              <p className="font-display text-base font-bold text-ink">Belum ada update yang bisa ditampilkan.</p>
              <p className="mt-1 text-xs text-ink-muted">Coba muat ulang beberapa saat lagi.</p>
            </div>
          </div>
        ) : (
          BUCKET_META.map(({ key, label, hint }) => {
            const items = groups.get(key) ?? [];
            if (items.length === 0) return null;
            return (
              <div key={key} id={`update-${key}`} className="mt-10 scroll-mt-24">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h2 className="font-display text-xl font-extrabold tracking-tight text-ink md:text-2xl">{label}</h2>
                  <span className="font-mono text-xs text-ink-muted">
                    {items.length} anime · {hint}
                  </span>
                </div>
                <div className="mt-4">
                  <AnimeGrid anime={items} eagerCount={key === "today" ? 4 : 0} />
                </div>
              </div>
            );
          })
        )}
      </section>
    </MainLayout>
  );
};

export default UpdatePage;
