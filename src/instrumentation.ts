import { reportError } from "@/lib/error-reporter";
import type { Instrumentation } from "next";

// Node runtime only: edge runtime has no process signal handling. The lifecycle
// module is imported dynamically so the Edge bundle never statically contains
// Node-only APIs (process.on/process.exit).
export const register = async (): Promise<void> => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { registerNodeLifecycle } = await import("@/lib/lifecycle-node");
    registerNodeLifecycle();
  }
};

// Server error tracking. Alerts go to ERROR_WEBHOOK_URL (Discord webhook)
// when configured; without it this is a silent no-op. See src/lib/error-reporter.ts.
export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  const digest =
    typeof err === "object" && err !== null && "digest" in err
      ? String((err as { digest?: unknown }).digest ?? "")
      : "";

  await reportError({
    source: "server",
    message: err instanceof Error ? err.message : String(err),
    digest: digest || undefined,
    path: request.path,
    method: request.method,
    route: context.routePath,
  });
};
