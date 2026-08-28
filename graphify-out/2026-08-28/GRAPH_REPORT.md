# Graph Report - kokunime  (2026-08-28)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 826 nodes · 1785 edges · 57 communities (46 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9a45b78c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- genres.ts
- main-layout.tsx
- useTranslation
- interfaces/index.ts
- section-detail.tsx
- scripts
- bookmarks/page.tsx
- settings.ts
- style
- [genre]/page.tsx
- devDependencies
- site.ts
- seo.ts
- scraper/index.ts
- compilerOptions
- layout.tsx
- footer/index.tsx
- biome.json
- include
- .next/**
- error-card.tsx
- ignore
- seasons/page.tsx
- getAnimeDetail
- formatter
- next.config.mjs
- genres/route.ts
- defer-hydration.tsx
- format-date.ts
- vcs
- lib
- safeJsonLd
- webhook-dispatcher.ts
- parser-benchmark.test.ts
- worker.js
- html5-video-player.tsx
- smart-prefetch-link.tsx
- virtualized-grid.tsx
- api-auth.ts
- mirror-health.ts
- postcss.config.js
- sw.js

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
- `PaginatedHome()` --calls--> `getAnimePerPage()`  [EXTRACTED]
  src/app/page/[page]/page.tsx → src/services/scraper/anime-list.ts
- `SeasonYearGroup()` --calls--> `endpointSlug()`  [EXTRACTED]
  src/sections/season-year-group.tsx → src/utils/endpoint-slug.ts
- `exclude` --extends--> `node_modules/**`  [EXTRACTED]
  tsconfig.json → biome.json
- `SeasonsExplorerProps` --references--> `Season`  [EXTRACTED]
  src/components/seasons-explorer.tsx → src/interfaces/reference.ts

## Import Cycles
- None detected.

## Communities (57 total, 11 thin omitted)

### Community 0 - "genres.ts"
Cohesion: 0.06
Nodes (59): GET(), cleanFirstTitle(), dynamic, GET(), probe(), dynamic, GET(), GET() (+51 more)

### Community 1 - "main-layout.tsx"
Cohesion: 0.05
Nodes (26): dynamic, dynamic, PaginatedHome(), DetailDownloadSkeleton(), DetailHeroSkeleton(), DetailSkeleton(), CardSkeleton(), GridSkeleton() (+18 more)

### Community 2 - "useTranslation"
Cohesion: 0.06
Nodes (45): sitemap(), NewSeriesSection(), NewSeriesSkeleton(), AnimeImage(), AnimeImageProps, clientSearchCache, CommandPalette(), getRecentSearches() (+37 more)

### Community 3 - "interfaces/index.ts"
Cohesion: 0.07
Nodes (33): EmptyState(), AnimeGrid(), AnimeGridProps, ChevronLeftIcon(), ChevronRightIcon(), SearchIcon(), IconProps, Input() (+25 more)

### Community 4 - "section-detail.tsx"
Cohesion: 0.07
Nodes (30): DetailHero(), DetailHeroProps, DetailMeta(), MetaItemProps, DetailToc(), SECTIONS, DownloadGuideModal(), DownloadSection() (+22 more)

### Community 5 - "scripts"
Cohesion: 0.04
Nodes (45): axios, cheerio, husky, author, dependencies, axios, cheerio, husky (+37 more)

### Community 6 - "bookmarks/page.tsx"
Cohesion: 0.13
Nodes (37): BookmarksPage(), SERVER_BOOKMARKS, SERVER_HISTORY, BookmarkButton(), BookmarkButtonProps, HistoryTracker(), HistoryTrackerProps, CardAnime() (+29 more)

### Community 7 - "settings.ts"
Cohesion: 0.09
Nodes (37): BatchDownloadTools(), BatchDownloadToolsProps, CopyButton(), CopyButtonProps, DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), DownloadPlatform() (+29 more)

### Community 8 - "style"
Cohesion: 0.05
Nodes (38): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, noExtraBooleanCast (+30 more)

### Community 9 - "[genre]/page.tsx"
Cohesion: 0.29
Nodes (8): dynamic, generateMetadata(), GenrePage(), dynamic, generateMetadata(), SeasonPage(), AnimeListing(), toTitle()

### Community 10 - "devDependencies"
Cohesion: 0.10
Nodes (21): @biomejs/biome, lint-staged, devDependencies, @biomejs/biome, lint-staged, postcss, tailwindcss, @tailwindcss/postcss (+13 more)

### Community 11 - "site.ts"
Cohesion: 0.22
Nodes (7): dynamic, openGraph, DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL

### Community 12 - "seo.ts"
Cohesion: 0.32
Nodes (8): Anime(), dynamic, generateMetadata(), buildDetailMetadata(), buildAnimeJsonLd(), buildBreadcrumbJsonLd(), buildFaqJsonLd(), truncate()

### Community 13 - "scraper/index.ts"
Cohesion: 0.24
Nodes (11): POST(), POST(), GET(), GenresPage(), checkRateLimit(), getRateLimitHeaders(), RateLimitRecord, RateLimitResult (+3 more)

### Community 14 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx, module (+8 more)

### Community 15 - "layout.tsx"
Cohesion: 0.16
Nodes (11): jetBrainsMono, plusJakartaSans, RootLayout(), viewport, RouteProgressBar(), ServiceWorkerRegister(), AnimeCardProps, ChildrenProps (+3 more)

### Community 16 - "footer/index.tsx"
Cohesion: 0.21
Nodes (9): AboutBlock(), BackToTop(), BottomBar(), BrandBlock(), footerDevLinks, footerNavLinks, footerTags, Footer() (+1 more)

### Community 17 - "biome.json"
Cohesion: 0.18
Nodes (10): quoteStyle, semicolons, trailingCommas, javascript, formatter, linter, enabled, organizeImports (+2 more)

### Community 18 - "include"
Cohesion: 0.20
Nodes (9): node_modules/**, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 19 - ".next/**"
Cohesion: 0.33
Nodes (6): .next/**, generateMetadata(), SearchAnime(), buildSearchMetadata(), decodeQuery(), SearchResults()

### Community 21 - "ignore"
Cohesion: 0.29
Nodes (7): files, ignore, ignoreUnknown, coverage/**, dist/**, pnpm-lock.yaml, public/**

### Community 22 - "seasons/page.tsx"
Cohesion: 0.18
Nodes (12): SeasonsPage(), getSeasonInfo(), SEASON_META, SeasonsExplorer(), SeasonsExplorerProps, Season, SeasonYearGroup(), SeasonYearGroupProps (+4 more)

### Community 23 - "getAnimeDetail"
Cohesion: 0.24
Nodes (8): alt, contentType, Image(), runtime, size, GET(), GET(), getAnimeDetail()

### Community 24 - "formatter"
Cohesion: 0.40
Nodes (5): formatter, enabled, indentStyle, indentWidth, lineWidth

### Community 25 - "next.config.mjs"
Cohesion: 0.40
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - "genres/route.ts"
Cohesion: 0.80
Nodes (3): GET(), checkEtagMatch(), generateEtag()

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

### Community 31 - "safeJsonLd"
Cohesion: 0.16
Nodes (15): ApiDocsPage(), ENDPOINTS, metadata, ComparePage(), ComparePageProps, dynamic, metadata, metadata (+7 more)

## Knowledge Gaps
- **217 isolated node(s):** `RetryConfig`, `MemoryCacheEntry`, `FallbackExtractResult`, `ImgLike`, `TaxonomyItem` (+212 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `main-layout.tsx`, `useTranslation`, `[genre]/page.tsx`, `site.ts`, `seo.ts`, `layout.tsx`, `ignore`, `seasons/page.tsx`, `safeJsonLd`?**
  _High betweenness centrality (0.179) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `include`, `.next/**`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **What connects `RetryConfig`, `MemoryCacheEntry`, `FallbackExtractResult` to the rest of the system?**
  _217 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `genres.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05916305916305916 - nodes in this community are weakly interconnected._
- **Should `main-layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.051360842844600525 - nodes in this community are weakly interconnected._
- **Should `useTranslation` be split into smaller, more focused modules?**
  _Cohesion score 0.061955965181771634 - nodes in this community are weakly interconnected._