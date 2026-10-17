import Link from "next/link";
import { JSX } from "react";

interface Crumb {
  name: string;
  href?: string;
}

// Visible breadcrumb trail — the names must match the BreadcrumbList JSON-LD
// each page ships in its <script type="application/ld+json">.
const Breadcrumbs = ({ items }: { items: Crumb[] }): JSX.Element => (
  <nav aria-label="Breadcrumb" className="container px-4 pt-4">
    <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-ink-muted">
      <li>
        <Link href="/" className="transition-colors hover:text-ink hover:underline">
          Beranda
        </Link>
      </li>
      {items.map((item) => (
        <li key={item.name} className="flex items-center gap-1.5">
          <span aria-hidden="true">/</span>
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-ink hover:underline">
              {item.name}
            </Link>
          ) : (
            <span aria-current="page" className="font-bold text-ink">
              {item.name}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;
