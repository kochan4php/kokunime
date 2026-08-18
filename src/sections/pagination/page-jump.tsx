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
    if (basePath === "/page" && page === 1) {
      router.push("/");
    } else {
      router.push(basePath ? `${basePath}/${page}` : `?page=${page}`);
    }
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
        className="h-8 w-14 rounded-full border border-border bg-surface px-2 text-center font-mono text-xs text-ink outline-none transition-all focus:border-accent hover:border-accent/60"
      />
      <button
        type="submit"
        aria-label="Lompat ke halaman"
        className="h-8 rounded-full border border-border bg-surface px-2.5 font-mono text-xs text-ink-muted transition-all hover:border-accent hover:text-ink active:scale-95"
      >
        Go
      </button>
    </form>
  );
};

export default PageJump;
