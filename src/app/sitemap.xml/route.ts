import { getSitemapEntries, SITEMAP_CHUNK_SIZE } from "@/lib/sitemap-entries";
import { SITE_URL } from "@/lib/site";

// Sitemap index: lists the chunk files in /sitemaps/[id].xml. The URL count is
// derived from the same deterministic builder the chunks use.
export async function GET(): Promise<Response> {
  const entries = await getSitemapEntries();
  const chunks = Math.max(1, Math.ceil(entries.length / SITEMAP_CHUNK_SIZE));
  const lastmod = new Date().toISOString();

  const body = Array.from(
    { length: chunks },
    (_, index) =>
      `  <sitemap>\n    <loc>${SITE_URL}/sitemaps/${index}.xml</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`,
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
