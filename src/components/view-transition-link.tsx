"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type JSX, type MouseEvent, type ReactNode, useRef } from "react";

interface ViewTransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
  /** Poster element to name for the shared-element transition (details page). */
  posterName?: string;
  /** Opt back into Next's viewport prefetch (rare — hover-intent is the default). */
  eagerPrefetch?: boolean;
}

// Progressive enhancement: internal navigations wrapped in a native view
// transition (crossfade) where supported. Everything unusual — modified
// clicks, non-primary buttons, reduced motion (system or site setting) — falls
// through to the plain <Link> behavior.
//
// Prefetch is hover/focus-intent rather than viewport: card rails can hold
// dozens of links and viewport prefetching all of them wastes bandwidth.
// Save-Data visitors get no speculative fetches at all.
const ViewTransitionLink = ({
  href,
  children,
  className,
  title,
  posterName,
  eagerPrefetch = false,
}: ViewTransitionLinkProps): JSX.Element => {
  const router = useRouter();
  const timer = useRef<number | null>(null);

  // Shared-element handoff: only the hovered/focused card is named, so two
  // rails showing the same title cannot produce duplicate view-transition-name
  // (which aborts the transition).
  const markPoster = (element: HTMLElement): void => {
    if (!posterName) return;
    // Only one named poster at a time: the same title can appear in several
    // rails, and duplicate view-transition-name aborts the transition.
    for (const other of document.querySelectorAll<HTMLElement>("[data-poster]")) {
      if (!element.contains(other)) other.style.removeProperty("view-transition-name");
    }
    element.querySelector<HTMLElement>("[data-poster]")?.style.setProperty("view-transition-name", posterName);
  };
  const clearPoster = (element: HTMLElement): void => {
    element.querySelector<HTMLElement>("[data-poster]")?.style.removeProperty("view-transition-name");
  };

  const startIntent = (): void => {
    if (eagerPrefetch || timer.current !== null) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    timer.current = window.setTimeout(() => {
      timer.current = null;
      router.prefetch(href);
    }, 80);
  };

  const cancelIntent = (): void => {
    if (timer.current === null) return;
    window.clearTimeout(timer.current);
    timer.current = null;
  };

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
    <Link
      href={href}
      {...(className !== undefined ? { className } : {})}
      {...(title !== undefined ? { title } : {})}
      {...(eagerPrefetch ? {} : { prefetch: false })}
      onPointerEnter={startIntent}
      onPointerDown={(event) => markPoster(event.currentTarget)}
      onPointerLeave={cancelIntent}
      onFocus={(event) => {
        startIntent();
        markPoster(event.currentTarget);
      }}
      onBlur={(event) => {
        cancelIntent();
        clearPoster(event.currentTarget);
      }}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default ViewTransitionLink;
