import { reportError } from "@/lib/error-reporter";
import { beginShutdown } from "@/lib/lifecycle";

// Container stop grace: flag readiness immediately, then stop this process even
// if nothing else listens for the signal (docker stop gives 10s before SIGKILL).
const SHUTDOWN_GRACE_MS = 5_000;

const logLifecycle = (event: string, detail?: Record<string, unknown>): void => {
  // biome-ignore lint/suspicious/noConsoleLog: structured lifecycle JSON is the intended stdout sink.
  console.log(JSON.stringify({ level: "info", type: "lifecycle", event, ...detail }));
};

// Node runtime only — dynamically imported from instrumentation.ts so the Edge
// bundle never statically contains Node-only APIs (process.on/exit).
export const registerNodeLifecycle = (): void => {
  const shutdown = (signal: string): void => {
    beginShutdown();
    logLifecycle("shutdown", { signal, graceMs: SHUTDOWN_GRACE_MS });
    setTimeout(() => process.exit(0), SHUTDOWN_GRACE_MS).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Crash loops in containers are worse than a reported-and-kept-alive process:
  // an unhandled rejection is logged/alerted, the circuit breaker still guards
  // upstream traffic.
  process.on("unhandledRejection", (reason) => {
    logLifecycle("unhandledRejection", { message: reason instanceof Error ? reason.message : String(reason) });
    void reportError({
      source: "server",
      message: `unhandledRejection: ${reason instanceof Error ? reason.message : String(reason)}`,
      route: "process",
    });
  });

  // An uncaught exception leaves unknown state behind — report, then exit(1)
  // so the orchestrator restarts a clean process.
  process.on("uncaughtException", (error) => {
    logLifecycle("uncaughtException", { message: error.message });
    void reportError({ source: "server", message: `uncaughtException: ${error.message}`, route: "process" });
    setTimeout(() => process.exit(1), 1_000);
  });
};
