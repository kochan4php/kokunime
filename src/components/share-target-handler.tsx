"use client";

import { isBookmarked, toggleBookmark } from "@/utils/bookmarks";
import { extractKusonimeSlug } from "@/utils/share-target";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { JSX, useEffect, useMemo, useState } from "react";

type ShareState = "loading" | "saved" | "exists" | "unknown" | "error";

interface DetailInfo {
  title?: string;
  image?: string;
  release_on?: string;
}

// PWA share target handler (manifest.share_target). Kusonime links are saved
// to bookmarks automatically; anything else offers a catalog search instead.
const ShareTargetHandler = (): JSX.Element => {
  const params = useSearchParams();
  const sharedUrl = params.get("url") || params.get("text") || "";
  const sharedTitle = params.get("title") || "";
  const slug = useMemo(() => extractKusonimeSlug(sharedUrl), [sharedUrl]);
  const [state, setState] = useState<ShareState>(slug ? "loading" : "unknown");
  const [info, setInfo] = useState<DetailInfo | null>(null);

  useEffect(() => {
    if (!slug) {
      setState("unknown");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/anime/${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error("not found");
        const detail = (await res.json()) as DetailInfo;
        if (cancelled) return;
        setInfo(detail);
        if (isBookmarked(slug)) {
          setState("exists");
        } else {
          toggleBookmark({
            slug,
            title: detail.title || sharedTitle || slug,
            image: detail.image,
            release: detail.release_on,
          });
          setState("saved");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, sharedTitle]);

  const title = info?.title || sharedTitle || slug || "Tautan";
  const searchQuery = (sharedTitle || sharedUrl).trim();

  const headline =
    state === "loading"
      ? "Menyimpan anime…"
      : state === "saved"
        ? "Tersimpan!"
        : state === "exists"
          ? "Sudah ada di daftar tersimpan"
          : state === "error"
            ? "Gagal memuat detail"
            : "Tautan tidak dikenali";

  return (
    <section className="container px-4 pt-10 pb-16 md:pt-16">
      <div className="card-shell mx-auto max-w-xl">
        <div className="card-core flex flex-col items-center p-8 text-center md:p-12">
          <span className="rounded-sm border-2 border-border bg-nb-yellow px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-nb-ink shadow-[2px_2px_0_0_var(--border)]">
            Share Target
          </span>
          <h1 className="mt-4 font-display text-xl font-extrabold tracking-tight text-ink md:text-2xl">{headline}</h1>
          {state !== "unknown" && <p className="mt-2 max-w-sm text-sm text-ink-muted">{title}</p>}

          {state === "unknown" && (
            <p className="mt-2 max-w-sm text-sm text-ink-muted">
              Tautan yang dibagikan bukan halaman anime Kusonime. Coba cari judulnya di katalog.
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {slug && (
              <Link href={`/anime/${slug}`} className="btn-primary">
                Buka Halaman Anime
              </Link>
            )}
            <Link href="/bookmarks" className="btn-secondary">
              Lihat Tersimpan
            </Link>
            {state === "unknown" && searchQuery && (
              <Link href={`/search/${encodeURIComponent(searchQuery)}`} className="btn-secondary">
                Cari &quot;{searchQuery.slice(0, 30)}&quot;
              </Link>
            )}
            <Link href="/" className="btn-secondary">
              Beranda
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShareTargetHandler;
