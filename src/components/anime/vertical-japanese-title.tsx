import { JSX } from "react";

const HAS_CJK = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/;

interface VerticalJapaneseTitleProps {
  japanese?: string | undefined;
}

export const VerticalJapaneseTitle = ({ japanese }: VerticalJapaneseTitleProps): JSX.Element | null => {
  if (!japanese || !HAS_CJK.test(japanese)) return null;

  return (
    <div
      lang="ja"
      aria-hidden="true"
      className="pointer-events-none absolute right-3 top-4 z-10 max-h-[75%] overflow-hidden select-none rounded-sm border-2 border-nb-cream/40 bg-nb-ink px-1.5 py-2 font-display text-[11px] font-extrabold tracking-widest text-nb-cream [writing-mode:vertical-rl]"
    >
      {japanese}
    </div>
  );
};
