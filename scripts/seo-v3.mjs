// SEO v3 gate (batch AF): feed autodiscovery + ETag/304, honest feed dates,
// JSON-LD v3, oEmbed, and noindex on thin pages. Runs against a live server:
//   BASE_URL=http://localhost:8000 node scripts/seo-v3.mjs
const BASE = (process.env.BASE_URL || "http://localhost:8000").replace(/\/$/, "");
const failures = [];
const check = (name, ok, detail = "") => {
  if (!ok) failures.push(name);
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${String(detail).slice(0, 220)}` : ""}`);
};

const get = async (path, headers = {}) => {
  const res = await fetch(`${BASE}${path}`, { headers, redirect: "follow", signal: AbortSignal.timeout(30_000) });
  const body = await res.text();
  return { status: res.status, headers: res.headers, body };
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const metaContent = (html, key, attr = "property") => {
  const pattern = new RegExp(`<meta[^>]*${attr}="${escapeRegExp(key)}"[^>]*content="([^"]*)"`, "i");
  const alt = new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${escapeRegExp(key)}"`, "i");
  return pattern.exec(html)?.[1] ?? alt.exec(html)?.[1] ?? null;
};

const linkHref = (html, rel, type) => {
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
  const found = links.find((tag) => {
    const relMatch = /rel="([^"]*)"/i.exec(tag)?.[1]?.toLowerCase() ?? "";
    if (!relMatch.split(/\s+/).includes(rel)) return false;
    if (!type) return true;
    return new RegExp(`type="${escapeRegExp(type)}"`, "i").test(tag);
  });
  return found ? (/href="([^"]*)"/i.exec(found)?.[1] ?? null) : null;
};

const jsonLdBlocks = (html) =>
  [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => {
      try {
        return JSON.parse(match[1]);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

const flattenJsonLd = (blocks) =>
  blocks.flatMap((block) => (Array.isArray(block) ? block : block["@graph"] ? block["@graph"] : [block]));

try {
  // ---- Autodiscovery --------------------------------------------------------
  const home = await get("/");
  check("home: 200", home.status === 200, String(home.status));
  check(
    "home: RSS autodiscovery",
    linkHref(home.body, "alternate", "application/rss+xml")?.endsWith("/feed.xml"),
    linkHref(home.body, "alternate", "application/rss+xml"),
  );
  check(
    "home: Atom autodiscovery",
    linkHref(home.body, "alternate", "application/atom+xml")?.endsWith("/feed.atom"),
    linkHref(home.body, "alternate", "application/atom+xml"),
  );
  check(
    "home: JSON Feed autodiscovery",
    linkHref(home.body, "alternate", "application/feed+json")?.endsWith("/feed.json"),
    linkHref(home.body, "alternate", "application/feed+json"),
  );
  check(
    "home: OpenSearch discovery",
    linkHref(home.body, "search", "application/opensearchdescription+xml")?.endsWith("/opensearch.xml"),
    linkHref(home.body, "search", "application/opensearchdescription+xml"),
  );

  // ---- Detail page: JSON-LD v3 + oEmbed + OG image --------------------------
  const slug = /href="\/anime\/([^"#?]+)"/.exec(home.body)?.[1] ?? null;
  check("detail: slug discovered from home", Boolean(slug), slug ?? "none");
  let detailCanonical = null;
  if (slug) {
    const detail = await get(`/anime/${slug}`);
    const entity = flattenJsonLd(jsonLdBlocks(detail.body)).find((node) =>
      ["TVSeries", "Movie"].includes(node["@type"]),
    );
    check("detail: 200", detail.status === 200, String(detail.status));
    check("detail: series JSON-LD present", Boolean(entity), entity?.["@type"] ?? "none");
    check("detail: JSON-LD inLanguage is ja", entity?.inLanguage === "ja", entity?.inLanguage);
    check(
      "detail: JSON-LD publisher carries a logo",
      Boolean(entity?.publisher?.logo?.url),
      entity?.publisher?.logo?.url ?? "none",
    );
    const hasJapanese = /lang="ja"/i.test(detail.body);
    check(
      "detail: JSON-LD alternateName covers the Japanese title",
      !hasJapanese || (Array.isArray(entity?.alternateName) && entity.alternateName.length > 0),
      JSON.stringify(entity?.alternateName ?? null),
    );
    const oembedHref = linkHref(detail.body, "alternate", "application/json+oembed");
    check("detail: oEmbed autodiscovery", Boolean(oembedHref), oembedHref ?? "none");
    const ogImage = metaContent(detail.body, "og:image");
    check("detail: OG image from the file convention", Boolean(ogImage?.includes("opengraph-image")), ogImage);
    check(
      "detail: OG image alt text",
      Boolean(metaContent(detail.body, "og:image:alt")),
      metaContent(detail.body, "og:image:alt"),
    );
    detailCanonical =
      metaContent(detail.body, "og:url") ?? (oembedHref ? new URL(oembedHref).searchParams.get("url") : null);
  }

  // ---- oEmbed ---------------------------------------------------------------
  if (detailCanonical) {
    const endpoint = `/api/oembed?url=${encodeURIComponent(detailCanonical)}&format=json`;
    const oembed = await get(endpoint);
    let payload = null;
    try {
      payload = JSON.parse(oembed.body);
    } catch {
      payload = null;
    }
    check("oEmbed: 200 for a canonical anime URL", oembed.status === 200, String(oembed.status));
    check("oEmbed: type link (no iframe embed)", payload?.type === "link", payload?.type);
    check(
      "oEmbed: provider + title present",
      payload?.provider_name === "Kokunime" && Boolean(payload?.title),
      JSON.stringify({ provider: payload?.provider_name, title: payload?.title }),
    );
    check("oEmbed: thumbnail present", Boolean(payload?.thumbnail_url), payload?.thumbnail_url);
    check(
      "oEmbed: CORS open for consumers",
      oembed.headers.get("access-control-allow-origin") === "*",
      oembed.headers.get("access-control-allow-origin"),
    );
    const invalid = await get(`/api/oembed?url=${encodeURIComponent("https://example.com/anime/x")}`);
    check("oEmbed: foreign URL rejected with 404", invalid.status === 404, String(invalid.status));
  }

  // ---- Feeds: status, ETag, 304, dates --------------------------------------
  const feeds = [
    ["/feed.xml", "rss"],
    ["/feed.atom", "atom"],
    ["/feed.json", "json"],
    ["/update/feed.xml", "rss"],
    ["/update/feed.ics", "ics"],
    ["/genres/action/feed.xml", "rss"],
    ["/years/2024/feed.xml", "rss"],
  ];
  if (slug) {
    const detail = await get(`/anime/${slug}`);
    const studioHref = /href="(\/studio\/[^"#?]+)"/.exec(detail.body)?.[1];
    if (studioHref) {
      feeds.push([`${studioHref}/feed.xml`, "rss"]);
    }
  }

  for (const [path, kind] of feeds) {
    const first = await get(path);
    check(`feed ${path}: 200`, first.status === 200, String(first.status));
    const etag = first.headers.get("etag");
    check(`feed ${path}: ETag`, Boolean(etag), etag ?? "missing");
    if (etag) {
      const second = await get(path, { "If-None-Match": etag });
      check(`feed ${path}: conditional GET is 304`, second.status === 304, String(second.status));
    }
    if (kind === "rss") {
      check(`feed ${path}: lastBuildDate`, /<lastBuildDate>[^<]+<\/lastBuildDate>/.test(first.body));
      check(`feed ${path}: item pubDate`, /<pubDate>[^<]+<\/pubDate>/.test(first.body));
    } else if (kind === "atom") {
      check(`feed ${path}: updated`, /<updated>[^<]+<\/updated>/.test(first.body));
    } else if (kind === "json") {
      let feed = null;
      try {
        feed = JSON.parse(first.body);
      } catch {
        feed = null;
      }
      check(`feed ${path}: JSON Feed 1.1`, feed?.version === "https://jsonfeed.org/version/1.1", feed?.version);
      const items = feed?.items ?? [];
      check(
        `feed ${path}: item date_modified`,
        items.every((item) => typeof item.date_modified === "string" && !Number.isNaN(Date.parse(item.date_modified))),
        `${items.length} items`,
      );
    } else if (kind === "ics") {
      check(`feed ${path}: calendar body`, /BEGIN:VCALENDAR/.test(first.body));
    }
  }

  // ---- Studio OG + feed -----------------------------------------------------
  if (slug) {
    const detail = await get(`/anime/${slug}`);
    const studioHref = /href="(\/studio\/[^"#?]+)"/.exec(detail.body)?.[1];
    if (studioHref) {
      const studio = await get(studioHref);
      check("studio: 200", studio.status === 200, String(studio.status));
      check(
        "studio: RSS autodiscovery",
        linkHref(studio.body, "alternate", "application/rss+xml")?.endsWith("/feed.xml"),
        linkHref(studio.body, "alternate", "application/rss+xml"),
      );
      check(
        "studio: OG image from the file convention",
        Boolean(metaContent(studio.body, "og:image")?.includes("opengraph-image")),
        metaContent(studio.body, "og:image"),
      );
    }
  }

  // ---- Listing OG + JSON-LD -------------------------------------------------
  const genre = await get("/genres/action");
  check("genre: 200", genre.status === 200, String(genre.status));
  check(
    "genre: RSS autodiscovery",
    Boolean(linkHref(genre.body, "alternate", "application/rss+xml")),
    linkHref(genre.body, "alternate", "application/rss+xml"),
  );
  const genreList = flattenJsonLd(jsonLdBlocks(genre.body)).find((node) => node["@type"] === "ItemList");
  check("genre: ItemList inLanguage id", genreList?.inLanguage === "id", genreList?.inLanguage);
  check(
    "genre: ItemList order declared",
    genreList?.itemListOrder === "https://schema.org/ItemListOrderAscending",
    genreList?.itemListOrder,
  );

  const update = await get("/update");
  check(
    "update: RSS autodiscovery",
    Boolean(linkHref(update.body, "alternate", "application/rss+xml")),
    linkHref(update.body, "alternate", "application/rss+xml"),
  );
  check(
    "update: calendar autodiscovery",
    Boolean(linkHref(update.body, "alternate", "text/calendar")),
    linkHref(update.body, "alternate", "text/calendar"),
  );

  // ---- Thin pages stay out of the index ------------------------------------
  const thin = [
    ["/search/one", "search results"],
    ["/share", "share receiver"],
    ["/page/6", "deep home pagination"],
    ["/genres/action?page=6", "deep genre pagination"],
  ];
  for (const [path, label] of thin) {
    const page = await get(path);
    const robots = metaContent(page.body, "robots", "name");
    check(
      `noindex: ${label}`,
      page.status === 404 || /noindex/i.test(robots ?? ""),
      `${page.status} ${robots ?? "missing"}`,
    );
  }
  const missing = await get("/definitely-not-a-real-page-xyz");
  check("noindex: 404 page", missing.status === 404 && /noindex/i.test(missing.body), String(missing.status));

  // ---- Sitemap + robots -----------------------------------------------------
  const robots = await get("/robots.txt");
  check(
    "robots: disallows search",
    /Disallow:\s*\/search/i.test(robots.body),
    robots.body.split("\n").slice(0, 6).join(" | "),
  );
  check("robots: sitemap declared", /Sitemap:.*\/sitemap\.xml/i.test(robots.body));

  const sitemapIndex = await get("/sitemap.xml");
  const chunkLoc = /<loc>([^<]*\.xml)<\/loc>/.exec(sitemapIndex.body)?.[1];
  if (chunkLoc) {
    const chunkPath = new URL(chunkLoc).pathname;
    const chunk = await get(chunkPath);
    check("sitemap: no noindexed search URLs", !/\/search\//.test(chunk.body));
  } else {
    // A tiny catalog can emit a single urlset instead of an index.
    check("sitemap: no noindexed search URLs", !/\/search\//.test(sitemapIndex.body));
  }

  console.log(`\n${failures.length === 0 ? "ALL PASS" : `${failures.length} FAIL`}`);
  process.exitCode = failures.length === 0 ? 0 : 1;
} catch (error) {
  console.error("SEO v3 gate crashed:", error);
  process.exitCode = 1;
}
