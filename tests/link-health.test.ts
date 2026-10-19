import { AnimeDetail, LinkHealthSnapshot } from "@/interfaces";
import {
  checkLink,
  classifyLinkStatus,
  extractDownloadUrls,
  getAnimeLinkHealth,
  saveAnimeLinkHealth,
} from "@/lib/link-health";
import { describe, expect, it } from "vitest";

const sample: AnimeDetail = {
  genre: [],
  download: [
    {
      title: "Batch",
      is_batch: true,
      link_download: [
        {
          resolusi: "1080p",
          link: [
            { platform: "GDrive", url: "https://drive.google.com/file-a" },
            { platform: "Mega", url: "https://mega.nz/file-b" },
            { platform: "Magnet", url: "magnet:?xt=urn:btih:deadbeef" },
          ],
        },
        {
          resolusi: "720p",
          link: [{ platform: "GDrive mirror", url: "https://drive.google.com/file-a" }],
        },
      ],
    },
  ],
};

describe("link health", () => {
  it("extracts each download URL once, preserving order", () => {
    expect(extractDownloadUrls(sample)).toEqual([
      "https://drive.google.com/file-a",
      "https://mega.nz/file-b",
      "magnet:?xt=urn:btih:deadbeef",
    ]);
  });

  it("ignores missing and whitespace-only URLs", () => {
    expect(
      extractDownloadUrls({
        genre: [],
        download: [
          {
            title: "Episode 01",
            link_download: [
              {
                resolusi: "720p",
                link: [
                  { platform: "Mega", url: "  " },
                  { platform: "GDrive", url: undefined },
                ],
              },
            ],
          },
        ],
      }),
    ).toEqual([]);
  });

  it("classifies HTTP status families without calling them all dead", () => {
    expect(classifyLinkStatus(200)).toBe("ok");
    expect(classifyLinkStatus(206)).toBe("ok");
    expect(classifyLinkStatus(404)).toBe("dead");
    expect(classifyLinkStatus(410)).toBe("dead");
    expect(classifyLinkStatus(401)).toBe("blocked");
    expect(classifyLinkStatus(403)).toBe("blocked");
    expect(classifyLinkStatus(429)).toBe("blocked");
    expect(classifyLinkStatus(500)).toBe("error");
    expect(classifyLinkStatus(302)).toBe("error");
  });

  it("marks magnet and private URLs as unverifiable/blocked without fetching", async () => {
    await expect(checkLink("magnet:?xt=urn:btih:deadbeef")).resolves.toMatchObject({ state: "unverifiable" });
    await expect(checkLink("http://127.0.0.1/admin")).resolves.toMatchObject({ state: "blocked" });
  });

  it("round-trips a snapshot through the local fallback when Redis is absent", async () => {
    const snapshot: LinkHealthSnapshot = {
      checkedAt: "2026-10-20T00:00:00.000Z",
      total: 1,
      checked: 1,
      truncated: false,
      records: {
        "https://mega.nz/file-b": {
          state: "ok",
          status: 200,
          checkedAt: "2026-10-20T00:00:00.000Z",
        },
      },
    };

    await saveAnimeLinkHealth("link-health-memory-test", snapshot);
    await expect(getAnimeLinkHealth("link-health-memory-test")).resolves.toEqual(snapshot);
  });
});
