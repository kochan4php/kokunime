"use client";

import AnimeSearchField from "@/components/compare/anime-search-field";
import CompareAnimeCard from "@/components/compare/compare-anime-card";
import CompareGenreAnalysis from "@/components/compare/compare-genre-analysis";
import CompareRadar, { buildCompareMetrics } from "@/components/compare/compare-radar";
import CompareSpecsTable from "@/components/compare/compare-specs-table";
import { CompareEmptyState, CompareLoadingCard } from "@/components/compare/compare-status-panels";
import { CompareSynopsis } from "@/components/compare/compare-synopsis";
import { useAnimeSearch } from "@/hooks/use-anime-search";
import { Anime, AnimeDetail } from "@/interfaces";
import { animeSlug } from "@/utils/endpoint-slug";
import { useTranslation } from "@/utils/i18n";
import { exportShareCard } from "@/utils/share-card";
import { extractYear, similarityScore } from "@/utils/similar";
import { showToast } from "@/utils/toast";
import { JSX, useCallback, useState } from "react";

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

type Side = "a" | "b";

const CompareAnimeClient = ({
  initialAnimeA,
  initialAnimeB,
  initialSlugA,
  initialSlugB,
}: CompareAnimeClientProps): JSX.Element => {
  const { t } = useTranslation();
  const [slugA, setSlugA] = useState(initialSlugA);
  const [slugB, setSlugB] = useState(initialSlugB);

  const [animeA, setAnimeA] = useState<AnimeDetail | null>(initialAnimeA);
  const [animeB, setAnimeB] = useState<AnimeDetail | null>(initialAnimeB);

  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);

  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  const [shareCopied, setShareCopied] = useState(false);

  const paneA = useAnimeSearch(initialAnimeA?.title || initialSlugA || "");
  const paneB = useAnimeSearch(initialAnimeB?.title || initialSlugB || "");

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

  const loadDetail = async (side: Side, slug: string, fallbackTitle: string) => {
    const setLoading = side === "a" ? setLoadingA : setLoadingB;
    const setError = side === "a" ? setErrorA : setErrorB;
    const setAnime = side === "a" ? setAnimeA : setAnimeB;
    const pane = side === "a" ? paneA : paneB;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchDetail(slug);
      if (data && data.title) {
        setAnime(data);
        pane.syncSelected(data.title);
      } else {
        setAnime(null);
        setError(`Anime "${fallbackTitle}" tidak ditemukan di database.`);
      }
    } catch {
      setAnime(null);
      setError("Gagal menghubungi server untuk mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  const chooseAnime = (side: Side) => (item: Anime) => {
    const slug = animeSlug(item.link.endpoint) || animeSlug(item.link.url);
    if (!slug) return;
    const pane = side === "a" ? paneA : paneB;
    pane.select(item);
    if (side === "a") {
      setSlugA(slug);
      updateUrl(slug, slugB);
    } else {
      setSlugB(slug);
      updateUrl(slugA, slug);
    }
    void loadDetail(side, slug, item.title);
  };

  const handleSwap = () => {
    const queryA = paneA.query;
    const queryB = paneB.query;
    paneA.syncSelected(queryB);
    paneB.syncSelected(queryA);

    setSlugA(slugB);
    setSlugB(slugA);
    setAnimeA(animeB);
    setAnimeB(animeA);
    updateUrl(slugB, slugA);
  };

  const handlePreset = async (queryA: string, queryB: string) => {
    setLoadingA(true);
    setLoadingB(true);
    setErrorA(null);
    setErrorB(null);
    setAnimeA(null);
    setAnimeB(null);
    paneA.syncSelected(queryA);
    paneB.syncSelected(queryB);

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
          paneA.syncSelected(detailA.title);
        } else {
          setErrorA(`Gagal memuat detail untuk ${queryA}.`);
        }

        if (detailB && detailB.title) {
          setAnimeB(detailB);
          paneB.syncSelected(detailB.title);
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

  const handleCopyShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    });
  };

  // PNG share card: per-metric scoreline plus which side leads.
  const handleExportCard = async (): Promise<void> => {
    if (!animeA || !animeB) return;
    const metrics = buildCompareMetrics(animeA, animeB);
    const winsA = metrics.filter((metric) => metric.a > metric.b).length;
    const winsB = metrics.filter((metric) => metric.b > metric.a).length;
    const result = await exportShareCard(
      {
        kicker: "Adu anime",
        title: `${animeA.title} vs ${animeB.title}`,
        accent: "#ff8a3d",
        rows: [
          ...metrics.map((metric) => ({
            label: metric.label,
            value: `${metric.display(metric.a)} vs ${metric.display(metric.b)}`,
          })),
          {
            label: "Unggul",
            value:
              winsA === winsB
                ? `Seri ${winsA}-${winsB}`
                : winsA > winsB
                  ? `🔴 ${winsA}-${winsB}`
                  : `🔵 ${winsB}-${winsA}`,
          },
        ],
        footer: "kokunime • perbandingan dari data katalog",
      },
      "kokunime-compare.png",
      `${animeA.title} vs ${animeB.title} — ${window.location.href}`,
    );
    if (result === "downloaded") showToast("Kartu perbandingan diunduh sebagai PNG");
    else if (result === "failed") showToast("Gagal membuat kartu PNG");
  };

  const isOverallLoading = loadingA || loadingB;

  // Local-only similarity — genre overlap + year/score/type proximity.
  const similarity =
    animeA && animeB
      ? similarityScore(
          {
            genres: animeA.genre?.map((g) => g.name) || [],
            score: animeA.score,
            year: extractYear(animeA.release_on),
            type: animeA.type,
          },
          {
            genres: animeB.genre?.map((g) => g.name) || [],
            score: animeB.score,
            year: extractYear(animeB.release_on),
            type: animeB.type,
          },
        )
      : 0;

  return (
    <div className="w-full space-y-8">
      {/* Top Interactive Selector Card */}
      <div className="card-shell overflow-visible">
        <div className="card-core p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-border pb-4">
            <div>
              <span className="chip">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                {t("compare.select_header")}
              </span>
              <h2 className="mt-1 font-display text-lg sm:text-xl font-bold text-ink">{t("compare.select_header")}</h2>
            </div>

            {slugA && slugB && animeA && animeB && !isOverallLoading && (
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => void handleExportCard()}
                  title="Unduh kartu perbandingan sebagai PNG"
                  className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-surface px-3.5 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
                >
                  🖼️ PNG
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  title="Cetak halaman perbandingan"
                  className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-surface px-3.5 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
                >
                  🖨️ Cetak
                </button>
                <button
                  type="button"
                  onClick={handleCopyShare}
                  className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-surface px-3.5 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer"
                >
                  <span>{shareCopied ? `✓ ${t("common.copied")}` : `🔗 ${t("compare.share")}`}</span>
                </button>
              </div>
            )}
          </div>

          {/* Search Inputs & Swap */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
            <AnimeSearchField
              id="input-anime-a"
              label={`🔴 ${t("compare.anime_a")}`}
              placeholder={t("compare.placeholder_a")}
              query={paneA.query}
              onQueryChange={paneA.setQuery}
              results={paneA.results}
              isSearching={paneA.isSearching}
              detailLoading={loadingA}
              showDropdown={paneA.showDropdown}
              loadingText={t("common.loading")}
              onFocus={() => {
                if (paneA.results.length > 0 && paneA.query !== paneA.selectedTitle.current) {
                  paneA.setShowDropdown(true);
                }
              }}
              onSelect={chooseAnime("a")}
              containerRef={paneA.containerRef}
            />

            {/* Swap Button (1 col) */}
            <div className="flex justify-center lg:col-span-1 py-1 lg:py-0">
              <button
                type="button"
                onClick={handleSwap}
                title="Tukar Posisi Anime A dan B"
                disabled={(!slugA && !slugB) || isOverallLoading}
                className="flex h-11 w-11 items-center justify-center rounded-sm border-2 border-border bg-surface text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:bg-nb-yellow hover:text-nb-ink active:translate-y-0 active:shadow-none disabled:opacity-40 cursor-pointer"
              >
                <span className="text-base font-bold">⇄</span>
              </button>
            </div>

            <AnimeSearchField
              id="input-anime-b"
              label={`🔵 ${t("compare.anime_b")}`}
              placeholder={t("compare.placeholder_b")}
              query={paneB.query}
              onQueryChange={paneB.setQuery}
              results={paneB.results}
              isSearching={paneB.isSearching}
              detailLoading={loadingB}
              showDropdown={paneB.showDropdown}
              loadingText={t("common.loading")}
              onFocus={() => {
                if (paneB.results.length > 0 && paneB.query !== paneB.selectedTitle.current) {
                  paneB.setShowDropdown(true);
                }
              }}
              onSelect={chooseAnime("b")}
              containerRef={paneB.containerRef}
            />
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
                  className="rounded-sm border-2 border-border bg-surface px-3 py-1 font-mono text-xs text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:bg-nb-purple hover:text-nb-ink active:translate-y-0 active:shadow-none disabled:opacity-50 cursor-pointer"
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
            <div className="rounded-sm border-2 border-border bg-nb-red p-4 text-xs font-mono font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]">
              🔴 {errorA}
            </div>
          )}
          {errorB && (
            <div className="rounded-sm border-2 border-border bg-nb-red p-4 text-xs font-mono font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]">
              🔵 {errorB}
            </div>
          )}
        </div>
      )}

      {/* Loading Skeleton during overall comparison fetch */}
      {isOverallLoading && <CompareLoadingCard />}

      {/* Comparison Empty State */}
      {!isOverallLoading && (!animeA || !animeB) && <CompareEmptyState hasA={Boolean(animeA)} hasB={Boolean(animeB)} />}

      {/* Full Comparison Dashboard */}
      {!isOverallLoading && animeA && animeB && (
        <div className="space-y-8 animate-fade-in">
          {/* Sticky mini header (mobile): the A-vs-B context stays visible while
              scrolling the long dashboard. The site navbar is h-16. */}
          <div className="sticky top-16 z-30 -mx-4 flex items-center justify-between gap-2 border-y-2 border-border bg-surface-solid/95 px-4 py-2 backdrop-blur md:hidden">
            <span className="truncate font-mono text-xs font-bold text-ink">🔴 {animeA.title}</span>
            <span className="shrink-0 font-mono text-[10px] text-ink-muted">vs</span>
            <span className="truncate text-right font-mono text-xs font-bold text-ink">🔵 {animeB.title}</span>
          </div>

          {/* Client-side similarity summary (no network) */}
          <div className="rounded-sm border-2 border-border bg-surface-solid p-4 shadow-[4px_4px_0_0_var(--border)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-display text-sm font-bold text-ink">🤝 {t("compare.similarity")}</span>
              <span className="font-mono text-lg font-extrabold text-accent-text">{similarity}%</span>
            </div>
            <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-sm border border-border bg-surface">
              <div className="h-full bg-accent transition-[width] duration-500" style={{ width: `${similarity}%` }} />
            </div>
            <p className="mt-1.5 font-mono text-[10px] text-ink-muted">{t("compare.similarity_desc")}</p>
          </div>

          {/* Header Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CompareAnimeCard anime={animeA} slug={slugA} side="a" />
            <CompareAnimeCard anime={animeB} slug={slugB} side="b" />
          </div>

          <CompareSpecsTable animeA={animeA} animeB={animeB} />

          <CompareRadar animeA={animeA} animeB={animeB} />

          <CompareGenreAnalysis animeA={animeA} animeB={animeB} />

          <CompareSynopsis animeA={animeA} animeB={animeB} />
        </div>
      )}
    </div>
  );
};

export default CompareAnimeClient;
