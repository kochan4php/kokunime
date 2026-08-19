import Link from "next/link";
import { JSX } from "react";
import { footerTags } from "./config";

const BrandBlock = (): JSX.Element => (
  <div className="flex flex-col justify-between">
    <div>
      <Link
        href="/"
        className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink transition-colors duration-200 hover:opacity-80"
      >
        <span className="bg-gradient-to-r from-accent via-accent-2 to-accent-amber bg-clip-text text-transparent">
          Koku
        </span>
        nime
      </Link>
      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-ink-muted">
        Kumpulan link download anime batch dan per episode terlengkap, semua dengan subtitle bahasa Indonesia berkualitas tinggi.
      </p>
    </div>
    <div className="mt-4 flex flex-wrap gap-1.5">
      {footerTags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default BrandBlock;
