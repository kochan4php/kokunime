import Link from "next/link";
import { JSX } from "react";
import { footerTags } from "./config";

const BrandBlock = (): JSX.Element => (
  <div className="max-w-sm">
    <Link
      href="/"
      className="font-display text-2xl font-extrabold tracking-tight text-ink transition-colors duration-200 hover:text-ink-muted"
    >
      <span className="bg-gradient-to-r from-accent via-accent-2 to-accent-amber bg-clip-text text-transparent">
        Koku
      </span>
      nime
    </Link>
    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
      Kumpulan link download anime batch dan episode, semua dengan subtitle Indonesia.
    </p>
    <div className="mt-5 flex flex-wrap gap-2">
      {footerTags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default BrandBlock;
