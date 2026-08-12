import CopyButton from "./copy-button";
import { DownloadIcon } from "@/components/icons";
import { JSX } from "react";

const DownloadPlatform = ({ name, url }: { name: string; url?: string }): JSX.Element => (
  <div className="flex min-w-0 items-stretch gap-2">
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-sm font-semibold text-ink transition-all duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent"
    >
      <span className="truncate">{name}</span>
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-muted text-ink-muted transition-all duration-300 group-hover:bg-accent group-hover:text-(--accent-ink)">
        <DownloadIcon className="h-3 w-3" />
      </span>
    </a>
    <CopyButton url={url} />
  </div>
);

export default DownloadPlatform;
