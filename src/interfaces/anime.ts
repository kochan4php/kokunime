import { Genre } from "./reference";
import { DownloadOption } from "./download";

export interface Anime {
  title: string;
  release: string;
  genres: string[];
  link: {
    endpoint?: string;
    url?: string;
    image?: string;
  };
}

export interface AnimePage {
  anime: Anime[];
  pagination: PaginationInfo | null;
}

export interface AnimeDetail {
  title?: string;
  japanese?: string;
  image?: string;
  producer?: string;
  type?: string;
  status?: string;
  total_episode?: string;
  score?: string;
  duration?: string;
  release_on?: string;
  synopsis?: string;
  rating?: string;
  synonyms?: string;
  aliases?: string[];
  subtitle?: string;
  audio?: string;
  genre: Genre[];
  season?: { name?: string; url?: string; endpoint?: string };
  trailer?: string;
  download: DownloadOption[];
}

export interface PaginationInfo {
  first_page_endpoint: string;
  next_page_endpoint: string | null;
  current_page: number;
  pages_of: string;
  total_page: number;
  prev_page_endpoint: string | null;
  last_page_endpoint: string;
}
