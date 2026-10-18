"use client";

import { Genre } from "@/interfaces";
import { endpointSlug } from "@/utils/endpoint-slug";
import Link from "next/link";
import { JSX, useMemo, useState } from "react";

interface GenresExplorerProps {
  genres: Genre[];
}

interface GenreMeta {
  icon: string;
  desc: string;
}

const GENRE_DICTIONARY: Record<string, GenreMeta> = {
  action: {
    icon: "⚔️",
    desc: "Pertarungan seru & adegan aksi menegangkan",
  },
  adventure: {
    icon: "🗺️",
    desc: "Petualangan menjelajah dunia & perjalanan epik",
  },
  comedy: {
    icon: "🤣",
    desc: "Humor segar & komedi pengocok perut",
  },
  drama: {
    icon: "🎭",
    desc: "Konflik emosional, kisah hidup & air mata",
  },
  fantasy: {
    icon: "🪄",
    desc: "Dunia sihir, sihir kuno & makhluk mitos",
  },
  magic: {
    icon: "✨",
    desc: "Kekuatan mantra sihir & akademi magis",
  },
  romance: {
    icon: "💖",
    desc: "Kisah cinta manis, romansa & perasaan tulus",
  },
  "sci-fi": {
    icon: "🚀",
    desc: "Teknologi masa depan, luar angkasa & mecha",
  },
  isekai: {
    icon: "🌀",
    desc: "Terlempar ke dunia lain & petualangan baru",
  },
  "slice of life": {
    icon: "☕",
    desc: "Kisah hangat keseharian yang santai & menenangkan",
  },
  supernatural: {
    icon: "👻",
    desc: "Kekuatan gaib, hantu & misteri supranatural",
  },
  mystery: {
    icon: "🔍",
    desc: "Teka-teki, penyelidikan & rahasia tersembunyi",
  },
  psychological: {
    icon: "🧠",
    desc: "Pertarungan pikiran, intrik & misteri psikologis",
  },
  horror: {
    icon: "🧟",
    desc: "Ketegangan mengerikan, misteri gelap & teror",
  },
  school: {
    icon: "🏫",
    desc: "Kehidupan sekolah, masa muda & pertemanan",
  },
  sports: {
    icon: "⚽",
    desc: "Semangat kompetisi, kerja tim & olahraga",
  },
  mecha: {
    icon: "🤖",
    desc: "Robot raksasa, teknologi perang & pilot tempur",
  },
  music: {
    icon: "🎵",
    desc: "Harmoni lagu, musisi & panggung impian",
  },
  shounen: {
    icon: "🔥",
    desc: "Semangat juang tinggi & pertarungan impian",
  },
  shoujo: {
    icon: "🌸",
    desc: "Kisah menyentuh hati penuh estetika & perasaan",
  },
  seinen: {
    icon: "🍷",
    desc: "Alur cerita matang, konflik kompleks & dewasa",
  },
  josei: {
    icon: "👠",
    desc: "Dinamika cinta realistis & kehidupan dewasa",
  },
  historical: {
    icon: "🏯",
    desc: "Latar sejarah era lampau & peradaban kuno",
  },
  military: {
    icon: "🎖️",
    desc: "Strategi perang, tentara & taktik tempur",
  },
  superpower: {
    icon: "⚡",
    desc: "Kekuatan super dahsyat & pertarungan epik",
  },
  vampire: {
    icon: "🧛",
    desc: "Makhluk pengisap darah & kutukan kegelapan",
  },
  demons: {
    icon: "👹",
    desc: "Iblis, siluman & pertempuran dunia bawah",
  },
  game: {
    icon: "🎮",
    desc: "Dunia game, video game & kompetisi virtual",
  },
  harem: {
    icon: "👥",
    desc: "Dikelilingi banyak pilihan karakter memikat",
  },
  ecchi: {
    icon: "🔞",
    desc: "Adegan menggoda & komedi berunsur sensual",
  },
  martial_arts: {
    icon: "🥋",
    desc: "Seni bela diri & jurus pukulan mematikan",
  },
  samurai: {
    icon: "🗡️",
    desc: "Pendekar pedang, kode bushido & zaman feodal",
  },
  space: {
    icon: "🌌",
    desc: "Perjalanan antariksa, galaksi & luar angkasa",
  },
  parody: {
    icon: "🤡",
    desc: "Pelesetan jenaka & parodi anime populer",
  },
  police: {
    icon: "👮",
    desc: "Penyelidikan kepolisian, detektif & kasus kriminal",
  },
  thriller: {
    icon: "😱",
    desc: "Ketegangan psikologis & pacuan adrenalin tinggi",
  },
};

const getGenreMeta = (slug: string, name: string): GenreMeta => {
  const normalizedKey = slug.toLowerCase().replace(/[^a-z0-9]/g, "_");
  if (GENRE_DICTIONARY[normalizedKey]) {
    return GENRE_DICTIONARY[normalizedKey];
  }
  const cleanKey = slug.toLowerCase();
  if (GENRE_DICTIONARY[cleanKey]) {
    return GENRE_DICTIONARY[cleanKey];
  }
  // Generic beautiful fallback
  return {
    icon: "🏷️",
    desc: `Koleksi anime bertema ${name} subtitle Indonesia`,
  };
};

export const GenresExplorer = ({ genres }: GenresExplorerProps): JSX.Element => {
  const [query, setQuery] = useState("");

  const filteredGenres = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return genres;
    return genres.filter((g) => g.name.toLowerCase().includes(q));
  }, [genres, query]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari genre (misal: Isekai, Romance, Action)..."
            aria-label="Cari genre anime"
            className="h-12 w-full rounded-sm border-2 border-border bg-surface-solid pl-11 pr-10 text-sm text-ink shadow-[2px_2px_0_0_var(--border)] outline-none transition-all placeholder:text-ink-muted focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/20"
          />
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted text-base">
            🔍
          </span>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-sm p-1 text-xs text-ink-muted hover:text-ink hover:bg-surface-muted cursor-pointer"
              title="Hapus pencarian"
            >
              ✕
            </button>
          )}
        </div>

        <p className="font-mono text-xs text-ink-muted">
          Menampilkan <span className="text-accent-text font-bold">{filteredGenres.length}</span> dari {genres.length}{" "}
          genre
        </p>
      </div>

      {/* Complete Genres Grid using Compact Rich Card Design */}
      <section>
        {filteredGenres.length > 0 ? (
          <div className="nb-cycle grid grid-cols-2 min-[500px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
            {filteredGenres.map((genre) => {
              const slug = endpointSlug(genre.endpoint, "genres");
              if (!slug) return null;

              const meta = getGenreMeta(slug, genre.name);

              return (
                <Link
                  key={slug}
                  href={`/genres/${slug}`}
                  className="group relative flex flex-col justify-between rounded-sm border-2 border-border bg-(--nb-card) p-3 sm:p-3.5 text-nb-ink shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 motion-safe:hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--border)] active:translate-y-0 active:shadow-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-sm bg-white/60 text-base sm:text-lg border-2 border-nb-ink/40 group-hover:scale-110 transition-transform">
                      {meta.icon}
                    </span>
                    <span className="font-mono text-xs text-nb-ink/60 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                      →
                    </span>
                  </div>
                  <div className="mt-2.5 min-w-0">
                    <h3 className="font-display text-xs sm:text-sm font-bold text-nb-ink truncate group-hover:underline transition-colors">
                      {genre.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-nb-ink mt-0.5 line-clamp-1 leading-snug">
                      {meta.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-sm border-2 border-border bg-surface-solid p-8 text-center shadow-[2px_2px_0_0_var(--border)]">
            <span className="text-3xl">🔍</span>
            <p className="font-display text-base font-bold text-ink mt-2">Genre &quot;{query}&quot; tidak ditemukan</p>
            <p className="text-xs text-ink-muted mt-1">Coba gunakan ejaan atau kata kunci genre yang lain.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default GenresExplorer;
