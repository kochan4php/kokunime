# Graph Report - kokunime  (2026-10-18)

## Corpus Check
- 465 files · ~138,730 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1855 nodes · 4155 edges · 130 communities (118 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eda0bccb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sanitize.ts
- main-layout.tsx
- animeSlug
- icons/index.ts
- reveal.tsx
- scripts
- genres-explorer.tsx
- useTranslation
- style
- site.ts
- devDependencies
- anime-image.tsx
- progress.ts
- scraper/index.ts
- compilerOptions
- [slug]/page.tsx
- roulette-content.tsx
- formatter
- release-inbox.ts
- find-unused-exports.mjs
- route-error.tsx
- ignore
- vitals-reporter.ts
- seasons/page.tsx
- biome.json
- next.config.mjs
- offline/layout.tsx
- detail-hero.tsx
- format-date.ts
- sitemap-entries.ts
- rules
- .next/**
- download-group.tsx
- command-palette.tsx
- app/layout.tsx
- dependencies
- bundle-budget.mjs
- a11y
- season-window.ts
- suspicious
- postcss.config.js
- sw.js
- backup-cache.mjs
- e2e-smoke.mjs
- load-test.mjs
- complexity
- toast.ts
- download-extras-panel.tsx
- vitest.config.ts
- compare/opengraph-image.tsx
- recommendation-section.tsx
- post-commit
- post-checkout
- interfaces/index.ts
- compare/page.tsx
- ADR 0001 — Three-tier cache with stale-while-revalidate
- package.json
- feature-flags.ts
- Deployment
- subscribeProgress
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
- upstream.ts
- toTitle
- bookmarks/page.tsx
- status/route.ts
- revalidate/route.ts
- search-results.tsx
- section-detail.tsx
- renderOgCard
- cache.ts
- roulette/opengraph-image.tsx
- detail-skeleton.tsx
- metrics.ts
- endpointSlug
- search-index.ts
- offline-indicator.tsx
- home-content.tsx
- stats/opengraph-image.tsx
- audit-meta.mjs
- og-card.tsx
- 🚑 RUNBOOK — Kokunime Operations
- wrapped/opengraph-image.tsx
- 🚀 API Quickstart
- Arsitektur
- scan-secrets.mjs
- health/route.ts
- [year]/opengraph-image.tsx
- warm-cache.mjs
- CONTRIBUTING.md
- ADR 0008 — CSP enforcement is a switch (`CSP_ENFORCE=1`), Trusted Types included
- check-licenses.mjs
- version-bump.mjs
- formatter
- ADR 0006 — `cacheComponents` / PPR stays off; routes are explicitly dynamic
- ADR 0007 — Upstream HTTP is fetch-native; axios is gone
- ADR 0009 — Module size budget + dead-export policy
- ADR 0010 — Vitest runs as two projects (node + dom) and CI shards them
- Dependensi
- Matriks Environment Variable
- assert-artifact.mjs
- file-size-budget.mjs
- find-untested.mjs
- indexnow.mjs
- validate-cache.mjs
- rollback.sh
- commit-msg
- check-commit-msg.mjs
- lint-staged-chunk.mjs

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 50 edges
2. `.next/**` - 29 edges
3. `animeSlug()` - 28 edges
4. `SITE_URL` - 28 edges
5. `checkEtagMatch()` - 27 edges
6. `generateEtag()` - 27 edges
7. `checkRateLimit()` - 25 edges
8. `safeJsonLd()` - 25 edges
9. `endpointSlug()` - 25 edges
10. `scripts` - 25 edges

## Surprising Connections (you probably didn't know these)
- `SeasonYearGroupProps` --references--> `Season`  [EXTRACTED]
  src/sections/season-year-group.tsx → src/interfaces/reference.ts
- `Image()` --calls--> `renderOgCard()`  [EXTRACTED]
  src/app/update/opengraph-image.tsx → src/lib/og-card.tsx
- `Image()` --calls--> `renderOgCard()`  [EXTRACTED]
  src/app/wrapped/opengraph-image.tsx → src/lib/og-card.tsx
- `Image()` --calls--> `renderOgCard()`  [EXTRACTED]
  src/app/years/[year]/opengraph-image.tsx → src/lib/og-card.tsx
- `SeasonYearGroup()` --calls--> `endpointSlug()`  [EXTRACTED]
  src/sections/season-year-group.tsx → src/utils/endpoint-slug.ts

## Import Cycles
- None detected.

## Communities (130 total, 12 thin omitted)

### Community 0 - "sanitize.ts"
Cohesion: 0.07
Nodes (47): mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias(), SEARCH_ALIASES, cached(), CacheTier, TTL, getAnimeDetailWithMeta() (+39 more)

### Community 1 - "main-layout.tsx"
Cohesion: 0.14
Nodes (5): FloatingTopButton(), HoneypotTrap(), ScrollToTop(), MainLayout(), ListingSkeleton()

### Community 2 - "animeSlug"
Cohesion: 0.27
Nodes (8): dynamic, GET(), buildItemListJsonLd(), AnimeListing(), AnimeListingProps, NewSeriesAnime(), getAnimePerPage(), animeSlug()

### Community 3 - "icons/index.ts"
Cohesion: 0.05
Nodes (37): AboutBlock(), BackToTop(), BottomBar(), BrandBlock(), footerDevLinks, footerNavLinks, footerTags, Footer() (+29 more)

### Community 4 - "reveal.tsx"
Cohesion: 0.15
Nodes (9): NewSeriesSkeleton(), ReadingFocusMode(), ReadingFocusModeProps, Reveal(), RevealProps, SeasonYearGroup(), SeasonYearGroupProps, TaxonomyCard() (+1 more)

### Community 5 - "scripts"
Cohesion: 0.08
Nodes (25): scripts, audit:client, audit:meta, backup:cache, build, bundle:budget, changelog, dev (+17 more)

### Community 6 - "genres-explorer.tsx"
Cohesion: 0.15
Nodes (14): WatchOrderTimeline(), WatchOrderTimelineProps, GENRE_DICTIONARY, GenreMeta, GenresExplorer(), GenresExplorerProps, getGenreMeta(), AnimeDetail (+6 more)

### Community 7 - "useTranslation"
Cohesion: 0.05
Nodes (71): DetailToc(), SECTIONS, CompareAnimeClient(), CompareAnimeClientProps, PRESET_COMPARISONS, Side, CompareAnimeCard(), CompareAnimeCardProps (+63 more)

### Community 8 - "style"
Cohesion: 0.22
Nodes (9): style, noNonNullAssertion, noUnusedTemplateLiteral, useConst, useImportType, useNodejsImportProtocol, useNumberNamespace, useSelfClosingElements (+1 more)

### Community 9 - "site.ts"
Cohesion: 0.07
Nodes (20): RFC-9116, ENDPOINTS, metadata, dynamic, dynamic, revalidate, metadata, SECTIONS (+12 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): axe-core, @biomejs/biome, jsdom, lint-staged, devDependencies, axe-core, @biomejs/biome, jsdom (+17 more)

### Community 11 - "anime-image.tsx"
Cohesion: 0.21
Nodes (9): AnimeImage(), AnimeImageProps, CardAnime(), AnimeSearchField(), AnimeSearchFieldProps, ViewTransitionLink(), ViewTransitionLinkProps, FeaturedHeroProps (+1 more)

### Community 12 - "progress.ts"
Cohesion: 0.26
Nodes (15): HistoryTracker(), HistoryTrackerProps, clearAllProgress(), EMPTY_PROGRESS, getProgress(), getProgressList(), getStorage(), getWatchedCount() (+7 more)

### Community 13 - "scraper/index.ts"
Cohesion: 0.06
Nodes (77): RFC-9457, BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), POST_DEPRECATION_HEADERS (+69 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts (+24 more)

### Community 15 - "[slug]/page.tsx"
Cohesion: 0.22
Nodes (10): Anime(), generateMetadata(), revalidate, ViewTracker(), buildDetailMetadata(), buildAnimeJsonLd(), buildBreadcrumbJsonLd(), buildFaqJsonLd() (+2 more)

### Community 16 - "roulette-content.tsx"
Cohesion: 0.47
Nodes (5): GenreOption, readSpinHistory(), RouletteContent(), RouletteSpin, writeSpinHistory()

### Community 17 - "formatter"
Cohesion: 0.40
Nodes (5): quoteStyle, semicolons, trailingCommas, javascript, formatter

### Community 18 - "release-inbox.ts"
Cohesion: 0.07
Nodes (35): metadata, generateMetadata(), SearchAnime(), AdminDashboard(), FeatureFlagView, PRESET_PATHS, EMPTY, InboxBell() (+27 more)

### Community 19 - "find-unused-exports.mjs"
Cohesion: 0.18
Nodes (11): corpus, exportsByFile, files, ROOT, SCAN_DIRS, SKIP_EXPORTS, SRC_DIRS, textCache (+3 more)

### Community 20 - "route-error.tsx"
Cohesion: 0.12
Nodes (5): Suggestion, ErrorCard(), ErrorCardProps, RouteError(), RouteErrorProps

### Community 21 - "ignore"
Cohesion: 0.22
Nodes (9): files, ignore, ignoreUnknown, node_modules/**, coverage/**, dist/**, graphify-out/**, pnpm-lock.yaml (+1 more)

### Community 22 - "vitals-reporter.ts"
Cohesion: 0.07
Nodes (37): dynamic, GET(), WebVitals(), EnvIssue, isHttpUrl(), isRedisUrl(), validateEnv(), onRequestError() (+29 more)

### Community 23 - "seasons/page.tsx"
Cohesion: 0.44
Nodes (5): SeasonsPage(), Season, getSeasons(), groupSeasonsByYear(), orderYears()

### Community 24 - "biome.json"
Cohesion: 0.22
Nodes (8): organizeImports, enabled, overrides, $schema, vcs, clientKind, enabled, useIgnoreFile

### Community 25 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 27 - "detail-hero.tsx"
Cohesion: 0.13
Nodes (13): CopyButton(), CopyButtonProps, DetailHero(), DetailHeroProps, DetailHeroViewProps, DownloadPlatform(), getPlatformStyle(), requiresLogin() (+5 more)

### Community 28 - "format-date.ts"
Cohesion: 0.50
Nodes (3): formatLocalizedDate(), MONTHS_EN, MONTHS_ID

### Community 29 - "sitemap-entries.ts"
Cohesion: 0.18
Nodes (15): dynamic, GET(), dynamic, GET(), dynamic, GET(), GET(), GET() (+7 more)

### Community 30 - "rules"
Cohesion: 0.20
Nodes (10): noUnusedVariables, useExhaustiveDependencies, useJsxKeyInIterable, linter, enabled, rules, correctness, recommended (+2 more)

### Community 31 - ".next/**"
Cohesion: 0.10
Nodes (23): .next/**, ApiDocsPage(), dynamic, GenrePage(), GenresPage(), dynamic, metadata, SettingsPage() (+15 more)

### Community 32 - "download-group.tsx"
Cohesion: 0.21
Nodes (13): DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), EpisodeWatchedToggle(), EpisodeWatchedToggleProps, episodeAnchors(), KeyboardNavigation(), nearestEpisodeAnchor() (+5 more)

### Community 33 - "command-palette.tsx"
Cohesion: 0.24
Nodes (12): CommandPalette(), clientSearchCache, useCommandPalette(), UseCommandPaletteResult, fuzzyScore(), HighlightSegment, highlightSegments(), clearRecentSearches() (+4 more)

### Community 34 - "app/layout.tsx"
Cohesion: 0.18
Nodes (9): jetBrainsMono, plusJakartaSans, RootLayout(), viewport, RouteAnnouncer(), rules, SpeculationRules(), metadata (+1 more)

### Community 35 - "dependencies"
Cohesion: 0.13
Nodes (15): cheerio, husky, dependencies, cheerio, husky, next, react, react-dom (+7 more)

### Community 36 - "bundle-budget.mjs"
Cohesion: 0.27
Nodes (8): baseline, collect(), current, formatKb(), report(), statSize(), THRESHOLD, walk()

### Community 37 - "a11y"
Cohesion: 0.25
Nodes (8): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, a11y

### Community 38 - "season-window.ts"
Cohesion: 0.43
Nodes (5): SeasonPage(), getSeasonWindow(), parseSeasonSlug(), SEASON_RANGES, SeasonWindow

### Community 39 - "suspicious"
Cohesion: 0.22
Nodes (9): suspicious, noArrayIndexKey, noAssignInExpressions, noConsoleLog, noControlCharactersInRegex, noExplicitAny, noGlobalIsNan, noMisleadingCharacterClass (+1 more)

### Community 41 - "sw.js"
Cohesion: 0.15
Nodes (16): API_SWR, broadcast(), CACHE_CAPS, enqueueRequest(), flushOutbox(), KEEP_CACHES, notifyServedFromCache(), OFFLINE_PAGES (+8 more)

### Community 42 - "backup-cache.mjs"
Cohesion: 0.32
Nodes (11): args, backupCache(), backupDir(), exportRedis(), isDryRun, listBackups(), pruneOldBackups(), REDIS_URL (+3 more)

### Community 43 - "e2e-smoke.mjs"
Cohesion: 0.67
Nodes (3): checkRoute(), routes, runSmokeTests()

### Community 44 - "load-test.mjs"
Cohesion: 0.21
Nodes (12): args, budgetProblems(), main(), MIN_SUCCESS_RATE, mode, modeArg, MODES, P95_BUDGET_MS (+4 more)

### Community 47 - "complexity"
Cohesion: 0.40
Nodes (5): noExtraBooleanCast, noForEach, useLiteralKeys, useOptionalChain, complexity

### Community 49 - "toast.ts"
Cohesion: 0.09
Nodes (40): OfflinePage(), registerRefreshSync(), SaveOfflineButton(), SaveOfflineButtonProps, ServiceWorkerRegister(), EMPTY_TOASTS, Toaster(), UpdateIcsButton() (+32 more)

### Community 51 - "download-extras-panel.tsx"
Cohesion: 0.26
Nodes (17): BatchDownloadTools(), BatchDownloadToolsProps, calculateTime(), copiedButtonClass(), DownloadExtrasPanel(), DownloadExtrasPanelProps, buildAria2(), buildCurlSh() (+9 more)

### Community 57 - "compare/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 58 - "recommendation-section.tsx"
Cohesion: 0.18
Nodes (7): CardSkeleton(), GridSkeleton(), GridSkeletonProps, RecommendedSkeleton(), HomeSkeleton(), RecommendedAnime(), getRecommendations()

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 61 - "interfaces/index.ts"
Cohesion: 0.26
Nodes (5): DownloadGuideModal(), DownloadSection(), parseEpisodeRange(), listEpisodeNumbers(), anime

### Community 62 - "compare/page.tsx"
Cohesion: 0.20
Nodes (10): alt, contentType, Image(), runtime, size, ComparePage(), ComparePageProps, dynamic (+2 more)

### Community 63 - "ADR 0001 — Three-tier cache with stale-while-revalidate"
Cohesion: 0.40
Nodes (4): ADR 0001 — Three-tier cache with stale-while-revalidate, Consequences, Context, Decision

### Community 64 - "package.json"
Cohesion: 0.20
Nodes (9): author, lint-staged, **/*.{js,jsx,ts,tsx,json,css}, name, packageManager, private, type, version (+1 more)

### Community 65 - "feature-flags.ts"
Cohesion: 0.22
Nodes (12): dynamic, GET(), POST(), FEATURE_FLAG_REGISTRY, FeatureFlag, FeatureFlagKey, FlagOverrides, getFeatureFlags() (+4 more)

### Community 66 - "Deployment"
Cohesion: 0.33
Nodes (5): Deployment, Manual deploy / rollback, Repository configuration, SEO ping, Server prerequisites

### Community 67 - "subscribeProgress"
Cohesion: 0.35
Nodes (7): ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), EpisodeNavigator(), EpisodeNavigatorProps, nextUnwatchedEpisode(), subscribeProgress()

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

### Community 79 - "upstream.ts"
Cohesion: 0.11
Nodes (33): POST(), sha256(), bodyKey(), DEFAULT_HEADERS, doFetch(), request(), retryDelay(), sha1() (+25 more)

### Community 81 - "toTitle"
Cohesion: 0.15
Nodes (13): alt, contentType, Image(), runtime, size, generateMetadata(), alt, contentType (+5 more)

### Community 82 - "bookmarks/page.tsx"
Cohesion: 0.05
Nodes (84): BookmarksPage(), metadata, metadata, BookmarkButton(), BookmarkButtonProps, BookmarkMetaDialog(), BookmarkMetaDialogProps, BookmarkListRow() (+76 more)

### Community 83 - "status/route.ts"
Cohesion: 0.13
Nodes (23): dynamic, GET(), dynamic, GET(), renderBadge(), dynamic, GET(), COMMIT (+15 more)

### Community 84 - "revalidate/route.ts"
Cohesion: 0.33
Nodes (6): dynamic, POST(), MAX_REVALIDATE_PATHS, sanitizeRevalidatePaths(), IndexNowResult, submitToIndexNow()

### Community 85 - "search-results.tsx"
Cohesion: 0.28
Nodes (6): EmptyState(), AnimeGrid(), AnimeGridProps, Anime, SearchResultsProps, SortOrder

### Community 86 - "section-detail.tsx"
Cohesion: 0.31
Nodes (6): EpisodeGallery(), EpisodeGalleryProps, SectionDetail(), ThemeSongsPlayer(), ThemeSongsPlayerProps, parseTotalEpisodes()

### Community 87 - "renderOgCard"
Cohesion: 0.33
Nodes (6): alt, contentType, Image(), runtime, size, renderOgCard()

### Community 88 - "cache.ts"
Cohesion: 0.10
Nodes (32): dynamic, GET(), currentLevel(), LEVEL_ORDER, logJson(), LogLevel, redact(), rotateIfNeeded() (+24 more)

### Community 89 - "roulette/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 90 - "detail-skeleton.tsx"
Cohesion: 0.36
Nodes (3): DetailDownloadSkeleton(), DetailHeroSkeleton(), DetailSkeleton()

### Community 91 - "metrics.ts"
Cohesion: 0.20
Nodes (14): CIRCUIT_VALUE, dynamic, GET(), clientIp(), denyAdmin(), counters, getHistogramQuantile(), getHistograms() (+6 more)

### Community 92 - "endpointSlug"
Cohesion: 0.15
Nodes (11): DetailMeta(), MetaItemProps, chipColors, GenreTags(), getSeasonInfo(), SEASON_META, SeasonsExplorer(), SeasonsExplorerProps (+3 more)

### Community 93 - "search-index.ts"
Cohesion: 0.15
Nodes (21): dynamic, GET(), POST(), isRedisConfigured(), compact(), getIndexedBySlugs(), getIndexSize(), getIndexSnapshot() (+13 more)

### Community 94 - "offline-indicator.tsx"
Cohesion: 0.60
Nodes (5): getCacheServedSnapshot(), getOnlineSnapshot(), OfflineIndicator(), subscribeCacheServed(), subscribeOnline()

### Community 96 - "home-content.tsx"
Cohesion: 0.14
Nodes (12): dynamic, TrendingEntry, TrendingRail(), compute(), getBlurDataUrl(), memory, FeaturedHero(), HomeHeroSection() (+4 more)

### Community 97 - "stats/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 98 - "audit-meta.mjs"
Cohesion: 0.15
Nodes (11): args, base, baseArg, limit, limitArg, problems, seenDescriptions, seenTitles (+3 more)

### Community 100 - "og-card.tsx"
Cohesion: 0.25
Nodes (6): alt, contentType, Image(), runtime, size, OgCardOptions

### Community 101 - "🚑 RUNBOOK — Kokunime Operations"
Cohesion: 0.17
Nodes (11): 10. Incident checklist (5 menit pertama), 1. Deploy normal, 2. Canary bertahap (opsional), 3. Rollback, 4. Backup & restore, 5. Monitoring & alert, 6. Load & chaos, 7. Feature flags (+3 more)

### Community 102 - "wrapped/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 104 - "🚀 API Quickstart"
Cohesion: 0.22
Nodes (8): 1. Cari anime, 2. Detail, episode, link download, 3. Jelajah katalog, 4. GraphQL (pengganti resmi `/api/anime/bulk`), 5. Bulk (deprecated — tetap hidup sampai 16 Apr 2027), 6. Endpoint ops (tanpa auth), 🚀 API Quickstart, Etika pemakaian

### Community 105 - "Arsitektur"
Cohesion: 0.25
Nodes (7): Alur request, Arsitektur, Aturan data, Deploy & rilis, Dokumen terkait, Observability, Resiliensi upstream

### Community 106 - "scan-secrets.mjs"
Cohesion: 0.25
Nodes (6): findings, PATTERNS, pending, SCAN_EXTENSIONS, SKIP_DIRS, SKIP_FILES

### Community 107 - "health/route.ts"
Cohesion: 0.33
Nodes (7): cleanFirstTitle(), dynamic, GET(), probe(), upstream, UpstreamErrorLike, SCRAPE_BASE_URL

### Community 108 - "[year]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 110 - "warm-cache.mjs"
Cohesion: 0.43
Nodes (6): BASE, collectUrls(), extractLocs(), fetchText(), LIMIT, main()

### Community 111 - "CONTRIBUTING.md"
Cohesion: 0.33
Nodes (5): 📝 Konvensi Commit, 🧪 Pengujian & Standar Kualitas, 🏗️ Prinsip Arsitektur (Ponytail Ultra), 🚀 Setup Lingkungan Pengembangan, 📁 Struktur Direktori Utama

### Community 112 - "ADR 0008 — CSP enforcement is a switch (`CSP_ENFORCE=1`), Trusted Types included"
Cohesion: 0.33
Nodes (5): ADR 0008 — CSP enforcement is a switch (`CSP_ENFORCE=1`), Trusted Types included, Consequences, Context, Decision, Rollout procedure

### Community 113 - "check-licenses.mjs"
Cohesion: 0.33
Nodes (5): ALLOWED, deps, pkg, problems, rows

### Community 114 - "version-bump.mjs"
Cohesion: 0.40
Nodes (5): lastTag, [major, minor, patch], pkg, sh(), subjects

### Community 115 - "formatter"
Cohesion: 0.40
Nodes (5): formatter, enabled, indentStyle, indentWidth, lineWidth

### Community 116 - "ADR 0006 — `cacheComponents` / PPR stays off; routes are explicitly dynamic"
Cohesion: 0.40
Nodes (4): ADR 0006 — `cacheComponents` / PPR stays off; routes are explicitly dynamic, Consequences, Context, Decision

### Community 117 - "ADR 0007 — Upstream HTTP is fetch-native; axios is gone"
Cohesion: 0.40
Nodes (4): ADR 0007 — Upstream HTTP is fetch-native; axios is gone, Consequences, Context, Decision

### Community 118 - "ADR 0009 — Module size budget + dead-export policy"
Cohesion: 0.40
Nodes (4): ADR 0009 — Module size budget + dead-export policy, Consequences, Context, Decision

### Community 119 - "ADR 0010 — Vitest runs as two projects (node + dom) and CI shards them"
Cohesion: 0.40
Nodes (4): ADR 0010 — Vitest runs as two projects (node + dom) and CI shards them, Consequences, Context, Decision

### Community 120 - "Dependensi"
Cohesion: 0.40
Nodes (4): Audit & update, Dependensi, Development (`devDependencies`), Runtime (`dependencies`)

### Community 121 - "Matriks Environment Variable"
Cohesion: 0.40
Nodes (4): Aplikasi (runtime), Matriks Environment Variable, Scripts & CI (tidak dibaca aplikasi), Variabel CI GitHub (repo Settings → Secrets and variables → Actions)

### Community 122 - "assert-artifact.mjs"
Cohesion: 0.40
Nodes (3): config, maps, problems

### Community 123 - "file-size-budget.mjs"
Cohesion: 0.40
Nodes (3): files, over, sorted

### Community 124 - "find-untested.mjs"
Cohesion: 0.40
Nodes (3): modules, testsBlob, untested

### Community 126 - "indexnow.mjs"
Cohesion: 0.40
Nodes (4): key, keyFile, SITE, urls

### Community 127 - "validate-cache.mjs"
Cohesion: 0.40
Nodes (3): base, notes, problems

## Knowledge Gaps
- **576 isolated node(s):** `cachedUnread`, `ITEM`, `DOM_TESTS`, `AnimePage`, `DownloadResolution` (+571 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `home-content.tsx`, `app/layout.tsx`, `site.ts`, `[slug]/page.tsx`, `release-inbox.ts`, `bookmarks/page.tsx`, `ignore`, `vitals-reporter.ts`, `seasons/page.tsx`, `offline/layout.tsx`, `sitemap-entries.ts`, `compare/page.tsx`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `.next/**`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `cachedUnread`, `ITEM`, `DOM_TESTS` to the rest of the system?**
  _576 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sanitize.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06882716049382716 - nodes in this community are weakly interconnected._
- **Should `main-layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._