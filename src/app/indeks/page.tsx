import Breadcrumbs from "@/components/breadcrumbs";
import SectionHeader from "@/components/section-header";
import SearchForm from "@/components/search-form";
import MainLayout from "@/layouts/main-layout";
import { getCatalogIndex, INDEX_LETTERS, letterOf, letterSlug } from "@/lib/catalog-index";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";
import { JSX } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Indeks Anime A–Z",
  description:
    "Daftar judul anime berdasarkan abjad dari seluruh arsip Kokunime — pilih huruf untuk melihat judul dan tautan ke detail serta link download.",
  alternates: { canonical: "/indeks" },
  openGraph: {
    title: "Indeks Anime A–Z · Kokunime",
    description: "Telusuri seluruh judul anime per huruf awal.",
    url: `${SITE_URL}/indeks`,
  },
};

const formatFetchedAt = (value: number): string => {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(new Date(value));
  } catch {
    return "";
  }
};

const IndexPage = async (): Promise<JSX.Element> => {
  const { items, complete, fetchedAt } = await getCatalogIndex();
  const counts = new Map<string, number>();
  for (const item of items) {
    const letter = letterOf(item.title);
    counts.set(letter, (counts.get(letter) ?? 0) + 1);
  }
  const letters = [...INDEX_LETTERS, ...(counts.has("#") ? ["#"] : [])];
  const updated = formatFetchedAt(fetchedAt);

  return (
    <MainLayout>
      <script
        id="indeks-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(buildSubpageBreadcrumbJsonLd([{ name: "Indeks A–Z", url: "/indeks" }])),
        }}
        suppressHydrationWarning
      />
      <Breadcrumbs items={[{ name: "Indeks A–Z" }]} />
      <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20">
        <SectionHeader
          kicker="Telusuri katalog"
          title="Indeks Anime A–Z"
          titleAs="h1"
          tone="teal"
          className="mb-6"
          badge={
            <span className="rounded-sm border-2 border-border bg-nb-lime px-2.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]">
              {items.length} judul
            </span>
          }
          description={
            complete
              ? "Seluruh arsip anime, dikelompokkan per huruf awal. Pilih huruf untuk membuka daftar judul dan link download."
              : "Snapshot penuh belum tersedia. Sebagian arsip mungkin belum muncul; data akan dilengkapi saat sinkronisasi berikutnya."
          }
        />

        <div className="mb-6 max-w-xl">
          <SearchForm />
        </div>

        <div className="mb-8 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
          {letters.map((letter) => {
            const count = counts.get(letter) ?? 0;
            const common =
              "flex min-h-16 flex-col items-center justify-center rounded-sm border-2 border-border px-2 py-2 text-center shadow-[2px_2px_0_0_var(--border)]";
            return count > 0 ? (
              <Link
                key={letter}
                href={`/indeks/${letterSlug(letter)}`}
                className={`${common} bg-surface transition-all motion-safe:hover:-translate-y-0.5 hover:bg-nb-yellow`}
              >
                <span className="font-display text-xl font-black text-ink">{letter}</span>
                <span className="font-mono text-[10px] text-ink-muted">{count} judul</span>
              </Link>
            ) : (
              <span key={letter} aria-disabled="true" className={`${common} bg-surface-muted opacity-60`}>
                <span className="font-display text-xl font-black text-ink-muted">{letter}</span>
                <span className="font-mono text-[10px] text-ink-muted">kosong</span>
              </span>
            );
          })}
        </div>

        <p className="max-w-2xl font-mono text-[11px] leading-relaxed text-ink-muted">
          Sumber: arsip kusonime. {updated ? `Diperbarui ${updated} WIB.` : "Waktu pembaruan belum tersedia."}
        </p>
      </section>
    </MainLayout>
  );
};

export default IndexPage;
