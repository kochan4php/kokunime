"use client";

import { recordDiagnostic } from "@/utils/diagnostics";
import { showToast } from "@/utils/toast";
import { useEffect } from "react";

const ServiceWorkerRegister = (): null => {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Service workers only exist on secure origins; skip plain-HTTP LAN hosts
    // so the register call never fails loudly.
    if (window.location.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(window.location.hostname)) return;

    // Back online → ask the worker to replay any queued offline actions.
    const flushQueue = (): void => {
      navigator.serviceWorker.controller?.postMessage({ type: "kokunime:flush-queue" });
    };
    window.addEventListener("online", flushQueue);

    if (process.env.NODE_ENV === "production") {
      // On alias/preview domains the build id and cache expectations differ:
      // register only on the configured production origin. localhost stays
      // allowed — self-hosting and the offline smoke run a real build locally.
      const configuredSite = process.env.NEXT_PUBLIC_SITE_URL;
      if (configuredSite) {
        try {
          const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
          if (!isLocalHost && new URL(configuredSite).origin !== window.location.origin) return;
        } catch {
          // Malformed env value — treat as unset and continue.
        }
      }

      // A fresh worker takes control right after a deploy (skipWaiting). Offer
      // a reload instead of silently mixing old page code with new chunks.
      // Only for updates — the very first install has no previous controller.
      const hadController = Boolean(navigator.serviceWorker.controller);
      let refreshOffered = false;
      const onControllerChange = (): void => {
        if (!hadController || refreshOffered) return;
        refreshOffered = true;
        recordDiagnostic("sw", "Versi baru menguasai halaman");
        showToast("Versi baru Kokunime siap.", {
          actionLabel: "Muat ulang",
          onAction: () => window.location.reload(),
          durationMs: 15_000,
        });
      };
      navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

      const buildId = process.env.NEXT_PUBLIC_BUILD_ID ?? "dev";
      navigator.serviceWorker
        .register(`/sw.js?v=${buildId}`)
        .then((reg) => {
          recordDiagnostic("sw", `Terdaftar build=${buildId}`);
          reg.update().catch(() => {});
        })
        .catch(() => {});

      return () => {
        window.removeEventListener("online", flushQueue);
        navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      };
    }

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

    return () => {
      window.removeEventListener("online", flushQueue);
    };
  }, []);

  return null;
};

export default ServiceWorkerRegister;
