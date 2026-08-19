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
  gradient: string;
}

const GENRE_DICTIONARY: Record<string, GenreMeta> = {
  action: {
    icon: "⚔️",
    desc: "Pertarungan seru & adegan aksi menegangkan",
    gradient: "from-rose-500/15 via-orange-500/10 to-transparent border-rose-500/30 hover:border-rose-500/60 hover:shadow-[0_8px_30px_rgba(244,63,94,0.15)]",
  },
  adventure: {
    icon: "🗺️",
    desc: "Petualangan menjelajah dunia & perjalanan epik",
    gradient: "from-amber-500/15 via-orange-500/10 to-transparent border-amber-500/30 hover:border-amber-500/60 hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]",
  },
  comedy: {
    icon: "🤣",
    desc: "Humor segar & komedi pengocok perut",
    gradient: "from-yellow-500/15 via-amber-500/10 to-transparent border-yellow-500/30 hover:border-yellow-500/60 hover:shadow-[0_8px_30px_rgba(234,179,8,0.15)]",
  },
  drama: {
    icon: "🎭",
    desc: "Konflik emosional, kisah hidup & air mata",
    gradient: "from-blue-500/15 via-indigo-500/10 to-transparent border-blue-500/30 hover:border-blue-500/60 hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)]",
  },
  fantasy: {
    icon: "🪄",
    desc: "Dunia sihir, sihir kuno & makhluk mitos",
    gradient: "from-purple-500/15 via-indigo-500/10 to-transparent border-purple-500/30 hover:border-purple-500/60 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)]",
  },
  magic: {
    icon: "✨",
    desc: "Kekuatan mantra sihir & akademi magis",
    gradient: "from-fuchsia-500/15 via-purple-500/10 to-transparent border-fuchsia-500/30 hover:border-fuchsia-500/60 hover:shadow-[0_8px_30px_rgba(217,70,239,0.15)]",
  },
  romance: {
    icon: "💖",
    desc: "Kisah cinta manis, romansa & perasaan tulus",
    gradient: "from-pink-500/15 via-rose-500/10 to-transparent border-pink-500/30 hover:border-pink-500/60 hover:shadow-[0_8px_30px_rgba(236,72,153,0.15)]",
  },
  "sci-fi": {
    icon: "🚀",
    desc: "Teknologi masa depan, luar angkasa & mecha",
    gradient: "from-teal-500/15 via-emerald-500/10 to-transparent border-teal-500/30 hover:border-teal-500/60 hover:shadow-[0_8px_30px_rgba(20,184,166,0.15)]",
  },
  isekai: {
    icon: "🌀",
    desc: "Terlempar ke dunia lain & petualangan baru",
    gradient: "from-cyan-500/15 via-blue-500/10 to-transparent border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)]",
  },
  "slice of life": {
    icon: "☕",
    desc: "Kisah hangat keseharian yang santai & menenangkan",
    gradient: "from-emerald-500/15 via-teal-500/10 to-transparent border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]",
  },
  supernatural: {
    icon: "👻",
    desc: "Kekuatan gaib, hantu & misteri supranatural",
    gradient: "from-violet-500/15 via-purple-500/10 to-transparent border-violet-500/30 hover:border-violet-500/60 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)]",
  },
  mystery: {
    icon: "🔍",
    desc: "Teka-teki, penyelidikan & rahasia tersembunyi",
    gradient: "from-slate-500/15 via-zinc-500/10 to-transparent border-slate-500/30 hover:border-slate-500/60 hover:shadow-[0_8px_30px_rgba(100,116,139,0.15)]",
  },
  psychological: {
    icon: "🧠",
    desc: "Pertarungan pikiran, intrik & misteri psikologis",
    gradient: "from-violet-600/15 via-fuchsia-600/10 to-transparent border-violet-600/30 hover:border-violet-600/60 hover:shadow-[0_8px_30px_rgba(124,58,237,0.15)]",
  },
  horror: {
    icon: "🧟",
    desc: "Ketegangan mengerikan, misteri gelap & teror",
    gradient: "from-red-600/15 via-zinc-800/10 to-transparent border-red-600/30 hover:border-red-600/60 hover:shadow-[0_8px_30px_rgba(220,38,38,0.15)]",
  },
  school: {
    icon: "🏫",
    desc: "Kehidupan sekolah, masa muda & pertemanan",
    gradient: "from-sky-500/15 via-indigo-500/10 to-transparent border-sky-500/30 hover:border-sky-500/60 hover:shadow-[0_8px_30px_rgba(14,165,233,0.15)]",
  },
  sports: {
    icon: "⚽",
    desc: "Semangat kompetisi, kerja tim & olahraga",
    gradient: "from-lime-500/15 via-green-500/10 to-transparent border-lime-500/30 hover:border-lime-500/60 hover:shadow-[0_8px_30px_rgba(132,204,22,0.15)]",
  },
  mecha: {
    icon: "🤖",
    desc: "Robot raksasa, teknologi perang & pilot tempur",
    gradient: "from-blue-600/15 via-cyan-600/10 to-transparent border-blue-600/30 hover:border-blue-600/60 hover:shadow-[0_8px_30px_rgba(37,99,235,0.15)]",
  },
  music: {
    icon: "🎵",
    desc: "Harmoni lagu, musisi & panggung impian",
    gradient: "from-pink-500/15 via-purple-500/10 to-transparent border-pink-500/30 hover:border-pink-500/60 hover:shadow-[0_8px_30px_rgba(236,72,153,0.15)]",
  },
  shounen: {
    icon: "🔥",
    desc: "Semangat juang tinggi & pertarungan impian",
    gradient: "from-orange-500/15 via-red-500/10 to-transparent border-orange-500/30 hover:border-orange-500/60 hover:shadow-[0_8px_30px_rgba(249,115,22,0.15)]",
  },
  shoujo: {
    icon: "🌸",
    desc: "Kisah menyentuh hati penuh estetika & perasaan",
    gradient: "from-pink-400/15 via-rose-400/10 to-transparent border-pink-400/30 hover:border-pink-400/60 hover:shadow-[0_8px_30px_rgba(244,114,182,0.15)]",
  },
  seinen: {
    icon: "🍷",
    desc: "Alur cerita matang, konflik kompleks & dewasa",
    gradient: "from-indigo-600/15 via-slate-700/10 to-transparent border-indigo-600/30 hover:border-indigo-600/60 hover:shadow-[0_8px_30px_rgba(79,70,229,0.15)]",
  },
  josei: {
    icon: "👠",
    desc: "Dinamika cinta realistis & kehidupan dewasa",
    gradient: "from-rose-400/15 via-pink-600/10 to-transparent border-rose-400/30 hover:border-rose-400/60 hover:shadow-[0_8px_30px_rgba(251,113,133,0.15)]",
  },
  historical: {
    icon: "🏯",
    desc: "Latar sejarah era lampau & peradaban kuno",
    gradient: "from-amber-600/15 via-stone-600/10 to-transparent border-amber-600/30 hover:border-amber-600/60 hover:shadow-[0_8px_30px_rgba(217,119,6,0.15)]",
  },
  military: {
    icon: "🎖️",
    desc: "Strategi perang, tentara & taktik tempur",
    gradient: "from-emerald-700/15 via-zinc-700/10 to-transparent border-emerald-700/30 hover:border-emerald-700/60 hover:shadow-[0_8px_30px_rgba(4,120,87,0.15)]",
  },
  superpower: {
    icon: "⚡",
    desc: "Kekuatan super dahsyat & pertarungan epik",
    gradient: "from-yellow-400/15 via-amber-500/10 to-transparent border-yellow-400/30 hover:border-yellow-400/60 hover:shadow-[0_8px_30px_rgba(250,204,21,0.15)]",
  },
  vampire: {
    icon: "🧛",
    desc: "Makhluk pengisap darah & kutukan kegelapan",
    gradient: "from-red-600/15 via-rose-950/10 to-transparent border-red-600/30 hover:border-red-600/60 hover:shadow-[0_8px_30px_rgba(220,38,38,0.15)]",
  },
  demons: {
    icon: "👹",
    desc: "Iblis, siluman & pertempuran dunia bawah",
    gradient: "from-red-700/15 via-purple-900/10 to-transparent border-red-700/30 hover:border-red-700/60 hover:shadow-[0_8px_30px_rgba(185,28,28,0.15)]",
  },
  game: {
    icon: "🎮",
    desc: "Dunia game, video game & kompetisi virtual",
    gradient: "from-violet-500/15 via-cyan-500/10 to-transparent border-violet-500/30 hover:border-violet-500/60 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)]",
  },
  harem: {
    icon: "👥",
    desc: "Dikelilingi banyak pilihan karakter memikat",
    gradient: "from-rose-400/15 via-orange-400/10 to-transparent border-rose-400/30 hover:border-rose-400/60 hover:shadow-[0_8px_30px_rgba(251,113,133,0.15)]",
  },
  ecchi: {
    icon: "🔞",
    desc: "Adegan menggoda & komedi berunsur sensual",
    gradient: "from-pink-600/15 via-red-500/10 to-transparent border-pink-600/30 hover:border-pink-600/60 hover:shadow-[0_8px_30px_rgba(219,39,119,0.15)]",
  },
  martial_arts: {
    icon: "🥋",
    desc: "Seni bela diri & jurus pukulan mematikan",
    gradient: "from-amber-500/15 via-red-500/10 to-transparent border-amber-500/30 hover:border-amber-500/60 hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]",
  },
  samurai: {
    icon: "🗡️",
    desc: "Pendekar pedang, kode bushido & zaman feodal",
    gradient: "from-stone-500/15 via-zinc-600/10 to-transparent border-stone-500/30 hover:border-stone-500/60 hover:shadow-[0_8px_30px_rgba(120,113,108,0.15)]",
  },
  space: {
    icon: "🌌",
    desc: "Perjalanan antariksa, galaksi & luar angkasa",
    gradient: "from-indigo-700/15 via-blue-900/10 to-transparent border-indigo-700/30 hover:border-indigo-700/60 hover:shadow-[0_8px_30px_rgba(67,56,202,0.15)]",
  },
  parody: {
    icon: "🤡",
    desc: "Pelesetan jenaka & parodi anime populer",
    gradient: "from-yellow-400/15 via-orange-400/10 to-transparent border-yellow-400/30 hover:border-yellow-400/60 hover:shadow-[0_8px_30px_rgba(250,204,21,0.15)]",
  },
  police: {
    icon: "👮",
    desc: "Penyelidikan kepolisian, detektif & kasus kriminal",
    gradient: "from-blue-600/15 via-slate-700/10 to-transparent border-blue-600/30 hover:border-blue-600/60 hover:shadow-[0_8px_30px_rgba(37,99,235,0.15)]",
  },
  thriller: {
    icon: "😱",
    desc: "Ketegangan psikologis & pacuan adrenalin tinggi",
    gradient: "from-red-600/15 via-purple-900/10 to-transparent border-red-600/30 hover:border-red-600/60 hover:shadow-[0_8px_30px_rgba(220,38,38,0.15)]",
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
    gradient: "from-accent/15 via-accent-2/10 to-transparent border-border hover:border-accent/60 hover:shadow-md",
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
            className="h-12 w-full rounded-2xl border border-border bg-surface-solid pl-11 pr-10 text-sm text-ink outline-none transition-all placeholder:text-ink-muted focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/20"
          />
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted text-base">
            🔍
          </span>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-xs text-ink-muted hover:text-ink hover:bg-surface-muted cursor-pointer"
              title="Hapus pencarian"
            >
              ✕
            </button>
          )}
        </div>

        <p className="font-mono text-xs text-ink-muted">
          Menampilkan <span className="text-accent font-bold">{filteredGenres.length}</span> dari {genres.length} genre
        </p>
      </div>

      {/* Complete Genres Grid using Compact Rich Card Design */}
      <section>
        {filteredGenres.length > 0 ? (
          <div className="grid grid-cols-2 min-[500px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
            {filteredGenres.map((genre) => {
              const slug = endpointSlug(genre.endpoint, "genres");
              if (!slug) return null;

              const meta = getGenreMeta(slug, genre.name);

              return (
                <Link
                  key={slug}
                  href={`/genres/${slug}`}
                  className={`group relative flex flex-col justify-between rounded-2xl border bg-gradient-to-br ${meta.gradient} p-3 sm:p-3.5 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-surface-solid/90 text-base sm:text-lg border border-border/60 shadow-xs backdrop-blur-md group-hover:scale-110 transition-transform">
                      {meta.icon}
                    </span>
                    <span className="font-mono text-xs text-ink-muted opacity-0 group-hover:opacity-100 group-hover:text-accent group-hover:translate-x-0.5 transition-all">
                      →
                    </span>
                  </div>
                  <div className="mt-2.5 min-w-0">
                    <h3 className="font-display text-xs sm:text-sm font-bold text-ink truncate group-hover:text-accent transition-colors">
                      {genre.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-ink-muted mt-0.5 line-clamp-1 leading-snug">
                      {meta.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-surface-solid p-8 text-center">
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
