import type { CacheTier } from "@/services/cache";
import { JSX } from "react";

const formatFetchedAt = (value: number): string => {
  if (!value) return "waktu pembaruan tidak tersedia";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(new Date(value));
  } catch {
    return "waktu pembaruan tidak tersedia";
  }
};

// The timestamp comes from the cache entry that served this page, not from
// "now": a cache hit must never look freshly scraped.
const DataProvenance = ({
  fetchedAt,
  tier,
}: {
  fetchedAt: number;
  tier?: CacheTier | undefined;
}): JSX.Element => {
  const iso = fetchedAt > 0 && fetchedAt <= 8.64e15 ? new Date(fetchedAt).toISOString() : "";
  return (
    <p className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-ink-muted">
      <span>
        Sumber:{" "}
        <a
          href="https://kusonime.com/"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 transition-colors hover:text-accent-text"
        >
          kusonime
        </a>
      </span>
      <span aria-hidden="true">·</span>
      {iso ? (
        <time dateTime={iso}>Diperbarui {formatFetchedAt(fetchedAt)} WIB</time>
      ) : (
        <span>Waktu pembaruan tidak tersedia</span>
      )}
      {tier === "stale" && (
        <span className="rounded-sm border border-border px-1.5 py-0.5 font-bold text-ink">
          Salinan terakhir — data mungkin tertinggal
        </span>
      )}
    </p>
  );
};

export default DataProvenance;
