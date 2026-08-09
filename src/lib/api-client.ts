import { AnimeType, GetAnimePerPageType, RecommendationType } from "@/interfaces";
import { headers } from "next/headers";

async function baseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${await baseUrl()}/api${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Kokunime API ${res.status}`);
  return (await res.json()) as T;
}

export const getAnimePerPage = (page: number): Promise<GetAnimePerPageType> => get(`/anime?page=${page}`);

export const getAnimeDetail = (slug: string): Promise<any> => get(`/anime/${encodeURIComponent(slug)}`);

export const getRecommendations = (): Promise<RecommendationType[]> => get(`/recommendations`);

export const searchAnime = (query: string): Promise<AnimeType[]> => get(`/search?q=${encodeURIComponent(query)}`);
