import { describe, expect, it } from "vitest";
import { load } from "cheerio";
import { formatAnimeData } from "@/services/scraper/parse-list";
import { formatScoreIndonesian, formatNumberIndonesian } from "@/utils/format-score";

describe("parser benchmark & formatting utilities", () => {
  it("formats scores and numbers to Indonesian locale standards", () => {
    expect(formatScoreIndonesian("8.45")).toBe("8,45");
    expect(formatScoreIndonesian("9.00")).toBe("9,00");
    expect(formatScoreIndonesian(null)).toBe("N/A");
    expect(formatNumberIndonesian(1500)).toBe("1.500");
    expect(formatNumberIndonesian(2500000)).toBe("2.500.000");
  });

  it("benchmarks Cheerio HTML list parser latency under high volume", () => {
    const cardsHtml = Array.from({ length: 50 }, (_, i) => `
      <li class="kover">
        <div class="thumb">
          <a href="https://kusonime.com/anime-${i}/">
            <div class="thumbz"><img src="https://example.com/cover-${i}.jpg" title="Anime Title ${i}" /></div>
          </a>
        </div>
        <div class="content">
          <h2 class="judul"><a href="https://kusonime.com/anime-${i}/">Anime Title ${i}</a></h2>
          <p>Genre: Action</p>
          <p>Released on Oct ${i + 1}, 2024</p>
          <p><a href="/genres/action">Action</a>, <a href="/genres/adventure">Adventure</a></p>
        </div>
      </li>
    `).join("\n");

    const fullHtml = `<html><body><div class="venutama"><div class="venz"><ul>${cardsHtml}</ul></div></div></body></html>`;

    const startTime = performance.now();
    const $ = load(fullHtml);
    const results = formatAnimeData($);
    const durationMs = performance.now() - startTime;

    expect(results).toHaveLength(50);
    expect(durationMs).toBeLessThan(100);
  });
});
