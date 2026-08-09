export interface DownloadOption {
  title: string;
  link_download: DownloadResolution[];
}

export interface DownloadResolution {
  resolusi: string;
  link: DownloadTarget[];
}

export interface DownloadTarget {
  platform: string;
  url: string | undefined;
}
