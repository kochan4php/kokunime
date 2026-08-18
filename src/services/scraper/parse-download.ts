import { DownloadResolution, DownloadOption, DownloadTarget } from "@/interfaces";
import { CheerioAPI } from "cheerio";
import { cleanText } from "./sanitize";

const normalizeUrl = (raw?: string): string | undefined => {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return undefined;
};

const parseBytes = (raw: string): { bytes?: number; formatted?: string } => {
  const match = raw.match(/(\d+(?:\.\d+)?)\s*(gb|mb|kb|tb)\b/i);
  if (!match) return {};
  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  let multiplier = 1024 * 1024;
  if (unit === "KB") multiplier = 1024;
  if (unit === "MB") multiplier = 1024 * 1024;
  if (unit === "GB") multiplier = 1024 * 1024 * 1024;
  if (unit === "TB") multiplier = 1024 * 1024 * 1024 * 1024;
  const bytes = Math.round(num * multiplier);
  return { bytes, formatted: `${num} ${unit}` };
};

export function getDownloadLinks(
  $: CheerioAPI,
  wrapperClass: string,
  urlClass: string,
  titleClass: string,
): DownloadOption[] {
  const download: DownloadOption[] = [];
  const element = $(".venser");

  $(element)
    .find(wrapperClass)
    .each((_, el) => {
      const temp_res: DownloadResolution[] = [];

      $(el)
        .find(urlClass)
        .each((_, groupEl) => {
          const temp_dl: DownloadTarget[] = [];

          $(groupEl)
            .find("a")
            .each((_, aEl) => {
              const url = normalizeUrl($(aEl).attr("href"));
              const platform = cleanText($(aEl).text());
              if (url && platform) {
                temp_dl.push({ platform, url });
              }
            });

          const resolusi = cleanText($(groupEl).find("strong").text());
          const heightMatch = resolusi.match(/\b(360|480|720|1080|1440|2160)p?\b/i);
          const height = heightMatch ? parseInt(heightMatch[1], 10) : undefined;
          const codec = /hevc|x265|h\.?265/i.test(resolusi)
            ? "hevc"
            : /x264|h\.?264|avc/i.test(resolusi)
              ? "h264"
              : /av1/i.test(resolusi)
                ? "av1"
                : undefined;
          const container = /mkv/i.test(resolusi) ? "mkv" : /mp4/i.test(resolusi) ? "mp4" : undefined;
          const sizeInfo = parseBytes(resolusi);

          if (temp_dl.length > 0 || resolusi) {
            temp_res.push({
              resolusi,
              height,
              codec,
              container,
              size_bytes: sizeInfo.bytes,
              size_formatted: sizeInfo.formatted,
              link: temp_dl,
            });
          }
        });

      const title = cleanText($(el).find(titleClass).text());
      const obj: DownloadOption = { title, link_download: temp_res };

      if (temp_res.length === 0) {
        const redirectLinks: DownloadTarget[] = [];
        $(el)
          .find(titleClass)
          .find("a[href]")
          .each((_, a) => {
            const url = normalizeUrl($(a).attr("href"));
            const platform = cleanText($(a).text()) || "Buka link";
            if (url) {
              redirectLinks.push({ platform, url });
            }
          });
        if (redirectLinks.length > 0) {
          obj.link_download = [{ resolusi: "", link: redirectLinks }];
        }
      }

      download.push(obj);
    });

  return download;
}
