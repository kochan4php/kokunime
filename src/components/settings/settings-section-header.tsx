"use client";

import { JSX } from "react";

interface SettingsSectionHeaderProps {
  icon: string;
  iconClassName: string;
  title: string;
  desc: string;
  /** Resets only the settings shown in this card. */
  onReset?: (() => void) | undefined;
}

// Shared card header: square icon tile + title + one-line description.
const SettingsSectionHeader = ({
  icon,
  iconClassName,
  title,
  desc,
  onReset,
}: SettingsSectionHeaderProps): JSX.Element => (
  <div className="flex items-start justify-between gap-2 border-b-2 border-border pb-3">
    <div className="flex items-center gap-2.5">
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-sm border-2 border-border text-base text-nb-ink ${iconClassName}`}
      >
        {icon}
      </span>
      <div>
        <h2 className="font-display text-base font-bold text-ink">{title}</h2>
        <p className="text-xs text-ink-muted">{desc}</p>
      </div>
    </div>
    {onReset && (
      <button
        type="button"
        onClick={onReset}
        title="Reset bagian ini"
        aria-label={`Reset ${title}`}
        className="shrink-0 rounded-sm border-2 border-border bg-surface px-2 py-1 font-mono text-[10px] text-ink-muted shadow-[2px_2px_0_0_var(--border)] hover:text-ink hover:bg-nb-yellow transition-colors cursor-pointer"
      >
        ↺ Reset
      </button>
    )}
  </div>
);

export default SettingsSectionHeader;
