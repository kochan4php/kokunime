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
    <div className="card-core flex h-full flex-col items-center justify-center gap-2 p-5 text-center">
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150" />
      )}
      <span className="line-clamp-2 text-sm font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
        {title}
      </span>
      {meta && <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">{meta}</span>}
    </div>
  </Link>
);

export default TaxonomyCard;
