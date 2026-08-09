import { Anime, AnimeDetail, AnimePage, Genre, Recommendation, Season } from "@/interfaces";
import * as scraper from "@/services/scraper";

const safe = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fn();
  } catch {
    return fallback;
  }
};

export const loadAnimePage = (page: number): Promise<AnimePage> =>
  safe(() => scraper.getAnimePerPage(page), { anime: [], pagination: null });

export const loadAnimeDetail = (slug: string): Promise<AnimeDetail> =>
  safe(() => scraper.getAnimeDetail(slug), { genre: [], download: [] });

export const loadGenres = (): Promise<Genre[]> => safe(() => scraper.getGenres(), []);

export const loadSeasons = (): Promise<Season[]> => safe(() => scraper.getSeasons(), []);

export const loadAnimeByGenres = (genre: string, page: number): Promise<AnimePage> =>
  safe(() => scraper.getAnimeByGenres(genre, page), { anime: [], pagination: null });

export const loadAnimeBySeasons = (season: string, page: number): Promise<AnimePage> =>
  safe(() => scraper.getAnimeBySeasons(season, page), { anime: [], pagination: null });

export const loadSearchAnime = (query: string): Promise<Anime[]> => safe(() => scraper.searchAnime(query), []);

export const loadRecommendations = (): Promise<Recommendation[]> => safe(() => scraper.getRecommendations(), []);
