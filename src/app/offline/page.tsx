"use client";

import MainLayout from "@/layouts/main-layout";
import Link from "next/link";
import { JSX } from "react";

const OfflinePage = (): JSX.Element => (
  <MainLayout>
    <section className="container px-4 py-16 text-center md:py-24">
      <div className="mx-auto max-w-md">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
            aria-hidden="true"
          >
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
          Anda Sedang Offline
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Koneksi internet Anda sedang terputus. Anda tetap dapat mengakses semua daftar anime yang sudah tersimpan di
          perangkat ini.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/bookmarks" className="btn-primary w-full sm:w-auto">
            Buka Anime Tersimpan
          </Link>
          <button type="button" onClick={() => window.location.reload()} className="btn-secondary w-full sm:w-auto">
            Coba Muat Ulang
          </button>
        </div>
      </div>
    </section>
  </MainLayout>
);

export default OfflinePage;
