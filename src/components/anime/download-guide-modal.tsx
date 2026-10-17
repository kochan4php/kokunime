"use client";

import { JSX, useState } from "react";

export const DownloadGuideModal = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. Pilih Resolusi & Format",
      desc: "Pilih resolusi sesuai layar Anda (1080p untuk TV/Laptop jernih, 720p standar hemat kuota, 480p/360p untuk smartphone/kuota irit).",
      tip: "Format MKV memiliki kualitas subtitle lebih rapi (softsub) dibanding MP4.",
    },
    {
      title: "2. Pilih Cloud Provider (Mirror)",
      desc: "Klik link server mirror yang tersedia (Google Drive, Mega, Mediafire, atau Acefile).",
      tip: "Jika Google Drive terkena limit unduhan (Quota Exceeded), gunakan mirror Mega atau Mediafire sebagai alternatif instan.",
    },
    {
      title: "3. Ekspor ke Download Manager",
      desc: "Gunakan tombol IDM (.ef2), aria2c, atau JDownloader (.dlc) untuk mengunduh semua episode sekaligus dengan kecepatan maksimal tanpa klik satu per satu.",
      tip: "Fitur 'Salin Semua URL' bisa langsung di-paste ke software download manager favorit Anda.",
    },
    {
      title: "4. Ekstrak File & Putar Video",
      desc: "Jika file berekstensi .zip atau .rar, ekstrak menggunakan 7-Zip atau WinRAR. Putar video menggunakan VLC Media Player atau MPV agar subtitle muncul otomatis.",
      tip: "Jika subtitle tidak muncul di pemutar default HP, unduh VLC for Android / iOS gratis.",
    },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-sm border-2 border-border bg-nb-yellow px-3 py-1 font-mono text-[11px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
      >
        <span>💡 Panduan Unduh</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-200">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Panduan Cara Download Anime"
            className="w-full max-w-lg rounded-sm border-2 border-border bg-surface-solid p-5 sm:p-6 shadow-[6px_6px_0_0_var(--border)] max-h-[90vh] overflow-y-auto [scrollbar-width:thin]"
          >
            <div className="flex items-center justify-between border-b-2 border-border pb-4">
              <h3 className="font-display text-lg font-bold text-ink">💡 Panduan Langkah Mengunduh</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup panduan"
                className="rounded-sm p-1 text-ink-muted hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="my-5">
              <div className="flex gap-2 border-b-2 border-border pb-3 mb-4">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`h-2.5 flex-1 rounded-sm border border-border transition-all cursor-pointer ${
                      activeStep === idx ? "bg-accent" : idx < activeStep ? "bg-accent/40" : "bg-surface-muted"
                    }`}
                  />
                ))}
              </div>

              <div className="min-h-[140px]">
                <h4 className="font-display text-base font-bold text-ink mb-2">{steps[activeStep].title}</h4>
                <p className="text-sm text-ink-muted leading-relaxed mb-3">{steps[activeStep].desc}</p>
                <div className="rounded-sm border-2 border-border bg-nb-yellow p-3 font-mono text-xs text-nb-ink">
                  <strong>Tips: </strong> {steps[activeStep].tip}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t-2 border-border pt-4">
              <button
                type="button"
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className="rounded-sm border-2 border-border bg-surface px-4 py-1.5 font-display text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:text-ink disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                ← Sebelumnya
              </button>
              {activeStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  className="rounded-sm border-2 border-border bg-accent px-4 py-1.5 font-display text-xs font-bold text-(--accent-ink) shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                >
                  Lanjut →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-sm border-2 border-border bg-nb-lime px-5 py-1.5 font-display text-xs font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                >
                  ✓ Paham, Tutup
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
