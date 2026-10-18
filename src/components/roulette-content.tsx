"use client";

import MainLayout from "@/layouts/main-layout";
import AnimeImage from "@/components/cards/anime-image";
import SectionHeader from "@/components/section-header";
import ViewTransitionLink from "@/components/view-transition-link";
import { Anime } from "@/interfaces";
import { animeSlug, endpointSlug } from "@/utils/endpoint-slug";
import { STORAGE_KEYS } from "@/utils/storage-keys";
import { showToast } from "@/utils/toast";
import Link from "next/link";
import { JSX, useCallback, useEffect, useRef, useState } from "react";

interface GenreOption {
  name: string;
  slug: string;
}

interface RouletteSpin {
  slug: string;
  title: string;
  image?: string | undefined;
  at: number;
}

const MIN_SPIN_MS = 1200;
const HISTORY_KEY = STORAGE_KEYS.rouletteHistory;
const MAX_HISTORY = 8;

const SEGMENTS = 8;
const SEGMENT_ANGLE = 360 / SEGMENTS;
const SEGMENT_COLORS = ["#ffde00", "#ff90e8", "#23a094", "#c4a1ff", "#ff8a3d", "#ff6b6b", "#a8e10c", "#7dd3fc"];

const polarPoint = (radius: number, degrees: number): [number, number] => {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return [120 + radius * Math.cos(radians), 120 + radius * Math.sin(radians)];
};

const segmentPath = (startDeg: number, endDeg: number): string => {
  const [x1, y1] = polarPoint(112, startDeg);
  const [x2, y2] = polarPoint(112, endDeg);
  return `M 120 120 L ${x1.toFixed(2)} ${y1.toFixed(2)} A 112 112 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
};

const readSpinHistory = (): RouletteSpin[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (spin): spin is RouletteSpin =>
          Boolean(spin) && typeof spin === "object" && typeof (spin as RouletteSpin).slug === "string",
      )
      .slice(0, MAX_HISTORY);
  } catch {
    return [];
  }
};

const writeSpinHistory = (list: RouletteSpin[]): void => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_HISTORY)));
  } catch {}
};

const RouletteContent = (): JSX.Element => {
  const [genres, setGenres] = useState<GenreOption[]>([]);
  const [genre, setGenre] = useState("__random__");
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Anime | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<RouletteSpin[]>([]);
  const [wheelItems, setWheelItems] = useState<Anime[]>([]);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);

  useEffect(() => {
    setHistory(readSpinHistory());
    void (async () => {
      try {
        const res = await fetch("/api/genres");
        if (!res.ok) return;
        const data = (await res.json()) as { genres?: { name: string; endpoint?: string }[] };
        setGenres(
          (data.genres ?? [])
            .map((g) => ({ name: g.name, slug: endpointSlug(g.endpoint, "genres") ?? "" }))
            .filter((g) => g.slug),
        );
      } catch {
        // Genre list unavailable — spins fall back to the plain random route.
      }
    })();
  }, []);

  const spin = useCallback(async (): Promise<void> => {
    if (spinning) return;
    setSpinning(true);
    setError(null);
    setResult(null);
    const started = Date.now();

    const chosen = genre === "__random__" ? genres[Math.floor(Math.random() * genres.length)]?.slug : genre;
    if (!chosen) {
      // No genre data (offline / upstream down): let the server pick one.
      window.location.assign("/api/random");
      return;
    }

    try {
      const page = 1 + Math.floor(Math.random() * 3);
      const res = await fetch(`/api/genres/${encodeURIComponent(chosen)}?page=${page}`);
      if (!res.ok) throw new Error("bad response");
      const data = (await res.json()) as { anime?: Anime[] };
      const candidates = (data.anime ?? []).filter((item) => animeSlug(item?.link?.endpoint));
      if (candidates.length === 0) throw new Error("empty pool");

      // The visible wheel IS the candidate pool: shuffle, take eight, pick one
      // of them — the pointer lands on the title actually drawn on the wheel.
      const pool = [...candidates].sort(() => Math.random() - 0.5).slice(0, SEGMENTS);
      const index = Math.floor(Math.random() * pool.length);
      const pick = pool[index];
      if (!pick) throw new Error("empty pick");
      const pickSlug = animeSlug(pick.link?.endpoint);
      if (!pickSlug) throw new Error("empty slug");

      setWheelItems(pool);

      // Rotate so the picked segment's center lands under the top pointer.
      const centerAngle = index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
      const currentMod = ((rotationRef.current % 360) + 360) % 360;
      const delta = (((-centerAngle - currentMod) % 360) + 360) % 360;
      const nextRotation = rotationRef.current + 2 * 360 + delta;
      rotationRef.current = nextRotation;
      setRotation(nextRotation);

      const remaining = Math.max(0, MIN_SPIN_MS - (Date.now() - started));
      window.setTimeout(() => {
        setResult(pick);
        setSpinning(false);
        const entry: RouletteSpin = {
          slug: pickSlug,
          title: pick.title ?? pickSlug,
          image: pick.link?.image as string | undefined,
          at: Date.now(),
        };
        setHistory((prev) => {
          const next = [entry, ...prev.filter((spinEntry) => spinEntry.slug !== entry.slug)].slice(0, MAX_HISTORY);
          writeSpinHistory(next);
          return next;
        });
      }, remaining);
    } catch {
      const remaining = Math.max(0, 400 - (Date.now() - started));
      window.setTimeout(() => {
        setError("Gagal memutar roulette — pool genre kosong atau koneksi bermasalah. Coba lagi.");
        setSpinning(false);
      }, remaining);
    }
  }, [genre, genres, spinning]);

  const resultSlug = result ? animeSlug(result.link?.endpoint) : null;

  const clearSpinHistory = (): void => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {}
  };

  const shareResult = async (): Promise<void> => {
    if (!result || !resultSlug) return;
    const url = `${window.location.origin}/anime/${resultSlug}`;
    const nav = navigator as Navigator & {
      share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
    };
    if (nav.share) {
      try {
        await nav.share({ title: result.title, text: `Rekomendasi roulette: ${result.title}`, url });
        return;
      } catch {
        // Share sheet dismissed or unsupported — fall back to clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Tautan disalin ✓");
    } catch {
      showToast("Gagal menyalin tautan", { durationMs: 3000 });
    }
  };

  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-16 md:pt-10">
        <SectionHeader
          kicker="Randomizer"
          title="Roulette Anime 🎡"
          titleAs="h1"
          tone="pink"
          className="mb-10"
          description="Bingung mau nonton apa? Pilih genre (atau biarkan acak), putar, dan ikuti hasilnya."
          aside={
            <>
              <label htmlFor="roulette-genre" className="sr-only">
                Pilih genre
              </label>
              <select
                id="roulette-genre"
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
                className="h-10 cursor-pointer rounded-sm border-2 border-border bg-surface px-3 font-mono text-xs text-ink outline-none focus:border-accent"
              >
                <option value="__random__">🎲 Genre acak</option>
                {genres.map((option) => (
                  <option key={option.slug} value={option.slug}>
                    {option.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => void spin()}
                disabled={spinning}
                className="btn-primary disabled:opacity-70"
              >
                {spinning ? "Memutar…" : "🎰 Putar Roulette"}
              </button>
            </>
          }
        />

        <div className="mx-auto flex max-w-2xl flex-col items-center">
          {/* SVG wheel: eight candidate slots; each spin redraws the pool and
              rotates so the picked slot lands under the top pointer. */}
          <div className="relative mt-2">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-0 z-10 -translate-x-1/2 text-2xl leading-none text-ink drop-shadow-[2px_2px_0_var(--border)]"
            >
              ▼
            </div>
            <svg
              viewBox="0 0 240 240"
              className="h-60 w-60 sm:h-64 sm:w-64"
              aria-hidden="true"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? `transform ${MIN_SPIN_MS}ms cubic-bezier(0.15, 0.85, 0.1, 1)` : "none",
              }}
            >
              {Array.from({ length: SEGMENTS }, (_, index) => (
                <path
                  key={index}
                  d={segmentPath(index * SEGMENT_ANGLE, (index + 1) * SEGMENT_ANGLE)}
                  fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                  stroke="#0a0a0a"
                  strokeWidth="2.5"
                />
              ))}
              {Array.from({ length: SEGMENTS }, (_, index) => {
                const [x, y] = polarPoint(72, index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
                return (
                  <text
                    key={`label-${index}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="20"
                    fontWeight="900"
                    fill="#0a0a0a"
                  >
                    {index + 1}
                  </text>
                );
              })}
              <circle cx="120" cy="120" r="30" fill="#fdf5eb" stroke="#0a0a0a" strokeWidth="3" />
              <text x="120" y="122" textAnchor="middle" dominantBaseline="middle" fontSize="26">
                🎡
              </text>
            </svg>
          </div>

          {wheelItems.length > 0 && (
            <>
              <ol className="mt-4 grid w-full max-w-md grid-cols-1 gap-1 sm:grid-cols-2">
                {wheelItems.map((item, index) => {
                  const winner = result && item.link?.endpoint === result.link?.endpoint;
                  return (
                    <li
                      key={`${index}-${item.title}`}
                      className={`flex min-w-0 items-center gap-2 rounded-sm border-2 border-border px-2 py-1 font-mono text-[11px] ${
                        winner ? "bg-nb-lime font-bold text-nb-ink" : "bg-surface text-ink-muted"
                      }`}
                    >
                      <span
                        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-border text-[9px] font-bold text-nb-ink"
                        style={{ backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length] }}
                      >
                        {index + 1}
                      </span>
                      <span className="truncate">{item.title}</span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-2 font-mono text-[10px] text-ink-muted">
                Kandidat di roda inilah yang diundi — 8 judul dari pool genre {genre === "__random__" ? "acak" : genre}.
              </p>
            </>
          )}

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-sm border-2 border-border bg-nb-red px-4 py-2 font-mono text-xs font-bold text-nb-ink"
            >
              {error}
            </p>
          )}

          {result && resultSlug && (
            <div className="card-shell mt-8 w-full max-w-md" aria-live="polite">
              <div className="card-core flex gap-4 p-4">
                <div className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-sm border-2 border-border bg-surface-muted">
                  <AnimeImage fill sizes="112px" src={result.link?.image as string} alt={result.title ?? ""} />
                </div>
                <div className="flex min-w-0 flex-col justify-between gap-2">
                  <div>
                    <h2 className="line-clamp-3 font-display text-base font-bold text-ink">{result.title}</h2>
                    <p className="mt-1 font-mono text-[10px] text-ink-muted">
                      {[result.release, result.genres?.slice(0, 2).join(", ")].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ViewTransitionLink href={`/anime/${resultSlug}`} className="btn-primary !px-3 !py-1 text-xs">
                      Buka Detail →
                    </ViewTransitionLink>
                    <button
                      type="button"
                      onClick={() => void spin()}
                      disabled={spinning}
                      className="btn-secondary !px-3 !py-1 text-xs disabled:opacity-70"
                    >
                      🎲 Putar Lagi
                    </button>
                    <button
                      type="button"
                      onClick={() => void shareResult()}
                      className="btn-secondary !px-3 !py-1 text-xs"
                    >
                      🔗 Bagikan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!result && !error && !spinning && (
            <p className="mt-6 max-w-sm text-center text-xs text-ink-muted">
              Tekan tombol putar — hasil diambil dari katalog genre pilihanmu, bukan daftar statis.
            </p>
          )}

          {history.length > 0 && (
            <div className="mt-8 w-full max-w-md">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                  Riwayat Putaran ({history.length})
                </span>
                <button
                  type="button"
                  onClick={clearSpinHistory}
                  className="font-mono text-[10px] text-ink-muted transition-colors hover:text-ink cursor-pointer"
                >
                  Bersihkan
                </button>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {history.map((spinEntry) => (
                  <Link
                    key={`${spinEntry.slug}-${spinEntry.at}`}
                    href={`/anime/${spinEntry.slug}`}
                    title={spinEntry.title}
                    className="max-w-[12rem] truncate rounded-sm border-2 border-border bg-surface px-2.5 py-1 text-xs font-semibold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 hover:bg-nb-yellow active:translate-y-0 active:shadow-none"
                  >
                    {spinEntry.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default RouletteContent;
