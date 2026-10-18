import { endpointSlug } from "@/utils/endpoint-slug";
import { AnimeDetail } from "@/interfaces";
import Link from "next/link";
import { JSX } from "react";

interface MetaItemProps {
  label: string;
  value?: string | undefined;
  href?: string | undefined;
  lang?: string | undefined;
}

const MetaItem = ({ label, value, href, lang }: MetaItemProps): JSX.Element => {
  return (
    <div className="rounded-sm border-2 border-border bg-surface px-3 py-2 sm:px-4 sm:py-2.5 min-w-0 overflow-hidden shadow-[2px_2px_0_0_var(--border)]">
      <dt className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-ink-muted truncate">{label}</dt>
      <dd
        lang={lang}
        translate={lang === "ja" ? "no" : undefined}
        className="mt-0.5 text-xs sm:text-sm font-semibold text-ink truncate hover:whitespace-normal transition-all cursor-help"
        title={value}
      >
        {href ? (
          <Link
            href={href}
            className="flex min-h-6 min-w-0 items-center truncate transition-colors duration-200 hover:text-accent-text"
          >
            {value || "—"}
          </Link>
        ) : (
          value || "—"
        )}
      </dd>
    </div>
  );
};

const DetailMeta = ({ anime }: { anime: AnimeDetail }): JSX.Element => {
  const seasonSlug = endpointSlug(anime.season?.endpoint, "seasons");
  const studioSlug = anime.studio?.trim() ? `/studio/${encodeURIComponent(anime.studio.trim())}` : undefined;
  const items: MetaItemProps[] = [
    { label: "Judul Jepang", value: anime.japanese, lang: "ja" },
    { label: "Sinonim / English", value: anime.synonyms },
    { label: "Studio", value: anime.studio, href: studioSlug },
    { label: "Produser", value: anime.producer },
    { label: "Rating Umur", value: anime.rating },
    { label: "Rilis", value: anime.release_on },
    { label: "Musim", value: anime.season?.name, href: seasonSlug ? `/seasons/${seasonSlug}` : undefined },
    { label: "Jumlah Episode", value: anime.total_episode },
    { label: "Durasi", value: anime.duration },
    { label: "Skor", value: anime.score },
  ].filter((item) => item.value);

  return (
    <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item, index) => (
        <MetaItem key={index} label={item.label} value={item.value} href={item.href} lang={item.lang} />
      ))}
    </dl>
  );
};

export default DetailMeta;
