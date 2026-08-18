import MainLayout from "@/layouts/main-layout";
import { getAnimeDetail } from "@/services/scraper";
import { AnimeDetail } from "@/interfaces";
import AnimeImage from "@/components/cards/anime-image";
import Link from "next/link";
import { Metadata } from "next";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Komparasi Anime · Kokunime",
  description: "Bandingkan skor, total episode, durasi, studio, dan genre antara dua anime berdampingan secara instan.",
  alternates: {
    canonical: "https://kokunime.netlify.app/compare",
  },
};

interface ComparePageProps {
  searchParams: Promise<{ a?: string; b?: string }>;
}

const ComparePage = async ({ searchParams }: ComparePageProps): Promise<JSX.Element> => {
  const { a: slugA, b: slugB } = await searchParams;

  const [animeA, animeB] = await Promise.all([
    slugA ? getAnimeDetail(slugA).catch(() => null) : Promise.resolve(null),
    slugB ? getAnimeDetail(slugB).catch(() => null) : Promise.resolve(null),
  ]);

  const scoreA = parseFloat(animeA?.score || "0");
  const scoreB = parseFloat(animeB?.score || "0");

  const epA = parseInt(animeA?.total_episode || "0", 10);
  const epB = parseInt(animeB?.total_episode || "0", 10);

  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-12 md:pt-10 md:pb-20">
        <div className="mb-8">
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Fitur Komparasi
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
            Perbandingan Anime Side-by-Side
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted leading-relaxed">
            Bandingkan dua anime secara berdampingan untuk melihat perbedaan skor, studio produksi, total episode, durasi tayang, dan genre.
          </p>
        </div>

        {/* Input selection form */}
        <form method="GET" action="/compare" className="mb-10 rounded-2xl border border-border bg-surface-solid p-5 shadow-lg">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="slug-a" className="block font-mono text-xs text-ink-muted mb-1">
                Slug Anime Pertama (A)
              </label>
              <input
                id="slug-a"
                name="a"
                defaultValue={slugA || ""}
                placeholder="misal: naruto-batch-sub-indo"
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 font-mono text-xs text-ink focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="slug-b" className="block font-mono text-xs text-ink-muted mb-1">
                Slug Anime Kedua (B)
              </label>
              <input
                id="slug-b"
                name="b"
                defaultValue={slugB || ""}
                placeholder="misal: bleach-batch-sub-indo"
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 font-mono text-xs text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="btn-primary"
            >
              <span>⚡ Bandingkan Sekarang</span>
            </button>
          </div>
        </form>

        {(!animeA || !animeB) && (
          <div className="rounded-2xl border border-border/80 bg-surface/50 p-8 text-center">
            <p className="text-sm text-ink-muted">
              Masukkan dua slug anime pada form di atas untuk melihat tabel komparasi detail.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="font-mono text-xs text-ink-muted">Contoh cepat:</span>
              <Link
                href="/compare?a=frieren-beyond-journeys-end-batch-sub-indo&b=sousou-no-frieren-batch-sub-indo"
                className="font-mono text-xs text-accent hover:underline"
              >
                Frieren vs Anime Lain
              </Link>
            </div>
          </div>
        )}

        {animeA && animeB && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-2xl border border-border bg-surface-solid overflow-hidden shadow-2xl">
              <thead>
                <tr className="border-b border-border bg-surface-muted/50">
                  <th className="p-4 text-left font-mono text-xs uppercase tracking-wider text-ink-muted w-1/4">
                    Kriteria
                  </th>
                  <th className="p-4 text-left font-display text-base font-bold text-ink w-[37.5%]">
                    {animeA.title}
                  </th>
                  <th className="p-4 text-left font-display text-base font-bold text-ink w-[37.5%]">
                    {animeB.title}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {/* Posters */}
                <tr>
                  <td className="p-4 font-mono text-xs text-ink-muted">Poster</td>
                  <td className="p-4">
                    {animeA.image && (
                      <div className="relative aspect-[3/4] w-36 overflow-hidden rounded-xl border border-border shadow-md">
                        <AnimeImage fill sizes="144px" src={animeA.image} alt={animeA.title ?? ""} />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    {animeB.image && (
                      <div className="relative aspect-[3/4] w-36 overflow-hidden rounded-xl border border-border shadow-md">
                        <AnimeImage fill sizes="144px" src={animeB.image} alt={animeB.title ?? ""} />
                      </div>
                    )}
                  </td>
                </tr>

                {/* Score */}
                <tr>
                  <td className="p-4 font-mono text-xs text-ink-muted">Skor Rating</td>
                  <td className="p-4 font-mono font-bold">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ${
                      scoreA >= scoreB && scoreA > 0 ? "bg-amber-400/20 text-amber-400 border border-amber-400/40" : "text-ink"
                    }`}>
                      ⭐ {animeA.score || "N/A"} {scoreA > scoreB && "🏆 Lebih Tinggi"}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ${
                      scoreB >= scoreA && scoreB > 0 ? "bg-amber-400/20 text-amber-400 border border-amber-400/40" : "text-ink"
                    }`}>
                      ⭐ {animeB.score || "N/A"} {scoreB > scoreA && "🏆 Lebih Tinggi"}
                    </span>
                  </td>
                </tr>

                {/* Status */}
                <tr>
                  <td className="p-4 font-mono text-xs text-ink-muted">Status Tayang</td>
                  <td className="p-4 font-mono text-xs">{animeA.status || "N/A"}</td>
                  <td className="p-4 font-mono text-xs">{animeB.status || "N/A"}</td>
                </tr>

                {/* Total Episodes */}
                <tr>
                  <td className="p-4 font-mono text-xs text-ink-muted">Total Episode</td>
                  <td className="p-4 font-mono text-xs font-semibold">
                    {animeA.total_episode || "N/A"} {epA > epB && epB > 0 && " (Lebih Panjang)"}
                  </td>
                  <td className="p-4 font-mono text-xs font-semibold">
                    {animeB.total_episode || "N/A"} {epB > epA && epA > 0 && " (Lebih Panjang)"}
                  </td>
                </tr>

                {/* Duration */}
                <tr>
                  <td className="p-4 font-mono text-xs text-ink-muted">Durasi per Episode</td>
                  <td className="p-4 font-mono text-xs">{animeA.duration || "N/A"}</td>
                  <td className="p-4 font-mono text-xs">{animeB.duration || "N/A"}</td>
                </tr>

                {/* Studio / Producer */}
                <tr>
                  <td className="p-4 font-mono text-xs text-ink-muted">Studio / Produser</td>
                  <td className="p-4 text-xs font-semibold text-ink">{animeA.producer || "N/A"}</td>
                  <td className="p-4 text-xs font-semibold text-ink">{animeB.producer || "N/A"}</td>
                </tr>

                {/* Release */}
                <tr>
                  <td className="p-4 font-mono text-xs text-ink-muted">Tanggal Rilis</td>
                  <td className="p-4 font-mono text-xs">{animeA.release_on || "N/A"}</td>
                  <td className="p-4 font-mono text-xs">{animeB.release_on || "N/A"}</td>
                </tr>

                {/* Genres */}
                <tr>
                  <td className="p-4 font-mono text-xs text-ink-muted">Genre</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {animeA.genre?.map((g) => (
                        <span key={g.name} className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-ink-muted">
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {animeB.genre?.map((g) => (
                        <span key={g.name} className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-ink-muted">
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>

                {/* Action */}
                <tr>
                  <td className="p-4 font-mono text-xs text-ink-muted">Aksi</td>
                  <td className="p-4">
                    <Link
                      href={`/anime/${slugA}`}
                      className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3.5 py-1.5 font-mono text-xs font-bold text-accent hover:bg-accent hover:text-(--accent-ink) transition-colors"
                    >
                      <span>Lihat Download A</span>
                      <span>→</span>
                    </Link>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/anime/${slugB}`}
                      className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3.5 py-1.5 font-mono text-xs font-bold text-accent hover:bg-accent hover:text-(--accent-ink) transition-colors"
                    >
                      <span>Lihat Download B</span>
                      <span>→</span>
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default ComparePage;
