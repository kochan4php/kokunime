"use client";

import { SearchIcon } from "@/components/icons";
import { Anime } from "@/interfaces";
import { animeSlug } from "@/utils/endpoint-slug";
import AnimeImage from "@/components/cards/anime-image";
import { useTranslation } from "@/utils/i18n";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JSX, useEffect, useRef, useState } from "react";

const RECENT_KEY = "kokunime_recent_searches";

const getRecentSearches = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveRecentSearch = (query: string) => {
  if (typeof window === "undefined" || !query.trim()) return;
  const list = getRecentSearches().filter((q) => q.toLowerCase() !== query.toLowerCase());
  list.unshift(query.trim());
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 6)));
  } catch {}
};

const clientSearchCache = new Map<string, Anime[]>();

const CommandPalette = (): JSX.Element => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [liveResults, setLiveResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();
  const { t, language } = useTranslation();

  const openPalette = () => {
    setIsClosing(false);
    setRecent(getRecentSearches());
    setQuery("");
    setLiveResults([]);
    dialogRef.current?.showModal();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const closePalette = () => {
    if (isClosing || !dialogRef.current?.open) return;
    setIsClosing(true);
    setTimeout(() => {
      dialogRef.current?.close();
      setIsClosing(false);
      setQuery("");
    }, 180);
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem(RECENT_KEY);
      setRecent([]);
    } catch {}
  };

  // Keyboard shortcut: Ctrl+K or / to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) {
          closePalette();
        } else {
          openPalette();
        }
      } else if (e.key === "/" && !isInput && !dialogRef.current?.open) {
        e.preventDefault();
        openPalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced search for live results with instant in-memory client cache
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 2) {
      setLiveResults([]);
      setIsLoading(false);
      return;
    }

    if (clientSearchCache.has(trimmed)) {
      setLiveResults(clientSearchCache.get(trimmed) || []);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        const results = (data.results || []) as Anime[];
        clientSearchCache.set(trimmed, results);
        setLiveResults(results);
      } catch {
        setLiveResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    saveRecentSearch(trimmed);
    closePalette();
    router.push(`/search/${encodeURIComponent(trimmed)}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <>
      {/* Mobile & Tablet Search Icon Button */}
      <button
        type="button"
        onClick={openPalette}
        aria-label={t("common.search")}
        title={`${t("common.search")} (Ctrl+K atau /)`}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-ink-muted transition-all duration-200 hover:border-accent hover:text-ink lg:hidden active:scale-95 cursor-pointer shrink-0"
      >
        <SearchIcon />
      </button>

      {/* Desktop Search Button */}
      <button
        type="button"
        onClick={openPalette}
        aria-label={t("common.search")}
        title={`${t("common.search")} (Ctrl+K atau /)`}
        className="hidden lg:flex items-center gap-2 rounded-full border border-accent/40 bg-surface px-3.5 py-2 text-sm text-ink-muted transition-all duration-200 hover:border-accent hover:text-ink hover:bg-surface-muted active:scale-95 cursor-pointer"
      >
        <SearchIcon />
        <span className="w-28 text-left text-xs xl:w-36 truncate">{t("nav.search_placeholder")}</span>
        <kbd className="rounded border border-border bg-surface-solid px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
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
        className={`fixed inset-x-0 top-4 sm:top-[8%] mx-auto w-[94vw] sm:w-[90vw] max-w-xl max-h-[85vh] rounded-3xl border border-border bg-surface-solid/98 backdrop-blur-2xl p-0 text-ink shadow-2xl overflow-hidden backdrop:bg-black/60 backdrop:backdrop-blur-sm ${
          isClosing ? "is-closing" : ""
        }`}
      >
        <div className="flex flex-col max-h-[85vh]">
          {/* Search Bar Header */}
          <form
            onSubmit={handleFormSubmit}
            className="relative flex items-center border-b border-border px-3.5 sm:px-4 py-3 bg-surface-solid/80"
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
                if (e.target.value.trim().length < 2) {
                  setLiveResults([]);
                  setIsLoading(false);
                }
              }}
              placeholder={language === "en" ? "Type anime title and press Enter..." : "Ketik judul anime, lalu tekan Enter..."}
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
                  setLiveResults([]);
                  setIsLoading(false);
                  inputRef.current?.focus();
                }}
                className="rounded-full p-1 text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors mr-1 cursor-pointer"
                title={t("common.clear")}
              >
                ✕
              </button>
            )}
            <button
              type="button"
              onClick={closePalette}
              className="rounded-lg border border-border bg-surface px-2 py-1 font-mono text-[10px] text-ink-muted hover:text-ink hover:border-accent transition-all cursor-pointer"
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
                  {language === "en" ? `Instant Results (${liveResults.length})` : `Hasil Instan (${liveResults.length})`}
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
                            saveRecentSearch(item.title);
                            closePalette();
                          }}
                          className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-2.5 transition-all hover:border-accent hover:bg-accent/5 active:scale-[0.99]"
                        >
                          <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                            {item.link.image && <AnimeImage fill sizes="36px" src={item.link.image} alt={item.title} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="line-clamp-1 text-xs sm:text-sm font-semibold text-ink">{item.title}</h4>
                            <p className="line-clamp-1 font-mono text-[10px] sm:text-xs text-ink-muted mt-0.5">{item.release || "Subtitle Indonesia"}</p>
                          </div>
                          <span className="font-mono text-xs text-accent font-bold shrink-0">{t("common.detail")} →</span>
                        </Link>
                      );
                    })}
                  </div>
                ) : !isLoading ? (
                  <div className="py-4 text-center">
                    <p className="text-xs sm:text-sm text-ink-muted">
                      {language === "en" ? (
                        <>No instant results for &ldquo;<span className="text-ink font-semibold">{query}</span>&rdquo;.</>
                      ) : (
                        <>Tidak ditemukan hasil instan untuk &ldquo;<span className="text-ink font-semibold">{query}</span>&rdquo;.</>
                      )}
                    </p>
                    <p className="font-mono text-[11px] text-accent mt-1">
                      {language === "en" ? "Press Enter to search entire database ↵" : "Tekan Enter untuk mencari di seluruh database ↵"}
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
                    className="font-mono text-[10px] text-ink-muted hover:text-rose-400 transition-colors cursor-pointer"
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
                      className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-ink transition-all hover:border-accent hover:text-accent active:scale-95 cursor-pointer"
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
                    className="flex items-center justify-between rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-mono text-accent transition-all hover:bg-accent hover:text-(--accent-ink)"
                  >
                    <span>⚙️ {t("nav.settings")}</span>
                    <span className="text-[10px]">🎨</span>
                  </Link>
                  <Link
                    href="/api"
                    onClick={closePalette}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono text-ink-muted transition-all hover:border-accent hover:text-accent"
                  >
                    <span>⚡ {t("nav.api")} Docs</span>
                    <span className="text-[10px]">📖</span>
                  </Link>
                  <a
                    href="/feed.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2 text-xs font-mono text-ink-muted transition-all hover:border-accent hover:text-accent"
                  >
                    <span>GET /feed.xml</span>
                    <span className="text-[10px]">📡</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between border-t border-border bg-surface-solid px-4 py-2 text-[11px] text-ink-muted font-mono">
            <span>{language === "en" ? "↵ Enter to search all" : "↵ Enter untuk cari penuh"}</span>
            <span>Esc</span>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CommandPalette;
