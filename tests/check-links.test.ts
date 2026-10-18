// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/scraper", () => ({
  getAnimeDetail: vi.fn(),
}));

const scraper = await import("@/services/scraper");
const { GET: checkLinksGet } = await import("@/app/api/check-links/route");

const request = (query: string) => new NextRequest(`http://localhost/api/check-links?${query}`);

describe("GET /api/check-links", () => {
  beforeEach(() => {
    vi.mocked(scraper.getAnimeDetail).mockImplementation(async (slug: string) =>
      slug === "alive" ? ({ title: "Alive" } as never) : (null as never),
    );
  });

  it("rejects requests without slugs", async () => {
    const response = await checkLinksGet(request(""));
    expect(response.status).toBe(400);
  });

  it("rejects unsafe or oversized slug lists", async () => {
    const unsafe = await checkLinksGet(request("slugs=../etc/passwd"));
    expect(unsafe.status).toBe(400);
    const many = await checkLinksGet(request(`slugs=${Array.from({ length: 31 }, (_, i) => `s${i}`).join(",")}`));
    expect(many.status).toBe(400);
  });

  it("reports ok/dead per slug", async () => {
    const response = await checkLinksGet(request("slugs=alive,dead"));
    expect(response.status).toBe(200);
    const body = (await response.json()) as { checked: number; dead: number; results: { slug: string; ok: boolean }[] };
    expect(body.checked).toBe(2);
    expect(body.dead).toBe(1);
    expect(body.results.find((r) => r.slug === "alive")?.ok).toBe(true);
    expect(body.results.find((r) => r.slug === "dead")?.ok).toBe(false);
  });

  it("treats upstream errors as dead links", async () => {
    vi.mocked(scraper.getAnimeDetail).mockRejectedValue(new Error("upstream down"));
    const response = await checkLinksGet(request("slugs=alive"));
    const body = (await response.json()) as { dead: number };
    expect(body.dead).toBe(1);
  });
});
