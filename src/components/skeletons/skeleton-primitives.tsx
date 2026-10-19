import { JSX, ReactNode } from "react";

interface SectionHeaderSkeletonProps {
  className?: string;
  titleWidth?: string;
  description?: boolean;
  badge?: boolean | ReactNode;
  aside?: ReactNode;
}

// Same shell as SectionHeader: sticker row, display title, description, aside
// controls and the chunky rule. Pages only vary the widths and the controls.
export const SectionHeaderSkeleton = ({
  className = "",
  titleWidth = "w-64",
  description = true,
  badge = false,
  aside,
}: SectionHeaderSkeletonProps): JSX.Element => (
  <header className={`min-w-0 ${className}`}>
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="skeleton h-6 w-24 rounded-sm" />
          {badge === true ? <div className="skeleton h-6 w-20 rounded-sm" /> : badge}
        </div>
        <div className={`skeleton mt-3 h-10 max-w-full rounded-sm md:h-12 ${titleWidth}`} />
        {description && <div className="skeleton mt-3 h-5 w-full max-w-2xl rounded" />}
      </div>
      {aside && <div className="flex flex-wrap items-center gap-2">{aside}</div>}
    </div>
    <div className="mt-4 flex h-2.5 gap-1" aria-hidden="true">
      <div className="skeleton w-16" />
      <div className="skeleton w-10" />
      <div className="skeleton w-6" />
      <div className="skeleton flex-1" />
    </div>
  </header>
);

export const BreadcrumbSkeleton = ({ width = "w-40" }: { width?: string }): JSX.Element => (
  <div className="container px-4 pt-4">
    <div className={`skeleton h-4 max-w-[70vw] rounded-sm ${width}`} />
  </div>
);

// Mirrors the legal/statement pages: header + stacked bordered prose panels.
export const ProseSkeleton = ({ sections = 4 }: { sections?: number }): JSX.Element => (
  <div className="mt-8 space-y-5">
    {Array.from({ length: sections }).map((_, index) => (
      <div
        key={index}
        className="rounded-sm border-2 border-border bg-surface p-4 shadow-[2px_2px_0_0_var(--border)] md:p-5"
      >
        <div className="skeleton h-5 w-56 max-w-full rounded-sm" />
        <div className="mt-3 space-y-2">
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-11/12 rounded" />
          <div className="skeleton h-4 w-4/5 rounded" />
        </div>
      </div>
    ))}
  </div>
);
