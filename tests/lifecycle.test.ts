import { beforeEach, describe, expect, it } from "vitest";
import { beginShutdown, isShuttingDown, resetLifecycle } from "@/lib/lifecycle";

describe("lifecycle shutdown flag", () => {
  beforeEach(() => resetLifecycle());

  it("is ready until shutdown begins, then stays down", () => {
    expect(isShuttingDown()).toBe(false);
    beginShutdown();
    expect(isShuttingDown()).toBe(true);
    beginShutdown();
    expect(isShuttingDown()).toBe(true);
  });
});
