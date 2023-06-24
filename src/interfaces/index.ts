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

export interface ResponseGetAllType {
  title: string;
  release: string;
  genres: string[];
  link: {
    endpoint: string;
    url: string;
    image: string;
  };
}

export interface ResponseGetRekomendasiType {
  title: string;
  endpoint: string;
  image: string;
  url: string;
}

export interface AnimeGenresType {
  name: string;
  url: string;
  endpoint: string;
}

export interface AnimeDownloadOptionType {
  title: string;
  link_download: AnimeLinkDownloadType[];
}

export interface AnimeLinkDownloadType {
  resolusi: string;
  link: AnimeLinkPlatformType[];
}

export interface AnimeLinkPlatformType {
  platform: string;
  url: string;
}
