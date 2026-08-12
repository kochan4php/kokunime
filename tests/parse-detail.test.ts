import { describe, expect, it } from "vitest";
import { load } from "cheerio";
import { parseAnimeDetail } from "@/services/scraper/parse-detail";
import { UPSTREAM_URL } from "@/services/scraper/constants";

// Fixture mirrors real upstream detail markup (verified Aug 2026):
// venser > post-thumb (img with srcset + title) + lexot > info (10 <p> fields) + synopsis <p>s + boilerplate
const html = `
<html><body><div class="venser">
  <div class="post-thumb">
    <img src="https://example.com/hero-622.jpg" title="Anime Foo" srcset="https://example.com/hero-622.jpg 622w, https://example.com/hero.jpg 1000w" />
  </div>
  <div class="venutama"><div class="lexot">
    <div class="info">
      <p><b>Japanese</b>: フー</p>
      <p><b>Genre </b>: <a href="${UPSTREAM_URL}genres/action/">Action</a></p>
      <p><b>Seasons </b>: <a href="${UPSTREAM_URL}seasons/fall-2024/">Fall 2024</a></p>
      <p><b>Producers</b>: Studio Foo</p>
      <p><b>Type</b>: TV</p>
      <p><b>Status</b>: Completed</p>
      <p><b>Total Episode</b>: 12</p>
      <p><b>Score</b>: 8.10</p>
      <p><b>Duration</b>: 24 min.</p>
      <p><b>Released on</b>: Oct 03, 2024</p>
    </div>
    <div class="clear"></div>
    <p><strong>Anime Foo</strong> adalah cerita pertama.</p>
    <p>Cerita kedua berlanjut.</p>
    <p>&nbsp;</p>
    <p>Credit : Tim Subtitle</p>
    <p>Download Anime Foo Batch Sub Indo, MKV 720P</p>
  </div></div>
</div></body></html>`;

describe("parseAnimeDetail", () => {
  it("parses all fields from real markup", () => {
    const detail = parseAnimeDetail(load(html));
    expect(detail.title).toBe("Anime Foo");
    expect(detail.japanese).toBe("フー");
    expect(detail.producer).toBe("Studio Foo");
    expect(detail.type).toBe("TV");
    expect(detail.status).toBe("Completed");
    expect(detail.total_episode).toBe("12");
    expect(detail.score).toBe("8.10");
    expect(detail.duration).toBe("24 min.");
    expect(detail.release_on).toBe("Oct 03, 2024");
    expect(detail.genre[0].name).toBe("Action");
    expect(detail.season?.name).toBe("Fall 2024");
  });

  it("joins the full synopsis and drops Credit/Download boilerplate", () => {
    const detail = parseAnimeDetail(load(html));
    expect(detail.synopsis).toContain("cerita pertama");
    expect(detail.synopsis).toContain("Cerita kedua");
    expect(detail.synopsis).not.toContain("Credit");
    expect(detail.synopsis).not.toContain("Download");
  });

  it("picks the largest srcset variant for the image", () => {
    const detail = parseAnimeDetail(load(html));
    expect(detail.image).toBe("https://example.com/hero.jpg");
  });

  it("does not crash when info fields are missing", () => {
    const sparse = `<div class="venser"><div class="post-thumb"><img src="https://example.com/hero.jpg" title="Anime Foo" /></div>
      <div class="venutama"><div class="lexot"><div class="info">
        <p><b>Japanese</b>: フー</p>
        <p><b>Type</b>: TV</p>
        <p><b>Score</b></p>
      </div></div></div></div>`;
    const detail = parseAnimeDetail(load(sparse));
    expect(detail.type).toBe("");
    expect(detail.score).toBe("");
    expect(detail.release_on).toBe("");
    expect(detail.synopsis).toBe("");
  });
});
