import { AnimeDetail, Genre } from "@/interfaces";
import { SITE_NAME, SITE_URL } from "./site";

// JSON.stringify does not escape "</script>", so scraped titles/synopses could
// break out of the <script type="application/ld+json"> tag → stored XSS.
export const safeJsonLd = (data: unknown): string => JSON.stringify(data).replace(/</g, "\\u003c");

export const buildWebSiteJsonLd = (): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search/{search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const buildAnimeJsonLd = (anime: AnimeDetail, slug: string): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "TVSeries",
  name: anime.title,
  url: `${SITE_URL}/anime/${slug}`,
  image: anime.image,
  description: anime.synopsis,
  genre: anime.genre?.map((genre: Genre) => genre.name) ?? [],
  inLanguage: "id",
});

export const buildBreadcrumbJsonLd = (title: string, slug: string): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}/anime/${slug}` },
  ],
});
