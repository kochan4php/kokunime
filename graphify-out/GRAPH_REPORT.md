# Graph Report - kokunime  (2026-10-17)

## Corpus Check
- 288 files · ~74,313 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1007 nodes · 2121 edges · 77 communities (64 shown, 13 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1168e1fc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- upstream.ts
- main-layout.tsx
- new-series-anime.tsx
- icons/index.ts
- section-detail.tsx
- scripts
- bookmarks/page.tsx
- settings.ts
- style
- site.ts
- devDependencies
- search.ts
- detail-hero.tsx
- scraper/index.ts
- compilerOptions
- seo.ts
- footer/index.tsx
- biome.json
- include
- interfaces/index.ts
- error-card.tsx
- ignore
- home-content.tsx
- endpoint-slug.ts
- formatter
- next.config.mjs
- .next/**
- defer-hydration.tsx
- format-date.ts
- vcs
- lib
- safeJsonLd
- cache.ts
- animeSlug
- layout.tsx
- html5-video-player.tsx
- smart-prefetch-link.tsx
- virtualized-grid.tsx
- api-auth.ts
- mirror-health.ts
- postcss.config.js
- sw.js
- e2e-smoke.mjs
- progress.ts
- [genre]/opengraph-image.tsx
- useTranslation
- post-commit
- post-checkout
- AnimeDetail
- [year]/page.tsx
- detail-skeleton.tsx
- reveal.tsx
- genres-explorer.tsx
- Deployment
- command-palette.tsx
- pwa-install-button.tsx
- offline-indicator.tsx
- deploy.sh
- live/route.ts
- middleware.ts
- AGENTS.md
- pre-commit

## God Nodes (most connected - your core abstractions)
1. `safeJsonLd()` - 21 edges
2. `scripts` - 20 edges
3. `MainLayout()` - 20 edges
4. `.next/**` - 20 edges
5. `stripHtmlNoise()` - 18 edges
6. `SITE_URL` - 18 edges
7. `buildSubpageBreadcrumbJsonLd()` - 17 edges
8. `compilerOptions` - 17 edges
9. `getBookmarks()` - 16 edges
10. `endpointSlug()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `BookmarksPage()` --indirect_call--> `getHistory()`  [INFERRED]
  src/app/bookmarks/page.tsx → src/utils/history.ts
- `BookmarksPage()` --indirect_call--> `subscribeHistory()`  [INFERRED]
  src/app/bookmarks/page.tsx → src/utils/history.ts
- `SearchResultsProps` --references--> `Anime`  [EXTRACTED]
  src/sections/search-results.tsx → src/interfaces/anime.ts
- `SeasonsExplorerProps` --references--> `Season`  [EXTRACTED]
  src/components/seasons-explorer.tsx → src/interfaces/reference.ts
- `CompareAnimeClientProps` --references--> `AnimeDetail`  [EXTRACTED]
  src/components/compare-anime-client.tsx → src/interfaces/anime.ts

## Import Cycles
- None detected.

## Communities (77 total, 13 thin omitted)

### Community 0 - "upstream.ts"
Cohesion: 0.06
Nodes (51): GET(), cleanFirstTitle(), dynamic, GET(), probe(), GET(), sitemap(), RetryConfig (+43 more)

### Community 1 - "main-layout.tsx"
Cohesion: 0.11
Nodes (9): FloatingTopButton(), HoneypotTrap(), KeyboardNavigation(), SHORTCUTS, BeforeInstallPromptEvent, PwaInstallBanner(), ScrollToTop(), MainLayout() (+1 more)

### Community 2 - "new-series-anime.tsx"
Cohesion: 0.29
Nodes (5): dynamic, GET(), NewSeriesSkeleton(), NewSeriesAnime(), getAnimePerPage()

### Community 3 - "icons/index.ts"
Cohesion: 0.08
Nodes (28): ArrowDownIcon(), ChevronLeftIcon(), ChevronRightIcon(), SearchIcon(), IconProps, Input(), SearchFormProps, PaginationInfo (+20 more)

### Community 4 - "section-detail.tsx"
Cohesion: 0.18
Nodes (9): SECTIONS, DownloadGuideModal(), DownloadSection(), EpisodeGallery(), EpisodeGalleryProps, SectionDetail(), ThemeSongsPlayer(), ThemeSongsPlayerProps (+1 more)

### Community 5 - "scripts"
Cohesion: 0.04
Nodes (46): axios, cheerio, husky, author, dependencies, axios, cheerio, husky (+38 more)

### Community 6 - "bookmarks/page.tsx"
Cohesion: 0.12
Nodes (39): BookmarksPage(), itemTime(), SERVER_BOOKMARKS, SERVER_HISTORY, BookmarkButton(), BookmarkButtonProps, CardAnime(), EMPTY_TOASTS (+31 more)

### Community 7 - "settings.ts"
Cohesion: 0.10
Nodes (32): CopyButton(), CopyButtonProps, DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), DownloadPlatform(), getPlatformStyle(), requiresLogin() (+24 more)

### Community 8 - "style"
Cohesion: 0.05
Nodes (38): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, noExtraBooleanCast (+30 more)

### Community 9 - "site.ts"
Cohesion: 0.11
Nodes (17): ENDPOINTS, metadata, dynamic, dynamic, escapeXml(), GET(), dynamic, ApiEndpoint (+9 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): axe-core, @biomejs/biome, jsdom, lint-staged, devDependencies, axe-core, @biomejs/biome, jsdom (+17 more)

### Community 11 - "search.ts"
Cohesion: 0.15
Nodes (17): generateMetadata(), SearchAnime(), EmptyState(), AnimeGrid(), mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias(), SEARCH_ALIASES (+9 more)

### Community 12 - "detail-hero.tsx"
Cohesion: 0.24
Nodes (6): ShareButton(), ShareButtonProps, TrailerButton(), TrailerButtonProps, VerticalJapaneseTitle(), VerticalJapaneseTitleProps

### Community 13 - "scraper/index.ts"
Cohesion: 0.08
Nodes (37): alt, contentType, Image(), runtime, size, POST(), GET(), GET() (+29 more)

### Community 14 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx, module (+8 more)

### Community 15 - "seo.ts"
Cohesion: 0.29
Nodes (8): Anime(), generateMetadata(), revalidate, buildDetailMetadata(), buildAnimeJsonLd(), buildBreadcrumbJsonLd(), buildFaqJsonLd(), truncate()

### Community 16 - "footer/index.tsx"
Cohesion: 0.21
Nodes (9): AboutBlock(), BackToTop(), BottomBar(), BrandBlock(), footerDevLinks, footerNavLinks, footerTags, Footer() (+1 more)

### Community 17 - "biome.json"
Cohesion: 0.18
Nodes (10): quoteStyle, semicolons, trailingCommas, javascript, formatter, linter, enabled, organizeImports (+2 more)

### Community 18 - "include"
Cohesion: 0.20
Nodes (9): node_modules/**, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 19 - "interfaces/index.ts"
Cohesion: 0.23
Nodes (8): Recommendation, Season, SeasonYearGroup(), SeasonYearGroupProps, TaxonomyCard(), TaxonomyCardProps, groupSeasonsByYear(), orderYears()

### Community 21 - "ignore"
Cohesion: 0.29
Nodes (7): files, ignore, ignoreUnknown, coverage/**, dist/**, pnpm-lock.yaml, public/**

### Community 22 - "home-content.tsx"
Cohesion: 0.15
Nodes (9): dynamic, CardSkeleton(), GridSkeleton(), GridSkeletonProps, RecommendedSkeleton(), HomeContent(), HomeSkeleton(), LatestGrid() (+1 more)

### Community 23 - "endpoint-slug.ts"
Cohesion: 0.21
Nodes (9): DetailMeta(), MetaItemProps, chipColors, GenreTags(), getSeasonInfo(), SEASON_META, SeasonsExplorer(), SeasonsExplorerProps (+1 more)

### Community 24 - "formatter"
Cohesion: 0.40
Nodes (5): formatter, enabled, indentStyle, indentWidth, lineWidth

### Community 25 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - ".next/**"
Cohesion: 0.17
Nodes (5): .next/**, ComparePageProps, dynamic, metadata, revalidate

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
Cohesion: 0.17
Nodes (15): ApiDocsPage(), ComparePage(), dynamic, generateMetadata(), GenrePage(), GenresPage(), SeasonsPage(), dynamic (+7 more)

### Community 32 - "cache.ts"
Cohesion: 0.09
Nodes (35): CIRCUIT_VALUE, dynamic, GET(), dynamic, GET(), UPSTREAM_CIRCUIT_KEY, BreakerEntry, breakers (+27 more)

### Community 33 - "animeSlug"
Cohesion: 0.20
Nodes (13): AnimeGridProps, AnimeImage(), AnimeImageProps, CompareAnimeClient(), CompareAnimeClientProps, PRESET_COMPARISONS, Anime, FeaturedHero() (+5 more)

### Community 34 - "layout.tsx"
Cohesion: 0.18
Nodes (7): jetBrainsMono, plusJakartaSans, RootLayout(), viewport, WebVitals(), metadata, buildWebSiteJsonLd()

### Community 43 - "e2e-smoke.mjs"
Cohesion: 0.67
Nodes (3): checkRoute(), routes, runSmokeTests()

### Community 51 - "progress.ts"
Cohesion: 0.13
Nodes (31): EpisodeWatchedToggle(), EpisodeWatchedToggleProps, HistoryTracker(), HistoryTrackerProps, EMPTY_HISTORY, EMPTY_PROGRESS, HomeHistoryStrip(), clearAllHistory() (+23 more)

### Community 57 - "[genre]/opengraph-image.tsx"
Cohesion: 0.10
Nodes (22): alt, contentType, Image(), runtime, size, alt, contentType, Image() (+14 more)

### Community 58 - "useTranslation"
Cohesion: 0.17
Nodes (16): MobileMenu(), MobileMenuProps, NAV_KEY_MAP, NAV_KEY_MAP, Navbar(), SiteLink, siteLinks, AppLanguage (+8 more)

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 61 - "AnimeDetail"
Cohesion: 0.19
Nodes (9): BatchDownloadToolsProps, DetailHeroProps, WatchOrderTimeline(), WatchOrderTimelineProps, AnimeDetail, AnimePage, DownloadOption, DownloadResolution (+1 more)

### Community 62 - "[year]/page.tsx"
Cohesion: 0.24
Nodes (5): collectYearAnime(), revalidate, YearPage(), AnimeListing(), AnimeListingProps

### Community 63 - "detail-skeleton.tsx"
Cohesion: 0.36
Nodes (3): DetailDownloadSkeleton(), DetailHeroSkeleton(), DetailSkeleton()

### Community 64 - "reveal.tsx"
Cohesion: 0.32
Nodes (4): ReadingFocusMode(), ReadingFocusModeProps, Reveal(), RevealProps

### Community 65 - "genres-explorer.tsx"
Cohesion: 0.38
Nodes (6): GENRE_DICTIONARY, GenreMeta, GenresExplorer(), GenresExplorerProps, getGenreMeta(), Genre

### Community 66 - "Deployment"
Cohesion: 0.33
Nodes (5): Deployment, Manual deploy / rollback, Repository configuration, SEO ping, Server prerequisites

### Community 67 - "command-palette.tsx"
Cohesion: 0.70
Nodes (4): clientSearchCache, CommandPalette(), getRecentSearches(), saveRecentSearch()

### Community 68 - "pwa-install-button.tsx"
Cohesion: 0.50
Nodes (3): DownloadIcon(), BeforeInstallPromptEvent, PwaInstallButton()

### Community 69 - "offline-indicator.tsx"
Cohesion: 0.83
Nodes (3): getOnlineSnapshot(), OfflineIndicator(), subscribeOnline()

## Knowledge Gaps
- **273 isolated node(s):** `This is NOT the Next.js you know`, `Repository configuration`, `Server prerequisites`, `Manual deploy / rollback`, `SEO ping` (+268 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `upstream.ts`, `layout.tsx`, `site.ts`, `search.ts`, `seo.ts`, `ignore`, `home-content.tsx`, `[year]/page.tsx`, `safeJsonLd`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `include`, `.next/**`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **What connects `This is NOT the Next.js you know`, `Repository configuration`, `Server prerequisites` to the rest of the system?**
  _273 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `upstream.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06426332288401254 - nodes in this community are weakly interconnected._
- **Should `main-layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11088709677419355 - nodes in this community are weakly interconnected._
- **Should `icons/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0784313725490196 - nodes in this community are weakly interconnected._