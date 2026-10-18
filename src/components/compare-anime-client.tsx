"use client";

import CompareAnimeCard from "@/components/compare/compare-anime-card";
import CompareGenreAnalysis from "@/components/compare/compare-genre-analysis";
import CompareRadar from "@/components/compare/compare-radar";
import CompareSelector from "@/components/compare/compare-selector";
import CompareSpecsTable from "@/components/compare/compare-specs-table";
import { CompareEmptyState, CompareLoadingCard } from "@/components/compare/compare-status-panels";
import { CompareSynopsis } from "@/components/compare/compare-synopsis";
import { useAnimeSearch } from "@/hooks/use-anime-search";
import { Anime, AnimeDetail } from "@/interfaces";
import { animeSlug } from "@/utils/endpoint-slug";
import { buildCompareMetrics, pickWinners, seriesMark } from "@/utils/compare";
import { useTranslation } from "@/utils/i18n";
import { exportShareCard } from "@/utils/share-card";
import { extractYear, similarityScore } from "@/utils/similar";
import { showToast } from "@/utils/toast";
import { JSX, useCallback, useState } from "react";

interface CompareAnimeClientProps {
  initialAnimeA: AnimeDetail | null;
  initialAnimeB: AnimeDetail | null;
  initialAnimeC: AnimeDetail | null;
  initialSlugA: string;
  initialSlugB: string;
  initialSlugC: string;
}

type Side = "a" | "b" | "c";

const CompareAnimeClient = ({
  initialAnimeA,
  initialAnimeB,
  initialAnimeC,
  initialSlugA,
  initialSlugB,
  initialSlugC,
}: CompareAnimeClientProps): JSX.Element => {
  const { t } = useTranslation();
  const [slugA, setSlugA] = useState(initialSlugA);
  const [slugB, setSlugB] = useState(initialSlugB);
  const [slugC, setSlugC] = useState(initialSlugC);

  const [animeA, setAnimeA] = useState<AnimeDetail | null>(initialAnimeA);
  const [animeB, setAnimeB] = useState<AnimeDetail | null>(initialAnimeB);
  const [animeC, setAnimeC] = useState<AnimeDetail | null>(initialAnimeC);

  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);
  const [errorC, setErrorC] = useState<string | null>(null);

  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [loadingC, setLoadingC] = useState(false);

  const [shareCopied, setShareCopied] = useState(false);

  const paneA = useAnimeSearch(initialAnimeA?.title || initialSlugA || "");
  const paneB = useAnimeSearch(initialAnimeB?.title || initialSlugB || "");
  const paneC = useAnimeSearch(initialAnimeC?.title || initialSlugC || "");

  // One setter bundle per slot so loading/selecting never repeats the A/B
  // ternaries three times over.
  const slots = {
    a: { setSlug: setSlugA, setAnime: setAnimeA, setError: setErrorA, setLoading: setLoadingA, pane: paneA },
    b: { setSlug: setSlugB, setAnime: setAnimeB, setError: setErrorB, setLoading: setLoadingB, pane: paneB },
    c: { setSlug: setSlugC, setAnime: setAnimeC, setError: setErrorC, setLoading: setLoadingC, pane: paneC },
  } satisfies Record<Side, unknown>;

  const updateUrl = useCallback((a: string, b: string, c: string) => {
    const params = new URLSearchParams();
    if (a) params.set("a", a);
    if (b) params.set("b", b);
    if (c) params.set("c", c);
    const query = params.toString();
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", query ? `/compare?${query}` : "/compare");
    }
  }, []);

  const fetchDetail = async (slug: string): Promise<AnimeDetail | null> => {
    if (!slug) return null;
    const res = await fetch(`/api/anime/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    return await res.json();
  };

  const loadDetail = async (side: Side, slug: string, fallbackTitle: string) => {
    const slot = slots[side];

    slot.setLoading(true);
    slot.setError(null);
    try {
      const data = await fetchDetail(slug);
      if (data && data.title) {
        slot.setAnime(data);
        slot.pane.syncSelected(data.title);
      } else {
        slot.setAnime(null);
        slot.setError(`Anime "${fallbackTitle}" tidak ditemukan di database.`);
      }
    } catch {
      slot.setAnime(null);
      slot.setError("Gagal menghubungi server untuk mengambil data.");
    } finally {
      slot.setLoading(false);
    }
  };

  const chooseAnime = (side: Side) => (item: Anime) => {
    const slug = animeSlug(item.link.endpoint) || animeSlug(item.link.url);
    if (!slug) return;
    const slot = slots[side];
    slot.pane.select(item);
    slot.setSlug(slug);
    updateUrl(side === "a" ? slug : slugA, side === "b" ? slug : slugB, side === "c" ? slug : slugC);
    void loadDetail(side, slug, item.title);
  };

  const clearThird = () => {
    setSlugC("");
    setAnimeC(null);
    setErrorC(null);
    paneC.syncSelected("");
    updateUrl(slugA, slugB, "");
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
    updateUrl(slugB, slugA, slugC);
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
        updateUrl(sA, sB, slugC);

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
    const compared = [animeA, animeB, animeC].filter((anime): anime is AnimeDetail => Boolean(anime));
    const metrics = buildCompareMetrics(...compared);
    const leadersByMetric = metrics.map((metric) => pickWinners(metric.values));
    const wins = compared.map(
      (_, index) => leadersByMetric.filter((leaders) => leaders.length === 1 && leaders[0] === index).length,
    );
    const allTied = wins.every((count) => count === wins[0]);
    const title = compared.map((anime) => anime.title).join(" vs ");
    const result = await exportShareCard(
      {
        kicker: "Adu anime",
        title,
        accent: "#ff8a3d",
        rows: [
          ...metrics.map((metric) => ({
            label: metric.label,
            value: metric.values.map((value) => metric.display(value)).join(" vs "),
          })),
          {
            label: "Unggul",
            value: allTied
              ? `Seri ${wins.join("-")}`
              : wins.map((count, index) => `${seriesMark(index)} ${count}`).join(" · "),
          },
        ],
        footer: "kokunime • perbandingan dari data katalog",
      },
      "kokunime-compare.png",
      `${title} — ${window.location.href}`,
    );
    if (result === "downloaded") showToast("Kartu perbandingan diunduh sebagai PNG");
    else if (result === "failed") showToast("Gagal membuat kartu PNG");
  };

  const isOverallLoading = loadingA || loadingB;

  // Every filled slot, in A → C order; the dashboard renders 2 or 3 columns.
  const compared = [animeA, animeB, animeC].filter((anime): anime is AnimeDetail => Boolean(anime));

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
      <CompareSelector
        paneA={paneA}
        paneB={paneB}
        paneC={paneC}
        readyAB={Boolean(slugA && slugB && animeA && animeB)}
        hasA={Boolean(slugA)}
        hasB={Boolean(slugB)}
        hasThird={Boolean(slugC)}
        isOverallLoading={isOverallLoading}
        loadingA={loadingA}
        loadingB={loadingB}
        loadingC={loadingC}
        shareCopied={shareCopied}
        onSelect={chooseAnime}
        onSwap={handleSwap}
        onClearThird={clearThird}
        onPreset={(queryA, queryB) => void handlePreset(queryA, queryB)}
        onExportCard={() => void handleExportCard()}
        onCopyShare={handleCopyShare}
      />

      {/* Error Banners */}
      {(errorA || errorB || errorC) && (
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
          {errorC && (
            <div className="rounded-sm border-2 border-border bg-nb-red p-4 text-xs font-mono font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]">
              🟣 {errorC}
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
            {animeC && (
              <>
                <span className="shrink-0 font-mono text-[10px] text-ink-muted">vs</span>
                <span className="truncate text-right font-mono text-xs font-bold text-ink">🟣 {animeC.title}</span>
              </>
            )}
          </div>

          {/* Client-side similarity summary (no network) */}
          <div className="rounded-sm border-2 border-border bg-surface-solid p-4 shadow-[4px_4px_0_0_var(--border)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-display text-sm font-bold text-ink">
                🤝 {t(animeC ? "compare.similarity_pair" : "compare.similarity")}
              </span>
              <span className="font-mono text-lg font-extrabold text-accent-text">{similarity}%</span>
            </div>
            <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-sm border border-border bg-surface">
              <div className="h-full bg-accent transition-[width] duration-500" style={{ width: `${similarity}%` }} />
            </div>
            <p className="mt-1.5 font-mono text-[10px] text-ink-muted">{t("compare.similarity_desc")}</p>
          </div>

          {/* Header Side-by-Side Cards */}
          <div className={`grid grid-cols-1 gap-6 ${animeC ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2"}`}>
            <CompareAnimeCard anime={animeA} slug={slugA} side="a" />
            <CompareAnimeCard anime={animeB} slug={slugB} side="b" />
            {animeC && <CompareAnimeCard anime={animeC} slug={slugC} side="c" />}
          </div>

          <CompareSpecsTable animes={compared} />

          <CompareRadar animes={compared} />

          <CompareGenreAnalysis animes={compared} />

          <CompareSynopsis animes={compared} />
        </div>
      )}
    </div>
  );
};

export default CompareAnimeClient;
