import { describe, expect, it } from "vitest";
import { load } from "cheerio";
import { formatAnimeData } from "@/services/scraper/parse-list";

const html = `
<html><body><div class="venutama">
  <div class="venz"><ul>
    <li class="kover">
      <div class="thumb"><a href="https://kusonime.com/anime-foo/"><div class="thumbz"><img src="https://example.com/foo.jpg" /></div></a></div>
      <div class="content">
        <h2><a href="https://kusonime.com/anime-foo/">Anime Foo</a></h2>
        <p>Admin Admin · 24 Apr 2025 · Genre: Action, Adventure</p>
      </div>
    </li>
  </ul></div>
</div></body></html>`;

describe("formatAnimeData", () => {
  it("parses anime items from HTML", () => {
    const anime = formatAnimeData(load(html));
    expect(anime).toHaveLength(1);
    expect(anime[0].title).toBe("Anime Foo");
    expect(anime[0].link.endpoint).toBe("anime-foo/");
    expect(anime[0].genres).toEqual(["Action", "Adventure"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(formatAnimeData(load("<html></html>"))).toEqual([]);
  });
});
