import MainLayout from "@/layouts/main-layout";
import { SITE_URL } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Kebijakan Privasi · Kokunime Hub",
  description:
    "Bagaimana Kokunime menangani data kamu: penyimpanan lokal di perangkat, pelacakan anonim tanpa cookie, dan kontrol penghapusan penuh.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title: "Kebijakan Privasi · Kokunime Hub",
    description: "Data kamu tetap di perangkat kamu. Tanpa akun, tanpa cookie iklan, tanpa pelacak pihak ketiga.",
    url: `${SITE_URL}/privacy`,
  },
};

const SECTIONS: { title: string; body: JSX.Element }[] = [
  {
    title: "Data yang disimpan di perangkat kamu",
    body: (
      <p>
        Bookmark, riwayat tontonan, catatan &amp; rating pribadi, pengaturan tema, inbox rilis, dan halaman offline
        disimpan di <strong>localStorage/Cache Storage browser kamu</strong>. Data ini tidak pernah dikirim ke server
        Kokunime dan bisa dihapus kapan saja lewat halaman{" "}
        <Link href="/settings" className="underline decoration-dotted hover:text-ink">
          Pengaturan
        </Link>{" "}
        atau tombol hapus di masing-masing halaman.
      </p>
    ),
  },
  {
    title: "Data di server",
    body: (
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Rate limiting:</strong> alamat IP dipakai sementara (hitungan menit) untuk membatasi penyalahgunaan
          API, lalu kedaluwarsa otomatis.
        </li>
        <li>
          <strong>View tracker anonim:</strong> halaman detail mengirim satu slug judul tanpa identitas setelah kamu
          membaca ±2 detik. Do Not Track (<code>DNT: 1</code>) dihormati penuh — tidak ada yang terkirim.
        </li>
        <li>
          <strong>Log:</strong> log operasional berisi path &amp; waktu, tanpa cookie, tanpa profil pengguna.
        </li>
      </ul>
    ),
  },
  {
    title: "Yang tidak kami lakukan",
    body: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Tidak ada akun, tidak ada login, tidak ada email yang diminta.</li>
        <li>Tidak ada cookie iklan, pelacak pihak ketiga, atau analytics eksternal.</li>
        <li>Tidak ada penjualan/pembagian data ke pihak lain.</li>
      </ul>
    ),
  },
  {
    title: "Layanan pihak ketiga",
    body: (
      <p>
        Poster dan tautan download mengarah ke server sumber (di luar kendali kami) dan hosting/CDN yang melayani situs
        ini. Saat mengklik tautan keluar, kebijakan privasi pemilik situs tujuan berlaku.
      </p>
    ),
  },
  {
    title: "Kontrol & penghapusan",
    body: (
      <p>
        Semua data lokal tunduk pada kendali kamu: tombol “Hapus semua data” di{" "}
        <Link href="/settings" className="underline decoration-dotted hover:text-ink">
          /settings
        </Link>{" "}
        membersihkan bookmark, riwayat, pengaturan, dan cache offline. Untuk pertanyaan privasi, hubungi tim lewat
        halaman kontak pada situs utama.
      </p>
    ),
  },
];

const PrivacyPage = (): JSX.Element => (
  <MainLayout>
    <section className="container mx-auto max-w-3xl px-4 pt-8 pb-16 md:pt-12">
      <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink md:text-3xl">
        Kebijakan Privasi
      </h1>
      <p className="mt-2 text-xs text-ink-muted">
        Terakhir diperbarui: Oktober 2026 · Berlaku untuk semua halaman &amp; API Kokunime.
      </p>

      <div className="mt-8 space-y-5">
        {SECTIONS.map((section) => (
          <div
            key={section.title}
            className="rounded-sm border-2 border-border bg-surface-solid p-5 shadow-[2px_2px_0_0_var(--border)]"
          >
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-ink">{section.title}</h2>
            <div className="mt-2 text-xs leading-relaxed text-ink-muted">{section.body}</div>
          </div>
        ))}
      </div>
    </section>
  </MainLayout>
);

export default PrivacyPage;
