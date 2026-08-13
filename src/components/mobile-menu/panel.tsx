"use client";

import SearchForm from "../search-form";
import { siteLinks } from "@/components/site-config";
import Link from "next/link";
import { JSX } from "react";

interface MobileMenuPanelProps {
  onClose: () => void;
  isActive: (href: string) => boolean;
}

// Slide-down panel: mobile search + nav links. Rendered by MobileMenu inside
// the header so tap-outside detection (header.contains) keeps working.
const MobileMenuPanel = ({ onClose, isActive }: MobileMenuPanelProps): JSX.Element => (
  <div className="container px-4 pb-6 pt-2 md:px-6">
    <div className="mb-4 md:hidden">
      <SearchForm
        inputClassName="w-full pl-10 bg-surface border border-accent/50 focus:border-accent"
        onSubmit={onClose}
      />
    </div>
    <nav aria-label="Menu" className="flex flex-col space-y-1">
      {siteLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          aria-current={isActive(link.href) ? "page" : undefined}
          className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
            isActive(link.href)
              ? "bg-accent/5 border-accent/20 shadow-[0_0_8px_var(--glow-accent)] text-ink"
              : "border-transparent text-ink-muted hover:bg-surface hover:text-ink"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  </div>
);

export default MobileMenuPanel;
