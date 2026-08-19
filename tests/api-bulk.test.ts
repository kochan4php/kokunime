import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/anime/bulk/route";
import { NextRequest } from "next/server";
import * as scraper from "@/services/scraper";

describe("POST /api/anime/bulk API", () => {
  it("rejects non-array payloads with 400 status", async () => {
    const req = new NextRequest("http://localhost:3000/api/anime/bulk", {
      method: "POST",
      body: JSON.stringify({ invalid: "payload" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it("handles empty arrays gracefully", async () => {
    const req = new NextRequest("http://localhost:3000/api/anime/bulk", {
      method: "POST",
      body: JSON.stringify({ slugs: [] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.total).toBe(0);
    expect(json.results).toEqual([]);
  });

  it("resolves multiple anime slugs concurrently up to max limit", async () => {
    vi.spyOn(scraper, "getAnimeDetail").mockImplementation(async (slug) => {
      if (slug === "naruto-batch") {
        return { title: "Naruto Batch Sub Indo", score: "8.2" } as any;
      }
      return null;
    });

    const req = new NextRequest("http://localhost:3000/api/anime/bulk", {
      method: "POST",
      body: JSON.stringify({ slugs: ["naruto-batch", "non-existent-batch"] }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.total).toBe(2);
    expect(json.results[0].slug).toBe("naruto-batch");
    expect(json.results[0].success).toBe(true);
    expect(json.results[0].data.title).toBe("Naruto Batch Sub Indo");
    expect(json.results[1].slug).toBe("non-existent-batch");
    expect(json.results[1].success).toBe(false);
  });
});
