export interface DownloadOption {
  title: string;
  link_download: DownloadResolution[];
}

export interface DownloadResolution {
  resolusi: string;
  height?: number;
  codec?: string;
  container?: string;
  size_bytes?: number;
  size_formatted?: string;
  link: DownloadTarget[];
}

export interface DownloadTarget {
  platform: string;
  url: string | undefined;
}
