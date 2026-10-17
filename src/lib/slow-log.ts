// Ring buffer of slow requests for /api/admin/slow. Process-local by design
// (same as metrics): the slow path an operator wants is the one that just
// happened on this instance.
const MAX_ENTRIES = 100;

export const SLOW_REQUEST_MS = Number(process.env.SLOW_REQUEST_MS ?? 1000);

interface SlowRequestEntry {
  at: string;
  event: string;
  durationMs: number;
  requestId?: string | undefined;
  path?: string | undefined;
}

const entries: SlowRequestEntry[] = [];

export const recordSlowRequest = (entry: SlowRequestEntry): void => {
  entries.push(entry);
  if (entries.length > MAX_ENTRIES) entries.splice(0, entries.length - MAX_ENTRIES);
};

export const getSlowRequests = (): SlowRequestEntry[] => [...entries].reverse();
