export interface DownloadOption {
  title: string;
  is_batch?: boolean;
  link_download: DownloadResolution[];
}

export interface DownloadResolution {
  resolusi: string;
  height?: number | undefined;
  codec?: string | undefined;
  codec_label?: string | undefined;
  container?: string | undefined;
  subtitle_type?: "softsub" | "hardsub" | undefined;
  size_bytes?: number | undefined;
  size_formatted?: string | undefined;
  link: DownloadTarget[];
}

export interface DownloadTarget {
  platform: string;
  url: string | undefined;
  is_torrent?: boolean;
}
