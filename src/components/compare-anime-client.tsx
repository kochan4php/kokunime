"use client";

import { Anime, AnimeDetail } from "@/interfaces";
import { animeSlug } from "@/utils/endpoint-slug";
import AnimeImage from "@/components/cards/anime-image";
import { useTranslation } from "@/utils/i18n";
import Link from "next/link";
import { JSX, useCallback, useEffect, useRef, useState } from "react";

interface CompareAnimeClientProps {
  initialAnimeA: AnimeDetail | null;
  initialAnimeB: AnimeDetail | null;
  initialSlugA: string;
  initialSlugB: string;
}

const PRESET_COMPARISONS = [
  { label: "Naruto vs Bleach", queryA: "Naruto", queryB: "Bleach" },
  { label: "Jujutsu Kaisen vs Kimetsu no Yaiba", queryA: "Jujutsu Kaisen", queryB: "Kimetsu no Yaiba" },
  { label: "One Piece vs Shingeki no Kyojin", queryA: "One Piece", queryB: "Shingeki no Kyojin" },
  { label: "Frieren vs Mushoku Tensei", queryA: "Frieren", queryB: "Mushoku Tensei" },
  { label: "Solo Leveling vs Mashle", queryA: "Solo Leveling", queryB: "Mashle" },
  { label: "Spy x Family vs Oshi no Ko", queryA: "Spy x Family", queryB: "Oshi no Ko" },
];

const CompareAnimeClient = ({
  initialAnimeA,
  initialAnimeB,
  initialSlugA,
  initialSlugB,
}: CompareAnimeClientProps): JSX.Element => {
  const { t, language } = useTranslation();
  const [slugA, setSlugA] = useState(initialSlugA);
  const [slugB, setSlugB] = useState(initialSlugB);

  const [animeA, setAnimeA] = useState<AnimeDetail | null>(initialAnimeA);
  const [animeB, setAnimeB] = useState<AnimeDetail | null>(initialAnimeB);

  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);

  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  // Search autocomplete states
  const [searchA, setSearchA] = useState(initialAnimeA?.title || initialSlugA || "");
  const [resultsA, setResultsA] = useState<Anime[]>([]);
  const [isSearchingA, setIsSearchingA] = useState(false);
  const [showDropdownA, setShowDropdownA] = useState(false);

  const [searchB, setSearchB] = useState(initialAnimeB?.title || initialSlugB || "");
  const [resultsB, setResultsB] = useState<Anime[]>([]);
  const [isSearchingB, setIsSearchingB] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  const selectedTitleA = useRef<string>(initialAnimeA?.title || "");
  const selectedTitleB = useRef<string>(initialAnimeB?.title || "");

  const [shareCopied, setShareCopied] = useState(false);

  const refA = useRef<HTMLDivElement>(null);
  const refB = useRef<HTMLDivElement>(null);

  const updateUrl = useCallback((a: string, b: string) => {
    const params = new URLSearchParams();
    if (a) params.set("a", a);
    if (b) params.set("b", b);
    const newUrl = `/compare?${params.toString()}`;
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", newUrl);
    }
  }, []);

  const fetchDetail = async (slug: string): Promise<AnimeDetail | null> => {
    if (!slug) return null;
    const res = await fetch(`/api/anime/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    return await res.json();
  };

  const selectAnimeA = async (item: Anime) => {
    const slug = animeSlug(item.link.endpoint) || animeSlug(item.link.url);
    if (!slug) return;
    selectedTitleA.current = item.title;
    setShowDropdownA(false);
    setResultsA([]);
    setSearchA(item.title);
    setSlugA(slug);
    updateUrl(slug, slugB);

    setLoadingA(true);
    setErrorA(null);
    try {
      const data = await fetchDetail(slug);
      if (data && data.title) {
        setAnimeA(data);
        selectedTitleA.current = data.title;
        setSearchA(data.title);
      } else {
        setAnimeA(null);
        setErrorA(`Anime "${item.title}" tidak ditemukan di database.`);
      }
    } catch {
      setAnimeA(null);
      setErrorA("Gagal menghubungi server untuk mengambil data.");
    } finally {
      setLoadingA(false);
    }
  };

  const selectAnimeB = async (item: Anime) => {
    const slug = animeSlug(item.link.endpoint) || animeSlug(item.link.url);
    if (!slug) return;
    selectedTitleB.current = item.title;
    setShowDropdownB(false);
    setResultsB([]);
    setSearchB(item.title);
    setSlugB(slug);
    updateUrl(slugA, slug);

    setLoadingB(true);
    setErrorB(null);
    try {
      const data = await fetchDetail(slug);
      if (data && data.title) {
        setAnimeB(data);
        selectedTitleB.current = data.title;
        setSearchB(data.title);
      } else {
        setAnimeB(null);
        setErrorB(`Anime "${item.title}" tidak ditemukan di database.`);
      }
    } catch {
      setAnimeB(null);
      setErrorB("Gagal menghubungi server untuk mengambil data.");
    } finally {
      setLoadingB(false);
    }
  };

  const handleSwap = () => {
    const newA = slugB;
    const newB = slugA;
    const dataA = animeB;
    const dataB = animeA;
    const titleA = searchB;
    const titleB = searchA;

    selectedTitleA.current = titleA;
    selectedTitleB.current = titleB;
    setShowDropdownA(false);
    setShowDropdownB(false);
    setResultsA([]);
    setResultsB([]);

    setSlugA(newA);
    setSlugB(newB);
    setAnimeA(dataA);
    setAnimeB(dataB);
    setSearchA(titleA);
    setSearchB(titleB);
    updateUrl(newA, newB);
  };

  const handlePreset = async (queryA: string, queryB: string) => {
    setLoadingA(true);
    setLoadingB(true);
    setErrorA(null);
    setErrorB(null);
    setAnimeA(null);
    setAnimeB(null);
    selectedTitleA.current = queryA;
    selectedTitleB.current = queryB;
    setShowDropdownA(false);
    setShowDropdownB(false);
    setResultsA([]);
    setResultsB([]);
    setSearchA(queryA);
    setSearchB(queryB);

    try {
      const [resA, resB] = await Promise.all([
        fetch(`/api/search?q=${encodeURIComponent(queryA)}`).then((r) => r.json()),
        fetch(`/api/search?q=${encodeURIComponent(queryB)}`).then((r) => r.json()),
      ]);

      const itemA = resA.results?.[0];
      const itemB = resB.results?.[0];

      const sA = itemA ? animeSlug(itemA.link.endpoint) || animeSlug(itemA.link.url) : "";
      const sB = itemB ? animeSlug(itemB.link.endpoint) || animeSlug(itemB.link.url) : "";

      if (sA && sB) {
        setSlugA(sA);
        setSlugB(sB);
        updateUrl(sA, sB);

        const [detailA, detailB] = await Promise.all([fetchDetail(sA), fetchDetail(sB)]);

        if (detailA && detailA.title) {
          setAnimeA(detailA);
          selectedTitleA.current = detailA.title;
          setSearchA(detailA.title);
        } else {
          setErrorA(`Gagal memuat detail untuk ${queryA}.`);
        }

        if (detailB && detailB.title) {
          setAnimeB(detailB);
          selectedTitleB.current = detailB.title;
          setSearchB(detailB.title);
        } else {
          setErrorB(`Gagal memuat detail untuk ${queryB}.`);
        }
      } else {
        if (!sA) setErrorA(`Tidak dapat menemukan hasil pencarian untuk "${queryA}".`);
        if (!sB) setErrorB(`Tidak dapat menemukan hasil pencarian untuk "${queryB}".`);
      }
    } catch {
      setErrorA("Gagal memuat preset komparasi anime.");
    } finally {
      setLoadingA(false);
      setLoadingB(false);
    }
  };

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (refA.current && !refA.current.contains(e.target as Node)) {
        setShowDropdownA(false);
      }
      if (refB.current && !refB.current.contains(e.target as Node)) {
        setShowDropdownB(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const compareSearchCache = new Map<string, Anime[]>();

  // Search A debounce with instant in-memory client cache
  useEffect(() => {
    const trimmed = searchA.trim().toLowerCase();
    if (!trimmed || trimmed.length < 2 || searchA === selectedTitleA.current) {
      setResultsA([]);
      setShowDropdownA(false);
      return;
    }

    if (compareSearchCache.has(trimmed)) {
      const cachedList = compareSearchCache.get(trimmed) || [];
      if (searchA !== selectedTitleA.current) {
        setResultsA(cachedList);
        setShowDropdownA(cachedList.length > 0);
      }
      setIsSearchingA(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingA(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        const results = (data.results || []) as Anime[];
        compareSearchCache.set(trimmed, results);
        if (searchA !== selectedTitleA.current) {
          setResultsA(results);
          setShowDropdownA(results.length > 0);
        }
      } catch {
        setResultsA([]);
      } finally {
        setIsSearchingA(false);
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [searchA]);

  // Search B debounce with instant in-memory client cache
  useEffect(() => {
    const trimmed = searchB.trim().toLowerCase();
    if (!trimmed || trimmed.length < 2 || searchB === selectedTitleB.current) {
      setResultsB([]);
      setShowDropdownB(false);
      return;
    }

    if (compareSearchCache.has(trimmed)) {
      const cachedList = compareSearchCache.get(trimmed) || [];
      if (searchB !== selectedTitleB.current) {
        setResultsB(cachedList);
        setShowDropdownB(cachedList.length > 0);
      }
      setIsSearchingB(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingB(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        const results = (data.results || []) as Anime[];
        compareSearchCache.set(trimmed, results);
        if (searchB !== selectedTitleB.current) {
          setResultsB(results);
          setShowDropdownB(results.length > 0);
        }
      } catch {
        setResultsB([]);
      } finally {
        setIsSearchingB(false);
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [searchB]);

  const handleCopyShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    });
  };

  const isOverallLoading = loadingA || loadingB;

  // Metric calculations
  const scoreA = parseFloat(animeA?.score || "0");
  const scoreB = parseFloat(animeB?.score || "0");
  const epA = parseInt(animeA?.total_episode || "0", 10);
  const epB = parseInt(animeB?.total_episode || "0", 10);

  // Genre overlap
  const genresA = animeA?.genre?.map((g) => g.name) || [];
  const genresB = animeB?.genre?.map((g) => g.name) || [];
  const sharedGenres = genresA.filter((g) => genresB.includes(g));
  const uniqueGenresA = genresA.filter((g) => !genresB.includes(g));
  const uniqueGenresB = genresB.filter((g) => !genresA.includes(g));

  return (
    <div className="w-full space-y-8">
      {/* Top Interactive Selector Card */}
      <div className="card-shell overflow-visible">
        <div className="card-core p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
            <div>
              <span className="chip">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                {t("compare.select_header")}
              </span>
              <h2 className="mt-1 font-display text-lg sm:text-xl font-bold text-ink">
                {t("compare.select_header")}
              </h2>
            </div>

            {slugA && slugB && animeA && animeB && !isOverallLoading && (
              <button
                type="button"
                onClick={handleCopyShare}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-border bg-surface px-3.5 py-1.5 font-mono text-xs font-semibold text-ink-muted hover:border-accent hover:text-accent active:scale-95 transition-all cursor-pointer"
              >
                <span>{shareCopied ? `✓ ${t("common.copied")}` : `🔗 ${t("compare.share")}`}</span>
              </button>
            )}
          </div>

          {/* Search Inputs & Swap */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
            {/* Input Anime A (5 cols) */}
            <div ref={refA} className="relative lg:col-span-5">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="input-anime-a" className="block font-mono text-xs font-bold text-accent">
                  🔴 {t("compare.anime_a")}
                </label>
                {loadingA && (
                  <span className="font-mono text-[10px] text-accent animate-pulse font-bold">
                    {t("common.loading")}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="input-anime-a"
                  type="text"
                  placeholder={t("compare.placeholder_a")}
                  value={searchA}
                  onChange={(e) => {
                    selectedTitleA.current = "";
                    setSearchA(e.target.value);
                  }}
                  onFocus={() => {
                    if (resultsA.length > 0 && searchA !== selectedTitleA.current) {
                      setShowDropdownA(true);
                    }
                  }}
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-xs sm:text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
                {isSearchingA && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-ink-muted animate-spin">
                    ⏳
                  </span>
                )}
              </div>

              {/* Dropdown A */}
              {showDropdownA && resultsA.length > 0 && (
                <div className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-border bg-surface-solid/98 backdrop-blur-xl p-2 shadow-2xl space-y-1">
                  {resultsA.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectAnimeA(item)}
                      className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-surface-muted transition-colors cursor-pointer"
                    >
                      <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-surface-muted border border-border">
                        <AnimeImage fill sizes="36px" src={item.link.image as string} alt={item.title} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-xs font-bold text-ink">{item.title}</p>
                        <p className="font-mono text-[10px] text-ink-muted">
                          {item.release || "Rilis"} • {item.genres?.slice(0, 2).join(", ") || "Anime"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button (1 col) */}
            <div className="flex justify-center lg:col-span-1 py-1 lg:py-0">
              <button
                type="button"
                onClick={handleSwap}
                title="Tukar Posisi Anime A dan B"
                disabled={(!slugA && !slugB) || isOverallLoading}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-ink-muted transition-all hover:border-accent hover:bg-accent/10 hover:text-accent active:scale-95 disabled:opacity-40 cursor-pointer shadow-sm"
              >
                <span className="text-base font-bold">⇄</span>
              </button>
            </div>

            {/* Input Anime B (5 cols) */}
            <div ref={refB} className="relative lg:col-span-5">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="input-anime-b" className="block font-mono text-xs font-bold text-accent">
                  🔵 {t("compare.anime_b")}
                </label>
                {loadingB && (
                  <span className="font-mono text-[10px] text-accent animate-pulse font-bold">
                    {t("common.loading")}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="input-anime-b"
                  type="text"
                  placeholder={t("compare.placeholder_b")}
                  value={searchB}
                  onChange={(e) => {
                    selectedTitleB.current = "";
                    setSearchB(e.target.value);
                  }}
                  onFocus={() => {
                    if (resultsB.length > 0 && searchB !== selectedTitleB.current) {
                      setShowDropdownB(true);
                    }
                  }}
                  className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-xs sm:text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
                {isSearchingB && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-ink-muted animate-spin">
                    ⏳
                  </span>
                )}
              </div>

              {/* Dropdown B */}
              {showDropdownB && resultsB.length > 0 && (
                <div className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-border bg-surface-solid/98 backdrop-blur-xl p-2 shadow-2xl space-y-1">
                  {resultsB.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectAnimeB(item)}
                      className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-surface-muted transition-colors cursor-pointer"
                    >
                      <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-surface-muted border border-border">
                        <AnimeImage fill sizes="36px" src={item.link.image as string} alt={item.title} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-xs font-bold text-ink">{item.title}</p>
                        <p className="font-mono text-[10px] text-ink-muted">
                          {item.release || "Rilis"} • {item.genres?.slice(0, 2).join(", ") || "Anime"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-ink-muted">⚡ {t("compare.quick_examples")}</span>
              {PRESET_COMPARISONS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isOverallLoading}
                  onClick={() => handlePreset(p.queryA, p.queryB)}
                  className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-ink-muted transition-all hover:border-accent hover:bg-accent/10 hover:text-ink active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Banners */}
      {(errorA || errorB) && (
        <div className="space-y-2">
          {errorA && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-mono text-red-400">
              🔴 {errorA}
            </div>
          )}
          {errorB && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-mono text-red-400">
              🔵 {errorB}
            </div>
          )}
        </div>
      )}

      {/* Loading Skeleton during overall comparison fetch */}
      {isOverallLoading && (
        <div className="card-shell animate-pulse">
          <div className="card-core p-8 text-center space-y-3">
            <span className="inline-block text-3xl animate-spin">⏳</span>
            <h3 className="font-display text-base font-bold text-ink">
              {t("compare.loading_msg")}
            </h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              {language === "en"
                ? "Fetching rating scores, studios, episodes, duration, and complete synopses in real-time."
                : "Mengambil skor rating, studio animasi, episode, durasi, dan sinopsis lengkap kedua anime secara langsung."}
            </p>
          </div>
        </div>
      )}

      {/* Comparison Empty State */}
      {!isOverallLoading && (!animeA || !animeB) && (
        <div className="card-shell">
          <div className="card-core p-10 text-center space-y-4">
            <span className="text-4xl">⚖️</span>
            <h3 className="font-display text-lg font-bold text-ink">
              {!animeA && !animeB
                ? t("compare.empty_prompt")
                : !animeA
                  ? (language === "en" ? "Select Anime A to Complete Comparison" : "Pilih Anime Pertama (A) untuk Melengkapi Komparasi")
                  : (language === "en" ? "Select Anime B to Complete Comparison" : "Pilih Anime Kedua (B) untuk Melengkapi Komparasi")}
            </h3>
            <p className="max-w-md mx-auto text-xs text-ink-muted leading-relaxed">
              {language === "en"
                ? "Use the search boxes or click a Quick Example above to compare rating scores, total episodes, genres, studios, synopses, and download links instantly."
                : "Gunakan kotak pencarian atau klik salah satu Contoh Cepat di atas untuk membandingkan skor rating, total episode, genre, studio, sinopsis, dan mirror unduhan secara instan."}
            </p>
          </div>
        </div>
      )}

      {/* Full Comparison Dashboard */}
      {!isOverallLoading && animeA && animeB && (
        <div className="space-y-8 animate-fade-in">
          {/* Header Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Anime A Card */}
            <div className="card-shell overflow-hidden">
              <div className="card-core p-5 sm:p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative aspect-[3/4] w-28 sm:w-32 shrink-0 overflow-hidden rounded-2xl border border-border shadow-lg bg-surface-muted">
                    {animeA.image && (
                      <AnimeImage fill sizes="(max-width: 640px) 112px, 128px" src={animeA.image} alt={animeA.title ?? ""} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <span className="chip text-[10px]">🔴 {t("compare.anime_a")}</span>
                    <h3 className="font-display text-base sm:text-lg font-extrabold text-ink leading-snug line-clamp-2">
                      {animeA.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                      <span className="rounded-md bg-accent/15 px-2 py-0.5 font-bold text-accent">
                        ⭐ {animeA.score || "N/A"}
                      </span>
                      <span className="rounded-md bg-surface-muted px-2 py-0.5 text-ink-muted">
                        {animeA.status || "N/A"}
                      </span>
                      <span className="rounded-md bg-surface-muted px-2 py-0.5 text-ink-muted">
                        {animeA.total_episode || "?"} Ep
                      </span>
                    </div>
                    <div className="pt-2">
                      <Link
                        href={`/anime/${slugA}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-1.5 font-mono text-xs font-bold text-(--accent-ink) hover:scale-[1.02] transition-transform"
                      >
                        <span>{t("compare.open_detail_a")}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Anime B Card */}
            <div className="card-shell overflow-hidden">
              <div className="card-core p-5 sm:p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative aspect-[3/4] w-28 sm:w-32 shrink-0 overflow-hidden rounded-2xl border border-border shadow-lg bg-surface-muted">
                    {animeB.image && (
                      <AnimeImage fill sizes="(max-width: 640px) 112px, 128px" src={animeB.image} alt={animeB.title ?? ""} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <span className="chip text-[10px]">🔵 {t("compare.anime_b")}</span>
                    <h3 className="font-display text-base sm:text-lg font-extrabold text-ink leading-snug line-clamp-2">
                      {animeB.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                      <span className="rounded-md bg-accent/15 px-2 py-0.5 font-bold text-accent">
                        ⭐ {animeB.score || "N/A"}
                      </span>
                      <span className="rounded-md bg-surface-muted px-2 py-0.5 text-ink-muted">
                        {animeB.status || "N/A"}
                      </span>
                      <span className="rounded-md bg-surface-muted px-2 py-0.5 text-ink-muted">
                        {animeB.total_episode || "?"} Ep
                      </span>
                    </div>
                    <div className="pt-2">
                      <Link
                        href={`/anime/${slugB}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-1.5 font-mono text-xs font-bold text-(--accent-ink) hover:scale-[1.02] transition-transform"
                      >
                        <span>{t("compare.open_detail_b")}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Specs Matrix Table */}
          <div className="card-shell overflow-hidden">
            <div className="card-core p-0 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/50 font-mono text-xs uppercase tracking-wider text-ink-muted">
                    <th className="p-4 w-1/4">{t("compare.spec_parameter")}</th>
                    <th className="p-4 w-[37.5%] font-display text-sm font-bold text-ink">🔴 {animeA.title}</th>
                    <th className="p-4 w-[37.5%] font-display text-sm font-bold text-ink">🔵 {animeB.title}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs sm:text-sm font-mono">
                  {/* Rating Score */}
                  <tr className="hover:bg-surface/30">
                    <td className="p-4 font-bold text-ink-muted">⭐ {t("compare.score_rating")}</td>
                    <td className="p-4 font-bold">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${
                          scoreA > scoreB && scoreA > 0
                            ? "bg-amber-400/20 text-amber-400 border border-amber-400/40 font-black"
                            : "text-ink"
                        }`}
                      >
                        ⭐ {animeA.score || "N/A"} {scoreA > scoreB && t("compare.higher_score")}
                      </span>
                    </td>
                    <td className="p-4 font-bold">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${
                          scoreB > scoreA && scoreB > 0
                            ? "bg-amber-400/20 text-amber-400 border border-amber-400/40 font-black"
                            : "text-ink"
                        }`}
                      >
                        ⭐ {animeB.score || "N/A"} {scoreB > scoreA && t("compare.higher_score")}
                      </span>
                    </td>
                  </tr>

                  {/* Total Episodes */}
                  <tr className="hover:bg-surface/30">
                    <td className="p-4 font-bold text-ink-muted">🎬 {t("compare.total_episodes")}</td>
                    <td className="p-4">
                      {animeA.total_episode || "N/A"}{" "}
                      {epA > epB && epB > 0 && (
                        <span className="text-emerald-500 font-bold">({epA - epB} {t("compare.more_episodes")})</span>
                      )}
                    </td>
                    <td className="p-4">
                      {animeB.total_episode || "N/A"}{" "}
                      {epB > epA && epA > 0 && (
                        <span className="text-emerald-500 font-bold">({epB - epA} {t("compare.more_episodes")})</span>
                      )}
                    </td>
                  </tr>

                  {/* Duration */}
                  <tr className="hover:bg-surface/30">
                    <td className="p-4 font-bold text-ink-muted">⏱️ {t("compare.duration")}</td>
                    <td className="p-4 text-ink">{animeA.duration || "N/A"}</td>
                    <td className="p-4 text-ink">{animeB.duration || "N/A"}</td>
                  </tr>

                  {/* Studio */}
                  <tr className="hover:bg-surface/30">
                    <td className="p-4 font-bold text-ink-muted">🏢 {t("compare.studio")}</td>
                    <td className="p-4 text-accent font-bold">{animeA.studio || animeA.producer || "N/A"}</td>
                    <td className="p-4 text-accent font-bold">{animeB.studio || animeB.producer || "N/A"}</td>
                  </tr>

                  {/* Type */}
                  <tr className="hover:bg-surface/30">
                    <td className="p-4 font-bold text-ink-muted">📺 {t("compare.type")}</td>
                    <td className="p-4 text-ink">{animeA.type || "TV Series"}</td>
                    <td className="p-4 text-ink">{animeB.type || "TV Series"}</td>
                  </tr>

                  {/* Release Season / Year */}
                  <tr className="hover:bg-surface/30">
                    <td className="p-4 font-bold text-ink-muted">📅 {t("compare.release")}</td>
                    <td className="p-4 text-ink">{animeA.season?.name || animeA.release_on || "N/A"}</td>
                    <td className="p-4 text-ink">{animeB.season?.name || animeB.release_on || "N/A"}</td>
                  </tr>

                  {/* Status */}
                  <tr className="hover:bg-surface/30">
                    <td className="p-4 font-bold text-ink-muted">📡 {t("compare.status")}</td>
                    <td className="p-4 text-ink">{animeA.status || "N/A"}</td>
                    <td className="p-4 text-ink">{animeB.status || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Genre Overlap Analysis */}
          <div className="card-shell">
            <div className="card-core p-5 sm:p-6 space-y-4">
              <h4 className="font-display text-sm sm:text-base font-bold text-ink">
                🎭 {t("compare.genre_analysis")}
              </h4>

              {/* Shared Genres */}
              {sharedGenres.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-mono text-xs font-bold text-emerald-500 block">
                    🤝 {t("compare.shared_genres")} ({sharedGenres.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sharedGenres.map((g) => (
                      <span
                        key={g}
                        className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 font-mono text-xs font-bold text-emerald-400"
                      >
                        ✓ {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Unique Genres Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1.5">
                  <span className="font-mono text-xs font-bold text-accent block">
                    🔴 {t("compare.unique_genres_a")} ({animeA.title}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {uniqueGenresA.length > 0 ? (
                      uniqueGenresA.map((g) => (
                        <span key={g} className="rounded-lg bg-accent/15 px-2 py-0.5 font-mono text-xs text-accent">
                          {g}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-ink-muted italic">{t("compare.no_exclusive")}</span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1.5">
                  <span className="font-mono text-xs font-bold text-accent block">
                    🔵 {t("compare.unique_genres_b")} ({animeB.title}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {uniqueGenresB.length > 0 ? (
                      uniqueGenresB.map((g) => (
                        <span key={g} className="rounded-lg bg-accent/15 px-2 py-0.5 font-mono text-xs text-accent">
                          {g}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-ink-muted italic">{t("compare.no_exclusive")}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Synopses Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-shell">
              <div className="card-core p-5 sm:p-6 space-y-3">
                <h4 className="font-display text-sm sm:text-base font-bold text-ink">
                  📖 {t("compare.synopsis_a")}
                </h4>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed whitespace-pre-line">
                  {animeA.synopsis || "Sinopsis tidak tersedia."}
                </p>
              </div>
            </div>

            <div className="card-shell">
              <div className="card-core p-5 sm:p-6 space-y-3">
                <h4 className="font-display text-sm sm:text-base font-bold text-ink">
                  📖 {t("compare.synopsis_b")}
                </h4>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed whitespace-pre-line">
                  {animeB.synopsis || "Sinopsis tidak tersedia."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareAnimeClient;
