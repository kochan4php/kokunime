export interface ToastOptions {
  actionLabel?: string;
  onAction?: () => void;
  // 0 keeps the toast until dismissed manually (used by tests).
  durationMs?: number;
}

export interface ToastItem {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  durationMs: number;
}

const DEFAULT_DURATION_MS = 6000;
const MAX_TOASTS = 3;
// Identical messages inside this window refresh the existing toast instead of
// stacking duplicates (e.g. double-clicking a save button).
const DEDUPE_WINDOW_MS = 2000;

let toasts: ToastItem[] = [];
const listeners = new Set<() => void>();
let nextId = 1;
let paused = false;

interface TimerState {
  handle: ReturnType<typeof setTimeout> | null;
  remaining: number;
  endAt: number;
}

const timers = new Map<number, TimerState>();
const lastShownAt = new Map<string, number>();

const emit = (): void => {
  for (const listener of listeners) listener();
};

export const getToasts = (): ToastItem[] => toasts;

export const subscribeToasts = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const dismissToast = (id: number): void => {
  const next = toasts.filter((toast) => toast.id !== id);
  if (next.length === toasts.length) return;
  const removed = toasts.find((toast) => toast.id === id);
  const state = timers.get(id);
  if (state?.handle) clearTimeout(state.handle);
  timers.delete(id);
  if (removed) lastShownAt.delete(removed.message);
  toasts = next;
  emit();
};

const scheduleDismiss = (id: number, ms: number): void => {
  if (ms <= 0 || typeof setTimeout === "undefined") return;
  if (paused) {
    timers.set(id, { handle: null, remaining: ms, endAt: 0 });
    return;
  }
  const handle = setTimeout(() => {
    timers.delete(id);
    dismissToast(id);
  }, ms);
  timers.set(id, { handle, remaining: ms, endAt: Date.now() + ms });
};

// Pause/resume keeps toasts readable: hovering or focusing the stack stops the
// countdown, leaving it restarts it from the remaining time.
export const setToastsPaused = (value: boolean): void => {
  if (value === paused) return;
  paused = value;
  const now = Date.now();
  for (const [id, state] of timers) {
    if (paused) {
      if (state.handle) {
        clearTimeout(state.handle);
        state.remaining = Math.max(0, state.endAt - now);
        state.handle = null;
      }
    } else if (!state.handle && state.remaining > 0) {
      state.endAt = now + state.remaining;
      state.handle = setTimeout(() => {
        timers.delete(id);
        dismissToast(id);
      }, state.remaining);
    }
  }
};

// Tiny event-bus toast (no dependency, no context provider): call from any
// client component, <Toaster /> in the root layout renders the stack.
export const showToast = (message: string, options: ToastOptions = {}): number => {
  const now = Date.now();
  const duplicate = toasts.find(
    (toast) => toast.message === message && now - (lastShownAt.get(message) ?? 0) < DEDUPE_WINDOW_MS,
  );
  if (duplicate) {
    lastShownAt.set(message, now);
    const state = timers.get(duplicate.id);
    if (state?.handle) clearTimeout(state.handle);
    timers.delete(duplicate.id);
    scheduleDismiss(duplicate.id, duplicate.durationMs);
    return duplicate.id;
  }

  const toast: ToastItem = {
    id: nextId++,
    message,
    actionLabel: options.actionLabel,
    onAction: options.onAction,
    durationMs: options.durationMs ?? DEFAULT_DURATION_MS,
  };
  toasts = [...toasts, toast].slice(-MAX_TOASTS);
  lastShownAt.set(message, now);
  emit();
  scheduleDismiss(toast.id, toast.durationMs);
  return toast.id;
};

// Tests only.
export const clearToasts = (): void => {
  for (const state of timers.values()) {
    if (state.handle) clearTimeout(state.handle);
  }
  timers.clear();
  lastShownAt.clear();
  paused = false;
  toasts = [];
  emit();
};
