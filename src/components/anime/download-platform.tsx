import CopyButton from "./copy-button";
import { DownloadIcon } from "@/components/icons";
import { JSX } from "react";

const getPlatformStyle = (name: string): string => {
  if (/google|gdrive|^gd$/i.test(name)) {
    return "border-border bg-nb-yellow font-bold text-nb-ink";
  }
  if (/mega/i.test(name)) {
    return "border-border bg-nb-red font-bold text-nb-ink";
  }
  if (/mediafire/i.test(name)) {
    return "border-border bg-nb-teal font-bold text-nb-ink";
  }
  if (/acefile|racaty|droplover/i.test(name)) {
    return "border-border bg-nb-orange font-bold text-nb-ink";
  }
  return "border-border bg-surface font-semibold text-ink hover:bg-nb-purple hover:text-nb-ink";
};

const requiresLogin = (name: string): boolean => {
  return /acefile|krakenfiles|hxfile/i.test(name);
};

const DownloadPlatform = ({ name, url }: { name: string; url?: string | undefined }): JSX.Element => {
  const styleClass = getPlatformStyle(name);
  const needLogin = requiresLogin(name);

  return (
    <div className="flex min-w-0 items-stretch gap-1.5 sm:gap-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={needLogin ? `${name} (Mungkin membutuhkan login akun)` : name}
        className={`group flex min-w-0 flex-1 items-center justify-between gap-1.5 sm:gap-2 rounded-sm border-2 px-3 sm:px-4 py-2 text-xs sm:text-sm shadow-[2px_2px_0_0_var(--border)] transition-all duration-150 motion-safe:hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--border)] active:translate-y-0 active:shadow-none ${styleClass}`}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="truncate">{name}</span>
          {needLogin && (
            <span
              title="Penyedia ini mungkin memerlukan login akun"
              className="rounded-sm border border-nb-ink/50 bg-white/60 px-1.5 py-0.2 font-mono text-[9px] font-bold text-nb-ink uppercase shrink-0"
            >
              🔑 Login
            </span>
          )}
        </div>
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-nb-ink/50 bg-white/50 text-nb-ink transition-all duration-150 group-hover:bg-nb-ink group-hover:text-nb-cream">
          <DownloadIcon className="h-3 w-3" />
        </span>
      </a>
      <CopyButton url={url} className="!px-2.5 sm:!px-3 !text-[10px] sm:!text-[11px]" />
    </div>
  );
};

export default DownloadPlatform;
