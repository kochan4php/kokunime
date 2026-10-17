"use client";

import MainLayout from "@/layouts/main-layout";
import AnimeImage from "@/components/cards/anime-image";
import ViewTransitionLink from "@/components/view-transition-link";
import { Anime } from "@/interfaces";
import { animeSlug, endpointSlug } from "@/utils/endpoint-slug";
import { STORAGE_KEYS } from "@/utils/storage-keys";
import { showToast } from "@/utils/toast";
import Link from "next/link";
import { JSX, useCallback, useEffect, useState } from "react";

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

const MIN_SPIN_MS = 650;
const HISTORY_KEY = STORAGE_KEYS.rouletteHistory;
const MAX_HISTORY = 8;

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
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      if (!pick) throw new Error("empty pick");
      const pickSlug = animeSlug(pick.link?.endpoint);
      if (!pickSlug) throw new Error("empty slug");
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
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-nb-pink" />
            Randomizer
          </span>
          <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink md:text-4xl">
            Roulette Anime 🎡
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Bingung mau nonton apa? Pilih genre (atau biarkan acak), putar, dan ikuti hasilnya.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
              className="btn-primary w-full justify-center sm:w-auto disabled:opacity-70"
            >
              {spinning ? "Memutar…" : "🎰 Putar Roulette"}
            </button>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-sm border-2 border-border bg-nb-yellow text-4xl shadow-[4px_4px_0_0_var(--border)] ${
              spinning ? "animate-[spin_0.6s_linear_infinite]" : ""
            }`}
            aria-hidden="true"
          >
            🎰
          </div>

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
                    className="max-w-[12rem] truncate rounded-sm border-2 border-border bg-surface px-2.5 py-1 text-xs font-semibold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:bg-nb-yellow active:translate-y-0 active:shadow-none"
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
