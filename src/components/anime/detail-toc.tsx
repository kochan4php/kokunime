"use client";

import { useTranslation } from "@/utils/i18n";
import { JSX, useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "Utama" },
  { id: "synopsis", label: "Sinopsis" },
  { id: "download", label: "Download" },
  { id: "recommendations", label: "Rekomendasi" },
];

const DetailToc = (): JSX.Element | null => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string>("hero");
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);

      const scrollPos = window.scrollY + 200;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = SECTIONS[i];
        if (!section) continue;
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(section.id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-6 top-24 z-40 hidden xl:flex flex-col gap-1.5 rounded-sm border-2 border-border bg-surface-solid p-2 shadow-[6px_6px_0_0_var(--border)]">
      <span className="px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">Navigasi</span>
      {SECTIONS.map((sec) => (
        <button
          key={sec.id}
          type="button"
          onClick={() => scrollTo(sec.id)}
          className={`flex items-center justify-between rounded-sm border-2 px-3 py-1.5 font-mono text-xs transition-all cursor-pointer ${
            activeId === sec.id
              ? "bg-accent font-bold text-(--accent-ink) border-border shadow-[2px_2px_0_0_var(--border)]"
              : "border-transparent text-ink-muted hover:bg-surface hover:text-ink"
          }`}
        >
          <span>{sec.label}</span>
        </button>
      ))}
      <div className="mt-1 border-t-2 border-border px-2 pt-2 pb-1">
        <div className="flex items-center justify-between font-mono text-[10px] text-ink-muted">
          <span>{t("watch.progress")}</span>
          <span>{progress}%</span>
        </div>
        <div aria-hidden="true" className="mt-1 h-1.5 overflow-hidden rounded-sm border border-border bg-surface">
          <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default DetailToc;
