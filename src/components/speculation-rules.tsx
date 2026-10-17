import { JSX } from "react";

// Native Speculation Rules (Chromium): prerender detail pages on hover and
// prefetch internal links conservatively. Browsers without support ignore the
// unknown script type, so this degrades to exactly today's behavior.
// Production only — dev prerenders would hammer the dev server.
const rules = JSON.stringify({
  prerender: [{ where: { href_matches: "/anime/*" }, eagerness: "moderate" }],
  prefetch: [
    {
      where: { href_matches: "/*", not: { href_matches: ["/api/*", "/admin/*", "/_next/*"] } },
      eagerness: "conservative",
    },
  ],
});

const SpeculationRules = (): JSX.Element | null =>
  process.env.NODE_ENV === "production" ? (
    <script type="speculationrules" dangerouslySetInnerHTML={{ __html: rules }} />
  ) : null;

export default SpeculationRules;
