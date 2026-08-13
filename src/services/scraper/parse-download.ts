import { DownloadResolution, DownloadOption, DownloadTarget } from "@/interfaces";
import { CheerioAPI } from "cheerio";

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
    .each((_, element) => {
      const temp_res: DownloadResolution[] = [];

      $(element)
        .find(urlClass)
        .each((_, el) => {
          const temp_dl: DownloadTarget[] = [];

          $(el)
            .find("a")
            .each((_, elm) => {
              const url = $(elm).attr("href");
              // Trust boundary: scraped hrefs are rendered verbatim as
              // <a href> — a compromised/weird upstream could inject
              // javascript: URLs (stored XSS on click). Only http(s) pass.
              if (url && /^https?:\/\//i.test(url)) {
                temp_dl.push({ platform: $(elm).text(), url });
              }
            });

          const obj = { resolusi: $(el).find("strong").text(), link: temp_dl };
          temp_res.push(obj);
        });

      const obj = { title: $(element).find(titleClass).text(), link_download: temp_res };
      download.push(obj);
    });

  return download;
}
