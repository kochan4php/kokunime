import BackToTop from "./back-to-top";
import { AccentThemePicker } from "@/components/accent-theme-picker";
import Link from "next/link";
import { JSX } from "react";

const BottomBar = (): JSX.Element => (
  <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-center sm:text-left">
      <p className="font-mono text-xs text-ink-muted">&copy; {new Date().getFullYear()} Kokunime</p>
      <span className="text-ink-muted/40">•</span>
      <Link href="/api" className="font-mono text-[11px] text-ink-muted hover:text-accent transition-colors">
        API Docs
      </Link>
      <span className="text-ink-muted/40">•</span>
      <a
        href="/feed.xml"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[11px] text-ink-muted hover:text-accent transition-colors"
      >
        RSS
      </a>
      <span className="text-ink-muted/40">•</span>
      <a
        href="/feed.json"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[11px] text-ink-muted hover:text-accent transition-colors"
      >
        JSON Feed
      </a>
      <span className="text-ink-muted/40">•</span>
      <AccentThemePicker />
    </div>
    <div className="hidden items-center gap-1.5 font-mono text-[11px] text-ink-muted md:flex">
      <span>Cari:</span>
      <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-ink">⌘K</kbd>
      <span>/</span>
      <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-ink">/</kbd>
      <span className="ml-2">Download:</span>
      <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-ink">D</kbd>
      <span className="ml-2">Trailer:</span>
      <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-ink">T</kbd>
    </div>
    <BackToTop />
  </div>
);

export default BottomBar;
