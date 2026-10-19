"use client";

import ErrorCard from "@/components/error-card";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";

interface Suggestion {
  slug: string;
  title: string;
}

// "Did you mean" on 404: turns the failed URL slug into words and asks the
// local index for close titles. Empty index = suggestions simply do not show.
const NotFoundPage = (): JSX.Element => {
  const router = useRouter();
  const pathname = usePathname();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const segments = (pathname ?? "").split("/").filter(Boolean);
    const raw = (() => {
      try {
        return decodeURIComponent(segments[segments.length - 1] ?? "");
      } catch {
        return segments[segments.length - 1] ?? "";
      }
    })();
    const cleaned = raw
      .split(/[-_+]+/)
      .join(" ")
      .trim();
    if (cleaned.length < 3) return;

    let active = true;
    void (async () => {
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(cleaned)}`);
        if (!res.ok) return;
        const data = (await res.json()) as { items?: Suggestion[] };
        if (active) setSuggestions((data.items ?? []).slice(0, 5));
      } catch {
        // Offline / no index — static actions below still help.
      }
    })();
    return () => {
      active = false;
    };
  }, [pathname]);

  return (
    <ErrorCard
      code="404"
      label="Halaman tidak ditemukan"
      title="Kayaknya kamu nyasar"
      message="Halaman ini nggak ada. Mungkin link-nya salah atau sudah dihapus."
    >
      <meta name="robots" content="noindex, nofollow" />
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <button onClick={() => router.push("/")} className="btn-primary">
          Kembali ke beranda
        </button>
        <button
          onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
          className="glass inline-flex h-11 items-center gap-2 rounded-sm border-2 border-border bg-surface px-6 text-sm font-semibold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
        >
          Balik ke halaman sebelumnya
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-6 w-full text-left">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-ink-muted">Mungkin maksudmu:</p>
          <ul className="mt-2 space-y-1.5">
            {suggestions.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/anime/${item.slug}`}
                  className="flex items-center justify-between gap-2 rounded-sm border-2 border-border bg-surface px-3 py-2 text-sm font-semibold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                >
                  <span className="min-w-0 truncate">{item.title}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ErrorCard>
  );
};

export default NotFoundPage;
