import { SITE_URL } from "@/lib/site";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/search"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
