# Graph Report - kokunime  (2026-08-28)

## Corpus Check
- 239 files · ~61,899 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 828 nodes · 1787 edges · 61 communities (52 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5f9b0e7d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- genres.ts
- main-layout.tsx
- download-section.tsx
- icons/index.ts
- section-detail.tsx
- scripts
- bookmarks/page.tsx
- settings.ts
- style
- site.ts
- devDependencies
- Anime
- detail-hero.tsx
- scraper/index.ts
- compilerOptions
- seo.ts
- footer/index.tsx
- biome.json
- include
- seasons/page.tsx
- error-card.tsx
- ignore
- home-content.tsx
- endpoint-slug.ts
- formatter
- next.config.mjs
- safeJsonLd
- defer-hydration.tsx
- format-date.ts
- vcs
- lib
- [genre]/page.tsx
- webhook-dispatcher.ts
- interfaces/index.ts
- layout.tsx
- html5-video-player.tsx
- smart-prefetch-link.tsx
- virtualized-grid.tsx
- api-auth.ts
- mirror-health.ts
- postcss.config.js
- sw.js
- search-form.tsx
- .next/**
- api/page.tsx
- post-commit
- post-checkout

## God Nodes (most connected - your core abstractions)
1. `MainLayout()` - 23 edges
2. `getAnimeDetail()` - 21 edges
3. `scripts` - 21 edges
4. `safeJsonLd()` - 19 edges
5. `.next/**` - 19 edges
6. `AnimeDetail` - 18 edges
7. `stripHtmlNoise()` - 18 edges
8. `Anime` - 17 edges
9. `compilerOptions` - 17 edges
10. `getAnimePerPage()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `FeaturedHeroProps` --references--> `Anime`  [EXTRACTED]
  src/sections/featured-hero.tsx → src/interfaces/anime.ts
- `AnimeGridProps` --references--> `Anime`  [EXTRACTED]
  src/components/cards/anime-grid.tsx → src/interfaces/anime.ts
- `PaginationBarProps` --references--> `PaginationInfo`  [EXTRACTED]
  src/sections/pagination/bar.tsx → src/interfaces/anime.ts
- `PaginationProps` --references--> `PaginationInfo`  [EXTRACTED]
  src/sections/pagination/index.tsx → src/interfaces/anime.ts
- `DetailHeroProps` --references--> `AnimeDetail`  [EXTRACTED]
  src/components/anime/detail-hero.tsx → src/interfaces/anime.ts

## Import Cycles
- None detected.

## Communities (61 total, 9 thin omitted)

### Community 0 - "genres.ts"
Cohesion: 0.07
Nodes (47): cleanFirstTitle(), dynamic, GET(), probe(), SearchAnime(), RetryConfig, upstream, AnimePage (+39 more)

### Community 1 - "main-layout.tsx"
Cohesion: 0.06
Nodes (23): dynamic, dynamic, PaginatedHome(), DetailDownloadSkeleton(), DetailHeroSkeleton(), DetailSkeleton(), CardSkeleton(), GridSkeleton() (+15 more)

### Community 2 - "download-section.tsx"
Cohesion: 0.22
Nodes (7): DownloadGuideModal(), DownloadSection(), NewSeriesSection(), NewSeriesSkeleton(), Reveal(), RevealProps, NewSeriesAnime()

### Community 3 - "icons/index.ts"
Cohesion: 0.08
Nodes (26): CopyButton(), CopyButtonProps, DownloadPlatform(), getPlatformStyle(), requiresLogin(), ChevronLeftIcon(), ChevronRightIcon(), DownloadIcon() (+18 more)

### Community 4 - "section-detail.tsx"
Cohesion: 0.13
Nodes (16): DetailToc(), SECTIONS, EpisodeGallery(), EpisodeGalleryProps, InfoSide(), ReadingFocusMode(), ReadingFocusModeProps, SectionDetail() (+8 more)

### Community 5 - "scripts"
Cohesion: 0.04
Nodes (45): axios, cheerio, husky, author, dependencies, axios, cheerio, husky (+37 more)

### Community 6 - "bookmarks/page.tsx"
Cohesion: 0.13
Nodes (36): BookmarksPage(), SERVER_BOOKMARKS, SERVER_HISTORY, BookmarkButton(), BookmarkButtonProps, HistoryTracker(), HistoryTrackerProps, EMPTY_HISTORY (+28 more)

### Community 7 - "settings.ts"
Cohesion: 0.07
Nodes (48): BatchDownloadTools(), BatchDownloadToolsProps, DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), MobileMenu(), MobileMenuProps, NAV_KEY_MAP (+40 more)

### Community 8 - "style"
Cohesion: 0.05
Nodes (38): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, noExtraBooleanCast (+30 more)

### Community 9 - "site.ts"
Cohesion: 0.22
Nodes (7): dynamic, openGraph, DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL

### Community 10 - "devDependencies"
Cohesion: 0.10
Nodes (21): @biomejs/biome, lint-staged, devDependencies, @biomejs/biome, lint-staged, postcss, tailwindcss, @tailwindcss/postcss (+13 more)

### Community 11 - "Anime"
Cohesion: 0.23
Nodes (11): EmptyState(), AnimeGrid(), SearchIcon(), Anime, PaginationInfo, AnimeListingProps, LatestGridProps, Pagination() (+3 more)

### Community 12 - "detail-hero.tsx"
Cohesion: 0.21
Nodes (8): DetailHero(), DetailHeroProps, ShareButton(), ShareButtonProps, TrailerButton(), TrailerButtonProps, VerticalJapaneseTitle(), VerticalJapaneseTitleProps

### Community 13 - "scraper/index.ts"
Cohesion: 0.08
Nodes (36): alt, contentType, Image(), runtime, size, POST(), GET(), GET() (+28 more)

### Community 14 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx, module (+8 more)

### Community 15 - "seo.ts"
Cohesion: 0.32
Nodes (8): Anime(), dynamic, generateMetadata(), buildDetailMetadata(), buildAnimeJsonLd(), buildBreadcrumbJsonLd(), buildFaqJsonLd(), truncate()

### Community 16 - "footer/index.tsx"
Cohesion: 0.21
Nodes (9): AboutBlock(), BackToTop(), BottomBar(), BrandBlock(), footerDevLinks, footerNavLinks, footerTags, Footer() (+1 more)

### Community 17 - "biome.json"
Cohesion: 0.18
Nodes (10): quoteStyle, semicolons, trailingCommas, javascript, formatter, linter, enabled, organizeImports (+2 more)

### Community 18 - "include"
Cohesion: 0.20
Nodes (9): node_modules/**, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 19 - "seasons/page.tsx"
Cohesion: 0.26
Nodes (9): SeasonsPage(), getSeasonInfo(), SEASON_META, SeasonsExplorer(), SeasonsExplorerProps, Season, SeasonYearGroupProps, groupSeasonsByYear() (+1 more)

### Community 21 - "ignore"
Cohesion: 0.29
Nodes (7): files, ignore, ignoreUnknown, coverage/**, dist/**, pnpm-lock.yaml, public/**

### Community 22 - "home-content.tsx"
Cohesion: 0.31
Nodes (5): RecommendedSkeleton(), FeaturedHero(), FeaturedHeroProps, LatestGrid(), RecommendationSection()

### Community 23 - "endpoint-slug.ts"
Cohesion: 0.15
Nodes (14): DetailMeta(), MetaItemProps, chipColors, GenreTags(), GENRE_DICTIONARY, GenreMeta, GenresExplorer(), GenresExplorerProps (+6 more)

### Community 24 - "formatter"
Cohesion: 0.40
Nodes (5): formatter, enabled, indentStyle, indentWidth, lineWidth

### Community 25 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - "safeJsonLd"
Cohesion: 0.27
Nodes (10): ApiDocsPage(), ComparePage(), ComparePageProps, dynamic, metadata, GenresPage(), metadata, SettingsPage() (+2 more)

### Community 27 - "defer-hydration.tsx"
Cohesion: 0.60
Nodes (3): DeferHydration(), DeferHydrationProps, runWhenIdle()

### Community 28 - "format-date.ts"
Cohesion: 0.50
Nodes (3): formatLocalizedDate(), MONTHS_EN, MONTHS_ID

### Community 29 - "vcs"
Cohesion: 0.50
Nodes (4): vcs, clientKind, enabled, useIgnoreFile

### Community 30 - "lib"
Cohesion: 0.50
Nodes (4): dom, dom.iterable, esnext, lib

### Community 31 - "[genre]/page.tsx"
Cohesion: 0.31
Nodes (7): dynamic, generateMetadata(), GenrePage(), dynamic, generateMetadata(), AnimeListing(), toTitle()

### Community 33 - "interfaces/index.ts"
Cohesion: 0.17
Nodes (15): AnimeGridProps, AnimeImage(), AnimeImageProps, CardAnime(), clientSearchCache, CommandPalette(), getRecentSearches(), saveRecentSearch() (+7 more)

### Community 34 - "layout.tsx"
Cohesion: 0.24
Nodes (8): jetBrainsMono, plusJakartaSans, RootLayout(), viewport, RouteProgressBar(), ServiceWorkerRegister(), metadata, buildWebSiteJsonLd()

### Community 51 - "search-form.tsx"
Cohesion: 0.25
Nodes (5): Input(), SearchFormProps, AnimeCardProps, ChildrenProps, InputProps

### Community 57 - ".next/**"
Cohesion: 0.43
Nodes (4): .next/**, generateMetadata(), buildSearchMetadata(), decodeQuery()

### Community 58 - "api/page.tsx"
Cohesion: 0.32
Nodes (6): ENDPOINTS, metadata, ApiEndpoint, ApiTester(), ApiTesterProps, CodeLang

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

## Knowledge Gaps
- **215 isolated node(s):** `RetryConfig`, `MemoryCacheEntry`, `FallbackExtractResult`, `ImgLike`, `TaxonomyItem` (+210 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `main-layout.tsx`, `layout.tsx`, `safeJsonLd`, `site.ts`, `scraper/index.ts`, `seo.ts`, `seasons/page.tsx`, `ignore`, `api/page.tsx`, `[genre]/page.tsx`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `.next/**`, `include`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **What connects `RetryConfig`, `MemoryCacheEntry`, `FallbackExtractResult` to the rest of the system?**
  _215 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `genres.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07467630231857875 - nodes in this community are weakly interconnected._
- **Should `main-layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05552617662612375 - nodes in this community are weakly interconnected._
- **Should `icons/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08078231292517007 - nodes in this community are weakly interconnected._