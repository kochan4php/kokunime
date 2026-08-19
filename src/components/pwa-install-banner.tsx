"use client";

import { JSX, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PWA_DISMISSED_KEY = "kokunime_pwa_dismissed";

export const PwaInstallBanner = (): JSX.Element | null => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem(PWA_DISMISSED_KEY);
    if (isDismissed) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  if (!isVisible || !deferredPrompt) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(PWA_DISMISSED_KEY, "true");
  };

  return (
    <aside
      aria-label="Install Aplikasi Kokunime"
      className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md rounded-2xl border border-accent/40 bg-surface-solid/95 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 md:bottom-6 md:right-6 md:left-auto"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-lg font-black text-(--accent-ink)">
          K
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-display text-sm font-bold text-ink">Pasang Kokunime di HP / Desktop</h4>
          <p className="mt-0.5 text-xs text-ink-muted leading-relaxed">
            Akses instan lebih cepat, hemat kuota, dan tetap bisa cari anime saat offline.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstall}
              className="rounded-full bg-accent px-4 py-1.5 font-display text-xs font-bold text-(--accent-ink) transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            >
              ⬇ Pasang Sekarang
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-full border border-border px-3 py-1.5 font-display text-xs text-ink-muted hover:text-ink transition-colors cursor-pointer"
            >
              Nanti Saja
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Tutup pesan"
          className="text-ink-muted hover:text-ink p-1 cursor-pointer"
        >
          ✕
        </button>
      </div>
    </aside>
  );
};
