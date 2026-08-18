import { getGenres } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const genres = await getGenres();
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format")?.toLowerCase();

    if (format === "csv") {
      const csvRows = ["name,endpoint", ...genres.map((g) => `"${g.name.replace(/"/g, '""')}","${g.endpoint}"`)];
      return new Response(csvRows.join("\n"), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'inline; filename="kokunime-genres.csv"',
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        },
      });
    }

    if (format === "xml") {
      const xmlItems = genres
        .map((g) => `  <genre><name>${g.name}</name><endpoint>${g.endpoint}</endpoint></genre>`)
        .join("\n");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<genres total="${genres.length}">\n${xmlItems}\n</genres>`;
      return new Response(xml, {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        },
      });
    }

    return NextResponse.json(
      {
        total: genres.length,
        genres,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 });
  }
}
