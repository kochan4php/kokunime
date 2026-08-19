import { describe, expect, it, vi } from "vitest";
import { GET as getHealth } from "@/app/api/health/route";
import { GET as getGenres } from "@/app/api/genres/route";
import { GET as getSeasons } from "@/app/api/seasons/route";
import { POST as postBulk } from "@/app/api/anime/bulk/route";
import upstream from "@/config/upstream";
import { NextRequest } from "next/server";

describe("API Response Schema Validation Suite", () => {
  it("validates /api/health response schema", async () => {
    vi.spyOn(upstream, "get").mockResolvedValueOnce({
      status: 200,
      data: "<html><body>OK</body></html>",
    } as any);

    const res = await getHealth();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("status", "ok");
    expect(json).toHaveProperty("scraper", "operational");
    expect(json).toHaveProperty("latency_ms");
    expect(typeof json.latency_ms).toBe("number");
  });

  it("validates /api/genres response schema", async () => {
    vi.spyOn(upstream, "get").mockResolvedValueOnce({
      status: 200,
      url: "https://kusonime.com/genres/",
      data: `
        <div class="venser"><div class="venutama"><ul class="genres">
          <li><a href="https://kusonime.com/genres/action/">Action</a></li>
        </ul></div></div>
      `,
    } as any);

    const req = new NextRequest("http://localhost:3000/api/genres");
    const res = await getGenres(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("genres");
    expect(Array.isArray(json.genres)).toBe(true);
  });

  it("validates /api/seasons response schema", async () => {
    vi.spyOn(upstream, "get").mockResolvedValueOnce({
      status: 200,
      url: "https://kusonime.com/seasons-list/",
      data: `
        <div class="venser"><div class="venutama"><ul class="genres">
          <li><a href="https://kusonime.com/seasons/winter-2026/">Winter 2026</a></li>
        </ul></div></div>
      `,
    } as any);

    const req = new NextRequest("http://localhost:3000/api/seasons");
    const res = await getSeasons(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("seasons");
    expect(Array.isArray(json.seasons)).toBe(true);
  });

  it("validates /api/anime/bulk payload rejection for malicious crawlers", async () => {
    const req = new NextRequest("http://localhost:3000/api/anime/bulk", {
      method: "POST",
      headers: {
        "user-agent": "Scrapy/2.11.0 (+https://scrapy.org)",
        "content-type": "application/json",
      },
      body: JSON.stringify({ slugs: ["naruto"] }),
    });

    const res = await postBulk(req);
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json).toHaveProperty("error");
  });
});
