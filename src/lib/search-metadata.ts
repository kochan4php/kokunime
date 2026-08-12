import { Metadata } from "next";

// Next leaves percent-encoded path segments raw (esp. %2F); decode safely —
// a literal "%" with no valid escape must not 500 the page.
export const decodeQuery = (query: string): string => {
  try {
    return decodeURIComponent(query);
  } catch {
    return query;
  }
};

export async function buildSearchMetadata(params: Promise<{ query: string }>): Promise<Metadata> {
  const { query: rawQuery } = await params;
  const term = decodeQuery(rawQuery).split("+").join(" ");

  return {
    title: `Cari "${term}"`,
    description: `Hasil pencarian di Kokunime untuk "${term}".`,
    robots: { index: false, follow: false },
  };
}
