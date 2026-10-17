import { reportError } from "@/lib/error-reporter";
import type { Instrumentation } from "next";

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
