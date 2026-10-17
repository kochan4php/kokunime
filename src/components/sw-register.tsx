"use client";

import { useEffect } from "react";

const ServiceWorkerRegister = (): null => {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV === "production") {
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
