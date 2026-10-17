"use client";

import { JSX, useEffect } from "react";

// Native Speculation Rules (Chromium): prerender detail pages on hover and
// prefetch internal links conservatively. Browsers without support ignore the
// unknown script type, so this degrades to exactly today's behavior.
// Production only — dev prerenders would hammer the dev server.
// Injected client-side so Save-Data / prefers-reduced-data visitors (and
// browsers that do not ship the API at all) never install the rules.
const rules = JSON.stringify({
  prerender: [{ where: { href_matches: "/anime/*" }, eagerness: "moderate" }],
  prefetch: [
    {
      where: { href_matches: "/*", not: { href_matches: ["/api/*", "/admin/*", "/_next/*"] } },
      eagerness: "conservative",
    },
  ],
});

const SpeculationRules = (): JSX.Element | null => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!HTMLScriptElement.supports?.("speculationrules")) return;

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData || window.matchMedia("(prefers-reduced-data: reduce)").matches) return;

    const script = document.createElement("script");
    script.type = "speculationrules";
    script.textContent = rules;
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return null;
};

export default SpeculationRules;
