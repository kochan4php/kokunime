import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearToasts, dismissToast, getToasts, showToast, subscribeToasts } from "@/utils/toast";

describe("toast store", () => {
  beforeEach(() => clearToasts());

  it("shows, notifies, dismisses, and unsubscribes", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToasts(listener);

    const id = showToast("hello", { durationMs: 0 });
    expect(getToasts().map((toast) => toast.id)).toEqual([id]);
    expect(listener).toHaveBeenCalledTimes(1);

    dismissToast(id);
    expect(getToasts()).toHaveLength(0);
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    showToast("ignored", { durationMs: 0 });
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("keeps only the newest three toasts", () => {
    for (const message of ["a", "b", "c", "d"]) {
      showToast(message, { durationMs: 0 });
    }
    expect(getToasts().map((toast) => toast.message)).toEqual(["b", "c", "d"]);
  });

  it("carries the undo action callback", () => {
    const onAction = vi.fn();
    const id = showToast("dihapus", { actionLabel: "Urungkan", onAction, durationMs: 0 });
    const toast = getToasts().find((item) => item.id === id);
    toast?.onAction?.();
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("auto-dismisses after the duration", () => {
    vi.useFakeTimers();
    showToast("bye", { durationMs: 1000 });
    expect(getToasts()).toHaveLength(1);
    vi.advanceTimersByTime(1000);
    expect(getToasts()).toHaveLength(0);
    vi.useRealTimers();
  });
});
