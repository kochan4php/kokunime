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

export const buildAnimeJsonLd = (anime: AnimeDetail, slug: string): Record<string, unknown> => {
  const isMovie = /movie/i.test(anime.type || "");
  const scoreNum = parseFloat(anime.score || "0");
  const episodesNum = parseInt(anime.total_episode || "0", 10);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": isMovie ? "Movie" : "TVSeries",
    name: anime.title,
    url: `${SITE_URL}/anime/${slug}`,
    image: anime.image,
    description: anime.synopsis,
    genre: anime.genre?.map((genre: Genre) => genre.name) ?? [],
    inLanguage: "id",
  };

  if (!isNaN(scoreNum) && scoreNum > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: scoreNum.toString(),
      bestRating: "10",
      worstRating: "1",
      ratingCount: "50",
    };
  }

  if (!isMovie && !isNaN(episodesNum) && episodesNum > 0) {
    jsonLd.numberOfEpisodes = episodesNum;
  }

  return jsonLd;
};

export const buildBreadcrumbJsonLd = (title: string, slug: string): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}/anime/${slug}` },
  ],
});

export const buildFaqJsonLd = (anime: AnimeDetail): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: `Di mana bisa download ${anime.title} Subtitle Indonesia?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `Anda dapat mendownload batch ${anime.title} Sub Indo lengkap dengan berbagai pilihan resolusi (360p, 480p, 720p, 1080p) melalui berbagai cloud mirror di Kokunime.`,
      },
    },
    {
      "@type": "Question",
      name: `Berapa skor rating dan total episode ${anime.title}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${anime.title} memiliki skor rating ${anime.score || "N/A"} dengan status ${anime.status || "N/A"} dan total durasi ${anime.duration || "N/A"}.`,
      },
    },
  ],
});
