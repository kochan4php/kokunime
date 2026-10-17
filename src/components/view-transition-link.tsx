"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type JSX, type MouseEvent, type ReactNode, useRef } from "react";

interface ViewTransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
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
  eagerPrefetch = false,
}: ViewTransitionLinkProps): JSX.Element => {
  const router = useRouter();
  const timer = useRef<number | null>(null);

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
      onPointerLeave={cancelIntent}
      onFocus={startIntent}
      onBlur={cancelIntent}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default ViewTransitionLink;
