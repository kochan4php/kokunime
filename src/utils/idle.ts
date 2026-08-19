export function runWhenIdle(callback: () => void, timeout = 2000): void {
  if (typeof window === "undefined") return;

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, 200);
  }
}
