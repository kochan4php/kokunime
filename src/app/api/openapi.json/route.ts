import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const spec = {
    openapi: "3.0.3",
    info: {
      title: "Kokunime Public REST API",
      version: "1.0.0",
      description:
        "Official Kokunime Public REST API for querying anime batches, streaming links, cloud mirrors, genres, and release seasons.",
      contact: {
        name: "Kokunime Team",
        url: "https://kokunime.netlify.app",
      },
    },
    servers: [
      {
        url: "https://kokunime.netlify.app",
        description: "Production Server",
      },
      {
        url: "http://localhost:3000",
        description: "Local Development Server",
      },
    ],
    paths: {
      "/api/health": {
        get: {
          summary: "Server and scraper health status",
          description: "Returns uptime, scraper operational status, memory metrics, and latency.",
          responses: {
            "200": {
              description: "Server is healthy",
            },
          },
        },
      },
      "/api/random": {
        get: {
          summary: "Get random anime",
          description:
            "Returns 307 temporary redirect to a random anime detail page or JSON payload with ?format=json.",
          responses: {
            "307": {
              description: "Redirect to anime detail",
            },
          },
        },
      },
      "/api/search": {
        get: {
          summary: "Real-time anime search",
          parameters: [
            {
              name: "q",
              in: "query",
              required: true,
              schema: { type: "string" },
              description: "Search keyword (minimum 2 characters)",
            },
          ],
          responses: {
            "200": {
              description: "List of matching anime",
            },
          },
        },
      },
      "/api/genres": {
        get: {
          summary: "Get all anime genres",
          responses: {
            "200": {
              description: "Array of genre categories",
            },
          },
        },
      },
      "/api/genres/{genre}": {
        get: {
          summary: "Get anime catalog by genre",
          parameters: [
            {
              name: "genre",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "page",
              in: "query",
              required: false,
              schema: { type: "integer", default: 1 },
            },
          ],
          responses: {
            "200": {
              description: "Paginated anime list for the genre",
            },
          },
        },
      },
      "/api/seasons": {
        get: {
          summary: "Get all release seasons",
          responses: {
            "200": {
              description: "Array of release seasons",
            },
          },
        },
      },
      "/api/seasons/{season}": {
        get: {
          summary: "Get anime catalog by season",
          parameters: [
            {
              name: "season",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "page",
              in: "query",
              required: false,
              schema: { type: "integer", default: 1 },
            },
          ],
          responses: {
            "200": {
              description: "Paginated anime list for the season",
            },
          },
        },
      },
      "/api/anime/{slug}": {
        get: {
          summary: "Get complete anime details",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Detailed anime metadata with downloads, synopsis, score, and trailer",
            },
          },
        },
      },
      "/api/anime/bulk": {
        post: {
          summary: "Resolve multiple anime details in bulk",
          description: "Accepts an array of anime slugs (up to 20) and returns detailed metadata for each in a single request.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    slugs: {
                      type: "array",
                      items: { type: "string" },
                      example: ["naruto-batch", "bleach-batch"],
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Array of anime detail results",
            },
          },
        },
      },
      "/api/anime/{slug}/download": {
        get: {
          summary: "Get direct download links",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
            {
              name: "res",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "Resolution filter (e.g. 720p, 1080p, 480p)",
            },
          ],
          responses: {
            "200": {
              description: "Grouped download mirrors and resolutions",
            },
          },
        },
      },
      "/feed.xml": {
        get: {
          summary: "RSS / Atom Feed",
          parameters: [
            {
              name: "genre",
              in: "query",
              required: false,
              schema: { type: "string" },
            },
            {
              name: "season",
              in: "query",
              required: false,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Valid RSS 2.0 XML feed",
            },
          },
        },
      },
    },
  };

  return NextResponse.json(spec, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
