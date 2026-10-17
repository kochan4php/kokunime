"use client";

import { buildPageHref } from "@/utils/pagination";
import { useRouter } from "next/navigation";
import { FormEvent, JSX, useState } from "react";

// Jump straight to a page in the 500+ page catalog.
const PageJump = ({ current, total, basePath }: { current: number; total: number; basePath?: string }): JSX.Element => {
  const router = useRouter();
  const [value, setValue] = useState("");

  if (total <= 1) return <></>;

  const submit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const page = Number(value);
    if (!page || page < 1 || page > total) return;
    router.push(buildPageHref(page, basePath));
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">Hal.</span>
      <input
        type="number"
        min={1}
        max={total}
        placeholder={`${current}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label={`Lompat ke halaman (1-${total})`}
        className="h-9 w-14 rounded-sm border-2 border-border bg-surface px-2 text-center font-mono text-xs text-ink shadow-[2px_2px_0_0_var(--border)] outline-none transition-all focus:border-accent"
      />
      <button
        type="submit"
        aria-label="Lompat ke halaman"
        className="h-9 rounded-sm border-2 border-border bg-nb-yellow px-2.5 font-mono text-xs font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
      >
        Go
      </button>
    </form>
  );
};

export default PageJump;
