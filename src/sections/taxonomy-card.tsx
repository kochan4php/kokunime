import Link from "next/link";
import { JSX } from "react";

interface TaxonomyCardProps {
  href: string;
  title: string;
  meta?: string;
  dot?: boolean;
}

const TaxonomyCard = ({ href, title, meta, dot = false }: TaxonomyCardProps): JSX.Element => (
  <Link href={href} className="card-shell group block">
    <div className="card-core flex h-full flex-col items-center justify-center gap-1.5 sm:gap-2 p-3.5 sm:p-5 text-center min-w-0">
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150" />
      )}
      <span className="line-clamp-2 text-xs sm:text-sm font-semibold text-ink transition-colors duration-200 group-hover:text-accent break-words">
        {title}
      </span>
      {meta && <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">{meta}</span>}
    </div>
  </Link>
);

export default TaxonomyCard;
