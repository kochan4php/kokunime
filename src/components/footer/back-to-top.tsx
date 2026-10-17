"use client";

import { ArrowUpRightIcon } from "@/components/icons";
import { JSX } from "react";

const BackToTop = (): JSX.Element => (
  <button
    type="button"
    onClick={() => window.scrollTo({ top: 0 })}
    aria-label="Kembali ke atas"
    className="glass inline-flex h-10 items-center gap-1.5 rounded-sm px-4 text-sm font-semibold text-ink shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--border)] active:translate-y-0 active:shadow-none"
  >
    Ke atas
    <ArrowUpRightIcon className="h-4 w-4 -rotate-45" />
  </button>
);

export default BackToTop;
