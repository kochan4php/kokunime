"use client";

import { usePathname } from "next/navigation";
import { JSX, useEffect, useState } from "react";

// Module scope, not a ref: React StrictMode re-mounts effects in dev, which
// would reset a ref and re-run the handoff on the initial page load — moving
// focus (and setting tabindex) while React is still hydrating the heading.
let lastPathname: string | null = null;

// Client-side navigation handoff: focus lands on the new page's heading so
// keyboard and screen-reader users continue from the top (WCAG 2.4.3) instead
// of losing focus in the body. Pages without a heading fall back to the polite
// live region. The first render is skipped: assistive tech already reads the
// initial page.
const RouteAnnouncer = (): JSX.Element => {
  const pathname = usePathname();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const previous = lastPathname;
    lastPathname = pathname;
    if (previous === null || previous === pathname) return;
    // Small delay: route components set document.title during their render.
    const timer = window.setTimeout(() => {
      const heading = document.querySelector<HTMLElement>("main h1, main h2");
      if (heading) {
        if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
        setMessage("");
      } else {
        setMessage(document.title ? `Halaman dimuat: ${document.title}` : `Halaman dimuat: ${pathname}`);
      }
    }, 150);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
};

export default RouteAnnouncer;
