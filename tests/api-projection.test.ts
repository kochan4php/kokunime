import { describe, expect, it } from "vitest";
import { parseFieldsParam, projectRecord } from "@/lib/api-projection";

describe("api projection", () => {
  it("ignores unknown field names, dedupes and returns null when nothing valid", () => {
    expect(parseFieldsParam("title, title, nope", ["title", "score"])).toEqual(["title"]);
    expect(parseFieldsParam("title,score", ["title", "score"])).toEqual(["title", "score"]);
    expect(parseFieldsParam("nope", ["title"])).toBeNull();
    expect(parseFieldsParam(null, ["title"])).toBeNull();
    expect(parseFieldsParam("", ["title"])).toBeNull();
  });

  it("projects top-level fields and keeps nested payloads intact", () => {
    const record = {
      title: "A",
      score: "8.0",
      genre: [{ name: "Action" }],
      season: { name: "2026" },
      secret: "internal",
    };
    const projected = projectRecord(record, ["title", "genre", "season"]) as Record<string, unknown>;
    expect(projected).toEqual({ title: "A", genre: [{ name: "Action" }], season: { name: "2026" } });
    expect("secret" in projected).toBe(false);
  });

  it("returns the full record when no fields are requested", () => {
    const record = { a: 1, b: 2 };
    expect(projectRecord(record, null)).toBe(record);
  });
});
