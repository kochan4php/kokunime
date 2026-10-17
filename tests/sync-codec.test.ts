import { describe, expect, it } from "vitest";
import { decodeSyncPayload, encodeSyncPayload } from "@/utils/sync-codec";

describe("sync-codec", () => {
  it("round-trips a payload (gzip when available, plain otherwise)", async () => {
    const payload = {
      v: 1 as const,
      b: [{ slug: "a", title: "A" }],
      p: [{ slug: "a", watched: [1, 2], updatedAt: 1 }],
    };
    const token = await encodeSyncPayload(payload);
    expect(token).toMatch(/^[gj]\./);
    if (typeof CompressionStream !== "undefined") {
      expect(token.startsWith("g.")).toBe(true);
    }
    expect(await decodeSyncPayload(token)).toEqual(payload);
  });

  it("returns null for garbage or wrong-version payloads", async () => {
    expect(await decodeSyncPayload("")).toBeNull();
    expect(await decodeSyncPayload("not-a-token")).toBeNull();
    expect(await decodeSyncPayload("j.bm90LWpzb24")).toBeNull();
    expect(await decodeSyncPayload(`g.${btoa("nonsense")}`)).toBeNull();
  });

  it("decodes legacy #sync= links (base64 of encoded JSON array)", async () => {
    const legacy = btoa(encodeURIComponent(JSON.stringify([{ slug: "x", title: "X" }])));
    const decoded = await decodeSyncPayload(legacy);
    expect(decoded?.b).toEqual([{ slug: "x", title: "X" }]);
  });
});
