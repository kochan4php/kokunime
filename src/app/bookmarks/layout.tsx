import { Metadata } from "next";
import { JSX, ReactNode } from "react";

// Client page: metadata lives here so the crawl gets a unique title/summary.
export const metadata: Metadata = {
  title: "Tersimpan — Bookmark & Koleksi Anime",
  description:
    "Simpan anime tanpa akun: status tontonan, rating, catatan pribadi, koleksi kustom, plus ekspor JSON/XML MyAnimeList dan tautan sinkronisasi antar perangkat.",
  alternates: { canonical: "/bookmarks" },
};

const BookmarksLayout = ({ children }: { children: ReactNode }): JSX.Element => <>{children}</>;

export default BookmarksLayout;
