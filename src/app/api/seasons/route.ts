import { getSeasons } from "@/services/scraper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const seasons = await getSeasons();
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format")?.toLowerCase();

    if (format === "csv") {
      const csvRows = ["name,endpoint", ...seasons.map((s) => `"${s.name.replace(/"/g, '""')}","${s.endpoint}"`)];
      return new Response(csvRows.join("\n"), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'inline; filename="kokunime-seasons.csv"',
          "Cache-Control": "private, max-age=600",
        },
      });
    }

    if (format === "xml") {
      const xmlItems = seasons
        .map((s) => `  <season><name>${s.name}</name><endpoint>${s.endpoint}</endpoint></season>`)
        .join("\n");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<seasons total="${seasons.length}">\n${xmlItems}\n</seasons>`;
      return new Response(xml, {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "private, max-age=600",
        },
      });
    }

    return NextResponse.json(
      {
        total: seasons.length,
        seasons,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=600",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch seasons" }, { status: 500 });
  }
}
