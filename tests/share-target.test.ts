import { describe, expect, it } from "vitest";
import { extractKusonimeSlug } from "@/utils/share-target";

describe("extractKusonimeSlug", () => {
  it("extracts the slug from kusonime detail URLs", () => {
    expect(extractKusonimeSlug("https://kusonime.com/one-piece-sub-indo/")).toBe("one-piece-sub-indo");
    expect(extractKusonimeSlug("https://kusonime.com/solo-leveling-s2-batch-sub-indo/?utm_source=share")).toBe(
      "solo-leveling-s2-batch-sub-indo",
    );
    expect(extractKusonimeSlug("https://www.kusonime.com/frieren-sub-indo")).toBe("frieren-sub-indo");
  });

  it("rejects non-kusonime hosts, reserved paths and garbage", () => {
    expect(extractKusonimeSlug("https://example.com/one-piece-sub-indo/")).toBeNull();
    expect(extractKusonimeSlug("https://kusonime.com/genres/action/")).toBeNull();
    expect(extractKusonimeSlug("https://kusonime.com/seasons/fall-2024/")).toBeNull();
    expect(extractKusonimeSlug("https://kusonime.com/")).toBeNull();
    expect(extractKusonimeSlug("not a url")).toBeNull();
    expect(extractKusonimeSlug("")).toBeNull();
  });
});
