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

let toasts: ToastItem[] = [];
const listeners = new Set<() => void>();
let nextId = 1;

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
  toasts = next;
  emit();
};

// Tiny event-bus toast (no dependency, no context provider): call from any
// client component, <Toaster /> in the root layout renders the stack.
export const showToast = (message: string, options: ToastOptions = {}): number => {
  const toast: ToastItem = {
    id: nextId++,
    message,
    actionLabel: options.actionLabel,
    onAction: options.onAction,
    durationMs: options.durationMs ?? DEFAULT_DURATION_MS,
  };
  toasts = [...toasts, toast].slice(-MAX_TOASTS);
  emit();
  if (toast.durationMs > 0 && typeof setTimeout !== "undefined") {
    setTimeout(() => dismissToast(toast.id), toast.durationMs);
  }
  return toast.id;
};

// Tests only.
export const clearToasts = (): void => {
  toasts = [];
  emit();
};
