import Breadcrumbs from "@/components/breadcrumbs";
import SectionHeader from "@/components/section-header";
import MainLayout from "@/layouts/main-layout";
import { getAnimePerPage } from "@/services/scraper";
import { SITE_URL } from "@/lib/site";
import { animeSlug } from "@/utils/endpoint-slug";
import { Metadata } from "next";
import Link from "next/link";
import { JSX } from "react";

// The upstream catalog has no A–Z index endpoint, so the index is built from
// the N newest catalog pages and labels its real coverage honestly.
export const revalidate = 3600;

const CATALOG_PAGES = 12;

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const metadata: Metadata = {
  title: "Indeks Anime A–Z",
  description:
    "Daftar judul anime berdasarkan abjad, disusun dari halaman katalog terbaru Kokunime — lengkap dengan tautan ke detail dan link download.",
  alternates: { canonical: "/indeks" },
  openGraph: {
    title: "Indeks Anime A–Z · Kokunime",
    description: "Telusuri judul anime per huruf awal.",
    url: `${SITE_URL}/indeks`,
  },
};

interface IndexItem {
  title: string;
  slug: string;
}

const letterOf = (title: string): string => {
  const first = title.trim().charAt(0).toUpperCase();
  return LETTERS.includes(first) ? first : "#";
};

const IndexPage = async (): Promise<JSX.Element> => {
  const results = await Promise.allSettled(
    Array.from({ length: CATALOG_PAGES }, (_, index) => getAnimePerPage(index + 1)),
  );

  const seen = new Set<string>();
  const items: IndexItem[] = [];
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const item of result.value.anime ?? []) {
      const slug = animeSlug(item.link?.endpoint) || animeSlug(item.link?.url);
      if (!slug || seen.has(slug) || !item.title) continue;
      seen.add(slug);
      items.push({ title: item.title, slug });
    }
  }

  const groups = new Map<string, IndexItem[]>();
  for (const item of items) {
    const letter = letterOf(item.title);
    const bucket = groups.get(letter);
    if (bucket) bucket.push(item);
    else groups.set(letter, [item]);
  }
  for (const bucket of groups.values()) {
    bucket.sort((a, b) => a.title.localeCompare(b.title, "id", { sensitivity: "base" }));
  }
  const letters = [...groups.keys()].sort((a, b) => {
    if (a === "#") return 1;
    if (b === "#") return -1;
    return a.localeCompare(b);
  });

  return (
    <MainLayout>
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
          description={`Disusun dari ${CATALOG_PAGES} halaman katalog terbaru (bukan seluruh arsip) — pilih judul untuk membuka detail dan link unduhannya.`}
        />

        <nav aria-label="Lompat ke huruf" className="mb-8 flex flex-wrap gap-1.5">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#huruf-${letter === "#" ? "lain" : letter}`}
              className="flex h-9 w-9 items-center justify-center rounded-sm border-2 border-border bg-surface font-mono text-xs font-bold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:bg-nb-yellow hover:text-nb-ink"
            >
              {letter}
            </a>
          ))}
        </nav>

        <div className="space-y-8">
          {letters.map((letter) => (
            <section key={letter} id={`huruf-${letter === "#" ? "lain" : letter}`} className="card-shell scroll-mt-24">
              <div className="card-core p-5 sm:p-6">
                <h2 className="font-display text-2xl font-black text-ink">{letter}</h2>
                <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
                  {(groups.get(letter) ?? []).map((item) => (
                    <li key={item.slug} className="min-w-0">
                      <Link
                        href={`/anime/${item.slug}`}
                        className="block truncate text-sm text-ink-muted transition-colors hover:text-accent-text hover:underline"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default IndexPage;
