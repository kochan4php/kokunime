import MainLayout from "@/layouts/main-layout";
import SectionHeader from "@/components/section-header";
import { SITE_URL } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Pernyataan Aksesibilitas · Kokunime",
  description:
    "Komitmen Kokunime terhadap WCAG 2.2 Level AA: navigasi keyboard, kontras, mode gerak/transparansi, reflow, dan kanal laporan masalah aksesibilitas.",
  alternates: { canonical: `${SITE_URL}/aksesibilitas` },
  openGraph: {
    title: "Pernyataan Aksesibilitas · Kokunime",
    description:
      "Bagaimana Kokunime menjaga situs tetap bisa dipakai dengan keyboard, pembaca layar, dan pengaturan kontras sistem.",
    url: `${SITE_URL}/aksesibilitas`,
  },
};

const SECTIONS: { id: string; title: string; body: JSX.Element }[] = [
  {
    id: "komitmen",
    title: "Komitmen",
    body: (
      <p>
        Kokunime menargetkan <strong className="text-ink">WCAG 2.2 Level AA</strong>. Situs ini tidak memakai akun,
        iklan, atau widget pihak ketiga, jadi hampir seluruh antarmuka sepenuhnya ada di kendali kami dan bisa
        diperbaiki tanpa menunggu vendor.
      </p>
    ),
  },
  {
    id: "diterapkan",
    title: "Yang Sudah Diterapkan",
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          Navigasi keyboard penuh dengan urutan fokus yang logis, tautan &quot;Lewati ke konten&quot;, dan cincin fokus
          yang terlihat di semua tema.
        </li>
        <li>Kontras teks dan komponen diuji otomatis dengan axe-core pada rute-rute utama.</li>
        <li>
          Menghormati <code className="font-mono text-[11px]">prefers-reduced-motion</code>,{" "}
          <code className="font-mono text-[11px]">prefers-contrast</code>,{" "}
          <code className="font-mono text-[11px]">forced-colors</code> (Windows High Contrast), dan{" "}
          <code className="font-mono text-[11px]">prefers-reduced-transparency</code>.
        </li>
        <li>
          Reflow tanpa gulir horizontal pada lebar 320px (setara zoom 400%) dan teks yang diperbesar hingga 200% tanpa
          kehilangan konten.
        </li>
        <li>
          Perpindahan halaman diumumkan lewat satu live region; notifikasi memakai status live — tidak ada pengumuman
          ganda untuk pesan yang sama.
        </li>
        <li>
          Judul berbahasa Jepang ditandai <code className="font-mono text-[11px]">lang=&quot;ja&quot;</code> dan tidak
          diterjemahkan mesin; judul katalog ditandai{" "}
          <code className="font-mono text-[11px]">translate=&quot;no&quot;</code> agar nama judul tidak rusak oleh
          penerjemah bawaan browser.
        </li>
        <li>
          Poster anime memakai teks alternatif dari judul; gambar dekoratif ditandai agar diabaikan pembaca layar.
        </li>
      </ul>
    ),
  },
  {
    id: "batasan",
    title: "Batasan yang Diketahui",
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          Data anime berasal dari sumber upstream. Judul, sinopsis, dan poster bisa berubah atau tidak lengkap tanpa
          kendali kami.
        </li>
        <li>
          Poster dimuat dari server gambar upstream; bila gagal dimuat, teks alternatif judul tetap tersedia di kartu.
        </li>
        <li>
          Kartu di daftar memakai pemotongan baris (line-clamp) agar grid rapi. Judul lengkap selalu tersedia di halaman
          detail dan atribut judul pada kartu.
        </li>
        <li>
          Tautan unduhan membuka penyedia eksternal (mirror/cloud) yang punya kebijakan aksesibilitasnya sendiri; situs
          ini tidak menyematkan pemutar video pihak ketiga.
        </li>
      </ul>
    ),
  },
  {
    id: "pengujian",
    title: "Cara Kami Menguji",
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>axe-core otomatis pada rute utama, termasuk aturan nama aksesibel yang cocok dengan teks terlihat.</li>
        <li>Perjalanan keyboard berbasis Chrome DevTools Protocol: Tab, Esc, skip link, dan dialog.</li>
        <li>Emulasi media sistem: forced-colors, prefers-contrast, reduces-transparency, dan reflow 320px.</li>
        <li>Pemeriksaan manual dengan keyboard dan pembaca layar bawaan sistem.</li>
      </ul>
    ),
  },
  {
    id: "lapor",
    title: "Melaporkan Masalah",
    body: (
      <p>
        Menemukan hambatan? Buka issue di{" "}
        <a
          href="https://github.com/kochan4php/kokunime/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-bold text-ink underline decoration-2 underline-offset-2 transition-colors hover:text-accent-text"
        >
          github.com/kochan4php/kokunime/issues
        </a>
        . Sertakan URL halaman, browser dan versi, pembaca layar bila ada, serta langkah reproduksi. Laporan akan
        ditinjau dan diperbaiki bila bisa direproduksi.
      </p>
    ),
  },
];

const AccessibilityPage = (): JSX.Element => (
  <MainLayout>
    <section className="container mx-auto max-w-3xl px-4 pt-8 pb-16 md:pt-12">
      <SectionHeader
        kicker="Aksesibilitas"
        title="Pernyataan Aksesibilitas"
        titleAs="h1"
        tone="teal"
        description="Terakhir diperbarui: Oktober 2026 · Target: WCAG 2.2 Level AA."
      />

      <nav aria-label="Daftar isi" className="mt-6 flex flex-wrap gap-2">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="inline-flex min-h-7 items-center rounded-sm border-2 border-border bg-surface px-2 font-mono text-[11px] font-bold text-ink transition-colors hover:bg-nb-yellow hover:text-nb-ink focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {section.title}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-5">
        {SECTIONS.map((section) => (
          <section
            key={section.id}
            aria-labelledby={`${section.id}-title`}
            className="rounded-sm border-2 border-border bg-surface p-4 shadow-[2px_2px_0_0_var(--border)] md:p-5"
          >
            <h2
              id={`${section.id}-title`}
              className="font-display text-base font-extrabold uppercase tracking-tight text-ink"
            >
              {section.title}
            </h2>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-ink-muted">{section.body}</div>
          </section>
        ))}
      </div>

      <p className="mt-8 font-mono text-[11px] text-ink-muted">
        Kembali ke{" "}
        <Link href="/" className="underline decoration-2 underline-offset-2 hover:text-accent-text">
          beranda
        </Link>{" "}
        atau buka{" "}
        <Link href="/settings" className="underline decoration-2 underline-offset-2 hover:text-accent-text">
          pengaturan
        </Link>
        .
      </p>
    </section>
  </MainLayout>
);

export default AccessibilityPage;
