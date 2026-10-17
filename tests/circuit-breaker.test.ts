import { beforeEach, describe, expect, it } from "vitest";
import { canRequest, getCircuitState, recordFailure, recordSuccess, resetCircuits } from "@/lib/circuit-breaker";

const KEY = "test-upstream";

describe("circuit breaker", () => {
  beforeEach(() => resetCircuits());

  it("stays closed under the failure threshold", () => {
    for (let i = 0; i < 4; i++) recordFailure(KEY, 1000);
    expect(getCircuitState(KEY, 1000)).toBe("closed");
    expect(canRequest(KEY, 1000)).toBe(true);
  });

  it("opens after 5 consecutive failures and fast-fails within the cooldown", () => {
    for (let i = 0; i < 5; i++) recordFailure(KEY, 1000);
    expect(getCircuitState(KEY, 1000)).toBe("open");
    expect(canRequest(KEY, 1000)).toBe(false);
  });

  it("allows exactly one probe after the cooldown", () => {
    for (let i = 0; i < 5; i++) recordFailure(KEY, 1000);
    // Cooldown doubled at the threshold crossing: 30s base * 2 = 60s.
    const probeAt = 1000 + 60_000;
    expect(getCircuitState(KEY, probeAt)).toBe("half-open");
    expect(canRequest(KEY, probeAt)).toBe(true);
    expect(canRequest(KEY, probeAt + 10)).toBe(false);
  });

  it("closes again when the probe succeeds", () => {
    for (let i = 0; i < 5; i++) recordFailure(KEY, 1000);
    const probeAt = 1000 + 60_000;
    expect(canRequest(KEY, probeAt)).toBe(true);
    recordSuccess(KEY);
    expect(getCircuitState(KEY, probeAt)).toBe("closed");
    expect(canRequest(KEY, probeAt)).toBe(true);
  });

  it("re-opens with a longer cooldown when the probe fails", () => {
    for (let i = 0; i < 5; i++) recordFailure(KEY, 1000);
    const probeAt = 1000 + 60_000;
    canRequest(KEY, probeAt);
    recordFailure(KEY, probeAt);
    expect(getCircuitState(KEY, probeAt)).toBe("open");
    expect(canRequest(KEY, probeAt + 119_000)).toBe(false);
    expect(canRequest(KEY, probeAt + 120_000)).toBe(true);
  });
});
