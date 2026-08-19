import { JSX } from "react";

const AboutBlock = (): JSX.Element => (
  <div>
    <span className="chip">Tentang & Fitur</span>
    <p className="mt-4 text-xs sm:text-sm leading-relaxed text-ink-muted">
      Platform kurasi tautan unduhan anime terlengkap dengan subtitle Indonesia. Mendukung batch episode, resolusi 360p–1080p, mode gelap/terang, dan ekspor link IDM / aria2c.
    </p>
    <div className="mt-4 flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-ink-muted">
      <span className="rounded-md border border-border bg-surface px-2 py-0.5">⚡ Fast Edge CDN</span>
      <span className="rounded-md border border-border bg-surface px-2 py-0.5">📱 PWA Ready</span>
      <span className="rounded-md border border-border bg-surface px-2 py-0.5">🛡️ Zero Ads</span>
    </div>
  </div>
);

export default AboutBlock;
