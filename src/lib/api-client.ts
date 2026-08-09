import { Anime, AnimePage, Recommendation } from "@/interfaces";

const API_BASE = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Kokunime API ${res.status}`);
  return (await res.json()) as T;
}

export const getAnimePerPage = (page: number): Promise<AnimePage> => get(`/anime?page=${page}`);

export const getAnimeDetail = (slug: string): Promise<any> => get(`/anime/${encodeURIComponent(slug)}`);

export const getRecommendations = (): Promise<Recommendation[]> => get(`/recommendations`);

export const searchAnime = (query: string): Promise<Anime[]> => get(`/search?q=${encodeURIComponent(query)}`);
