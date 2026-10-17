# Graph Report - kokunime  (2026-10-18)

## Corpus Check
- 362 files · ~104,336 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1389 nodes · 3181 edges · 82 communities (73 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0e056193`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sanitize.ts
- main-layout.tsx
- anime-image.tsx
- icons/index.ts
- reveal.tsx
- scripts
- bookmarks/page.tsx
- settings.ts
- style
- site.ts
- devDependencies
- anime-grid.tsx
- detail-hero.tsx
- scraper/index.ts
- compilerOptions
- seo.ts
- animeSlug
- formatter
- release-inbox.ts
- find-unused-exports.mjs
- error-card.tsx
- ignore
- report-vitals/route.ts
- endpointSlug
- biome.json
- next.config.mjs
- .next/**
- home-content.tsx
- format-date.ts
- feed-items.ts
- rules
- safeJsonLd
- cache.ts
- recommendation-section.tsx
- layout.tsx
- dependencies
- bundle-budget.mjs
- a11y
- api-auth.ts
- suspicious
- postcss.config.js
- sw.js
- backup-cache.mjs
- e2e-smoke.mjs
- load-test.mjs
- complexity
- interfaces/index.ts
- renderOgCard
- useTranslation
- post-commit
- post-checkout
- update/page.tsx
- compare/page.tsx
- ADR 0001 — Three-tier cache with stale-while-revalidate
- package.json
- api/page.tsx
- Deployment
- search-index.ts
- ADR 0002 — Redis is optional; every feature degrades gracefully
- ADR 0003 — Local search index merged into upstream results
- canary.sh script
- live/route.ts
- middleware.ts
- AGENTS.md
- pre-commit
- ADR 0004 — CSP ships Report-Only, with nonce and Trusted Types in the policy
- ADR 0005 — Hand-written service worker with per-tier caches
- find-client-unnecessary.mjs
- genres/page.tsx

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 30 edges
2. `animeSlug()` - 28 edges
3. `checkEtagMatch()` - 27 edges
4. `generateEtag()` - 27 edges
5. `.next/**` - 27 edges
6. `safeJsonLd()` - 25 edges
7. `checkRateLimit()` - 23 edges
8. `SITE_URL` - 23 edges
9. `scripts` - 22 edges
10. `BookmarksPage()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `ContinueWatching()` --indirect_call--> `subscribeProgress()`  [INFERRED]
  src/components/anime/continue-watching.tsx → src/utils/progress.ts
- `EpisodeNavigator()` --indirect_call--> `subscribeProgress()`  [INFERRED]
  src/components/anime/episode-navigator.tsx → src/utils/progress.ts
- `EpisodeWatchedToggle()` --indirect_call--> `subscribeProgress()`  [INFERRED]
  src/components/anime/episode-watched-toggle.tsx → src/utils/progress.ts
- `generateMetadata()` --calls--> `buildDetailMetadata()`  [EXTRACTED]
  src/app/anime/[slug]/page.tsx → src/lib/detail-metadata.ts
- `Anime()` --calls--> `safeJsonLd()`  [EXTRACTED]
  src/app/anime/[slug]/page.tsx → src/lib/seo.ts

## Import Cycles
- None detected.

## Communities (82 total, 9 thin omitted)

### Community 0 - "sanitize.ts"
Cohesion: 0.07
Nodes (47): cleanFirstTitle(), dynamic, GET(), probe(), dynamic, GET(), upstream, cached() (+39 more)

### Community 1 - "main-layout.tsx"
Cohesion: 0.06
Nodes (26): DetailDownloadSkeleton(), DetailHeroSkeleton(), DetailSkeleton(), CardSkeleton(), GridSkeleton(), GridSkeletonProps, FloatingTopButton(), AboutBlock() (+18 more)

### Community 2 - "anime-image.tsx"
Cohesion: 0.27
Nodes (5): NewSeriesSkeleton(), AnimeImage(), AnimeImageProps, NewSeriesAnime(), isGif()

### Community 3 - "icons/index.ts"
Cohesion: 0.06
Nodes (34): CopyButton(), CopyButtonProps, DownloadPlatform(), getPlatformStyle(), requiresLogin(), ArrowDownIcon(), ChevronLeftIcon(), ChevronRightIcon() (+26 more)

### Community 4 - "reveal.tsx"
Cohesion: 0.32
Nodes (4): ReadingFocusMode(), ReadingFocusModeProps, Reveal(), RevealProps

### Community 5 - "scripts"
Cohesion: 0.09
Nodes (22): scripts, audit:client, backup:cache, build, bundle:budget, changelog, dev, docker:down (+14 more)

### Community 6 - "bookmarks/page.tsx"
Cohesion: 0.06
Nodes (80): BookmarksPage(), itemTime(), SERVER_BOOKMARKS, SERVER_HISTORY, SERVER_PROGRESS, metadata, metadata, BookmarkButton() (+72 more)

### Community 7 - "settings.ts"
Cohesion: 0.09
Nodes (33): metadata, AdminDashboard(), LogEntry, PRESET_PATHS, request(), BeforeInstallPromptEvent, PwaInstallBanner(), getRecent() (+25 more)

### Community 8 - "style"
Cohesion: 0.22
Nodes (9): style, noNonNullAssertion, noUnusedTemplateLiteral, useConst, useImportType, useNodejsImportProtocol, useNumberNamespace, useSelfClosingElements (+1 more)

### Community 9 - "site.ts"
Cohesion: 0.12
Nodes (11): dynamic, dynamic, revalidate, metadata, SECTIONS, openGraph, DEFAULT_OG_IMAGE, SITE_DESCRIPTION (+3 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): axe-core, @biomejs/biome, jsdom, lint-staged, devDependencies, axe-core, @biomejs/biome, jsdom (+17 more)

### Community 11 - "anime-grid.tsx"
Cohesion: 0.26
Nodes (7): EmptyState(), AnimeGrid(), AnimeGridProps, Anime, LatestGridProps, SearchResultsProps, SortOrder

### Community 12 - "detail-hero.tsx"
Cohesion: 0.14
Nodes (10): DetailHero(), DetailHeroProps, DetailHeroViewProps, ShareButtonProps, TrailerButtonProps, VerticalJapaneseTitle(), VerticalJapaneseTitleProps, compute() (+2 more)

### Community 13 - "scraper/index.ts"
Cohesion: 0.08
Nodes (55): BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), resolveBulk(), GET() (+47 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (30): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, tailwind.config.js (+22 more)

### Community 15 - "seo.ts"
Cohesion: 0.24
Nodes (9): Anime(), generateMetadata(), revalidate, ViewTracker(), buildDetailMetadata(), buildAnimeJsonLd(), buildBreadcrumbJsonLd(), buildFaqJsonLd() (+1 more)

### Community 16 - "animeSlug"
Cohesion: 0.18
Nodes (10): metadata, sitemap(), CardAnime(), GenreOption, RouletteContent(), ViewTransitionLink(), ViewTransitionLinkProps, FeaturedHero() (+2 more)

### Community 17 - "formatter"
Cohesion: 0.40
Nodes (5): quoteStyle, semicolons, trailingCommas, javascript, formatter

### Community 18 - "release-inbox.ts"
Cohesion: 0.28
Nodes (14): EMPTY, InboxBell(), ReleaseWatcher(), ReleaseWatcherProps, getReleaseSeen(), getStorage(), getUnreadReleases(), markReleasesRead() (+6 more)

### Community 19 - "find-unused-exports.mjs"
Cohesion: 0.18
Nodes (11): corpus, exportsByFile, files, ROOT, SCAN_DIRS, SKIP_EXPORTS, SRC_DIRS, textCache (+3 more)

### Community 20 - "error-card.tsx"
Cohesion: 0.27
Nodes (3): Suggestion, ErrorCard(), ErrorCardProps

### Community 21 - "ignore"
Cohesion: 0.25
Nodes (8): files, ignore, ignoreUnknown, node_modules/**, coverage/**, dist/**, pnpm-lock.yaml, public/**

### Community 22 - "report-vitals/route.ts"
Cohesion: 0.08
Nodes (29): dynamic, handleCspReport(), POST(), dynamic, VALID_NAMES, onRequestError(), register(), ErrorReport (+21 more)

### Community 23 - "endpointSlug"
Cohesion: 0.07
Nodes (31): SeasonsPage(), DetailMeta(), MetaItemProps, chipColors, GenreTags(), WatchOrderTimeline(), WatchOrderTimelineProps, GENRE_DICTIONARY (+23 more)

### Community 24 - "biome.json"
Cohesion: 0.15
Nodes (12): formatter, enabled, indentStyle, indentWidth, lineWidth, organizeImports, enabled, $schema (+4 more)

### Community 25 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - ".next/**"
Cohesion: 0.39
Nodes (5): .next/**, generateMetadata(), SearchAnime(), buildSearchMetadata(), decodeQuery()

### Community 27 - "home-content.tsx"
Cohesion: 0.21
Nodes (6): dynamic, TrendingEntry, TrendingRail(), HomeHeroSection(), HomeLatestSection(), HomeSectionProps

### Community 28 - "format-date.ts"
Cohesion: 0.50
Nodes (3): formatLocalizedDate(), MONTHS_EN, MONTHS_ID

### Community 29 - "feed-items.ts"
Cohesion: 0.33
Nodes (8): dynamic, GET(), dynamic, GET(), escapeXml(), FeedData, FeedEntry, getFeedData()

### Community 30 - "rules"
Cohesion: 0.20
Nodes (10): noUnusedVariables, useExhaustiveDependencies, useJsxKeyInIterable, linter, enabled, rules, correctness, recommended (+2 more)

### Community 31 - "safeJsonLd"
Cohesion: 0.16
Nodes (18): dynamic, generateMetadata(), GenrePage(), dynamic, generateMetadata(), SeasonPage(), metadata, SettingsPage() (+10 more)

### Community 32 - "cache.ts"
Cohesion: 0.05
Nodes (71): dynamic, GET(), POST(), dynamic, POST(), apqMemory, POST(), sha256() (+63 more)

### Community 33 - "recommendation-section.tsx"
Cohesion: 0.43
Nodes (3): RecommendedSkeleton(), RecommendedAnime(), getRecommendations()

### Community 34 - "layout.tsx"
Cohesion: 0.15
Nodes (9): jetBrainsMono, plusJakartaSans, RootLayout(), viewport, rules, SpeculationRules(), ServiceWorkerRegister(), metadata (+1 more)

### Community 35 - "dependencies"
Cohesion: 0.12
Nodes (17): axios, cheerio, husky, dependencies, axios, cheerio, husky, next (+9 more)

### Community 36 - "bundle-budget.mjs"
Cohesion: 0.27
Nodes (8): baseline, collect(), current, formatKb(), report(), statSize(), THRESHOLD, walk()

### Community 37 - "a11y"
Cohesion: 0.25
Nodes (8): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, a11y

### Community 39 - "suspicious"
Cohesion: 0.25
Nodes (8): suspicious, noArrayIndexKey, noAssignInExpressions, noControlCharactersInRegex, noExplicitAny, noGlobalIsNan, noMisleadingCharacterClass, noShadowRestrictedNames

### Community 41 - "sw.js"
Cohesion: 0.23
Nodes (11): API_SWR, broadcast(), KEEP_CACHES, notifyServedFromCache(), OFFLINE_PAGES, PRECACHE_URLS, readSavedMeta(), refreshSaved() (+3 more)

### Community 42 - "backup-cache.mjs"
Cohesion: 0.39
Nodes (7): args, backupCache(), backupDir(), exportRedis(), REDIS_URL, restoreBackup(), verifyBackups()

### Community 43 - "e2e-smoke.mjs"
Cohesion: 0.67
Nodes (3): checkRoute(), routes, runSmokeTests()

### Community 47 - "complexity"
Cohesion: 0.40
Nodes (5): noExtraBooleanCast, noForEach, useLiteralKeys, useOptionalChain, complexity

### Community 51 - "interfaces/index.ts"
Cohesion: 0.06
Nodes (46): BatchDownloadToolsProps, ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), DownloadGuideModal() (+38 more)

### Community 57 - "renderOgCard"
Cohesion: 0.07
Nodes (32): alt, contentType, Image(), runtime, size, alt, contentType, Image() (+24 more)

### Community 58 - "useTranslation"
Cohesion: 0.07
Nodes (48): OfflinePage(), DetailToc(), SECTIONS, registerRefreshSync(), SaveOfflineButton(), SaveOfflineButtonProps, CompareAnimeClient(), CompareAnimeClientProps (+40 more)

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 61 - "update/page.tsx"
Cohesion: 0.25
Nodes (8): BUCKET_META, metadata, revalidate, UpdatePage(), AgeBucket, NUMBER_WORDS, parseRelativeAge(), RelativeAge

### Community 62 - "compare/page.tsx"
Cohesion: 0.20
Nodes (10): alt, contentType, Image(), runtime, size, ComparePage(), ComparePageProps, dynamic (+2 more)

### Community 63 - "ADR 0001 — Three-tier cache with stale-while-revalidate"
Cohesion: 0.40
Nodes (4): ADR 0001 — Three-tier cache with stale-while-revalidate, Consequences, Context, Decision

### Community 64 - "package.json"
Cohesion: 0.20
Nodes (9): author, lint-staged, **/*.{js,jsx,ts,tsx,json,css}, name, packageManager, private, type, version (+1 more)

### Community 65 - "api/page.tsx"
Cohesion: 0.25
Nodes (6): ApiDocsPage(), ENDPOINTS, metadata, ApiEndpoint, ApiTesterProps, CodeLang

### Community 66 - "Deployment"
Cohesion: 0.33
Nodes (5): Deployment, Manual deploy / rollback, Repository configuration, SEO ping, Server prerequisites

### Community 67 - "search-index.ts"
Cohesion: 0.12
Nodes (25): clientSearchCache, CommandPalette(), getRecentSearches(), saveRecentSearch(), mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias(), SEARCH_ALIASES (+17 more)

### Community 68 - "ADR 0002 — Redis is optional; every feature degrades gracefully"
Cohesion: 0.40
Nodes (4): ADR 0002 — Redis is optional; every feature degrades gracefully, Consequences, Context, Decision

### Community 69 - "ADR 0003 — Local search index merged into upstream results"
Cohesion: 0.40
Nodes (4): ADR 0003 — Local search index merged into upstream results, Consequences, Context, Decision

### Community 70 - "canary.sh script"
Cohesion: 0.40
Nodes (4): canary.sh script, write_conf(), KOKUNIME_TAG, deploy.sh script

### Community 76 - "ADR 0004 — CSP ships Report-Only, with nonce and Trusted Types in the policy"
Cohesion: 0.40
Nodes (4): ADR 0004 — CSP ships Report-Only, with nonce and Trusted Types in the policy, Consequences, Context, Decision

### Community 77 - "ADR 0005 — Hand-written service worker with per-tier caches"
Cohesion: 0.40
Nodes (4): ADR 0005 — Hand-written service worker with per-tier caches, Consequences, Context, Decision

## Knowledge Gaps
- **388 isolated node(s):** `Context`, `Decision`, `Consequences`, `Context`, `Decision` (+383 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `api/page.tsx`, `layout.tsx`, `bookmarks/page.tsx`, `settings.ts`, `site.ts`, `seo.ts`, `genres/page.tsx`, `animeSlug`, `ignore`, `report-vitals/route.ts`, `endpointSlug`, `home-content.tsx`, `update/page.tsx`, `compare/page.tsx`, `safeJsonLd`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `.next/**`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Context`, `Decision`, `Consequences` to the rest of the system?**
  _388 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sanitize.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06859806859806859 - nodes in this community are weakly interconnected._
- **Should `main-layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.055299539170506916 - nodes in this community are weakly interconnected._