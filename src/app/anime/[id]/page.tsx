import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Download, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AnimePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Anime Details */}
      <div className="container py-8">
        <Button variant="ghost" asChild className="mb-6 p-0 hover:bg-transparent">
          <Link href="/" className="inline-flex items-center hover:text-white">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <div className="space-y-4">
            <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-sm border">
              <Image src="https://placehold.co/600x400" alt="Anime Cover" fill className="object-cover" priority />
            </AspectRatio>
            <div className="flex flex-col gap-2">
              <Button className="w-full gap-2 rounded-sm">
                <Play className="h-4 w-4" /> Watch Now
              </Button>
              <Button variant="outline" className="w-full gap-2 rounded-sm">
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Itai no wa Iya nano de Bougyoryoku ni Kyokufuri Shitai to Omoimasu Season 2 BD
              </h1>
              <p className="mt-2">Released on 5:00 am</p>
            </div>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-sm">
                <TabsTrigger value="info" className="rounded-sm">
                  Information
                </TabsTrigger>
                <TabsTrigger value="episodes" className="rounded-sm">
                  Episodes
                </TabsTrigger>
                <TabsTrigger value="comments" className="rounded-sm">
                  Comments
                </TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold text-lg text-white">Synopsis</h3>
                  <p className="mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia,
                    nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies
                    lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
                  </p>
                </div>
                <Separator className="my-4 " />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-white">Details</h3>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>
                        <span className="">Type:</span> <span className="text-white">TV</span>
                      </li>
                      <li>
                        <span className="">Episodes:</span> <span className="text-white">12</span>
                      </li>
                      <li>
                        <span className="">Status:</span> <span className="text-white">Completed</span>
                      </li>
                      <li>
                        <span className="">Aired:</span> <span className="text-white">Jan 8, 2023 to Mar 26, 2023</span>
                      </li>
                      <li>
                        <span className="">Studios:</span> <span className="text-white">Silver Link</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">Genres</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className=" text-white border rounded-sm">
                        Action
                      </Badge>
                      <Badge variant="secondary" className=" text-white border rounded-sm">
                        Adventure
                      </Badge>
                      <Badge variant="secondary" className=" text-white border rounded-sm">
                        Comedy
                      </Badge>
                      <Badge variant="secondary" className=" text-white border rounded-sm">
                        Fantasy
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="episodes" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((episode) => (
                    <Card key={episode} className="overflow-hidden  border rounded-sm">
                      <AspectRatio ratio={16 / 9}>
                        <Image
                          src="https://placehold.co/600x400"
                          alt={`Episode ${episode}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                          <p className="text-white font-medium">Episode {episode}</p>
                        </div>
                      </AspectRatio>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="comments" className="mt-4">
                <p className="text-center py-8">No comments yet.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
