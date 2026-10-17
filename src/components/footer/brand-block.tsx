import Link from "next/link";
import { JSX } from "react";
import { footerTags } from "./config";

const BrandBlock = (): JSX.Element => (
  <div className="flex flex-col justify-between">
    <div>
      <Link
        href="/"
        className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink transition-transform duration-200 hover:-rotate-1 inline-block"
      >
        <span className="inline-block -rotate-2 border-2 border-border bg-nb-yellow px-1.5 text-[#0a0a0a] shadow-[2px_2px_0_0_var(--border)]">
          Koku
        </span>
        nime
      </Link>
      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink-muted">
        Kumpulan link download anime batch dan per episode terlengkap, semua dengan subtitle bahasa Indonesia
        berkualitas tinggi.
      </p>
    </div>
    <div className="mt-4 flex flex-wrap gap-1.5">
      {footerTags.map((tag) => (
        <span
          key={tag}
          className="rounded-sm border-2 border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink shadow-[2px_2px_0_0_var(--border)]"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default BrandBlock;
