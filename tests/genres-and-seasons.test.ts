import { describe, expect, it, vi } from "vitest";
import { getGenres, getAnimeByGenres } from "@/services/scraper/genres";
import { getSeasons, getAnimeBySeasons } from "@/services/scraper/seasons";
import upstream from "@/config/upstream";

describe("genres and seasons scraper", () => {
  it("parses genres taxonomy list correctly", async () => {
    const mockHtml = `
      <div class="venser"><div class="venutama">
        <ul class="genres">
          <li><a href="https://kusonime.com/genres/action/">Action</a></li>
          <li><a href="https://kusonime.com/genres/adventure/">Adventure</a></li>
          <li><a href="https://kusonime.com/genres/genres-list/">Genres List</a></li>
        </ul>
      </div></div>
    `;

    vi.spyOn(upstream, "get").mockResolvedValueOnce({
      data: mockHtml,
      url: "https://kusonime.com/genres/",
      status: 200,
    } as any);

    const genres = await getGenres();
    expect(genres).toHaveLength(2);
    expect(genres[0].name).toBe("Action");
    expect(genres[0].endpoint).toBe("genres/action/");
    expect(genres[1].name).toBe("Adventure");
  });

  it("parses anime by genre correctly", async () => {
    const mockHtml = `
      <div class="venutama">
        <div class="venz">
          <ul>
            <div class="kover">
              <div class="thumb">
                <a href="https://kusonime.com/naruto-batch-sub-indo/">
                  <div class="thumbz"><img src="https://example.com/naruto.jpg" /></div>
                </a>
              </div>
              <div class="content">
                <h2 class="episodeye"><a href="https://kusonime.com/naruto-batch-sub-indo/">Naruto Batch Sub Indo</a></h2>
                <p>Admin</p>
                <p>Released on 1:00 am</p>
                <p><a>Action</a><a>Shounen</a></p>
              </div>
            </div>
          </ul>
        </div>
      </div>
    `;

    vi.spyOn(upstream, "get").mockResolvedValueOnce({
      data: mockHtml,
      url: "https://kusonime.com/genres/action/",
      status: 200,
    } as any);

    const result = await getAnimeByGenres("action", 1);
    expect(result.anime).toHaveLength(1);
    expect(result.anime[0].title).toBe("Naruto Batch Sub Indo");
  });

  it("handles redirected / invalid genre gracefully", async () => {
    vi.spyOn(upstream, "get").mockResolvedValueOnce({
      data: "<html>Homepage</html>",
      url: "https://kusonime.com/",
      status: 200,
    } as any);

    const result = await getAnimeByGenres("invalid-genre-xyz", 1);
    expect(result.anime).toHaveLength(0);
    expect(result.pagination).toBeNull();
  });
});
