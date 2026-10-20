import { describe, expect, it } from "vitest";
import { isRequestedUpstreamPath } from "@/services/scraper/request-path";

const BASE = "https://kusonime.com/";

describe("request path guard", () => {
  it("accepts the requested detail path with or without trailing slash", () => {
    expect(isRequestedUpstreamPath("https://kusonime.com/one-piece/", BASE, "one-piece")).toBe(true);
    expect(isRequestedUpstreamPath("https://kusonime.com/one-piece", BASE, "/one-piece")).toBe(true);
  });

  it("rejects the homepage redirect used for unknown slugs", () => {
    expect(isRequestedUpstreamPath("https://kusonime.com/", BASE, "not-a-real-anime")).toBe(false);
  });

  it("rejects a different detail slug or origin", () => {
    expect(isRequestedUpstreamPath("https://kusonime.com/other-anime", BASE, "requested-anime")).toBe(false);
    expect(isRequestedUpstreamPath("https://example.com/requested-anime", BASE, "requested-anime")).toBe(false);
  });

  it("treats equivalent percent-encoded paths as the same page", () => {
    expect(
      isRequestedUpstreamPath("https://kusonime.com/okusama-seitokaichou-s2/", BASE, "okusama-seitokaichou-s2"),
    ).toBe(true);
    expect(isRequestedUpstreamPath("https://kusonime.com/caf%C3%A9", BASE, "café")).toBe(true);
  });

  it("rejects malformed final URLs", () => {
    expect(isRequestedUpstreamPath("not a url", BASE, "one-piece")).toBe(false);
  });
});
