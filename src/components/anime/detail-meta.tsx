import { endpointSlug } from "@/utils/endpoint-slug";
import { AnimeDetail } from "@/interfaces";
import Link from "next/link";
import { JSX } from "react";

interface MetaItemProps {
  label: string;
  value?: string;
  href?: string;
}

const MetaItem = ({ label, value, href }: MetaItemProps): JSX.Element => (
  <div className="rounded-2xl border border-border bg-surface px-4 py-3">
    <dt className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{label}</dt>
    <dd className="mt-1 text-sm font-semibold text-ink">
      {href ? (
        <Link href={href} className="transition-colors duration-200 hover:text-accent">
          {value || "—"}
        </Link>
      ) : (
        value || "—"
      )}
    </dd>
  </div>
);

const DetailMeta = ({ anime }: { anime: AnimeDetail }): JSX.Element => {
  const seasonSlug = endpointSlug(anime.season?.endpoint, "seasons");
  const items = [
    { label: "Japanese", value: anime.japanese },
    { label: "Release", value: anime.release_on },
    { label: "Musim", value: anime.season?.name, href: seasonSlug ? `/seasons/${seasonSlug}` : undefined },
    { label: "Total Episode", value: anime.total_episode },
    { label: "Durasi", value: anime.duration },
    { label: "Skor", value: anime.score },
  ];

  return (
    <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <MetaItem key={index} label={item.label} value={item.value} href={item.href} />
      ))}
    </dl>
  );
};

export default DetailMeta;
