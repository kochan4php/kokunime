import { describe, expect, it } from "vitest";
import { load } from "cheerio";
import { formatAnimeData } from "@/services/scraper/parse-list";
import { UPSTREAM_URL } from "@/services/scraper/constants";

// Fixture mirrors the real upstream list markup (verified Aug 2026):
// kover > thumb (image link with srcset) + content (h2 title, 3 <p>: posted by / released on / genre links)
const html = `
<html><body><div class="venutama">
  <div class="venz"><ul>
    <div class="kover">
      <div class="thumb"><a href="${UPSTREAM_URL}anime-foo/"><div class="thumbz"><img src="https://example.com/foo-150.jpg" srcset="https://example.com/foo-150.jpg 150w, https://example.com/foo-300.jpg 300w, https://example.com/foo.jpg 1000w" /></div></a></div>
      <div class="content">
        <h2 class="episodeye"><a href="${UPSTREAM_URL}anime-foo/">Anime Foo</a></h2>
        <p>Posted by Admin</p>
        <p>Released on 3:54 pm</p>
        <p>Genre <a href="${UPSTREAM_URL}genres/action/">Action</a>, <a href="${UPSTREAM_URL}genres/adventure/">Adventure</a></p>
      </div>
    </div>
  </ul></div>
</div></body></html>`;

describe("formatAnimeData", () => {
  it("parses anime items from HTML", () => {
    const anime = formatAnimeData(load(html));
    expect(anime).toHaveLength(1);
    expect(anime[0].title).toBe("Anime Foo");
    expect(anime[0].link.endpoint).toBe("anime-foo/");
    expect(anime[0].release).toBe("3:54 pm");
    expect(anime[0].genres).toEqual(["Action", "Adventure"]);
  });

  it("picks the largest srcset variant for the card image", () => {
    const anime = formatAnimeData(load(html));
    expect(anime[0].link.image).toBe("https://example.com/foo.jpg");
  });

  it("falls back to src when srcset is absent", () => {
    const sparse = `<div class="venutama"><div class="venz"><ul><div class="kover">
      <div class="thumb"><a href="${UPSTREAM_URL}anime-foo/"><div class="thumbz"><img src="https://example.com/foo.jpg" /></div></a></div>
      <div class="content"><h2><a href="${UPSTREAM_URL}anime-foo/">Anime Foo</a></h2><p>Posted by Admin</p></div>
    </div></ul></div></div>`;
    const anime = formatAnimeData(load(sparse));
    expect(anime[0].link.image).toBe("https://example.com/foo.jpg");
  });

  it("does not crash when a paragraph is missing", () => {
    const sparse = `<div class="venutama"><div class="venz"><ul><div class="kover">
      <div class="thumb"><a href="${UPSTREAM_URL}anime-foo/"><div class="thumbz"><img src="https://example.com/foo.jpg" /></div></a></div>
      <div class="content"><h2><a href="${UPSTREAM_URL}anime-foo/">Anime Foo</a></h2><p>Posted by Admin</p></div>
    </div></ul></div></div>`;
    const anime = formatAnimeData(load(sparse));
    expect(anime).toHaveLength(1);
    expect(anime[0].release).toBe("");
    expect(anime[0].genres).toEqual([]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(formatAnimeData(load("<html></html>"))).toEqual([]);
  });
});
