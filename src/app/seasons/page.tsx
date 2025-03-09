import { Card } from "@/components/ui/card";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function SeasonsPage() {
  // Sample seasons
  const seasons = [
    { name: "Winter 2025", image: "https://placehold.co/600x400" },
    { name: "Fall 2024", image: "https://placehold.co/600x400" },
    { name: "Summer 2024", image: "https://placehold.co/600x400" },
    { name: "Spring 2024", image: "https://placehold.co/600x400" },
    { name: "Winter 2024", image: "https://placehold.co/600x400" },
    { name: "Fall 2023", image: "https://placehold.co/600x400" },
    { name: "Summer 2023", image: "https://placehold.co/600x400" },
    { name: "Spring 2023", image: "https://placehold.co/600x400" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* Page Content */}
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Anime Seasons</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {seasons.map((season) => (
            <Card
              key={season.name}
              className="overflow-hidden bg-slate-700 hover:bg-slate-600 transition-colors border border-slate-600 rounded-md"
            >
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={season.image || "/placeholder.svg"}
                  alt={season.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <h3 className="text-white font-medium text-lg">{season.name}</h3>
                </div>
              </AspectRatio>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
