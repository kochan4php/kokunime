"use client";

import { useEffect } from "react";

const ServiceWorkerRegister = (): null => {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Service workers only exist on secure origins; skip plain-HTTP LAN hosts
    // so the register call never fails loudly.
    if (window.location.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(window.location.hostname)) return;

    if (process.env.NODE_ENV === "production") {
      // On alias/preview domains the build id and cache expectations differ:
      // register only on the configured production origin.
      const configuredSite = process.env.NEXT_PUBLIC_SITE_URL;
      if (configuredSite) {
        try {
          if (new URL(configuredSite).origin !== window.location.origin) return;
        } catch {
          // Malformed env value — treat as unset and continue.
        }
      }

      const buildId = process.env.NEXT_PUBLIC_BUILD_ID ?? "dev";
      navigator.serviceWorker
        .register(`/sw.js?v=${buildId}`)
        .then((reg) => {
          reg.update().catch(() => {});
        })
        .catch(() => {});
    } else {
      // In development, unregister any stale service workers to prevent cached chunk corruption
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
        }
      });
      if ("caches" in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key);
          }
        });
      }
    }
  }, []);

  return null;
};

export default ServiceWorkerRegister;
