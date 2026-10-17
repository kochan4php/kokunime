import AnimeImage from "@/components/cards/anime-image";
import { suggestLocal } from "@/lib/search-index";
import Link from "next/link";
import { JSX } from "react";

// "Mirip dengan ini" — server-rendered rail from the local catalog index.
// Hidden when the index is cold (no Redis / not warmed up yet).
const SimilarAnime = async ({ slug, title }: { slug: string; title: string }): Promise<JSX.Element | null> => {
  if (!title) return null;
  const items = (await suggestLocal(title, 13)).filter((item) => item.slug !== slug).slice(0, 12);
  if (items.length === 0) return null;

  return (
    <section className="container px-4 pt-10" aria-labelledby="similar-title">
      <div className="mb-4 flex items-center gap-2">
        <h2 id="similar-title" className="font-display text-lg font-extrabold tracking-tight text-ink md:text-xl">
          🧭 Mirip dengan ini
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-wide text-ink-muted">dari katalog lokal</span>
      </div>
      <div className="nb-cycle flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/anime/${item.slug}`}
            className="card-shell group block w-32 shrink-0 snap-start sm:w-36"
          >
            <div className="card-core">
              <div className="relative aspect-[3/4] w-full border-b-2 border-border">
                <AnimeImage
                  fill
                  sizes="144px"
                  src={item.image as string}
                  alt={item.title}
                  className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                />
              </div>
              <div className="p-2.5">
                <h3 className="line-clamp-2 text-[11px] font-semibold leading-snug group-hover:underline decoration-2 underline-offset-2">
                  {item.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SimilarAnime;
