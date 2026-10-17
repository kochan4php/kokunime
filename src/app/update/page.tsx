import MainLayout from "@/layouts/main-layout";
import AnimeGrid from "@/components/cards/anime-grid";
import UpdateIcsButton from "@/components/update-ics-button";
import { getAnimePerPage } from "@/services/scraper";
import { Anime } from "@/interfaces";
import { AgeBucket, parseRelativeAge } from "@/utils/relative-age";
import { animeSlug } from "@/utils/endpoint-slug";
import { SITE_URL } from "@/lib/site";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="chip">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Timeline
            </span>
            <h1 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight text-ink md:text-4xl">
              Update Terbaru
            </h1>
            <p className="mt-2 max-w-xl text-sm text-ink-muted">
              Anime yang baru diperbarui, dikelompokkan per hari. Ingin rutin mengecek? Simpan pengingat mingguan ke
              kalender Anda.
            </p>
          </div>
          <UpdateIcsButton events={calendarEvents} />
        </div>

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
              <div key={key} className="mt-10">
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
