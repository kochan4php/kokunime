# Graph Report - kokunime  (2026-08-28)

## Corpus Check
- 240 files · ~62,134 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 833 nodes · 1791 edges · 63 communities (52 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2d41a621`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scraper/index.ts
- main-layout.tsx
- genres-explorer.tsx
- interfaces/index.ts
- section-detail.tsx
- scripts
- bookmarks/page.tsx
- settings.ts
- style
- .next/**
- devDependencies
- site.ts
- seo.ts
- getAnimeDetail
- compilerOptions
- layout.tsx
- footer/index.tsx
- biome.json
- include
- [page]/page.tsx
- error-card.tsx
- ignore
- seasons/page.tsx
- dependencies
- formatter
- next.config.mjs
- endpoint-slug.ts
- defer-hydration.tsx
- format-date.ts
- vcs
- lib
- detail-hero.tsx
- webhook-dispatcher.ts
- AnimeDetail
- worker.js
- html5-video-player.tsx
- smart-prefetch-link.tsx
- virtualized-grid.tsx
- api-auth.ts
- mirror-health.ts
- postcss.config.js
- sw.js
- package.json
- detail-skeleton.tsx
- seasons-explorer.tsx
- post-commit
- post-checkout
- download-section.tsx
- offline-indicator.tsx

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
- `exclude` --extends--> `node_modules/**`  [EXTRACTED]
  tsconfig.json → biome.json
- `GenresExplorerProps` --references--> `Genre`  [EXTRACTED]
  src/components/genres-explorer.tsx → src/interfaces/reference.ts
- `AnimeDetail` --references--> `Genre`  [EXTRACTED]
  src/interfaces/anime.ts → src/interfaces/reference.ts
- `FeaturedHeroProps` --references--> `Anime`  [EXTRACTED]
  src/sections/featured-hero.tsx → src/interfaces/anime.ts
- `SeasonsExplorerProps` --references--> `Season`  [EXTRACTED]
  src/components/seasons-explorer.tsx → src/interfaces/reference.ts

## Import Cycles
- None detected.

## Communities (63 total, 11 thin omitted)

### Community 0 - "scraper/index.ts"
Cohesion: 0.05
Nodes (66): GET(), GET(), cleanFirstTitle(), dynamic, GET(), probe(), dynamic, GET() (+58 more)

### Community 1 - "main-layout.tsx"
Cohesion: 0.11
Nodes (9): FloatingTopButton(), HoneypotTrap(), KeyboardNavigation(), SHORTCUTS, BeforeInstallPromptEvent, PwaInstallBanner(), ScrollToTop(), MainLayout() (+1 more)

### Community 2 - "genres-explorer.tsx"
Cohesion: 0.38
Nodes (6): GENRE_DICTIONARY, GenreMeta, GenresExplorer(), GenresExplorerProps, getGenreMeta(), Genre

### Community 3 - "interfaces/index.ts"
Cohesion: 0.05
Nodes (50): EmptyState(), NewSeriesSection(), NewSeriesSkeleton(), AnimeGrid(), AnimeGridProps, AnimeImage(), AnimeImageProps, RecommendedSkeleton() (+42 more)

### Community 4 - "section-detail.tsx"
Cohesion: 0.20
Nodes (9): DetailToc(), SECTIONS, EpisodeGallery(), EpisodeGalleryProps, InfoSide(), SectionDetail(), ThemeSongsPlayer(), ThemeSongsPlayerProps (+1 more)

### Community 5 - "scripts"
Cohesion: 0.10
Nodes (21): scripts, analyze, backup:cache, build, changelog, dev, docker:down, docker:up (+13 more)

### Community 6 - "bookmarks/page.tsx"
Cohesion: 0.13
Nodes (37): BookmarksPage(), SERVER_BOOKMARKS, SERVER_HISTORY, BookmarkButton(), BookmarkButtonProps, HistoryTracker(), HistoryTrackerProps, CardAnime() (+29 more)

### Community 7 - "settings.ts"
Cohesion: 0.05
Nodes (60): BatchDownloadTools(), BatchDownloadToolsProps, CopyButton(), CopyButtonProps, DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), DownloadPlatform() (+52 more)

### Community 8 - "style"
Cohesion: 0.05
Nodes (38): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, noExtraBooleanCast (+30 more)

### Community 9 - ".next/**"
Cohesion: 0.14
Nodes (18): .next/**, ComparePage(), ComparePageProps, dynamic, metadata, dynamic, generateMetadata(), GenrePage() (+10 more)

### Community 10 - "devDependencies"
Cohesion: 0.10
Nodes (21): @biomejs/biome, lint-staged, devDependencies, @biomejs/biome, lint-staged, postcss, tailwindcss, @tailwindcss/postcss (+13 more)

### Community 11 - "site.ts"
Cohesion: 0.15
Nodes (14): ApiDocsPage(), ENDPOINTS, metadata, dynamic, ApiEndpoint, ApiTester(), ApiTesterProps, CodeLang (+6 more)

### Community 12 - "seo.ts"
Cohesion: 0.32
Nodes (8): Anime(), dynamic, generateMetadata(), buildDetailMetadata(), buildAnimeJsonLd(), buildBreadcrumbJsonLd(), buildFaqJsonLd(), truncate()

### Community 13 - "getAnimeDetail"
Cohesion: 0.12
Nodes (23): alt, contentType, Image(), runtime, size, POST(), GET(), GET() (+15 more)

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

### Community 19 - "[page]/page.tsx"
Cohesion: 0.16
Nodes (7): dynamic, dynamic, CardSkeleton(), GridSkeleton(), GridSkeletonProps, HomeContent(), HomeSkeleton()

### Community 21 - "ignore"
Cohesion: 0.29
Nodes (7): files, ignore, ignoreUnknown, coverage/**, dist/**, pnpm-lock.yaml, public/**

### Community 22 - "seasons/page.tsx"
Cohesion: 0.57
Nodes (3): SeasonsPage(), groupSeasonsByYear(), orderYears()

### Community 23 - "dependencies"
Cohesion: 0.13
Nodes (15): axios, cheerio, husky, dependencies, axios, cheerio, husky, next (+7 more)

### Community 24 - "formatter"
Cohesion: 0.40
Nodes (5): formatter, enabled, indentStyle, indentWidth, lineWidth

### Community 25 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - "endpoint-slug.ts"
Cohesion: 0.21
Nodes (8): DetailMeta(), MetaItemProps, chipColors, GenreTags(), SeasonYearGroup(), TaxonomyCard(), TaxonomyCardProps, endpointSlug()

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

### Community 31 - "detail-hero.tsx"
Cohesion: 0.24
Nodes (7): DetailHero(), ShareButton(), ShareButtonProps, TrailerButton(), TrailerButtonProps, VerticalJapaneseTitle(), VerticalJapaneseTitleProps

### Community 33 - "AnimeDetail"
Cohesion: 0.22
Nodes (8): DetailHeroProps, ReadingFocusMode(), ReadingFocusModeProps, Synopsis(), WatchOrderTimeline(), WatchOrderTimelineProps, CompareAnimeClientProps, AnimeDetail

### Community 51 - "package.json"
Cohesion: 0.20
Nodes (9): author, lint-staged, **/*.{js,jsx,ts,tsx,json,css}, name, packageManager, private, type, version (+1 more)

### Community 57 - "detail-skeleton.tsx"
Cohesion: 0.36
Nodes (3): DetailDownloadSkeleton(), DetailHeroSkeleton(), DetailSkeleton()

### Community 58 - "seasons-explorer.tsx"
Cohesion: 0.38
Nodes (6): getSeasonInfo(), SEASON_META, SeasonsExplorer(), SeasonsExplorerProps, Season, SeasonYearGroupProps

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 62 - "offline-indicator.tsx"
Cohesion: 0.83
Nodes (3): getOnlineSnapshot(), OfflineIndicator(), subscribeOnline()

## Knowledge Gaps
- **217 isolated node(s):** `RetryConfig`, `MemoryCacheEntry`, `FallbackExtractResult`, `ImgLike`, `TaxonomyItem` (+212 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `scraper/index.ts`, `site.ts`, `seo.ts`, `getAnimeDetail`, `layout.tsx`, `[page]/page.tsx`, `ignore`, `seasons/page.tsx`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `.next/**`, `include`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **What connects `RetryConfig`, `MemoryCacheEntry`, `FallbackExtractResult` to the rest of the system?**
  _217 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `scraper/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.052606177606177605 - nodes in this community are weakly interconnected._
- **Should `main-layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11088709677419355 - nodes in this community are weakly interconnected._
- **Should `interfaces/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05095839177185601 - nodes in this community are weakly interconnected._