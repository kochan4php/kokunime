import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource") || "anime";

  if (resource === "genres") {
    return NextResponse.json({
      mode: "sandbox_mock",
      total: 3,
      genres: [
        { name: "Action", endpoint: "action" },
        { name: "Fantasy", endpoint: "fantasy" },
        { name: "Sci-Fi", endpoint: "sci-fi" },
      ],
    });
  }

  return NextResponse.json({
    mode: "sandbox_mock",
    title: "Solo Leveling Season 2 [Mock]",
    japanese: "俺だけレベルアップな件",
    score: "8.9",
    type: "TV Series",
    status: "Completed",
    total_episode: "12",
    duration: "24 min per ep",
    release_on: "Januari 2025",
    synopsis: "Simulasi respons sandbox untuk pengujian developer pihak ketiga.",
    genre: [
      { name: "Action", endpoint: "action" },
      { name: "Fantasy", endpoint: "fantasy" },
    ],
    downloads: [
      {
        resolution: "1080p",
        links: [
          { platform: "Google Drive", url: "https://example.com/mock-1080p-gdrive" },
          { platform: "Mega", url: "https://example.com/mock-1080p-mega" },
        ],
      },
    ],
  });
}
