'use client';

// import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Download, Star, Calendar, Building, Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data - in a real app, this would come from an API
const animeDetails = {
  1: {
    id: 1,
    title: 'Attack on Titan',
    japaneseTitle: '進撃の巨人',
    coverImage: '/placeholder.svg?height=600&width=400',
    bannerImage: '/placeholder.svg?height=300&width=800',
    genres: ['Action', 'Drama', 'Fantasy', 'Military'],
    year: 2013,
    season: 'Spring',
    rating: 9.0,
    episodes: 87,
    status: 'Completed',
    studio: 'Mappa',
    director: 'Tetsuro Araki',
    source: 'Manga',
    duration: '24 min per episode',
    aired: 'Apr 7, 2013 to Nov 5, 2023',
    synopsis:
      'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be out of pleasure. To ensure their survival, the remnants of humanity began living within defensive barriers, resulting in one hundred years without a single titan encounter. However, that fragile calm is soon shattered when a colossal Titan manages to breach the supposedly impregnable outer wall, reigniting the fight for survival against the man-eating abominations.',
    episodes_list: [
      { number: 1, title: 'To You, in 2000 Years', duration: '24:10', aired: 'Apr 7, 2013' },
      { number: 2, title: 'That Day', duration: '24:10', aired: 'Apr 14, 2013' },
      { number: 3, title: 'A Dim Light Amid Despair', duration: '24:10', aired: 'Apr 21, 2013' },
      { number: 4, title: 'The Night of the Closing Ceremony', duration: '24:10', aired: 'Apr 28, 2013' },
      { number: 5, title: 'First Battle', duration: '24:10', aired: 'May 5, 2013' },
    ],
    characters: [
      { name: 'Eren Yeager', role: 'Main Character', image: '/placeholder.svg?height=100&width=100' },
      { name: 'Mikasa Ackerman', role: 'Main Character', image: '/placeholder.svg?height=100&width=100' },
      { name: 'Armin Arlert', role: 'Main Character', image: '/placeholder.svg?height=100&width=100' },
    ],
  },
};

// export default function AnimeDetailPage({ params }: { params: { id: string } }) {
export default function AnimeDetailPage() {
  // const [selectedSeason, setSelectedSeason] = useState('Season 1');
  // const anime = animeDetails[Number.parseInt(params.id) as keyof typeof animeDetails]
  const anime = animeDetails[Number.parseInt(1 as unknown as string) as keyof typeof animeDetails];

  if (!anime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Anime not found</h1>
          <Link href="/">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4">
              <ArrowLeft className="w-5 h-5 text-white" />
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Kokunime</div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <Image src={anime.bannerImage || '/placeholder.svg'} alt={anime.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-14">
          {/* Poster and Quick Actions */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-6 shadow-2xl">
                <Image src={anime.coverImage || '/placeholder.svg'} alt={anime.title} fill className="object-cover" />
              </div>

              <div className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 h-12">
                  <Download className="w-5 h-5 mr-2" />
                  Download All Episodes
                </Button>

                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 h-12">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Trailer
                </Button>
              </div>

              {/* Quick Info */}
              <Card className="mt-6 bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Studio:</span>
                    <span className="text-white">{anime.studio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Director:</span>
                    <span className="text-white">{anime.director}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Source:</span>
                    <span className="text-white">{anime.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Episodes:</span>
                    <span className="text-white">{anime.episodes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{anime.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Aired:</span>
                    <span className="text-white">{anime.aired}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-white mb-2">{anime.title}</h1>
              <p className="text-xl text-purple-300 mb-4">{anime.japaneseTitle}</p>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white font-semibold">{anime.rating}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{anime.year}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <Building className="w-4 h-4" />
                  <span>{anime.studio}</span>
                </div>
                <Badge variant={anime.status === 'Ongoing' ? 'default' : 'secondary'} className="bg-purple-600/80">
                  {anime.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {anime.genres.map((genre) => (
                  <Badge key={genre} variant="outline" className="border-purple-400/30 text-purple-300">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-sm border border-white/10">
                <TabsTrigger value="overview" className="text-white data-[state=active]:bg-purple-600">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="episodes" className="text-white data-[state=active]:bg-purple-600">
                  Episodes
                </TabsTrigger>
                <TabsTrigger value="characters" className="text-white data-[state=active]:bg-purple-600">
                  Characters
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Synopsis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">{anime.synopsis}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="episodes" className="mt-6">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Episodes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {anime.episodes_list.map((episode) => (
                        <div
                          key={episode.number}
                          className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center">
                              <span className="text-purple-300 font-semibold">{episode.number}</span>
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{episode.title}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{episode.duration}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{episode.aired}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="characters" className="mt-6">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Main Characters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {anime.characters.map((character) => (
                        <div key={character.name} className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <Image src={character.image || '/placeholder.svg'} alt={character.name} width={48} height={48} className="object-cover" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{character.name}</h4>
                            <p className="text-sm text-gray-400">{character.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
