"use client";

import dynamic from "next/dynamic";

// Install banner only matters after `beforeinstallprompt`, and its markup
// should never enter the server HTML / layout bundle.
export const DeferredPwaInstallBanner = dynamic(
  () => import("./pwa-install-banner").then((mod) => mod.PwaInstallBanner),
  { ssr: false },
);
