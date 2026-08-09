import { siteLinks } from "@/components/site-config";
import Link from "next/link";
import { JSX } from "react";

const NavLinks = (): JSX.Element => (
  <div>
    <span className="chip">Navigasi</span>
    <ul className="mt-4 space-y-2.5">
      {siteLinks.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="text-sm text-ink-muted transition-colors duration-200 hover:text-accent">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default NavLinks;
