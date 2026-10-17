"use client";

import CardAnime from "@/components/cards/card-anime";
import { BookmarkItem, getBookmarks, subscribeBookmarks } from "@/utils/bookmarks";
import { HistoryItem, getHistory, subscribeHistory } from "@/utils/history";
import { toTitle } from "@/utils/to-title";
import { JSX, useEffect, useMemo, useState, useSyncExternalStore } from "react";

interface RecommendItem {
  slug: string;
  title: string;
  image?: string;
  release?: string;
  genres: string[];
  score: number;
}

interface RecommendResponse {
  topGenre: string | null;
  items: RecommendItem[];
}

const SERVER_BOOKMARKS: BookmarkItem[] = [];
const SERVER_HISTORY: HistoryItem[] = [];

// Personal strip on the home page: seeds = most recent bookmarks (or history),
// scored server-side against their genres. Renders nothing when there is no
// seed data or no match.
const RecommendForYou = (): JSX.Element | null => {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, getBookmarks, () => SERVER_BOOKMARKS);
  const history = useSyncExternalStore(subscribeHistory, getHistory, () => SERVER_HISTORY);
  const [data, setData] = useState<RecommendResponse | null>(null);

  const seedKey = useMemo(
    () =>
      (bookmarks.length > 0 ? bookmarks : history)
        .slice(0, 4)
        .map((item) => item.slug)
        .join(","),
    [bookmarks, history],
  );

  useEffect(() => {
    if (!seedKey) {
      setData(null);
      return;
    }
    const controller = new AbortController();
    fetch(`/api/recommend?slugs=${encodeURIComponent(seedKey)}`, { signal: controller.signal })
      .then((res) => (res.ok ? (res.json() as Promise<RecommendResponse>) : null))
      .then((payload) => {
        if (payload) setData(payload);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [seedKey]);

  const saved = useMemo(() => new Set(bookmarks.map((bookmark) => bookmark.slug)), [bookmarks]);
  const items = (data?.items ?? []).filter((item) => !saved.has(item.slug)).slice(0, 12);

  if (items.length === 0) return null;

  return (
    <section className="container px-4 pt-2 pb-10 md:pb-14">
      <div className="mb-5">
        <span className="chip">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Untukmu
        </span>
        <h2 className="mt-3 font-display text-xl font-extrabold uppercase tracking-tight text-ink md:text-3xl">
          Rekomendasi Untukmu
        </h2>
        {data?.topGenre && (
          <p className="mt-1 font-mono text-xs text-ink-muted">Karena kamu suka {toTitle(data.topGenre)}</p>
        )}
      </div>
      <div className="nb-cycle grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 md:grid-cols-5 md:gap-3 lg:grid-cols-6">
        {items.map((item, index) => (
          <CardAnime
            key={item.slug}
            path={`/anime/${item.slug}`}
            src={item.image as string}
            title={item.title}
            genres={item.genres}
            meta={item.release || ""}
            eager={index < 2}
            priority={false}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendForYou;
