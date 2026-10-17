"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type JSX, type MouseEvent, type ReactNode } from "react";

interface ViewTransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
}

// Progressive enhancement: internal navigations wrapped in a native view
// transition (crossfade) where supported. Everything unusual — modified
// clicks, non-primary buttons, reduced motion (system or site setting) — falls
// through to the plain <Link> behavior.
const ViewTransitionLink = ({ href, children, className, title }: ViewTransitionLinkProps): JSX.Element => {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      document.documentElement.getAttribute("data-reduce-motion") === "true" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const startViewTransition = (document as Document & { startViewTransition?: (callback: () => void) => void })
      .startViewTransition;
    if (typeof startViewTransition !== "function") return;

    event.preventDefault();
    startViewTransition.call(document, () => {
      router.push(href);
    });
  };

  return (
    <Link href={href} className={className} title={title} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default ViewTransitionLink;
