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

      // Redirect posts ("PINDAH KE <a>…", kusonime moved the post): the
      // ONLY actionable link lives in the group TITLE, not in url blocks.
      // Surface it as a single platform target instead of dropping the
      // group (which rendered an empty "Pilih Kualitas" section).
      if (temp_res.length === 0) {
        const redirectLinks: DownloadTarget[] = [];
        $(element)
          .find(titleClass)
          .find("a[href]")
          .each((_, a) => {
            const url = $(a).attr("href");
            if (url && /^https?:\/\//i.test(url)) {
              redirectLinks.push({ platform: $(a).text().trim() || "Buka link", url });
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
