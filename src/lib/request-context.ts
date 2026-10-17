import { AsyncLocalStorage } from "node:async_hooks";

// Carries the per-request correlation id from the route handler into the
// scraper/cache/log layers without threading it through every signature.
// Middleware runs in a separate edge isolate, so only handlers wrapped with
// runWithRequestId get a context.
const storage = new AsyncLocalStorage<string>();

export const runWithRequestId = <T>(requestId: string, run: () => T): T => storage.run(requestId, run);

export const currentRequestId = (): string | undefined => storage.getStore();
