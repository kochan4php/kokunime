export interface Recommendation {
  title?: string | undefined;
  endpoint?: string | undefined;
  image?: string | undefined;
  url?: string | undefined;
}

export interface Genre {
  name: string;
  url?: string;
  endpoint?: string;
}

export interface Season {
  name: string;
  endpoint?: string;
  url?: string;
}
