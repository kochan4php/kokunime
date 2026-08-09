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
              const obj = { platform: $(elm).text(), url: $(elm).attr("href") };
              temp_dl.push(obj);
            });

          const obj = { resolusi: $(el).find("strong").text(), link: temp_dl };
          temp_res.push(obj);
        });

      const obj = { title: $(element).find(titleClass).text(), link_download: temp_res };
      download.push(obj);
    });

  return download;
}
