import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function GenresPage() {
  // Sample genres list
  const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Slice of Life",
    "Sports",
    "Supernatural",
    "Thriller",
    "Mecha",
    "Music",
    "Psychological",
    "Shoujo",
    "Shounen",
    "Isekai",
    "Ecchi",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* Page Content */}
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Anime Genres</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.map((genre) => (
            <Card
              key={genre}
              className="overflow-hidden bg-slate-700 hover:bg-slate-600 transition-colors border border-slate-700 rounded-lg"
            >
              <CardContent className="p-6 flex items-center justify-center">
                <Link
                  href={`/genres/${genre.toLowerCase()}`}
                  className="text-center font-medium text-white hover:text-[#38bdf8]"
                >
                  {genre}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
