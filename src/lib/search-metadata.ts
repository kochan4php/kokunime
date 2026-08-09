import { Metadata } from "next";

export async function buildSearchMetadata(params: any): Promise<Metadata> {
  const { query } = await params;
  const term = query.split("+").join(" ");

  return {
    title: `Cari "${term}"`,
    description: `Hasil pencarian di Kokunime untuk "${term}".`,
    robots: { index: false, follow: false },
  };
}
