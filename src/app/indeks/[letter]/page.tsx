import Breadcrumbs from "@/components/breadcrumbs";
import SectionHeader from "@/components/section-header";
import SearchForm from "@/components/search-form";
import Pagination from "@/sections/pagination";
import MainLayout from "@/layouts/main-layout";
import {
  getCatalogIndex,
  INDEX_LETTERS,
  INDEX_PAGE_SIZE,
  letterFromSlug,
  letterOf,
  letterSlug,
  resolveIndexPage,
} from "@/lib/catalog-index";
import { buildSubpageBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { PaginationInfo } from "@/interfaces";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JSX } from "react";

export const dynamic = "force-dynamic";

const letterLabel = (letter: string): string => (letter === "#" ? "Lainnya" : letter);

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ letter: string }>;
  searchParams: Promise<{ page?: string | string[] | undefined }>;
}): Promise<Metadata> {
  const letter = letterFromSlug((await params).letter);
  if (!letter) notFound();

  const { items } = await getCatalogIndex();
  const count = items.filter((item) => letterOf(item.title) === letter).length;
  if (count === 0) notFound();
  const totalPages = Math.max(1, Math.ceil(count / INDEX_PAGE_SIZE));
  const { page, invalid: invalidPage } = resolveIndexPage((await searchParams).page, totalPages);
  const label = letterLabel(letter);
  const canonical = page > 1 ? `/indeks/${letterSlug(letter)}?page=${page}` : `/indeks/${letterSlug(letter)}`;

  return {
    title: `Indeks Anime ${label}`,
    description: `Daftar judul anime yang diawali ${label}, lengkap dengan tautan detail dan link download subtitle Indonesia.`,
    alternates: { canonical },
    robots: count < 3 || invalidPage ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `Indeks Anime ${label} · Kokunime`,
      description: `Telusuri judul anime yang diawali ${label}.`,
      url: `${SITE_URL}${canonical}`,
    },
  };
}

const LetterPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ letter: string }>;
  searchParams: Promise<{ page?: string | string[] | undefined }>;
}): Promise<JSX.Element> => {
  const letter = letterFromSlug((await params).letter);
  if (!letter) notFound();

  const { items, complete } = await getCatalogIndex();
  const filtered = items
    .filter((item) => letterOf(item.title) === letter)
    .sort((a, b) => a.title.localeCompare(b.title, "id", { sensitivity: "base" }));
  if (filtered.length === 0) notFound();

  const totalPages = Math.max(1, Math.ceil(filtered.length / INDEX_PAGE_SIZE));
  const { page } = resolveIndexPage((await searchParams).page, totalPages);

  const start = (page - 1) * INDEX_PAGE_SIZE;
  const visible = filtered.slice(start, start + INDEX_PAGE_SIZE);
  const label = letterLabel(letter);
  const pagination: PaginationInfo = {
    first_page_endpoint: "?page=1",
    next_page_endpoint: page < totalPages ? `?page=${page + 1}` : null,
    current_page: page,
    pages_of: String(totalPages),
    total_page: totalPages,
    prev_page_endpoint: page > 1 ? `?page=${page - 1}` : null,
    last_page_endpoint: `?page=${totalPages}`,
  };

  const coveredLetters = new Set(items.map((item) => letterOf(item.title)));

  return (
    <MainLayout>
      <script
        id="indeks-letter-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            buildSubpageBreadcrumbJsonLd([
              { name: "Indeks A–Z", url: "/indeks" },
              { name: `Indeks Anime ${label}`, url: `/indeks/${letterSlug(letter)}` },
            ]),
          ),
        }}
        suppressHydrationWarning
      />
      <Breadcrumbs items={[{ name: "Indeks A–Z", href: "/indeks" }, { name: label }]} />
      <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20">
        <SectionHeader
          kicker="Telusuri katalog"
          title={`Indeks Anime ${label}`}
          titleAs="h1"
          tone="teal"
          className="mb-6"
          badge={
            <span className="rounded-sm border-2 border-border bg-nb-lime px-2.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]">
              {filtered.length} judul
            </span>
          }
          description={
            complete
              ? `Seluruh judul yang diawali ${label}, diurutkan menurut abjad.`
              : `Snapshot penuh belum tersedia; daftar ${label} ini mungkin belum lengkap.`
          }
        />

        <div className="mb-6 max-w-xl">
          <SearchForm />
        </div>

        <nav aria-label="Pilih huruf" className="mb-8 flex flex-wrap gap-1.5">
          {INDEX_LETTERS.map((item) =>
            coveredLetters.has(item) ? (
              <Link
                key={item}
                href={`/indeks/${letterSlug(item)}`}
                aria-current={item === letter ? "page" : undefined}
                className={
                  item === letter
                    ? "flex h-9 w-9 items-center justify-center rounded-sm border-2 border-border bg-accent font-mono text-xs font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                    : "flex h-9 w-9 items-center justify-center rounded-sm border-2 border-border bg-surface font-mono text-xs font-bold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:bg-nb-yellow hover:text-nb-ink"
                }
              >
                {item}
              </Link>
            ) : (
              <span
                key={item}
                aria-disabled="true"
                className="flex h-9 w-9 items-center justify-center rounded-sm border-2 border-border bg-surface-muted font-mono text-xs font-bold text-ink-muted opacity-50"
              >
                {item}
              </span>
            ),
          )}
          {coveredLetters.has("#") && (
            <Link
              href="/indeks/lain"
              aria-current={letter === "#" ? "page" : undefined}
              className={
                letter === "#"
                  ? "flex h-9 min-w-9 items-center justify-center rounded-sm border-2 border-border bg-accent px-2 font-mono text-xs font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)]"
                  : "flex h-9 min-w-9 items-center justify-center rounded-sm border-2 border-border bg-surface px-2 font-mono text-xs font-bold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:bg-nb-yellow hover:text-nb-ink"
              }
            >
              #
            </Link>
          )}
        </nav>

        <ul
          aria-label={`Judul anime ${label}`}
          className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((item) => (
            <li key={item.slug} className="min-w-0 border-b border-border/60 pb-1.5">
              <Link
                href={`/anime/${item.slug}`}
                className="block text-sm leading-relaxed text-ink-muted transition-colors hover:text-accent-text hover:underline"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        {totalPages > 1 && <Pagination pagination={pagination} />}
      </section>
    </MainLayout>
  );
};

export default LetterPage;
