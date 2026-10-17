import { escapeXml } from "@/lib/feed-items";
import { getSitemapEntries, SITEMAP_CHUNK_SIZE } from "@/lib/sitemap-entries";

// One sitemap chunk per [id] (path: /sitemaps/N.xml). The index route
// (/sitemap.xml) derives the chunk count from the same entry list.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await params;
  const match = /^(\d+)\.xml$/.exec(id);
  const chunkIndex = match ? Number.parseInt(match[1] ?? "", 10) : Number.NaN;
  if (!Number.isInteger(chunkIndex) || chunkIndex < 0) {
    return new Response("Not Found", { status: 404 });
  }

  const entries = await getSitemapEntries();
  const start = chunkIndex * SITEMAP_CHUNK_SIZE;
  if (start >= entries.length) {
    return new Response("Not Found", { status: 404 });
  }

  const urls = entries
    .slice(start, start + SITEMAP_CHUNK_SIZE)
    .map((entry) => {
      const lastmod = entry.lastModified ? new Date(entry.lastModified).toISOString() : undefined;
      const images = (entry.images ?? []).map(
        (image) => `\n    <image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`,
      );
      return `  <url>
    <loc>${escapeXml(entry.url)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}${
      entry.changeFrequency ? `\n    <changefreq>${entry.changeFrequency}</changefreq>` : ""
    }${typeof entry.priority === "number" ? `\n    <priority>${entry.priority}</priority>` : ""}${images.join("")}
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
