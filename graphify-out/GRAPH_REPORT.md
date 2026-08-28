# Graph Report - kokunime  (2026-08-28)

## Corpus Check
- 239 files · ~62,008 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 832 nodes · 1791 edges · 58 communities (49 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f18e7dbe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scraper/index.ts
- MainLayout
- download-section.tsx
- interfaces/index.ts
- section-detail.tsx
- scripts
- bookmarks/page.tsx
- settings.ts
- style
- seo.ts
- devDependencies
- main-layout.tsx
- detail-hero.tsx
- getAnimeDetail
- compilerOptions
- [page]/page.tsx
- footer/index.tsx
- biome.json
- include
- season-year-group.tsx
- error-card.tsx
- ignore
- home-content.tsx
- genres-explorer.tsx
- formatter
- next.config.mjs
- endpoint-slug.ts
- defer-hydration.tsx
- format-date.ts
- vcs
- lib
- detail-skeleton.tsx
- webhook-dispatcher.ts
- useTranslation
- offline-indicator.tsx
- html5-video-player.tsx
- smart-prefetch-link.tsx
- virtualized-grid.tsx
- api-auth.ts
- mirror-health.ts
- postcss.config.js
- sw.js
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
- `CompareAnimeClientProps` --references--> `AnimeDetail`  [EXTRACTED]
  src/components/compare-anime-client.tsx → src/interfaces/anime.ts
- `PaginatedHome()` --calls--> `getAnimePerPage()`  [EXTRACTED]
  src/app/page/[page]/page.tsx → src/services/scraper/anime-list.ts
- `SeasonYearGroup()` --calls--> `endpointSlug()`  [EXTRACTED]
  src/sections/season-year-group.tsx → src/utils/endpoint-slug.ts
- `exclude` --extends--> `node_modules/**`  [EXTRACTED]
  tsconfig.json → biome.json

## Import Cycles
- None detected.

## Communities (58 total, 9 thin omitted)

### Community 0 - "scraper/index.ts"
Cohesion: 0.06
Nodes (58): GET(), cleanFirstTitle(), dynamic, GET(), probe(), dynamic, GET(), GET() (+50 more)

### Community 1 - "MainLayout"
Cohesion: 0.15
Nodes (5): CardSkeleton(), GridSkeleton(), GridSkeletonProps, MainLayout(), ListingSkeleton()

### Community 2 - "download-section.tsx"
Cohesion: 0.17
Nodes (9): DownloadGuideModal(), DownloadSection(), NewSeriesSection(), NewSeriesSkeleton(), ReadingFocusMode(), ReadingFocusModeProps, Synopsis(), Reveal() (+1 more)

### Community 3 - "interfaces/index.ts"
Cohesion: 0.07
Nodes (34): EmptyState(), AnimeGrid(), AnimeGridProps, ChevronLeftIcon(), ChevronRightIcon(), SearchIcon(), IconProps, Input() (+26 more)

### Community 4 - "section-detail.tsx"
Cohesion: 0.17
Nodes (12): DetailHeroProps, DetailToc(), SECTIONS, EpisodeGallery(), EpisodeGalleryProps, InfoSide(), ThemeSongsPlayer(), ThemeSongsPlayerProps (+4 more)

### Community 5 - "scripts"
Cohesion: 0.04
Nodes (45): axios, cheerio, husky, author, dependencies, axios, cheerio, husky (+37 more)

### Community 6 - "bookmarks/page.tsx"
Cohesion: 0.11
Nodes (40): BookmarksPage(), SERVER_BOOKMARKS, SERVER_HISTORY, BookmarkButton(), BookmarkButtonProps, HistoryTracker(), HistoryTrackerProps, AnimeImage() (+32 more)

### Community 7 - "settings.ts"
Cohesion: 0.08
Nodes (40): BatchDownloadTools(), BatchDownloadToolsProps, CopyButton(), CopyButtonProps, DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), DownloadPlatform() (+32 more)

### Community 8 - "style"
Cohesion: 0.05
Nodes (38): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, noExtraBooleanCast (+30 more)

### Community 9 - "seo.ts"
Cohesion: 0.06
Nodes (52): .next/**, Anime(), dynamic, generateMetadata(), ApiDocsPage(), ENDPOINTS, metadata, ComparePage() (+44 more)

### Community 10 - "devDependencies"
Cohesion: 0.10
Nodes (21): @biomejs/biome, lint-staged, devDependencies, @biomejs/biome, lint-staged, postcss, tailwindcss, @tailwindcss/postcss (+13 more)

### Community 11 - "main-layout.tsx"
Cohesion: 0.18
Nodes (7): FloatingTopButton(), HoneypotTrap(), KeyboardNavigation(), SHORTCUTS, BeforeInstallPromptEvent, PwaInstallBanner(), ScrollToTop()

### Community 12 - "detail-hero.tsx"
Cohesion: 0.19
Nodes (9): DetailHero(), chipColors, GenreTags(), ShareButton(), ShareButtonProps, TrailerButton(), TrailerButtonProps, VerticalJapaneseTitle() (+1 more)

### Community 13 - "getAnimeDetail"
Cohesion: 0.10
Nodes (27): alt, contentType, Image(), runtime, size, POST(), GET(), GET() (+19 more)

### Community 14 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx, module (+8 more)

### Community 15 - "[page]/page.tsx"
Cohesion: 0.21
Nodes (5): dynamic, dynamic, PaginatedHome(), HomeContent(), HomeSkeleton()

### Community 16 - "footer/index.tsx"
Cohesion: 0.21
Nodes (9): AboutBlock(), BackToTop(), BottomBar(), BrandBlock(), footerDevLinks, footerNavLinks, footerTags, Footer() (+1 more)

### Community 17 - "biome.json"
Cohesion: 0.18
Nodes (10): quoteStyle, semicolons, trailingCommas, javascript, formatter, linter, enabled, organizeImports (+2 more)

### Community 18 - "include"
Cohesion: 0.20
Nodes (9): node_modules/**, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 19 - "season-year-group.tsx"
Cohesion: 0.23
Nodes (9): getSeasonInfo(), SEASON_META, SeasonsExplorer(), SeasonsExplorerProps, Season, SeasonYearGroup(), SeasonYearGroupProps, TaxonomyCard() (+1 more)

### Community 21 - "ignore"
Cohesion: 0.29
Nodes (7): files, ignore, ignoreUnknown, coverage/**, dist/**, pnpm-lock.yaml, public/**

### Community 22 - "home-content.tsx"
Cohesion: 0.31
Nodes (5): RecommendedSkeleton(), FeaturedHero(), FeaturedHeroProps, LatestGrid(), RecommendationSection()

### Community 23 - "genres-explorer.tsx"
Cohesion: 0.28
Nodes (7): GENRE_DICTIONARY, GenreMeta, GenresExplorer(), GenresExplorerProps, getGenreMeta(), Genre, Recommendation

### Community 24 - "formatter"
Cohesion: 0.40
Nodes (5): formatter, enabled, indentStyle, indentWidth, lineWidth

### Community 25 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - "endpoint-slug.ts"
Cohesion: 0.25
Nodes (8): sitemap(), DetailMeta(), MetaItemProps, NewSeriesAnime(), RecommendedAnime(), getRecommendations(), animeSlug(), endpointSlug()

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

### Community 31 - "detail-skeleton.tsx"
Cohesion: 0.36
Nodes (3): DetailDownloadSkeleton(), DetailHeroSkeleton(), DetailSkeleton()

### Community 33 - "useTranslation"
Cohesion: 0.11
Nodes (26): clientSearchCache, CommandPalette(), getRecentSearches(), saveRecentSearch(), CompareAnimeClient(), CompareAnimeClientProps, PRESET_COMPARISONS, DownloadIcon() (+18 more)

### Community 34 - "offline-indicator.tsx"
Cohesion: 0.83
Nodes (3): getOnlineSnapshot(), OfflineIndicator(), subscribeOnline()

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

## Knowledge Gaps
- **218 isolated node(s):** `USER_AGENTS`, `httpAgent`, `httpsAgent`, `RetryConfig`, `MemoryCacheEntry` (+213 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `seo.ts` to `getAnimeDetail`, `endpoint-slug.ts`, `ignore`, `[page]/page.tsx`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `seo.ts`, `include`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **What connects `USER_AGENTS`, `httpAgent`, `httpsAgent` to the rest of the system?**
  _218 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `scraper/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05858585858585859 - nodes in this community are weakly interconnected._
- **Should `MainLayout` be split into smaller, more focused modules?**
  _Cohesion score 0.1471861471861472 - nodes in this community are weakly interconnected._
- **Should `interfaces/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07067307692307692 - nodes in this community are weakly interconnected._