"use client";

import { JSX } from "react";

const HAS_CJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/;

interface VerticalJapaneseTitleProps {
  japanese?: string;
}

export const VerticalJapaneseTitle = ({ japanese }: VerticalJapaneseTitleProps): JSX.Element | null => {
  if (!japanese || !HAS_CJK.test(japanese)) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-3 top-4 z-10 max-h-[75%] overflow-hidden select-none rounded-lg bg-black/40 px-1.5 py-2 font-display text-[11px] font-extrabold tracking-widest text-white/90 backdrop-blur-xs shadow-md [writing-mode:vertical-rl]"
    >
      {japanese}
    </div>
  );
};
