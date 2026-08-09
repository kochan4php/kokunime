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
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  first_page_endpoint: string;
  next_page_endpoint: string;
  current_page: number;
  pages_of: string;
  total_page: number;
  prev_page_endpoint: string;
  last_page_endpoint: string;
}
