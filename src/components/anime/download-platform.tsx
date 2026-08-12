import { DownloadIcon } from "@/components/icons";
import { JSX } from "react";

const DownloadPlatform = ({ name, url }: { name: string; url?: string }): JSX.Element => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition-all duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent"
  >
    <span>{name}</span>
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface-muted text-ink-muted transition-all duration-300 group-hover:bg-accent group-hover:text-(--accent-ink)">
      <DownloadIcon className="h-3 w-3" />
    </span>
  </a>
);

export default DownloadPlatform;
