import Link from "next/link";
import { JSX, ReactNode } from "react";

type SectionTone = "yellow" | "pink" | "teal" | "lime" | "purple" | "orange";

interface SectionHeaderProps {
  kicker: string;
  title: string;
  titleId?: string;
  titleAs?: "h1" | "h2";
  tone?: SectionTone;
  badge?: ReactNode;
  aside?: ReactNode;
  action?: { href: string; label: string };
  description?: ReactNode;
  className?: string;
}

const TONE_CLASS: Record<SectionTone, string> = {
  yellow: "bg-nb-yellow",
  pink: "bg-nb-pink",
  teal: "bg-nb-teal",
  lime: "bg-nb-lime",
  purple: "bg-nb-purple",
  orange: "bg-nb-orange",
};

// Shared print-shop header: rotated sticker, black display title, optional
// description and a chunky colour rule. Pages pass titleAs="h1"; sections keep
// the default h2 so one component covers every heading level.
const SectionHeader = ({
  kicker,
  title,
  titleId,
  titleAs = "h2",
  tone = "yellow",
  badge,
  aside,
  action,
  description,
  className = "",
}: SectionHeaderProps): JSX.Element => {
  const TitleTag = titleAs;

  return (
    <header className={`min-w-0 ${className}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`nb-sticker -rotate-1 ${TONE_CLASS[tone]}`}>{kicker}</span>
            {badge}
          </div>
          <TitleTag
            id={titleId}
            className="mt-3 font-display text-3xl font-black uppercase leading-[1.04] tracking-tight text-ink md:text-4xl"
          >
            {title}
          </TitleTag>
          {description && <div className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{description}</div>}
        </div>
        {(aside || action) && (
          <div className="flex flex-wrap items-center gap-3">
            {aside}
            {action && (
              <Link href={action.href} className="btn-secondary px-4 py-2 text-xs">
                {action.label}
              </Link>
            )}
          </div>
        )}
      </div>
      <div className="nb-rule mt-4" aria-hidden="true">
        <span className="w-16 bg-nb-yellow" />
        <span className="w-10 bg-nb-pink" />
        <span className="w-6 bg-nb-teal" />
        <span className="flex-1 bg-surface-muted" />
      </div>
    </header>
  );
};

export default SectionHeader;
