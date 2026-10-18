import { UrlStateSchema, readUrlState, writeUrlState } from "@/utils/url-state";
import { describe, expect, it } from "vitest";

const schema: UrlStateSchema = {
  defaults: { f: "", v: "grid", s: "catalog", g: "all" },
  sanitize: (key, value) => {
    if (key === "v") return value === "grid" || value === "list" ? value : null;
    if (key === "s") return ["catalog", "az", "za"].includes(value) ? value : null;
    if (key === "f") return value.slice(0, 80).trim() || null;
    return value.length <= 48 ? value : null;
  },
};

describe("readUrlState", () => {
  it("adopts valid values and falls back to defaults for junk", () => {
    expect(readUrlState("", schema)).toEqual({ f: "", v: "grid", s: "catalog", g: "all" });
    expect(readUrlState("?v=list&s=az&f=%20naruto%20&g=Action", schema)).toEqual({
      f: "naruto",
      v: "list",
      s: "az",
      g: "Action",
    });
    // Unknown enum, empty search: each reverts to its default.
    expect(readUrlState("?v=portal&s=wat&f=%20%20&g=x", schema)).toEqual({
      f: "",
      v: "grid",
      s: "catalog",
      g: "x",
    });
  });

  it("clamps long filter text to 80 chars", () => {
    const long = "a".repeat(200);
    const values = readUrlState(`?f=${long}`, schema);
    expect(values.f).toHaveLength(80);
  });

  it("ignores parameters the schema does not know", () => {
    const values = readUrlState("?utm_source=x&v=list", schema);
    expect(values).toEqual({ f: "", v: "list", s: "catalog", g: "all" });
  });
});

describe("writeUrlState", () => {
  it("drops values equal to their defaults", () => {
    const values = { f: "", v: "grid", s: "catalog", g: "all" };
    expect(writeUrlState("?v=list&f=naruto", values, schema)).toBe("");
  });

  it("keeps non-default values and foreign parameters", () => {
    const query = writeUrlState("?utm_source=x", { f: "naruto", v: "list", s: "catalog", g: "all" }, schema);
    const params = new URLSearchParams(query);
    expect(params.get("f")).toBe("naruto");
    expect(params.get("v")).toBe("list");
    expect(params.has("s")).toBe(false);
    expect(params.has("g")).toBe(false);
    expect(params.get("utm_source")).toBe("x");
  });

  it("round-trips through readUrlState", () => {
    const values = { f: "one piece", v: "list", s: "za", g: "Action" };
    const query = writeUrlState("", values, schema);
    expect(readUrlState(query, schema)).toEqual(values);
  });
});
