import { SITE_URL } from "@/lib/site";

// RFC 9116 security.txt. Expires is always one year ahead so the file can
// never go stale; contact points at the public policy page (this fan project
// has no dedicated security mailbox).
export async function GET(): Promise<Response> {
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const body = [
    `Contact: ${SITE_URL}/privacy`,
    `Expires: ${expires}`,
    "Preferred-Languages: id, en",
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    `Policy: ${SITE_URL}/privacy`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
