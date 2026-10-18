"use client";

import MainLayout from "@/layouts/main-layout";
import SectionHeader from "@/components/section-header";
import { getCatalogSnapshot, subscribeCatalog } from "@/utils/local-catalog";
import { deleteTag, getTagsVersion, listTags, normalizeTag, renameTag, subscribeTags } from "@/utils/tags";
import { showToast } from "@/utils/toast";
import { useTranslation } from "@/utils/i18n";
import Link from "next/link";
import { JSX, useMemo, useState, useSyncExternalStore } from "react";

// Tag management: rename (renaming onto an existing name merges the two) and
// delete. Everything is device-local; the catalog size is shown so a cleared
// catalog does not look like lost tags.
const NO_SNAPSHOT: never[] = [];

const TagIndexPage = (): JSX.Element => {
  const { language } = useTranslation();
  const en = language === "en";
  const version = useSyncExternalStore(subscribeTags, getTagsVersion, () => 0);
  const tags = useMemo(() => listTags(), [version]);
  const catalog = useSyncExternalStore(subscribeCatalog, getCatalogSnapshot, () => NO_SNAPSHOT);

  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);

  const submitRename = (from: string): void => {
    const to = normalizeTag(draft);
    if (!to || to === from) {
      setEditing(null);
      return;
    }
    const merged = tags.some((entry) => entry.tag === to);
    if (renameTag(from, to)) {
      showToast(
        merged
          ? en
            ? `“${from}” merged into “${to}”.`
            : `“${from}” digabung ke “${to}”.`
          : en
            ? `“${from}” renamed to “${to}”.`
            : `“${from}” diganti nama jadi “${to}”.`,
      );
    }
    setEditing(null);
  };

  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-8 md:pt-10 md:pb-16">
        <SectionHeader
          kicker={en ? "Personal tags" : "Tag pribadi"}
          title={en ? "Manage tags" : "Kelola tag"}
          titleAs="h1"
          tone="purple"
          className="mb-6"
          badge={
            <span className="rounded-sm border-2 border-border bg-nb-lime px-2.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]">
              {tags.length} {en ? "tags" : "tag"}
            </span>
          }
          description={
            en
              ? "Your own labels across anime, stored on this device only. Renaming a tag onto an existing name merges them."
              : "Label buatanmu sendiri lintas anime, tersimpan di perangkat ini saja. Ganti nama ke tag yang sudah ada untuk menggabungkannya."
          }
        />

        {tags.length === 0 ? (
          <div className="card-shell">
            <div className="card-core space-y-2 p-6">
              <p className="font-mono text-sm text-ink">{en ? "No tags yet." : "Belum ada tag."}</p>
              <p className="text-xs leading-relaxed text-ink-muted">
                {en
                  ? "Open any anime and add a tag in the “Personal tags” card next to its details."
                  : "Buka anime mana pun dan tambahkan tag di kartu “Tag pribadi” di sebelah detailnya."}
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-2">
            {tags.map((entry) => (
              <li key={entry.tag} className="card-shell">
                <div className="card-core flex flex-wrap items-center gap-2 p-3.5">
                  <Link
                    href={`/tag/${encodeURIComponent(entry.tag)}`}
                    className="min-w-0 flex-1 font-mono text-sm font-bold text-ink hover:text-accent-text"
                  >
                    #{entry.tag}
                  </Link>
                  <span className="shrink-0 rounded-sm border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
                    {entry.count} {en ? "titles" : "judul"}
                  </span>

                  {editing === entry.tag ? (
                    <form
                      className="flex w-full gap-2 sm:w-auto"
                      onSubmit={(event) => {
                        event.preventDefault();
                        submitRename(entry.tag);
                      }}
                    >
                      <label className="sr-only" htmlFor={`rename-${entry.tag}`}>
                        {en ? "New name" : "Nama baru"}
                      </label>
                      <input
                        id={`rename-${entry.tag}`}
                        value={draft}
                        maxLength={24}
                        onChange={(event) => setDraft(event.target.value)}
                        className="min-w-0 flex-1 rounded-sm border-2 border-border bg-surface px-2 py-1 font-mono text-xs text-ink outline-none focus-visible:border-accent-text sm:w-40"
                      />
                      <button
                        type="submit"
                        className="shrink-0 rounded-sm border-2 border-border bg-nb-lime px-2 py-1 font-mono text-[11px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] active:translate-y-0.5 active:shadow-none cursor-pointer"
                      >
                        {en ? "Save" : "Simpan"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(null)}
                        className="shrink-0 rounded-sm border-2 border-border bg-surface px-2 py-1 font-mono text-[11px] font-bold text-ink active:translate-y-0.5 active:shadow-none cursor-pointer"
                      >
                        {en ? "Cancel" : "Batal"}
                      </button>
                    </form>
                  ) : (
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(entry.tag);
                          setDraft(entry.tag);
                          setConfirming(null);
                        }}
                        className="rounded-sm border-2 border-border bg-surface px-2 py-1 font-mono text-[11px] font-bold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
                      >
                        {en ? "Rename" : "Ganti nama"}
                      </button>
                      {confirming === entry.tag ? (
                        <button
                          type="button"
                          onClick={() => {
                            deleteTag(entry.tag);
                            showToast(en ? `Tag “${entry.tag}” deleted.` : `Tag “${entry.tag}” dihapus.`);
                            setConfirming(null);
                          }}
                          className="rounded-sm border-2 border-border bg-nb-pink px-2 py-1 font-mono text-[11px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] active:translate-y-0.5 active:shadow-none cursor-pointer"
                        >
                          {en ? "Really delete?" : "Yakin hapus?"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setConfirming(entry.tag);
                            setEditing(null);
                          }}
                          className="rounded-sm border-2 border-border bg-surface px-2 py-1 font-mono text-[11px] font-bold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
                        >
                          {en ? "Delete" : "Hapus"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 font-mono text-[11px] text-ink-muted">
          {en
            ? `Local catalog: ${catalog.length} titles seen on this device.`
            : `Katalog lokal: ${catalog.length} judul yang pernah terlihat di perangkat ini.`}
        </p>
      </section>
    </MainLayout>
  );
};

export default TagIndexPage;
