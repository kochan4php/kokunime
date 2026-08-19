import CopyButton from "./copy-button";
import { DownloadIcon } from "@/components/icons";
import { JSX } from "react";

const getPlatformStyle = (name: string): string => {
  if (/google|gdrive|^gd$/i.test(name)) {
    return "border-blue-500/30 bg-blue-500/5 font-bold text-blue-400 hover:border-blue-500 hover:bg-blue-500/15";
  }
  if (/mega/i.test(name)) {
    return "border-rose-500/30 bg-rose-500/5 font-bold text-rose-400 hover:border-rose-500 hover:bg-rose-500/15";
  }
  if (/mediafire/i.test(name)) {
    return "border-sky-500/30 bg-sky-500/5 font-bold text-sky-400 hover:border-sky-500 hover:bg-sky-500/15";
  }
  if (/acefile|racaty|droplover/i.test(name)) {
    return "border-amber-500/30 bg-amber-500/5 font-bold text-amber-400 hover:border-amber-500 hover:bg-amber-500/15";
  }
  return "border-border bg-surface font-semibold text-ink hover:border-accent hover:bg-accent/10 hover:text-accent";
};

const requiresLogin = (name: string): boolean => {
  return /acefile|krakenfiles|hxfile/i.test(name);
};

const DownloadPlatform = ({ name, url }: { name: string; url?: string }): JSX.Element => {
  const styleClass = getPlatformStyle(name);
  const needLogin = requiresLogin(name);

  return (
    <div className="flex min-w-0 items-stretch gap-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={needLogin ? `${name} (Mungkin membutuhkan login akun)` : name}
        className={`group flex min-w-0 flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-full border px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-300 ${styleClass}`}
      >
        <span className="truncate">{name}</span>
        {needLogin && (
          <span
            title="Penyedia ini mungkin memerlukan login akun"
            className="rounded-full bg-amber-500/20 px-1.5 py-0.2 font-mono text-[9px] font-bold text-amber-500 uppercase"
          >
            🔑 Login
          </span>
        )}
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-muted text-ink-muted transition-all duration-300 group-hover:bg-accent group-hover:text-(--accent-ink)">
          <DownloadIcon className="h-3 w-3" />
        </span>
      </a>
      <CopyButton url={url} />
    </div>
  );
};

export default DownloadPlatform;
