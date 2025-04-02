import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function AnimeListPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Page Content */}
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Anime List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 20 }).map((_, index) => (
            <AnimeCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AnimeCard() {
  return (
    <Card className="overflow-hidden transition-colors border rounded-sm">
      <AspectRatio ratio={16 / 9}>
        <Image
          src="https://placehold.co/600x400"
          alt="Anime Cover"
          fill
          className="object-cover transition-transform hover:scale-105"
        />
      </AspectRatio>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 text-white">Anime Title Goes Here</h3>
        <p className="text-xs mt-1">TV • 2023</p>
      </CardContent>
    </Card>
  );
}
