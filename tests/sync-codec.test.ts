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

  it("round-trips a v2 payload (history, queue, settings)", async () => {
    const payload = {
      v: 2 as const,
      b: [{ slug: "a", title: "A" }],
      p: [{ slug: "a", watched: [1], updatedAt: 2 }],
      h: [{ slug: "a", title: "A", viewedAt: 3 }],
      q: [{ slug: "a", title: "A", addedAt: 4 }],
      s: { accent: "violet", weeklyGoal: 7 },
    };
    const token = await encodeSyncPayload(payload);
    expect(await decodeSyncPayload(token)).toEqual(payload);
  });

  it("round-trips a v3 payload (collections + folder order)", async () => {
    const payload = {
      v: 3 as const,
      b: [{ slug: "a", title: "A", folder: "Rewatch" }],
      c: ["Rewatch", "Selesai"],
      o: ["Selesai", "Rewatch"],
    };
    const token = await encodeSyncPayload(payload);
    expect(await decodeSyncPayload(token)).toEqual(payload);
  });

  it("still decodes v1 payloads", async () => {
    const token = await encodeSyncPayload({ v: 1, b: [], p: [] });
    const decoded = await decodeSyncPayload(token);
    expect(decoded?.v).toBe(1);
  });
});
