"use client";

import { SearchIcon } from "@/components/icons";
import { siteLinks } from "@/components/site-config";
import { Anime } from "@/interfaces";
import { animeSlug } from "@/utils/endpoint-slug";
import AnimeImage from "@/components/cards/anime-image";
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

const CommandPalette = (): JSX.Element => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [liveResults, setLiveResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const openPalette = () => {
    setRecent(getRecentSearches());
    setQuery("");
    setLiveResults([]);
    dialogRef.current?.showModal();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const closePalette = () => {
    dialogRef.current?.close();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName))
      ) {
        e.preventDefault();
        if (dialogRef.current?.open) {
          closePalette();
        } else {
          openPalette();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounced live search autocomplete
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setLiveResults(data.results || []);
        }
      } catch {
        setLiveResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
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
      <button
        type="button"
        onClick={openPalette}
        aria-label="Buka pencarian cepat"
        title="Pencarian cepat (Ctrl+K atau /)"
        className="hidden md:flex items-center gap-2 rounded-full border border-accent/40 bg-surface px-3.5 py-2 text-sm text-ink-muted transition-all duration-200 hover:border-accent hover:text-ink hover:bg-surface-muted active:scale-95"
      >
        <SearchIcon />
        <span className="w-28 text-left text-xs lg:w-40 truncate">Cari anime...</span>
        <kbd className="rounded border border-border bg-surface-solid px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
          ⌘K
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) closePalette();
        }}
        className="fixed inset-0 m-auto w-[94vw] sm:w-[90vw] max-w-lg max-h-[85vh] rounded-2xl border border-border bg-bg p-0 text-ink shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex flex-col">
          <form onSubmit={handleFormSubmit} className="relative flex items-center border-b border-border px-4 py-3.5">
            <span className="text-accent mr-3">
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
              placeholder="Ketik judul anime, lalu Enter..."
              className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
            />
            {isLoading && (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            )}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setLiveResults([]);
                  setIsLoading(false);
                }}
                className="rounded-full p-1 text-ink-muted hover:text-ink"
              >
                ✕
              </button>
            )}
          </form>

          <div className="max-h-80 overflow-y-auto p-4 space-y-4">
            {/* Live Autocomplete Results */}
            {query.trim().length >= 2 && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2">
                  Hasil Instan ({liveResults.length})
                </p>
                {liveResults.length > 0 ? (
                  <div className="space-y-1.5">
                    {liveResults.slice(0, 5).map((item) => {
                      const slug = animeSlug(item.link.endpoint);
                      return (
                        <Link
                          key={item.title}
                          href={`/anime/${slug}`}
                          onClick={() => {
                            saveRecentSearch(item.title);
                            closePalette();
                          }}
                          className="flex items-center gap-3 rounded-xl border border-border bg-surface p-2 transition-all hover:border-accent hover:bg-accent/5"
                        >
                          <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                            {item.link.image && <AnimeImage fill sizes="36px" src={item.link.image} alt={item.title} />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="line-clamp-1 text-xs font-semibold text-ink">{item.title}</h4>
                            <p className="line-clamp-1 font-mono text-[10px] text-ink-muted">{item.release}</p>
                          </div>
                          <span className="font-mono text-xs text-ink-muted">→</span>
                        </Link>
                      );
                    })}
                  </div>
                ) : !isLoading ? (
                  <p className="py-2 text-center text-xs text-ink-muted">
                    Tidak ditemukan hasil langsung. Tekan Enter untuk pencarian penuh.
                  </p>
                ) : null}
              </div>
            )}

            {recent.length > 0 && !query && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2">Pencarian Terakhir</p>
                <div className="flex flex-wrap gap-1.5">
                  {recent.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleSearch(item)}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-ink transition-all hover:border-accent hover:text-accent"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!query && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">Navigasi Cepat</p>
                    <a
                      href="/api/random"
                      onClick={closePalette}
                      className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-accent hover:underline"
                    >
                      <span>🎲 Anime Acak</span>
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {siteLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closePalette}
                        className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-ink transition-all hover:border-accent hover:text-accent hover:bg-accent/5"
                      >
                        <span>{link.label}</span>
                        <span className="font-mono text-[10px] text-ink-muted">→</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mb-2">Developer & Feed</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <Link
                      href="/api"
                      onClick={closePalette}
                      className="flex items-center justify-between rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-mono text-accent transition-all hover:bg-accent hover:text-(--accent-ink)"
                    >
                      <span>⚡ API Docs</span>
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
              </>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border bg-surface-solid px-4 py-2 text-[11px] text-ink-muted font-mono">
            <span>Enter untuk cari</span>
            <span>Esc untuk tutup</span>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CommandPalette;
