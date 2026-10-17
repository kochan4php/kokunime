// Flipped by src/instrumentation.ts on SIGTERM/SIGINT. /api/ready then reports
// 503 so orchestrators/load balancers drain this instance before it exits.
let shuttingDown = false;

export const beginShutdown = (): void => {
  shuttingDown = true;
};

export const isShuttingDown = (): boolean => shuttingDown;

// Tests only — production never flips the flag back.
export const resetLifecycle = (): void => {
  shuttingDown = false;
};
