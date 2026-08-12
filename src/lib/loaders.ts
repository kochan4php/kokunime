import { Anime, AnimeDetail, AnimePage, Genre, Recommendation, Season } from "@/interfaces";
import * as scraper from "@/services/scraper";

// Scrapers are total: they catch upstream errors inside `cached()` and return
// their own fallbacks, so no safe() wrapper is needed here anymore.
export const loadAnimePage = (page: number): Promise<AnimePage> => scraper.getAnimePerPage(page);

export const loadAnimeDetail = (slug: string): Promise<AnimeDetail | null> => scraper.getAnimeDetail(slug);

export const loadGenres = (): Promise<Genre[]> => scraper.getGenres();

export const loadSeasons = (): Promise<Season[]> => scraper.getSeasons();

export const loadAnimeByGenres = (genre: string, page: number): Promise<AnimePage> =>
  scraper.getAnimeByGenres(genre, page);

export const loadAnimeBySeasons = (season: string, page: number): Promise<AnimePage> =>
  scraper.getAnimeBySeasons(season, page);

export const loadSearchAnime = (query: string): Promise<Anime[]> => scraper.searchAnime(query);

export const loadRecommendations = (): Promise<Recommendation[]> => scraper.getRecommendations();
