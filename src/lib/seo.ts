import { SITE_NAME, SITE_URL } from "./site";

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

export const buildAnimeJsonLd = (anime: any, slug: string): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "TVSeries",
  name: anime.title,
  url: `${SITE_URL}/anime/${slug}`,
  image: anime.image,
  description: anime.synopsis,
  genre: anime.genre?.map((genre: any) => genre.name) ?? [],
  inLanguage: "id",
});

export const buildBreadcrumbJsonLd = (title: string, slug: string): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
    { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}/anime/${slug}` },
  ],
});
