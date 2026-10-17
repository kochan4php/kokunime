# Graph Report - kokunime  (2026-10-17)

## Corpus Check
- 305 files · ~82,670 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1110 nodes · 2449 edges · 76 communities (66 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.66)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7b64350a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sanitize.ts
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
- Anime
- detail-hero.tsx
- cache.ts
- compilerOptions
- seo.ts
- footer/index.tsx
- biome.json
- include
- season-year-group.tsx
- error-card.tsx
- ignore
- report-vitals/route.ts
- animeSlug
- formatter
- next.config.mjs
- .next/**
- toast.ts
- format-date.ts
- vcs
- lib
- anime-listing.tsx
- upstream.ts
- anime-image.tsx
- layout.tsx
- dependencies
- smart-prefetch-link.tsx
- download-group.tsx
- api-auth.ts
- interfaces/index.ts
- postcss.config.js
- sw.js
- backup-cache.mjs
- e2e-smoke.mjs
- progress.ts
- [genre]/opengraph-image.tsx
- useTranslation
- post-commit
- post-checkout
- update/page.tsx
- safeJsonLd
- compare-anime-client.tsx
- package.json
- api/page.tsx
- Deployment
- command-palette.tsx
- continue-watching.tsx
- seasons/page.tsx
- deploy.sh
- live/route.ts
- middleware.ts
- AGENTS.md
- pre-commit

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 26 edges
2. `safeJsonLd()` - 25 edges
3. `.next/**` - 22 edges
4. `MainLayout()` - 20 edges
5. `scripts` - 20 edges
6. `SITE_URL` - 20 edges
7. `BookmarksPage()` - 19 edges
8. `buildSubpageBreadcrumbJsonLd()` - 19 edges
9. `animeSlug()` - 19 edges
10. `compilerOptions` - 17 edges

## Surprising Connections (you probably didn't know these)
- `BookmarksPage()` --indirect_call--> `subscribeProgress()`  [INFERRED]
  src/app/bookmarks/page.tsx → src/utils/progress.ts
- `EpisodeWatchedToggle()` --indirect_call--> `subscribeProgress()`  [INFERRED]
  src/components/anime/episode-watched-toggle.tsx → src/utils/progress.ts
- `HomeHistoryStrip()` --indirect_call--> `getProgressList()`  [INFERRED]
  src/components/home-history-strip.tsx → src/utils/progress.ts
- `HomeHistoryStrip()` --indirect_call--> `subscribeProgress()`  [INFERRED]
  src/components/home-history-strip.tsx → src/utils/progress.ts
- `SeasonYearGroup()` --calls--> `endpointSlug()`  [EXTRACTED]
  src/sections/season-year-group.tsx → src/utils/endpoint-slug.ts

## Import Cycles
- None detected.

## Communities (76 total, 10 thin omitted)

### Community 0 - "sanitize.ts"
Cohesion: 0.09
Nodes (30): BatchDownloadToolsProps, GenresExplorerProps, AnimePage, DownloadOption, DownloadResolution, DownloadTarget, Genre, Recommendation (+22 more)

### Community 1 - "main-layout.tsx"
Cohesion: 0.05
Nodes (27): dynamic, DetailDownloadSkeleton(), DetailHeroSkeleton(), DetailSkeleton(), CardSkeleton(), GridSkeleton(), GridSkeletonProps, FloatingTopButton() (+19 more)

### Community 2 - "new-series-anime.tsx"
Cohesion: 0.29
Nodes (5): dynamic, GET(), NewSeriesSkeleton(), NewSeriesAnime(), getAnimePerPage()

### Community 3 - "icons/index.ts"
Cohesion: 0.07
Nodes (33): CopyButton(), CopyButtonProps, DownloadPlatform(), getPlatformStyle(), requiresLogin(), ChevronLeftIcon(), ChevronRightIcon(), DownloadIcon() (+25 more)

### Community 4 - "section-detail.tsx"
Cohesion: 0.13
Nodes (12): EpisodeGallery(), EpisodeGalleryProps, ReadingFocusMode(), ReadingFocusModeProps, SectionDetail(), ThemeSongsPlayer(), ThemeSongsPlayerProps, WatchOrderTimeline() (+4 more)

### Community 5 - "scripts"
Cohesion: 0.10
Nodes (20): scripts, backup:cache, build, changelog, dev, docker:down, docker:up, e2e (+12 more)

### Community 6 - "bookmarks/page.tsx"
Cohesion: 0.10
Nodes (45): BookmarksPage(), itemTime(), SERVER_BOOKMARKS, SERVER_HISTORY, SERVER_PROGRESS, BookmarkButton(), BookmarkButtonProps, CardAnime() (+37 more)

### Community 7 - "settings.ts"
Cohesion: 0.19
Nodes (21): DEFAULT_STORAGE, SettingsPageContent(), ACCENT_PRESETS, AccentColor, AppLanguage, applySettingsToDom(), AppSettings, calculateStorageBreakdown() (+13 more)

### Community 8 - "style"
Cohesion: 0.05
Nodes (38): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, noExtraBooleanCast (+30 more)

### Community 9 - "site.ts"
Cohesion: 0.12
Nodes (12): dynamic, dynamic, escapeXml(), GET(), dynamic, revalidate, openGraph, DEFAULT_OG_IMAGE (+4 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): axe-core, @biomejs/biome, jsdom, lint-staged, devDependencies, axe-core, @biomejs/biome, jsdom (+17 more)

### Community 11 - "Anime"
Cohesion: 0.19
Nodes (10): EmptyState(), AnimeGrid(), AnimeGridProps, Reveal(), RevealProps, Anime, FeaturedHeroProps, SearchResults() (+2 more)

### Community 12 - "detail-hero.tsx"
Cohesion: 0.18
Nodes (6): DetailHero(), DetailHeroProps, ShareButtonProps, TrailerButtonProps, VerticalJapaneseTitle(), VerticalJapaneseTitleProps

### Community 13 - "cache.ts"
Cohesion: 0.05
Nodes (70): alt, contentType, Image(), runtime, size, POST(), GET(), GET() (+62 more)

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

### Community 19 - "season-year-group.tsx"
Cohesion: 0.23
Nodes (9): getSeasonInfo(), SEASON_META, SeasonsExplorer(), SeasonsExplorerProps, Season, SeasonYearGroup(), SeasonYearGroupProps, TaxonomyCard() (+1 more)

### Community 21 - "ignore"
Cohesion: 0.29
Nodes (7): files, ignore, ignoreUnknown, coverage/**, dist/**, pnpm-lock.yaml, public/**

### Community 22 - "report-vitals/route.ts"
Cohesion: 0.11
Nodes (22): dynamic, POST(), VALID_NAMES, onRequestError(), register(), ErrorReport, lastSent, reportError() (+14 more)

### Community 23 - "animeSlug"
Cohesion: 0.19
Nodes (11): sitemap(), DetailMeta(), MetaItemProps, chipColors, GenreTags(), GENRE_DICTIONARY, GenreMeta, GenresExplorer() (+3 more)

### Community 24 - "formatter"
Cohesion: 0.40
Nodes (5): formatter, enabled, indentStyle, indentWidth, lineWidth

### Community 25 - "next.config.mjs"
Cohesion: 0.40
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - ".next/**"
Cohesion: 0.36
Nodes (6): .next/**, generateMetadata(), SearchAnime(), buildSearchMetadata(), decodeQuery(), searchAnime()

### Community 27 - "toast.ts"
Cohesion: 0.15
Nodes (21): EMPTY_TOASTS, Toaster(), UpdateIcsButton(), buildWeeklyReminderIcs(), CalendarEvent, djb2(), escapeIcs(), foldLine() (+13 more)

### Community 28 - "format-date.ts"
Cohesion: 0.50
Nodes (3): formatLocalizedDate(), MONTHS_EN, MONTHS_ID

### Community 29 - "vcs"
Cohesion: 0.50
Nodes (4): vcs, clientKind, enabled, useIgnoreFile

### Community 30 - "lib"
Cohesion: 0.50
Nodes (4): dom, dom.iterable, esnext, lib

### Community 31 - "anime-listing.tsx"
Cohesion: 0.21
Nodes (10): dynamic, generateMetadata(), GenrePage(), dynamic, generateMetadata(), SeasonPage(), buildItemListJsonLd(), AnimeListing() (+2 more)

### Community 32 - "upstream.ts"
Cohesion: 0.06
Nodes (53): dynamic, POST(), cleanFirstTitle(), dynamic, GET(), probe(), CIRCUIT_VALUE, dynamic (+45 more)

### Community 33 - "anime-image.tsx"
Cohesion: 0.21
Nodes (9): AnimeImage(), AnimeImageProps, RecommendedSkeleton(), FeaturedHero(), LatestGrid(), RecommendationSection(), RecommendedAnime(), getRecommendations() (+1 more)

### Community 34 - "layout.tsx"
Cohesion: 0.18
Nodes (7): jetBrainsMono, plusJakartaSans, RootLayout(), viewport, WebVitals(), metadata, buildWebSiteJsonLd()

### Community 35 - "dependencies"
Cohesion: 0.12
Nodes (17): axios, cheerio, husky, dependencies, axios, cheerio, husky, next (+9 more)

### Community 37 - "download-group.tsx"
Cohesion: 0.30
Nodes (9): DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), EpisodeWatchedToggle(), EpisodeWatchedToggleProps, isEpisodeWatched(), toggleEpisodeWatched(), subscribeSettings() (+1 more)

### Community 39 - "interfaces/index.ts"
Cohesion: 0.33
Nodes (5): DownloadGuideModal(), DownloadSection(), parseEpisodeRange(), listEpisodeNumbers(), anime

### Community 42 - "backup-cache.mjs"
Cohesion: 0.83
Nodes (3): backupCache(), backupDir(), verifyBackups()

### Community 43 - "e2e-smoke.mjs"
Cohesion: 0.67
Nodes (3): checkRoute(), routes, runSmokeTests()

### Community 51 - "progress.ts"
Cohesion: 0.25
Nodes (16): HistoryTracker(), HistoryTrackerProps, clearAllProgress(), EMPTY_PROGRESS, getProgress(), getProgressList(), getStorage(), getWatchedCount() (+8 more)

### Community 57 - "[genre]/opengraph-image.tsx"
Cohesion: 0.10
Nodes (22): alt, contentType, Image(), runtime, size, alt, contentType, Image() (+14 more)

### Community 58 - "useTranslation"
Cohesion: 0.15
Nodes (18): DetailToc(), SECTIONS, MobileMenu(), MobileMenuProps, NAV_KEY_MAP, NAV_KEY_MAP, Navbar(), SiteLink (+10 more)

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 61 - "update/page.tsx"
Cohesion: 0.25
Nodes (8): BUCKET_META, metadata, revalidate, UpdatePage(), AgeBucket, NUMBER_WORDS, parseRelativeAge(), RelativeAge

### Community 62 - "safeJsonLd"
Cohesion: 0.18
Nodes (12): ComparePage(), ComparePageProps, dynamic, metadata, GenresPage(), metadata, SettingsPage(), collectYearAnime() (+4 more)

### Community 63 - "compare-anime-client.tsx"
Cohesion: 0.33
Nodes (8): CompareAnimeClient(), CompareAnimeClientProps, PRESET_COMPARISONS, extractYear(), genreSet(), numeric(), SimilarInput, similarityScore()

### Community 64 - "package.json"
Cohesion: 0.20
Nodes (9): author, lint-staged, **/*.{js,jsx,ts,tsx,json,css}, name, packageManager, private, type, version (+1 more)

### Community 65 - "api/page.tsx"
Cohesion: 0.28
Nodes (7): ApiDocsPage(), ENDPOINTS, metadata, ApiEndpoint, ApiTester(), ApiTesterProps, CodeLang

### Community 66 - "Deployment"
Cohesion: 0.33
Nodes (5): Deployment, Manual deploy / rollback, Repository configuration, SEO ping, Server prerequisites

### Community 67 - "command-palette.tsx"
Cohesion: 0.40
Nodes (7): clientSearchCache, CommandPalette(), getRecentSearches(), saveRecentSearch(), fuzzyScore(), HighlightSegment, highlightSegments()

### Community 68 - "continue-watching.tsx"
Cohesion: 0.39
Nodes (7): ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), EpisodeNavigator(), EpisodeNavigatorProps, nextUnwatchedEpisode(), subscribeProgress()

### Community 69 - "seasons/page.tsx"
Cohesion: 0.57
Nodes (3): SeasonsPage(), groupSeasonsByYear(), orderYears()

## Knowledge Gaps
- **295 isolated node(s):** `Repository configuration`, `Server prerequisites`, `Manual deploy / rollback`, `SEO ping`, `securityHeaders` (+290 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `api/page.tsx`, `layout.tsx`, `main-layout.tsx`, `seasons/page.tsx`, `site.ts`, `seo.ts`, `ignore`, `report-vitals/route.ts`, `animeSlug`, `update/page.tsx`, `safeJsonLd`, `anime-listing.tsx`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `include`, `.next/**`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Repository configuration`, `Server prerequisites`, `Manual deploy / rollback` to the rest of the system?**
  _295 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sanitize.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08583959899749373 - nodes in this community are weakly interconnected._
- **Should `main-layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.051923076923076926 - nodes in this community are weakly interconnected._