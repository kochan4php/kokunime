"use client";

import SearchForm from "./search-form";
import ThemeToggle from "./theme-toggle";
import { siteLinks } from "@/components/site-config";
import Link from "next/link";
import { JSX } from "react";

const Navbar = (): JSX.Element => (
  <header className="sticky top-0 z-50 px-4 pt-3">
    <nav className="glass mx-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-full py-2 pl-5 pr-2">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="font-display text-xl font-extrabold tracking-tight text-ink transition-colors duration-200 hover:text-ink-muted"
        >
          <span className="bg-gradient-to-r from-accent via-accent-2 to-accent-amber bg-clip-text text-transparent">
            Koku
          </span>
          nime
        </Link>
        <ul className="hidden items-center gap-5 lg:flex">
          {siteLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-2">
        <SearchForm className="hidden md:block" inputClassName="w-56 pl-10 lg:w-64" />
        <ThemeToggle />
      </div>
    </nav>
    <div className="mx-auto mt-2 max-w-5xl md:hidden">
      <SearchForm inputClassName="w-full pl-10" />
    </div>
  </header>
);

export default Navbar;
