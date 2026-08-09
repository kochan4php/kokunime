import { JSX } from "react";

const MetaItem = ({ label, value }: { label: string; value?: string }): JSX.Element => (
  <div className="rounded-2xl border border-border bg-surface px-4 py-3">
    <dt className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{label}</dt>
    <dd className="mt-1 text-sm font-semibold text-ink">{value || "—"}</dd>
  </div>
);

const DetailMeta = ({ anime }: any): JSX.Element => {
  const items = [
    { label: "Japanese", value: anime.japanese },
    { label: "Release", value: anime.release_on },
    { label: "Musim", value: anime.season?.name },
    { label: "Total Episode", value: anime.total_episode },
    { label: "Durasi", value: anime.duration },
    { label: "Skor", value: anime.score },
  ];

  return (
    <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <MetaItem key={index} label={item.label} value={item.value} />
      ))}
    </dl>
  );
};

export default DetailMeta;
