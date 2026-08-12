"use client";

import { ArrowUpRightIcon } from "@/components/icons";
import { JSX } from "react";

const BackToTop = (): JSX.Element => (
  <button
    type="button"
    onClick={() => window.scrollTo({ top: 0 })}
    aria-label="Kembali ke atas"
    className="glass inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink transition-all duration-300 hover:text-accent active:scale-95"
  >
    Ke atas
    <ArrowUpRightIcon className="h-4 w-4 -rotate-45" />
  </button>
);

export default BackToTop;
