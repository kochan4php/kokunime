import React from "react";

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface InputProps {
  width?: string;
  type: string;
  name: string;
  placeholder: string;
  autoComplete: string;
  value: string;
  onChange: (e: any) => void;
}

export interface CardAnimeProps {
  src: string;
  alt?: string;
  title: string;
  path: string;
}

export interface GetAnimePerPageType {
  anime: AnimeType[];
  pagination: PaginationType;
}

export interface PaginationType {
  first_page_endpoint: string;
  next_page_endpoint: string;
  current_page: number;
  pages_of: string;
  total_page: number;
  prev_page_endpoint: string;
  last_page_endpoint: string;
}

export interface RekomendasiType {
  title?: string;
  endpoint?: string;
  image?: string;
  url?: string;
}

export interface AnimeGenresType {
  name: string;
  url: string;
  endpoint: string;
}

export interface AnimeDownloadOptionType {
  title?: string;
  link_download: AnimeLinkDownloadType[];
}

export interface AnimeLinkDownloadType {
  resolusi?: string;
  link: AnimeLinkPlatformType[];
}

export interface AnimeLinkPlatformType {
  platform: string;
  url: string;
}

export interface ParamType {
  params: { number: string };
}

export interface AnimeType {
  title: string;
  release: string;
  genres: string[];
  link: {
    endpoint?: string;
    url?: string;
    image?: string;
  };
}

export interface DownloadType {
  title: string;
  link_download: DownloadLinkType[];
}

export interface DownloadLinkType {
  resolusi: string;
  link: PlatformType[];
}

export interface PlatformType {
  platform: string;
  url: string | undefined;
}

export interface GenreType {
  name: string;
  url?: string;
  endpoint?: string;
}

export interface SeasonType {
  name: string;
  endpoint?: string;
  url?: string;
}
