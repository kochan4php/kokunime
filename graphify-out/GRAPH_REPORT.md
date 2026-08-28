# Graph Report - kokunime  (2026-08-28)

## Corpus Check
- 239 files · ~61,896 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 830 nodes · 1789 edges · 49 communities (40 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9bfc4f54`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scraper/index.ts
- main-layout.tsx
- interfaces/index.ts
- section-detail.tsx
- scripts
- bookmarks/page.tsx
- settings.ts
- style
- seo.ts
- devDependencies
- [query]/page.tsx
- compilerOptions
- footer/index.tsx
- biome.json
- include
- error-card.tsx
- ignore
- formatter
- next.config.mjs
- getAnimePerPage
- defer-hydration.tsx
- format-date.ts
- vcs
- lib
- webhook-dispatcher.ts
- useTranslation
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
- `CompareAnimeClientProps` --references--> `AnimeDetail`  [EXTRACTED]
  src/components/compare-anime-client.tsx → src/interfaces/anime.ts
- `PaginatedHome()` --calls--> `getAnimePerPage()`  [EXTRACTED]
  src/app/page/[page]/page.tsx → src/services/scraper/anime-list.ts
- `exclude` --extends--> `node_modules/**`  [EXTRACTED]
  tsconfig.json → biome.json
- `GenresExplorerProps` --references--> `Genre`  [EXTRACTED]
  src/components/genres-explorer.tsx → src/interfaces/reference.ts
- `AnimeDetail` --references--> `Genre`  [EXTRACTED]
  src/interfaces/anime.ts → src/interfaces/reference.ts

## Import Cycles
- None detected.

## Communities (49 total, 9 thin omitted)

### Community 0 - "scraper/index.ts"
Cohesion: 0.05
Nodes (65): alt, contentType, Image(), runtime, size, GET(), GET(), GET() (+57 more)

### Community 1 - "main-layout.tsx"
Cohesion: 0.06
Nodes (23): dynamic, dynamic, PaginatedHome(), DetailDownloadSkeleton(), DetailHeroSkeleton(), DetailSkeleton(), CardSkeleton(), GridSkeleton() (+15 more)

### Community 3 - "interfaces/index.ts"
Cohesion: 0.06
Nodes (42): EmptyState(), AnimeGrid(), AnimeGridProps, AnimeImage(), AnimeImageProps, CardAnime(), ChevronLeftIcon(), ChevronRightIcon() (+34 more)

### Community 4 - "section-detail.tsx"
Cohesion: 0.06
Nodes (33): CopyButton(), CopyButtonProps, DetailHero(), DetailHeroProps, DetailToc(), SECTIONS, DownloadPlatform(), getPlatformStyle() (+25 more)

### Community 5 - "scripts"
Cohesion: 0.04
Nodes (45): axios, cheerio, husky, author, dependencies, axios, cheerio, husky (+37 more)

### Community 6 - "bookmarks/page.tsx"
Cohesion: 0.13
Nodes (36): BookmarksPage(), SERVER_BOOKMARKS, SERVER_HISTORY, BookmarkButton(), BookmarkButtonProps, HistoryTracker(), HistoryTrackerProps, EMPTY_HISTORY (+28 more)

### Community 7 - "settings.ts"
Cohesion: 0.10
Nodes (34): BatchDownloadTools(), BatchDownloadToolsProps, DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), DownloadGuideModal(), DownloadSection(), DEFAULT_STORAGE (+26 more)

### Community 8 - "style"
Cohesion: 0.05
Nodes (38): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, noExtraBooleanCast (+30 more)

### Community 9 - "seo.ts"
Cohesion: 0.06
Nodes (52): .next/**, Anime(), dynamic, generateMetadata(), ApiDocsPage(), ENDPOINTS, metadata, ComparePage() (+44 more)

### Community 10 - "devDependencies"
Cohesion: 0.10
Nodes (21): @biomejs/biome, lint-staged, devDependencies, @biomejs/biome, lint-staged, postcss, tailwindcss, @tailwindcss/postcss (+13 more)

### Community 13 - "[query]/page.tsx"
Cohesion: 0.16
Nodes (18): POST(), GET(), POST(), GET(), generateMetadata(), SearchAnime(), checkEtagMatch(), generateEtag() (+10 more)

### Community 14 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx, module (+8 more)

### Community 16 - "footer/index.tsx"
Cohesion: 0.21
Nodes (9): AboutBlock(), BackToTop(), BottomBar(), BrandBlock(), footerDevLinks, footerNavLinks, footerTags, Footer() (+1 more)

### Community 17 - "biome.json"
Cohesion: 0.18
Nodes (10): quoteStyle, semicolons, trailingCommas, javascript, formatter, linter, enabled, organizeImports (+2 more)

### Community 18 - "include"
Cohesion: 0.20
Nodes (9): node_modules/**, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 21 - "ignore"
Cohesion: 0.29
Nodes (7): files, ignore, ignoreUnknown, coverage/**, dist/**, pnpm-lock.yaml, public/**

### Community 24 - "formatter"
Cohesion: 0.40
Nodes (5): formatter, enabled, indentStyle, indentWidth, lineWidth

### Community 25 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - "getAnimePerPage"
Cohesion: 0.08
Nodes (29): dynamic, GET(), sitemap(), DetailMeta(), MetaItemProps, chipColors, GenreTags(), GENRE_DICTIONARY (+21 more)

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

### Community 33 - "useTranslation"
Cohesion: 0.11
Nodes (26): clientSearchCache, CommandPalette(), getRecentSearches(), saveRecentSearch(), CompareAnimeClient(), CompareAnimeClientProps, PRESET_COMPARISONS, DownloadIcon() (+18 more)

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

## Knowledge Gaps
- **217 isolated node(s):** `RetryConfig`, `MemoryCacheEntry`, `FallbackExtractResult`, `ImgLike`, `TaxonomyItem` (+212 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `seo.ts` to `main-layout.tsx`, `[query]/page.tsx`, `getAnimePerPage`, `ignore`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `seo.ts`, `include`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **What connects `RetryConfig`, `MemoryCacheEntry`, `FallbackExtractResult` to the rest of the system?**
  _217 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `scraper/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05204336947456213 - nodes in this community are weakly interconnected._
- **Should `main-layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05552617662612375 - nodes in this community are weakly interconnected._
- **Should `interfaces/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05809802012333658 - nodes in this community are weakly interconnected._