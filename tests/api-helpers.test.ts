import { describe, expect, it } from "vitest";
import { parseFieldsParam, projectRecord } from "@/lib/api-projection";
import { decodeCursor, encodeCursor } from "@/lib/api-pagination";
import { scaleLimit } from "@/lib/rate-limit";

describe("parseFieldsParam", () => {
  it("keeps only whitelisted fields, deduped", () => {
    expect(parseFieldsParam("title,image,title,hack", ["title", "image", "score"])).toEqual(["title", "image"]);
  });

  it("returns null for empty or fully invalid input", () => {
    expect(parseFieldsParam(null, ["title"])).toBeNull();
    expect(parseFieldsParam("nope", ["title"])).toBeNull();
  });
});

describe("projectRecord", () => {
  it("projects to requested fields", () => {
    expect(projectRecord({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 });
  });

  it("passes the record through when fields is null", () => {
    const record = { a: 1 };
    expect(projectRecord(record, null)).toBe(record);
  });
});

describe("cursor helpers", () => {
  it("round-trips page numbers", () => {
    expect(decodeCursor(encodeCursor(7))).toBe(7);
  });

  it("rejects garbage cursors", () => {
    expect(decodeCursor("garbage")).toBeNull();
    expect(decodeCursor(Buffer.from("p:0").toString("base64url"))).toBeNull();
    expect(decodeCursor(null)).toBeNull();
  });
});

describe("scaleLimit", () => {
  it("scales down but never below the floor", () => {
    expect(scaleLimit(60, 1)).toBe(60);
    expect(scaleLimit(60, 0.25)).toBe(15);
    expect(scaleLimit(10, 0.1)).toBe(5);
  });
});
