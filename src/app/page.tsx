import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <section
        className="relative min-w-full h-[65vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] xl:h-[80vh] 2xl:h-[75vh] bg-cover bg-center bg-no-repeat object-cover"
        style={{ backgroundImage: `url(https://placehold.co/600x400)` }}
      >
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="relative z-20 flex flex-col justify-center h-full backdrop-blur-lg backdrop-brightness-105">
          <div className="container max-w-full px-3 lg:px-0 lg:max-w-3xl">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Itai no wa Iya nano de Bougyoryoku ni Kyokufuri Shitai to Omoimasu Season 2 BD Batch Subtitle Indonesia
              </h2>
              <p className="text-white/80">Released on 5:00 am</p>
              <div>
                <Link href={`/anime/1`} passHref>
                  <Button className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-8 w-full">
                    Detail
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold text-[#38bdf8] mb-6">Update Terbaru</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <AnimeCard key={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function AnimeCard() {
  return (
    <Card className="overflow-hidden bg-slate-700 hover:bg-slate-600 transition-colors border border-slate-700 rounded-lg">
      <AspectRatio ratio={15 / 10}>
        <Image
          src="https://placehold.co/600x400"
          alt="Anime Cover"
          fill
          className="object-cover transition-transform hover:scale-105"
        />
      </AspectRatio>
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 text-white">Anime Title Goes Here</h3>
        <p className="text-xs text-slate-300 mt-1">Episode 12</p>
      </CardContent>
    </Card>
  );
}
