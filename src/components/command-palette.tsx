"use client";

import { SearchIcon } from "@/components/icons";
import { animeSlug } from "@/utils/endpoint-slug";
import AnimeImage from "@/components/cards/anime-image";
import { highlightSegments } from "@/utils/fuzzy";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { useTranslation } from "@/utils/i18n";
import Link from "next/link";
import { JSX } from "react";

const CommandPalette = (): JSX.Element => {
  const {
    dialogRef,
    inputRef,
    query,
    setQuery,
    recent,
    liveResults,
    isLoading,
    isClosing,
    openPalette,
    closePalette,
    clearHistory,
    handleSearch,
    handleFormSubmit,
  } = useCommandPalette();
  const { t, language } = useTranslation();

  return (
    <>
      {/* Mobile & Tablet Search Icon Button */}
      <button
        type="button"
        onClick={openPalette}
        aria-label={t("common.search")}
        title={`${t("common.search")} (Ctrl+K atau /)`}
        className="flex h-11 w-11 items-center justify-center rounded-sm border-2 border-border bg-surface text-ink shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none lg:hidden cursor-pointer shrink-0"
      >
        <SearchIcon />
      </button>

      {/* Desktop Search Button */}
      <button
        type="button"
        onClick={openPalette}
        aria-label={t("common.search")}
        title={`${t("common.search")} (Ctrl+K atau /)`}
        className="hidden lg:flex items-center gap-2 rounded-sm border-2 border-border bg-surface px-3.5 py-2 text-sm text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--border)] hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
      >
        <SearchIcon />
        <span className="w-28 text-left text-xs xl:w-36 truncate">{t("nav.search_placeholder")}</span>
        <kbd className="rounded-sm border border-border bg-surface-solid px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
          ⌘K
        </kbd>
      </button>

      {/* Modal Dialog */}
      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          closePalette();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) closePalette();
        }}
        className={`fixed inset-x-0 top-4 sm:top-[8%] mx-auto w-[94vw] sm:w-[90vw] max-w-xl max-h-[85vh] bg-surface-solid p-0 text-ink overflow-hidden ${
          isClosing ? "is-closing" : ""
        }`}
      >
        <div className="flex flex-col max-h-[85vh]">
          {/* Search Bar Header */}
          <form
            onSubmit={handleFormSubmit}
            className="relative flex items-center border-b-2 border-border px-3.5 sm:px-4 py-3 bg-surface-muted"
          >
            <span className="text-accent mr-2.5 sm:mr-3 shrink-0">
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder={
                language === "en" ? "Type anime title and press Enter..." : "Ketik judul anime, lalu tekan Enter..."
              }
              className="flex-1 bg-transparent text-base sm:text-sm text-ink outline-none placeholder:text-ink-muted min-w-0"
            />
            {isLoading && (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent shrink-0" />
            )}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="rounded-sm p-1 text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors mr-1 cursor-pointer"
                title={t("common.clear")}
              >
                ✕
              </button>
            )}
            <button
              type="button"
              onClick={closePalette}
              className="rounded-sm border-2 border-border bg-surface px-2 py-1 font-mono text-[10px] text-ink-muted hover:text-ink shadow-[2px_2px_0_0_var(--border)] transition-all cursor-pointer"
              title={t("common.close")}
            >
              Esc
            </button>
          </form>

          {/* Search Body Content */}
          <div className="overflow-y-auto p-3.5 sm:p-4 space-y-4 [scrollbar-width:thin]">
            {/* Live Autocomplete Results */}
            {query.trim().length >= 2 && (
              <div role="region" aria-live="polite" aria-label={t("common.search")}>
                <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2">
                  {language === "en"
                    ? `Instant Results (${liveResults.length})`
                    : `Hasil Instan (${liveResults.length})`}
                </p>
                {liveResults.length > 0 ? (
                  <div className="space-y-1.5">
                    {liveResults.slice(0, 6).map((item) => {
                      const slug = animeSlug(item.link.endpoint);
                      return (
                        <Link
                          key={item.title}
                          href={`/anime/${slug}`}
                          onClick={() => {
                            handleSearch(item.title);
                          }}
                          className="flex items-center gap-3 rounded-sm border-2 border-border bg-surface p-2.5 transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_var(--border)] active:translate-y-0 active:shadow-none"
                        >
                          <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-sm border border-border bg-surface-muted">
                            {item.link.image && <AnimeImage fill sizes="36px" src={item.link.image} alt={item.title} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="line-clamp-1 text-xs sm:text-sm font-semibold text-ink">
                              {highlightSegments(item.title, query.trim()).map((segment, index) =>
                                segment.match ? (
                                  <mark key={`${segment.text}-${index}`} className="bg-nb-yellow px-0.5 text-ink">
                                    {segment.text}
                                  </mark>
                                ) : (
                                  <span key={`${segment.text}-${index}`}>{segment.text}</span>
                                ),
                              )}
                            </h4>
                            <p className="line-clamp-1 font-mono text-[10px] sm:text-xs text-ink-muted mt-0.5">
                              {item.release || "Subtitle Indonesia"}
                            </p>
                          </div>
                          <span className="font-mono text-xs text-accent font-bold shrink-0">
                            {t("common.detail")} →
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                ) : !isLoading ? (
                  <div className="py-4 text-center">
                    <p className="text-xs sm:text-sm text-ink-muted">
                      {language === "en" ? (
                        <>
                          No instant results for &ldquo;<span className="text-ink font-semibold">{query}</span>&rdquo;.
                        </>
                      ) : (
                        <>
                          Tidak ditemukan hasil instan untuk &ldquo;
                          <span className="text-ink font-semibold">{query}</span>&rdquo;.
                        </>
                      )}
                    </p>
                    <p className="font-mono text-[11px] text-accent mt-1">
                      {language === "en"
                        ? "Press Enter to search entire database ↵"
                        : "Tekan Enter untuk mencari di seluruh database ↵"}
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Recent Searches */}
            {recent.length > 0 && !query && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {language === "en" ? "Recent Searches" : "Pencarian Terakhir"}
                  </p>
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="font-mono text-[10px] text-ink-muted hover:text-nb-red transition-colors cursor-pointer"
                  >
                    {language === "en" ? "Clear History" : "Hapus Riwayat"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recent.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleSearch(item)}
                      className="rounded-sm border-2 border-border bg-nb-yellow px-3 py-1 text-xs text-[#0a0a0a] font-semibold shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Developer & Feed & Shortcuts */}
            {!query && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {language === "en" ? "Quick Links" : "Akses Cepat"}
                  </p>
                  <a
                    href="/api/random"
                    onClick={closePalette}
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-accent hover:underline"
                  >
                    <span>🎲 {t("nav.random_anime")}</span>
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  <Link
                    href="/settings"
                    onClick={closePalette}
                    className="flex items-center justify-between rounded-sm border-2 border-border bg-nb-pink px-3 py-2 text-xs font-mono font-semibold text-[#0a0a0a] shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                  >
                    <span>⚙️ {t("nav.settings")}</span>
                    <span className="text-[10px]">🎨</span>
                  </Link>
                  <Link
                    href="/api"
                    onClick={closePalette}
                    className="flex items-center justify-between rounded-sm border-2 border-border bg-surface px-3 py-2 text-xs font-mono text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none"
                  >
                    <span>⚡ {t("nav.api")} Docs</span>
                    <span className="text-[10px]">📖</span>
                  </Link>
                  <a
                    href="/feed.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-sm border-2 border-border bg-surface px-3 py-2 text-xs font-mono text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none"
                  >
                    <span>GET /feed.xml</span>
                    <span className="text-[10px]">📡</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t-2 border-border bg-surface-muted px-4 py-2 text-[11px] text-ink-muted font-mono">
            <span>{language === "en" ? "↵ Enter to search all" : "↵ Enter untuk cari penuh"}</span>
            <span>{language === "en" ? "? for shortcuts · Esc to close" : "? untuk pintasan · Esc menutup"}</span>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CommandPalette;
