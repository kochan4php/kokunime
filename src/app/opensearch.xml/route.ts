import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export function GET(): Response {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>${SITE_NAME}</ShortName>
  <Description>Cari dan download anime batch subtitle Indonesia di ${SITE_NAME}</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="32" height="32" type="image/svg+xml">${SITE_URL}/icon.svg</Image>
  <Url type="text/html" template="${SITE_URL}/search/{searchTerms}"/>
  <Url type="application/json" template="${SITE_URL}/api/search?q={searchTerms}"/>
</OpenSearchDescription>`.trim();

  return new Response(xml, {
    headers: {
      "Content-Type": "application/opensearchdescription+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
