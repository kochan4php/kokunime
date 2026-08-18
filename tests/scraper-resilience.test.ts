import { describe, expect, it } from "vitest";
import { cleanText, sanitizeQuery, parseEpisodeRange } from "@/services/scraper/sanitize";
import { getGenreIndonesian } from "@/utils/genre-dictionary";
import { bestImage, resolveAssetUrl } from "@/services/scraper/parse-image";
import { parseAnimeDetail } from "@/services/scraper/parse-detail";
import { load } from "cheerio";

describe("scraper sanitization and resilience", () => {
  it("cleans HTML entities, stray tags, smart quotes, and zero-width spaces cleanly", () => {
    const raw = "  Naruto\u200B &amp; Sasuke&#8211; <b>Shippuden</b> &#8220;Batch&#8221; &nbsp; ";
    expect(cleanText(raw)).toBe('Naruto & Sasuke- Shippuden "Batch"');
  });

  it("handles multi-attribute lazy-loaded images", () => {
    const mockElement = {
      attr: (name: string) => {
        if (name === "data-lazy-src") return "https://example.com/sharp-poster.jpg";
        if (name === "src") return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        return undefined;
      },
    };

    expect(bestImage(mockElement)).toBe("https://example.com/sharp-poster.jpg");
  });

  it("selects highest resolution from data-srcset", () => {
    const mockElement = {
      attr: (name: string) => {
        if (name === "data-srcset") {
          return "https://example.com/poster-150.jpg 150w, https://example.com/poster-600.jpg 600w, https://example.com/poster-300.jpg 300w";
        }
        return undefined;
      },
    };

    expect(bestImage(mockElement)).toBe("https://example.com/poster-600.jpg");
  });

  it("correctly parses anime detail with shuffled and missing metadata rows", () => {
    const html = `
      <div class="venser">
        <div class="post-thumb">
          <img title="Frieren Beyond Journey's End" src="https://example.com/frieren.jpg" />
        </div>
        <div class="lexot">
          <div class="info">
            <p><b>Skor</b> : 9.15</p>
            <p><b>Status</b> : Completed</p>
            <p><b>Total Episode</b> : 28 Episode</p>
            <p><b>Tipe</b> : TV Series</p>
            <p><b>Judul Jepang</b> : 葬送のフリーレン</p>
            <p><b>Durasi</b> : 24 Menit per episode</p>
            <p><b>Tanggal Rilis</b> : Sep 29, 2023</p>
          </div>
          <p>Sinopsis petualangan Frieren &amp; teman-temannya.</p>
          <p>Credit Kusonime</p>
        </div>
      </div>
    `;

    const $ = load(html);
    const detail = parseAnimeDetail($);

    expect(detail.title).toBe("Frieren Beyond Journey's End");
    expect(detail.score).toBe("9.15");
    expect(detail.status).toBe("Completed");
    expect(detail.total_episode).toBe("28 Episode");
    expect(detail.type).toBe("TV Series");
    expect(detail.japanese).toBe("葬送のフリーレン");
    expect(detail.duration).toBe("24 Menit per episode");
    expect(detail.release_on).toBe("Sep 29, 2023");
    expect(detail.synopsis).toBe("Sinopsis petualangan Frieren & teman-temannya.");
  });

  it("extracts trailer iframe embed URL correctly", () => {
    const html = `
      <div class="venser">
        <div class="post-thumb"><img title="Test Anime" src="https://example.com/test.jpg" /></div>
        <div class="lexot">
          <div class="info"><p><b>Tipe</b>: TV</p></div>
          <iframe src="//www.youtube.com/embed/dQw4w9WgXcQ"></iframe>
        </div>
      </div>
    `;

    const detail = parseAnimeDetail(load(html));
    expect(detail.trailer).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("resolves protocol-relative and relative asset URLs cleanly", () => {
    expect(resolveAssetUrl("//cdn.example.com/cover.webp")).toBe("https://cdn.example.com/cover.webp");
    expect(resolveAssetUrl("https://example.com/cover.png")).toBe("https://example.com/cover.png");
    expect(resolveAssetUrl("/uploads/cover.jpg")).toBe("https://kusonime.com/uploads/cover.jpg");
    expect(resolveAssetUrl("")).toBeUndefined();
    expect(resolveAssetUrl(undefined)).toBeUndefined();
  });

  it("sanitizes search query and truncates overlong input", () => {
    const raw = "  naruto\0shippuden \u200B  " + "a".repeat(100);
    const sanitized = sanitizeQuery(raw, 50);
    expect(sanitized.length).toBeLessThanOrEqual(50);
    expect(sanitized.startsWith("narutoshippuden")).toBe(true);
    expect(sanitized).not.toContain("\0");
  });

  it("translates genre names to Indonesian", () => {
    expect(getGenreIndonesian("Action")).toBe("Aksi");
    expect(getGenreIndonesian("Sci-Fi")).toBe("Fiksi Ilmiah");
    expect(getGenreIndonesian("Slice of Life")).toBe("Sepenggal Kehidupan");
    expect(getGenreIndonesian("UnknownGenre")).toBe("UnknownGenre");
  });

  it("parses episode ranges and completion flags from batch titles", () => {
    expect(parseEpisodeRange("Naruto Shippuden Episode 01 - 12 (End)")).toEqual({
      start: 1,
      end: 12,
      isEnd: true,
      total: 12,
    });
    expect(parseEpisodeRange("Bleach TYBW Episode 13 - 26 END")).toEqual({
      start: 13,
      end: 26,
      isEnd: true,
      total: 14,
    });
    expect(parseEpisodeRange("One Piece Episode 1100")).toEqual({
      start: 1100,
      end: 1100,
      isEnd: false,
      total: 1,
    });
    expect(parseEpisodeRange("Attack on Titan The Final Season")).toEqual({
      isEnd: true,
    });
  });
});
