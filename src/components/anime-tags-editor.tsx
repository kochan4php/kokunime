"use client";

import { addTag, getTagsForSlug, getTagsVersion, listTags, normalizeTag, removeTag, subscribeTags } from "@/utils/tags";
import { showToast } from "@/utils/toast";
import { useTranslation } from "@/utils/i18n";
import Link from "next/link";
import { JSX, useMemo, useState, useSyncExternalStore } from "react";

// Personal tags for one title. Local-only, keyboard reachable, and merged with
// the existing tag vocabulary as suggestions so renames stay rare.
const AnimeTagsEditor = ({ slug }: { slug: string }): JSX.Element => {
  const { language } = useTranslation();
  const version = useSyncExternalStore(subscribeTags, getTagsVersion, () => 0);
  const tags = useMemo(() => getTagsForSlug(slug), [slug, version]);
  const known = useMemo(() => listTags().map((entry) => entry.tag), [version]);
  const [input, setInput] = useState("");

  const suggestions = useMemo(() => {
    const needle = normalizeTag(input);
    if (!needle) return [];
    return known.filter((tag) => tag.includes(needle) && !tags.includes(tag)).slice(0, 5);
  }, [input, known, tags]);

  const submit = (value: string): void => {
    const tag = normalizeTag(value);
    if (!tag) return;
    if (addTag(slug, tag)) showToast(language === "en" ? `Tag “${tag}” added.` : `Tag “${tag}” ditambahkan.`);
    else showToast(language === "en" ? `“${tag}” is already on this title.` : `“${tag}” sudah ada di judul ini.`);
    setInput("");
  };

  const inputId = `tag-input-${slug}`;

  return (
    <div className="card-shell mt-4">
      <div className="card-core space-y-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="chip">🏷️ {language === "en" ? "Personal tags" : "Tag pribadi"}</span>
          <Link href="/tag" className="font-mono text-[11px] font-bold text-accent-text hover:underline">
            {language === "en" ? "Manage →" : "Kelola →"}
          </Link>
        </div>

        {tags.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => {
                    removeTag(slug, tag);
                    showToast(language === "en" ? `Tag “${tag}” removed.` : `Tag “${tag}” dihapus.`);
                  }}
                  className="inline-flex items-center gap-1 rounded-sm border-2 border-border bg-nb-yellow px-2 py-0.5 font-mono text-[11px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
                  title={language === "en" ? "Remove" : "Hapus"}
                >
                  <span className="sr-only">{language === "en" ? `Remove tag ${tag}` : `Hapus tag ${tag}`}</span>#{tag}
                  <span aria-hidden="true">×</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs leading-relaxed text-ink-muted">
            {language === "en"
              ? "No tags yet. Group your own watchlist (e.g. “rewatch”, “watch together”)."
              : "Belum ada tag. Kelompokkan tontonanmu sendiri (mis. “rewatch”, “nonton bareng”)."}
          </p>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(input);
          }}
          className="flex gap-2"
        >
          <label htmlFor={inputId} className="sr-only">
            {language === "en" ? "Add tag" : "Tambah tag"}
          </label>
          <input
            id={inputId}
            value={input}
            maxLength={24}
            onChange={(event) => setInput(event.target.value)}
            placeholder={language === "en" ? "add tag…" : "tambah tag…"}
            className="min-w-0 flex-1 rounded-sm border-2 border-border bg-surface px-2.5 py-1.5 font-mono text-xs text-ink outline-none placeholder:text-ink-muted focus-visible:border-accent-text"
          />
          <button
            type="submit"
            disabled={!normalizeTag(input)}
            className="shrink-0 rounded-sm border-2 border-border bg-surface px-2.5 py-1 font-mono text-[11px] font-bold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all hover:text-ink active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {language === "en" ? "Add" : "Tambah"}
          </button>
        </form>

        {suggestions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {language === "en" ? "Existing" : "Sudah ada"}
            </span>
            {suggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => submit(tag)}
                className="rounded-sm border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] text-ink-muted transition-colors hover:text-ink cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        <p className="font-mono text-[10px] text-ink-muted">
          {language === "en" ? "Stored on this device only." : "Tersimpan di perangkat ini saja."}
        </p>
      </div>
    </div>
  );
};

export default AnimeTagsEditor;
