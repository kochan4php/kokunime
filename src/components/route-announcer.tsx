"use client";

import { usePathname } from "next/navigation";
import { JSX, useEffect, useRef, useState } from "react";

// Announces client-side navigation to screen readers — without this they only
// notice the URL change (WCAG SPA route announcement). The first render is
// skipped: assistive tech already reads the initial page.
const RouteAnnouncer = (): JSX.Element => {
  const pathname = usePathname();
  const [message, setMessage] = useState("");
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Small delay: route components set document.title during their render.
    const timer = window.setTimeout(() => {
      setMessage(document.title ? `Halaman dimuat: ${document.title}` : `Halaman dimuat: ${pathname}`);
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
