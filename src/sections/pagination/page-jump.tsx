"use client";

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
    router.push(basePath ? `${basePath}/${page}` : `?page=${page}`);
  };

  return (
    <form onSubmit={submit} className="hidden items-center gap-2 md:flex">
      <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">Lompat</span>
      <input
        type="number"
        min={1}
        max={total}
        placeholder={`${current}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label={`Lompat ke halaman (1-${total})`}
        className="h-9 w-16 rounded-full border border-border bg-surface px-2 text-center font-mono text-xs text-ink outline-none transition-colors focus:border-accent"
      />
    </form>
  );
};

export default PageJump;
