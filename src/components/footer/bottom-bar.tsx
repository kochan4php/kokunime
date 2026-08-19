import BackToTop from "./back-to-top";
import { JSX } from "react";

const BottomBar = (): JSX.Element => (
  <div className="mt-10 sm:mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-center sm:text-left font-mono text-xs text-ink-muted">
      <span>&copy; {new Date().getFullYear()} Kokunime. Hak cipta dilindungi.</span>
    </div>
    <div className="hidden items-center gap-1.5 font-mono text-[11px] text-ink-muted lg:flex">
      <span>Shortcut:</span>
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
