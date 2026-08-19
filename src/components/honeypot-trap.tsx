import { JSX } from "react";

export const HoneypotTrap = (): JSX.Element => (
  <a
    href="/api/trap"
    rel="nofollow"
    tabIndex={-1}
    aria-hidden="true"
    className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0 pointer-events-none overflow-hidden select-none"
  >
    Do Not Click Or Crawl (Bot Verification Trap)
  </a>
);
