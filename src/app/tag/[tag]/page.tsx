"use client";

import CardAnime from "@/components/cards/card-anime";
import MainLayout from "@/layouts/main-layout";
import SectionHeader from "@/components/section-header";
import { getCatalogSnapshot, subscribeCatalog } from "@/utils/local-catalog";
import { deleteTag, getSlugsForTag, getTagsVersion, renameTag, subscribeTags } from "@/utils/tags";
import { showToast } from "@/utils/toast";
import { useTranslation } from "@/utils/i18n";
import Link from "next/link";
import { useParams } from "next/navigation";
import { JSX, useMemo, useState, useSyncExternalStore } from "react";

const NO_SNAPSHOT: never[] = [];

// One tag's titles. Slugs whose catalog entry is gone (storage cleared, titles
// never opened since) still link to their detail page instead of disappearing.
const TagDetailPage = (): JSX.Element => {
  const { language } = useTranslation();
  const en = language === "en";
  const params = useParams<{ tag: string }>();
  const tag = decodeURIComponent(params?.tag ?? "");
  const version = useSyncExternalStore(subscribeTags, getTagsVersion, () => 0);
  const slugs = useMemo(() => getSlugsForTag(tag), [tag, version]);
  const catalog = useSyncExternalStore(subscribeCatalog, getCatalogSnapshot, () => NO_SNAPSHOT);

  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(tag);
  const [confirming, setConfirming] = useState(false);

  const bySlug = useMemo(() => new Map(catalog.map((entry) => [entry.slug, entry])), [catalog]);
  const known = useMemo(() => slugs.filter((slug) => bySlug.has(slug)), [slugs, bySlug]);
  const unknown = useMemo(() => slugs.filter((slug) => !bySlug.has(slug)), [slugs, bySlug]);

  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-8 md:pt-10 md:pb-16">
        <SectionHeader
          kicker={en ? "Personal tag" : "Tag pribadi"}
          title={`#${tag}`}
          titleAs="h1"
          tone="purple"
          className="mb-6"
          badge={
            <span className="rounded-sm border-2 border-border bg-nb-lime px-2.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]">
              {slugs.length} {en ? "titles" : "judul"}
            </span>
          }
          description={
            en
              ? "Titles you tagged yourself. Renaming onto an existing tag merges the two."
              : "Judul yang kamu tandai sendiri. Ganti nama ke tag yang sudah ada untuk menggabungkannya."
          }
          aside={
            <Link href="/tag" className="font-mono text-[11px] font-bold text-accent-text hover:underline">
              {en ? "All tags →" : "Semua tag →"}
            </Link>
          }
        />

        <div className="mb-5 flex flex-wrap items-center gap-2">
          {renaming ? (
            <form
              className="flex w-full gap-2 sm:w-auto"
              onSubmit={(event) => {
                event.preventDefault();
                if (renameTag(tag, draft)) {
                  showToast(
                    en ? `“${tag}” renamed to “${draft.trim()}”.` : `“${tag}” diganti nama jadi “${draft.trim()}”.`,
                  );
                  setRenaming(false);
                } else {
                  showToast(en ? "That name cannot be used." : "Nama itu tidak bisa dipakai.");
                }
              }}
            >
              <label className="sr-only" htmlFor="tag-rename">
                {en ? "New name" : "Nama baru"}
              </label>
              <input
                id="tag-rename"
                value={draft}
                maxLength={24}
                onChange={(event) => setDraft(event.target.value)}
                className="min-w-0 flex-1 rounded-sm border-2 border-border bg-surface px-2 py-1 font-mono text-xs text-ink outline-none focus-visible:border-accent-text sm:w-48"
              />
              <button
                type="submit"
                className="rounded-sm border-2 border-border bg-nb-lime px-2 py-1 font-mono text-[11px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] active:translate-y-0.5 active:shadow-none cursor-pointer"
              >
                {en ? "Save" : "Simpan"}
              </button>
              <button
                type="button"
                onClick={() => setRenaming(false)}
                className="rounded-sm border-2 border-border bg-surface px-2 py-1 font-mono text-[11px] font-bold text-ink active:translate-y-0.5 active:shadow-none cursor-pointer"
              >
                {en ? "Cancel" : "Batal"}
              </button>
            </form>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setDraft(tag);
                  setRenaming(true);
                }}
                className="rounded-sm border-2 border-border bg-surface px-2.5 py-1 font-mono text-[11px] font-bold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
              >
                {en ? "Rename" : "Ganti nama"}
              </button>
              {confirming ? (
                <button
                  type="button"
                  onClick={() => {
                    deleteTag(tag);
                    showToast(en ? `Tag “${tag}” deleted.` : `Tag “${tag}” dihapus.`);
                  }}
                  className="rounded-sm border-2 border-border bg-nb-pink px-2.5 py-1 font-mono text-[11px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] active:translate-y-0.5 active:shadow-none cursor-pointer"
                >
                  {en ? "Really delete the tag?" : "Yakin hapus tag ini?"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="rounded-sm border-2 border-border bg-surface px-2.5 py-1 font-mono text-[11px] font-bold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
                >
                  {en ? "Delete" : "Hapus"}
                </button>
              )}
            </>
          )}
        </div>

        {slugs.length === 0 ? (
          <div className="card-shell">
            <div className="card-core p-6">
              <p className="font-mono text-sm text-ink">{en ? "This tag is empty." : "Tag ini kosong."}</p>
              <p className="mt-1 text-xs text-ink-muted">
                {en
                  ? "Add it back from any anime's “Personal tags” card."
                  : "Tambahkan lagi dari kartu “Tag pribadi” di halaman anime."}
              </p>
            </div>
          </div>
        ) : (
          <>
            {known.length > 0 && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-5 md:gap-3 lg:grid-cols-5 lg:gap-3.5 xl:grid-cols-6 2xl:grid-cols-6">
                {known.map((slug) => {
                  const entry = bySlug.get(slug);
                  if (!entry) return null;
                  return (
                    <CardAnime
                      key={slug}
                      path={`/anime/${slug}`}
                      src={entry.image as string}
                      title={entry.title}
                      meta={entry.release}
                      genres={entry.genres}
                    />
                  );
                })}
              </div>
            )}

            {unknown.length > 0 && (
              <div className={known.length > 0 ? "mt-6" : ""}>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  {en ? "Not in the local catalog" : "Belum ada di katalog lokal"}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {unknown.map((slug) => (
                    <li key={slug}>
                      <Link
                        href={`/anime/${slug}`}
                        className="inline-block rounded-sm border-2 border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-colors hover:text-ink"
                      >
                        {slug.replace(/-/g, " ")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>
    </MainLayout>
  );
};

export default TagDetailPage;
