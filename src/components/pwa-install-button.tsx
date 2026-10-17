"use client";

import { DownloadIcon } from "@/components/icons";
import { JSX, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PwaInstallButton = (): JSX.Element | null => {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (!promptEvent || installed) return null;

  const handleInstall = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
    }
    setPromptEvent(null);
  };

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-sm border-2 border-border bg-nb-yellow px-4 py-3 text-sm font-bold text-[#0a0a0a] shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
    >
      <DownloadIcon className="h-4 w-4" />
      <span>Pasang Aplikasi Kokunime</span>
    </button>
  );
};

export default PwaInstallButton;
