export interface DownloadOption {
  title: string;
  is_batch?: boolean;
  link_download: DownloadResolution[];
}

export interface DownloadResolution {
  resolusi: string;
  height?: number;
  codec?: string;
  codec_label?: string;
  container?: string;
  subtitle_type?: "softsub" | "hardsub";
  size_bytes?: number;
  size_formatted?: string;
  link: DownloadTarget[];
}

export interface DownloadTarget {
  platform: string;
  url: string | undefined;
  is_torrent?: boolean;
}

