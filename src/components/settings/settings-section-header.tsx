"use client";

import { JSX } from "react";

interface SettingsSectionHeaderProps {
  icon: string;
  iconClassName: string;
  title: string;
  desc: string;
}

// Shared card header: square icon tile + title + one-line description.
const SettingsSectionHeader = ({ icon, iconClassName, title, desc }: SettingsSectionHeaderProps): JSX.Element => (
  <div className="flex items-center gap-2.5 border-b-2 border-border pb-3">
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
);

export default SettingsSectionHeader;
