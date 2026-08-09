import { describe, expect, it } from "vitest";
import { endpointSlug } from "@/utils/endpoint-slug";

describe("endpointSlug", () => {
  it("strips the prefix and trailing slash", () => {
    expect(endpointSlug("genres/action/", "genres")).toBe("action");
  });

  it("handles a missing endpoint", () => {
    expect(endpointSlug(undefined, "genres")).toBeNull();
  });

  it("returns null for an empty slug", () => {
    expect(endpointSlug("genres/", "genres")).toBeNull();
  });
});
