'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Download, Star, Calendar, Tag, Menu, X, Film, Clock, Award, Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Loading from './loading';

const animeData = [
  {
    id: 1,
    title: 'Attack on Titan',
    japaneseTitle: '進撃の巨人',
    coverImage: '/placeholder.svg?height=400&width=300',
    heroImage: '/placeholder.svg?height=600&width=1200',
    genres: ['Action', 'Drama', 'Fantasy'],
    year: 2013,
    season: 'Spring',
    rating: 9.0,
    episodes: 87,
    status: 'Completed',
    studio: 'Mappa',
    isLatest: true,
    synopsis: 'Humanity fights for survival against giant humanoid Titans that have brought civilization to the brink of extinction.',
  },
  {
    id: 2,
    title: 'Demon Slayer',
    japaneseTitle: '鬼滅の刃',
    coverImage: '/placeholder.svg?height=400&width=300',
    heroImage: '/placeholder.svg?height=600&width=1200',
    genres: ['Action', 'Supernatural', 'Historical'],
    year: 2019,
    season: 'Spring',
    rating: 8.7,
    episodes: 44,
    status: 'Ongoing',
    studio: 'Ufotable',
    isLatest: false,
    synopsis: 'A young boy becomes a demon slayer to avenge his family and cure his sister who has been turned into a demon.',
  },
  {
    id: 3,
    title: 'Jujutsu Kaisen',
    japaneseTitle: '呪術廻戦',
    coverImage: '/placeholder.svg?height=400&width=300',
    heroImage: '/placeholder.svg?height=600&width=1200',
    genres: ['Action', 'Supernatural', 'School'],
    year: 2020,
    season: 'Fall',
    rating: 8.6,
    episodes: 48,
    status: 'Ongoing',
    studio: 'Mappa',
    isLatest: false,
    synopsis: 'Students at a school for jujutsu sorcerers learn to combat cursed spirits that are born from negative human emotions.',
  },
  {
    id: 4,
    title: 'Your Name',
    japaneseTitle: '君の名は',
    coverImage: '/placeholder.svg?height=400&width=300',
    heroImage: '/placeholder.svg?height=600&width=1200',
    genres: ['Romance', 'Drama', 'Supernatural'],
    year: 2016,
    season: 'Summer',
    rating: 8.4,
    episodes: 1,
    status: 'Movie',
    studio: 'CoMix Wave Films',
    isLatest: false,
    synopsis: 'Two teenagers share a profound, magical connection upon discovering they are swapping bodies.',
  },
  {
    id: 5,
    title: 'Spirited Away',
    japaneseTitle: '千と千尋の神隠し',
    coverImage: '/placeholder.svg?height=400&width=300',
    heroImage: '/placeholder.svg?height=600&width=1200',
    genres: ['Adventure', 'Family', 'Fantasy'],
    year: 2001,
    season: 'Summer',
    rating: 9.3,
    episodes: 1,
    status: 'Movie',
    studio: 'Studio Ghibli',
    isLatest: false,
    synopsis: 'A young girl enters a world ruled by gods and witches where humans are changed into beasts.',
  },
  {
    id: 6,
    title: 'One Piece',
    japaneseTitle: 'ワンピース',
    coverImage: '/placeholder.svg?height=400&width=300',
    heroImage: '/placeholder.svg?height=600&width=1200',
    genres: ['Action', 'Adventure', 'Comedy'],
    year: 1999,
    season: 'Fall',
    rating: 9.1,
    episodes: 1000,
    status: 'Ongoing',
    studio: 'Toei Animation',
    isLatest: false,
    synopsis: 'Monkey D. Luffy explores the Grand Line with his diverse crew of pirates in search of the legendary treasure One Piece.',
  },
];

const navigationItems = [
  {
    title: 'Genres',
    icon: Film,
    description: 'Browse by category',
    href: '/genres',
    items: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Supernatural', 'Historical', 'School', 'Family'],
  },
  {
    title: 'Seasons',
    icon: Clock,
    description: 'Explore by release season',
    href: '/seasons',
    items: ['Spring', 'Summer', 'Fall', 'Winter'],
  },
  {
    title: 'Years',
    icon: Award,
    description: 'Discover by release year',
    href: '/years',
    items: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'],
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const filteredAnime = useMemo(() => {
    return animeData.filter((anime) => {
      const matchesSearch = anime.title.toLowerCase().includes(searchQuery.toLowerCase()) || anime.japaneseTitle.includes(searchQuery);
      return matchesSearch;
    });
  }, [searchQuery]);

  const latestAnime = animeData.find((anime) => anime.isLatest) || animeData[0];

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 1000);
  }, []);

  if (!mounted || typeof window === 'undefined') return <Loading />;

  return (
    <div className="min-h-screen" id="home-page">
      {/* Navigation */}
      <nav className="sticky top-0 z-50">
        {/* Navbar Background - Changes based on menu state */}
        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            isMenuOpen ? 'bg-transparent' : 'backdrop-blur-md bg-black/20 border-b border-white/10'
          }`}
        />

        {/* Unified Gradient Background - Only visible when menu is open */}
        <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 via-blue-600/20 via-cyan-600/20 via-emerald-600/20 via-yellow-600/20 via-red-600/20 to-purple-600/20 animate-nav-gradient"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/80 to-slate-900/80 backdrop-blur-md"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-4">
          <div className="flex items-center justify-between min-h-[48px]">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">コクニメ</div>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
              <div className="relative flex-1 search-input-container">
                {/* Animated gradient outline - only visible on focus */}
                <div className="search-gradient-outline absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 ease-in-out">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 via-cyan-500 via-emerald-500 via-yellow-500 via-red-500 to-purple-500 animate-gradient-flow p-[2px]">
                    <div className="w-full h-full rounded-[6px] bg-slate-900/90 backdrop-blur-sm"></div>
                  </div>
                </div>

                {/* Search icon */}
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10 transition-colors duration-300" />

                {/* Input field */}
                <Input
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input-enhanced pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-transparent relative z-10 transition-all duration-300"
                />
              </div>
            </div>

            {/* Hamburger Menu Button - Fixed positioning and styling */}
            <Button
              variant="ghost"
              onClick={toggleMenu}
              className="w-12 h-12 shrink-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hamburger-button">
              <div className="relative w-6 h-6 flex items-center justify-center">
                <Menu
                  className={`absolute w-5 h-5 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0 rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'
                  }`}
                />
                <X
                  className={`absolute w-5 h-5 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-75'
                  }`}
                />
              </div>
            </Button>
          </div>
        </div>

        {/* Expanded Menu - Seamlessly connected with scrolling */}
        <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          {/* Scrollable container for mobile */}
          <div className="max-h-[calc(100vh-80px)] overflow-y-auto scrollbar-custom">
            <div className="relative z-10 container mx-auto px-4 py-8">
              {/* Mobile Search */}
              <div className="md:hidden mb-8">
                <div className="relative search-input-container">
                  {/* Animated gradient outline - only visible on focus */}
                  <div className="search-gradient-outline absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 ease-in-out">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 via-cyan-500 via-emerald-500 via-yellow-500 via-red-500 to-purple-500 animate-gradient-flow p-[2px]">
                      <div className="w-full h-full rounded-[10px] bg-slate-900/90 backdrop-blur-sm"></div>
                    </div>
                  </div>

                  {/* Search icon */}
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10 transition-colors duration-300" />

                  {/* Input field */}
                  <Input
                    placeholder="Search anime..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input-enhanced pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl h-12 focus:bg-white/15 focus:border-transparent relative z-10 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Navigation Menu Items */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
                {navigationItems.map((item, index) => (
                  <div
                    key={item.title}
                    className={`group nav-item-animate bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20`}
                    style={{ animationDelay: `${index * 100}ms` }}>
                    <Link href={item.href} className="block">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 flex items-center justify-center group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all duration-300">
                          <item.icon className="w-6 h-6 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300">{item.title}</h3>
                          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{item.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {item.items.slice(0, 6).map((subItem) => (
                          <Badge
                            key={subItem}
                            variant="outline"
                            className="text-xs border-purple-400/30 text-purple-300 group-hover:border-purple-400/50 group-hover:text-purple-200 transition-all duration-300">
                            {subItem}
                          </Badge>
                        ))}
                        {item.items.length > 6 && (
                          <Badge
                            variant="outline"
                            className="text-xs border-gray-400/30 text-gray-400 group-hover:border-gray-400/50 group-hover:text-gray-300 transition-all duration-300">
                            +{item.items.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={latestAnime.heroImage || '/placeholder.svg?height=600&width=1200'}
            alt={latestAnime.title}
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-900/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Latest Badge */}
            <div className="inline-flex items-center space-x-2 mb-6">
              <div className="hero-latest-badge bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-white">Latest Release</span>
                </div>
              </div>
            </div>

            {/* Glass Container */}
            <div className="hero-glass-container relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
              {/* Animated glass highlights */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slow"></div>
                <div
                  className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-white/20 to-transparent animate-shimmer-slow"
                  style={{ animationDelay: '1s' }}></div>
                <div
                  className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-white/20 to-transparent animate-shimmer-slow"
                  style={{ animationDelay: '2s' }}></div>
                <div
                  className="absolute bottom-0 left-0 w-1 h-full bg-gradient-to-t from-transparent via-white/20 to-transparent animate-shimmer-slow"
                  style={{ animationDelay: '3s' }}></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">{latestAnime.title}</span>
                </h1>

                {/* Japanese Title */}
                <p className="text-xl md:text-2xl text-purple-300 mb-6 japanese-text">{latestAnime.japaneseTitle}</p>

                {/* Synopsis */}
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">{latestAnime.synopsis}</p>

                {/* Genre Badges */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {latestAnime.genres.map((genre) => (
                    <Badge
                      key={genre}
                      className="hero-genre-badge bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 px-4 py-2 text-sm font-medium">
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {/* Details Button with Animated Gradient */}
                  <Link href={`/anime/${latestAnime.id}`}>
                    <div className="hero-button-container relative group">
                      {/* Animated gradient outline */}
                      <div className="hero-gradient-outline absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 via-cyan-500 via-emerald-500 via-yellow-500 via-red-500 to-purple-500 animate-gradient-flow p-[2px]">
                          <div className="w-full h-full rounded-[10px] bg-slate-900/90 backdrop-blur-sm"></div>
                        </div>
                      </div>

                      <Button className="hero-details-button relative z-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/25">
                        <Info className="w-5 h-5 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </Link>

                  {/* Watch Trailer Button */}
                  <Button
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/30 px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-xl">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Trailer
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{latestAnime.rating}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{latestAnime.year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Film className="w-4 h-4" />
                    <span>{latestAnime.studio}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>{latestAnime.episodes} episodes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">All Anime</h2>
          <p className="text-gray-400">Discover your next favorite series</p>
        </div>

        {/* Anime Grid with Skeleton Loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? // Show skeleton cards while loading
              Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} index={index} />)
            : // Show actual anime cards when loaded
              filteredAnime.map((anime) => <AnimeCard key={anime.id} anime={anime} />)}
        </div>

        {!isLoading && filteredAnime.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No anime found</h3>
            <p className="text-gray-400">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="skeleton-card-animate bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all duration-700 ease-out"
      style={{ animationDelay: `${index * 100}ms` }}>
      {/* Skeleton Image */}
      <div className="aspect-[3/4] relative overflow-hidden">
        <div className="skeleton-shimmer w-full h-full bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50"></div>

        {/* Skeleton Rating Badge */}
        <div className="absolute top-3 right-3">
          <div className="skeleton-shimmer w-12 h-6 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded-full"></div>
        </div>

        {/* Skeleton Status Badge */}
        <div className="absolute top-3 left-3">
          <div className="skeleton-shimmer w-16 h-6 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded-md"></div>
        </div>
      </div>

      <div className="p-4">
        {/* Skeleton Title */}
        <div className="skeleton-shimmer w-3/4 h-5 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded mb-2"></div>

        {/* Skeleton Japanese Title */}
        <div className="skeleton-shimmer w-1/2 h-4 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded mb-3"></div>

        {/* Skeleton Meta Info */}
        <div className="flex items-center space-x-4 mb-3">
          <div className="skeleton-shimmer w-12 h-3 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded"></div>
          <div className="skeleton-shimmer w-16 h-3 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded"></div>
        </div>

        {/* Skeleton Genre Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          <div className="skeleton-shimmer w-14 h-5 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded"></div>
          <div className="skeleton-shimmer w-16 h-5 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded"></div>
          <div className="skeleton-shimmer w-8 h-5 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded"></div>
        </div>

        {/* Skeleton Button */}
        <div className="skeleton-shimmer w-full h-10 bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 rounded-lg"></div>
      </div>
    </div>
  );
}

function AnimeCard({ anime }: { anime: (typeof animeData)[0] }) {
  return (
    <div className="anime-card-animate group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-700 ease-out hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-white/30 hover:brightness-110">
      {/* Enhanced magical rainbow gradient overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 via-red-400/20 via-orange-400/20 via-yellow-400/20 via-green-400/20 via-blue-400/20 via-indigo-400/20 via-purple-400/20 to-pink-400/20 animate-rainbow-flow"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-shimmer"></div>
      </div>

      <div className="aspect-[3/4] relative overflow-hidden">
        <Image
          src={anime.coverImage || '/placeholder.svg'}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 transition-all duration-300 group-hover:bg-black/70">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-xs text-white font-medium">{anime.rating}</span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={anime.status === 'Ongoing' ? 'default' : anime.status === 'Completed' ? 'secondary' : 'outline'}
            className="text-xs bg-purple-600/80 backdrop-blur-sm border-0 transition-all duration-300 group-hover:bg-purple-600/90">
            {anime.status}
          </Badge>
        </div>
      </div>

      <div className="p-4 relative z-10">
        <Link href={`/anime/${anime.id}`}>
          <h3 className="font-bold text-white mb-1 group-hover:text-purple-200 transition-colors duration-300 line-clamp-1">{anime.title}</h3>
        </Link>
        <p className="text-sm text-gray-400 mb-2 line-clamp-1 group-hover:text-gray-300 transition-colors duration-300">{anime.japaneseTitle}</p>

        <div className="flex items-center space-x-4 text-xs text-gray-400 mb-3 group-hover:text-gray-300 transition-colors duration-300">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{anime.year}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Tag className="w-3 h-3" />
            <span>{anime.episodes} eps</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {anime.genres.slice(0, 2).map((genre) => (
            <Badge
              key={genre}
              variant="outline"
              className="text-xs border-purple-400/30 text-purple-300 transition-all duration-300 group-hover:border-purple-400/50 group-hover:text-purple-200">
              {genre}
            </Badge>
          ))}
          {anime.genres.length > 2 && (
            <Badge
              variant="outline"
              className="text-xs border-gray-400/30 text-gray-400 transition-all duration-300 group-hover:border-gray-400/50 group-hover:text-gray-300">
              +{anime.genres.length - 2}
            </Badge>
          )}
        </div>

        {/* Enhanced button with opposing gradient animation */}
        <div className="relative overflow-hidden rounded-lg">
          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/25 relative z-10">
            <Download className="w-4 h-4 mr-2" />
            Batch Download
          </Button>

          {/* Opposing gradient overlay for button */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-l from-cyan-400/30 via-blue-400/30 via-purple-400/30 via-pink-400/30 via-red-400/30 via-orange-400/30 via-yellow-400/30 via-green-400/30 to-cyan-400/30 animate-rainbow-flow-reverse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
