# Graph Report - kokunime  (2026-10-18)

## Corpus Check
- 464 files · ~138,396 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1852 nodes · 4144 edges · 135 communities (123 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bc2c6721`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- genres.ts
- main-layout.tsx
- new-series-anime.tsx
- icons/index.ts
- reveal.tsx
- scripts
- bookmarks.ts
- settings.ts
- style
- site.ts
- devDependencies
- anime-grid.tsx
- detail-hero.tsx
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
- .next/**
- app/page.tsx
- format-date.ts
- sitemap-entries.ts
- rules
- safeJsonLd
- cache.ts
- scraper/constants.ts
- app/layout.tsx
- dependencies
- bundle-budget.mjs
- a11y
- [season]/page.tsx
- suspicious
- postcss.config.js
- sw.js
- backup-cache.mjs
- e2e-smoke.mjs
- load-test.mjs
- complexity
- toast.ts
- progress.ts
- vitest.config.ts
- renderOgCard
- useTranslation
- post-commit
- post-checkout
- update/page.tsx
- detail-metadata.ts
- ADR 0001 — Three-tier cache with stale-while-revalidate
- package.json
- denyAdmin
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
- upstream.ts
- bookmarks/page.tsx
- status/route.ts
- wrapped-content.tsx
- settings-page-content.tsx
- compare-anime-client.tsx
- download-extras-panel.tsx
- logger.ts
- redis.ts
- use-collection-data.ts
- metrics.ts
- anime.ts
- command-palette.tsx
- history.ts
- sanitize.ts
- animeSlug
- interfaces/index.ts
- audit-meta.mjs
- use-admin-console.ts
- search.ts
- 🚑 RUNBOOK — Kokunime Operations
- download-group.tsx
- storage-keys.ts
- 🚀 API Quickstart
- Arsitektur
- scan-secrets.mjs
- health/route.ts
- anime-image.tsx
- parse.ts
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
- anime-detail.ts
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
7. `scripts` - 25 edges
8. `checkRateLimit()` - 25 edges
9. `safeJsonLd()` - 25 edges
10. `endpointSlug()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `BookmarkButton()` --indirect_call--> `subscribeBookmarks()`  [INFERRED]
  src/components/anime/bookmark-button.tsx → src/utils/bookmarks.ts
- `EpisodeWatchedToggle()` --indirect_call--> `subscribeProgress()`  [INFERRED]
  src/components/anime/episode-watched-toggle.tsx → src/utils/progress.ts
- `HomeHistoryStrip()` --indirect_call--> `subscribeHistory()`  [INFERRED]
  src/components/home-history-strip.tsx → src/utils/history.ts
- `HomeHistoryStrip()` --indirect_call--> `getProgressList()`  [INFERRED]
  src/components/home-history-strip.tsx → src/utils/progress.ts
- `HomeHistoryStrip()` --indirect_call--> `subscribeProgress()`  [INFERRED]
  src/components/home-history-strip.tsx → src/utils/progress.ts

## Import Cycles
- None detected.

## Communities (135 total, 12 thin omitted)

### Community 0 - "genres.ts"
Cohesion: 0.22
Nodes (16): CACHE_TTL_SECONDS, cached(), CacheTier, TTL, fetchSingleGenrePage(), getAnimeByGenres(), getGenresWithMeta(), parseSimplePagination() (+8 more)

### Community 1 - "main-layout.tsx"
Cohesion: 0.05
Nodes (24): revalidate, DetailDownloadSkeleton(), DetailHeroSkeleton(), DetailSkeleton(), CardSkeleton(), GridSkeleton(), GridSkeletonProps, FloatingTopButton() (+16 more)

### Community 2 - "new-series-anime.tsx"
Cohesion: 0.29
Nodes (5): dynamic, GET(), NewSeriesSkeleton(), NewSeriesAnime(), getAnimePerPage()

### Community 3 - "icons/index.ts"
Cohesion: 0.05
Nodes (39): AboutBlock(), BackToTop(), BottomBar(), BrandBlock(), footerDevLinks, footerNavLinks, footerTags, Footer() (+31 more)

### Community 4 - "reveal.tsx"
Cohesion: 0.20
Nodes (6): ReadingFocusMode(), ReadingFocusModeProps, RecommendedSkeleton(), Reveal(), RevealProps, RecommendedAnime()

### Community 5 - "scripts"
Cohesion: 0.08
Nodes (25): scripts, audit:client, audit:meta, backup:cache, build, bundle:budget, changelog, dev (+17 more)

### Community 6 - "bookmarks.ts"
Cohesion: 0.20
Nodes (23): BookmarkButton(), BookmarkButtonProps, BookmarkMetaDialog(), BookmarkMetaDialogProps, parseAniListJson(), parseMalXml(), serializeMalXml(), slugifyTitle() (+15 more)

### Community 7 - "settings.ts"
Cohesion: 0.18
Nodes (18): formatQuota(), SettingsPageContent(), SettingsTypographySectionProps, AccentColor, applySettingsToDom(), calculateStorageBreakdown(), CardDensity, DEFAULT_SETTINGS (+10 more)

### Community 8 - "style"
Cohesion: 0.22
Nodes (9): style, noNonNullAssertion, noUnusedTemplateLiteral, useConst, useImportType, useNodejsImportProtocol, useNumberNamespace, useSelfClosingElements (+1 more)

### Community 9 - "site.ts"
Cohesion: 0.09
Nodes (20): RFC-9116, dynamic, POST(), ENDPOINTS, metadata, dynamic, dynamic, ApiEndpoint (+12 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): axe-core, @biomejs/biome, jsdom, lint-staged, devDependencies, axe-core, @biomejs/biome, jsdom (+17 more)

### Community 11 - "anime-grid.tsx"
Cohesion: 0.27
Nodes (7): EmptyState(), AnimeGrid(), AnimeGridProps, CardAnime(), Anime, SearchResultsProps, SortOrder

### Community 12 - "detail-hero.tsx"
Cohesion: 0.09
Nodes (27): OfflinePage(), CopyButton(), CopyButtonProps, DetailHeroProps, DetailHeroViewProps, DetailMeta(), MetaItemProps, DownloadPlatform() (+19 more)

### Community 13 - "scraper/index.ts"
Cohesion: 0.07
Nodes (67): RFC-9457, BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), POST_DEPRECATION_HEADERS (+59 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts (+24 more)

### Community 15 - "[slug]/page.tsx"
Cohesion: 0.12
Nodes (17): Anime(), revalidate, GENRE_DICTIONARY, GenreMeta, GenresExplorer(), getGenreMeta(), ViewTracker(), buildAnimeJsonLd() (+9 more)

### Community 16 - "roulette-content.tsx"
Cohesion: 0.22
Nodes (8): metadata, GenreOption, readSpinHistory(), RouletteContent(), RouletteSpin, writeSpinHistory(), ViewTransitionLink(), ViewTransitionLinkProps

### Community 17 - "formatter"
Cohesion: 0.40
Nodes (5): quoteStyle, semicolons, trailingCommas, javascript, formatter

### Community 18 - "release-inbox.ts"
Cohesion: 0.28
Nodes (14): EMPTY, InboxBell(), ReleaseWatcher(), ReleaseWatcherProps, getReleaseSeen(), getStorage(), getUnreadReleases(), markReleasesRead() (+6 more)

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
Nodes (36): dynamic, GET(), WebVitals(), EnvIssue, isHttpUrl(), isRedisUrl(), validateEnv(), onRequestError() (+28 more)

### Community 23 - "seasons/page.tsx"
Cohesion: 0.16
Nodes (13): SeasonsPage(), getSeasonInfo(), SEASON_META, SeasonsExplorer(), SeasonsExplorerProps, Season, SeasonYearGroup(), SeasonYearGroupProps (+5 more)

### Community 24 - "biome.json"
Cohesion: 0.22
Nodes (8): organizeImports, enabled, overrides, $schema, vcs, clientKind, enabled, useIgnoreFile

### Community 25 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - ".next/**"
Cohesion: 0.17
Nodes (8): .next/**, metadata, metadata, SECTIONS, generateMetadata(), SearchAnime(), buildSearchMetadata(), decodeQuery()

### Community 27 - "app/page.tsx"
Cohesion: 0.33
Nodes (3): dynamic, TrendingEntry, TrendingRail()

### Community 28 - "format-date.ts"
Cohesion: 0.50
Nodes (3): formatLocalizedDate(), MONTHS_EN, MONTHS_ID

### Community 29 - "sitemap-entries.ts"
Cohesion: 0.18
Nodes (15): dynamic, GET(), dynamic, GET(), dynamic, GET(), GET(), GET() (+7 more)

### Community 30 - "rules"
Cohesion: 0.20
Nodes (10): noUnusedVariables, useExhaustiveDependencies, useJsxKeyInIterable, linter, enabled, rules, correctness, recommended (+2 more)

### Community 31 - "safeJsonLd"
Cohesion: 0.15
Nodes (16): ApiDocsPage(), ComparePage(), ComparePageProps, dynamic, metadata, GenresPage(), SeasonPage(), metadata (+8 more)

### Community 32 - "cache.ts"
Cohesion: 0.13
Nodes (24): apqMemory, POST(), sha256(), analyzeQuery(), GRAPHQL_MAX_COMPLEXITY, GRAPHQL_MAX_DEPTH, QueryAnalysis, RESERVED (+16 more)

### Community 33 - "scraper/constants.ts"
Cohesion: 0.19
Nodes (11): upstream, UPSTREAM_URL, bestImage(), ImgLike, resolveAssetUrl(), formatAnimeData(), getRecommendations(), formatNumberIndonesian() (+3 more)

### Community 34 - "app/layout.tsx"
Cohesion: 0.16
Nodes (10): jetBrainsMono, plusJakartaSans, RootLayout(), viewport, RouteAnnouncer(), rules, SpeculationRules(), ServiceWorkerRegister() (+2 more)

### Community 35 - "dependencies"
Cohesion: 0.13
Nodes (15): cheerio, husky, dependencies, cheerio, husky, next, react, react-dom (+7 more)

### Community 36 - "bundle-budget.mjs"
Cohesion: 0.27
Nodes (8): baseline, collect(), current, formatKb(), report(), statSize(), THRESHOLD, walk()

### Community 37 - "a11y"
Cohesion: 0.25
Nodes (8): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, a11y

### Community 38 - "[season]/page.tsx"
Cohesion: 0.10
Nodes (22): alt, contentType, Image(), runtime, size, dynamic, generateMetadata(), GenrePage() (+14 more)

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
Cohesion: 0.12
Nodes (25): EMPTY_TOASTS, Toaster(), UpdateIcsButton(), buildWeeklyReminderIcs(), CalendarEvent, djb2(), escapeIcs(), foldLine() (+17 more)

### Community 51 - "progress.ts"
Cohesion: 0.13
Nodes (28): ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), EpisodeGallery(), EpisodeGalleryProps, EpisodeNavigator(), EpisodeNavigatorProps, HistoryTracker() (+20 more)

### Community 57 - "renderOgCard"
Cohesion: 0.06
Nodes (37): alt, contentType, Image(), runtime, size, alt, contentType, Image() (+29 more)

### Community 58 - "useTranslation"
Cohesion: 0.12
Nodes (21): DetailToc(), SECTIONS, CompareSpecsTable(), CompareSpecsTableProps, MobileMenu(), MobileMenuProps, NAV_KEY_MAP, NAV_KEY_MAP (+13 more)

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 61 - "update/page.tsx"
Cohesion: 0.27
Nodes (7): BUCKET_META, metadata, revalidate, AgeBucket, NUMBER_WORDS, parseRelativeAge(), RelativeAge

### Community 62 - "detail-metadata.ts"
Cohesion: 0.23
Nodes (9): alt, contentType, Image(), runtime, size, generateMetadata(), buildDetailMetadata(), getAnimeDetail() (+1 more)

### Community 63 - "ADR 0001 — Three-tier cache with stale-while-revalidate"
Cohesion: 0.40
Nodes (4): ADR 0001 — Three-tier cache with stale-while-revalidate, Consequences, Context, Decision

### Community 64 - "package.json"
Cohesion: 0.20
Nodes (9): author, lint-staged, **/*.{js,jsx,ts,tsx,json,css}, name, packageManager, private, type, version (+1 more)

### Community 65 - "denyAdmin"
Cohesion: 0.14
Nodes (22): dynamic, GET(), POST(), dynamic, GET(), POST(), clientIp(), denyAdmin() (+14 more)

### Community 66 - "Deployment"
Cohesion: 0.33
Nodes (5): Deployment, Manual deploy / rollback, Repository configuration, SEO ping, Server prerequisites

### Community 67 - "search-index.ts"
Cohesion: 0.29
Nodes (10): compact(), getIndexedBySlugs(), getIndexSnapshot(), IndexedAnime, rankIndexItems(), suggestLocal(), SimilarAnime(), ParsedQuery (+2 more)

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
Cohesion: 0.14
Nodes (24): dynamic, GET(), bodyKey(), DEFAULT_HEADERS, doFetch(), request(), retryDelay(), sha1() (+16 more)

### Community 82 - "bookmarks/page.tsx"
Cohesion: 0.12
Nodes (20): BookmarksBulkBar(), BookmarksBulkBarProps, BookmarksFolderBar(), BookmarksFolderBarProps, folderChipClass(), BookmarksGridView(), BookmarksStatusFilters(), BookmarksStatusFiltersProps (+12 more)

### Community 83 - "status/route.ts"
Cohesion: 0.15
Nodes (21): dynamic, GET(), dynamic, GET(), renderBadge(), COMMIT, dynamic, GET() (+13 more)

### Community 84 - "wrapped-content.tsx"
Cohesion: 0.14
Nodes (16): metadata, metadata, MiniBarChart(), MiniBarChartProps, MiniBarDatum, dayKey(), formatWatchTime(), MONTHS_SHORT (+8 more)

### Community 85 - "settings-page-content.tsx"
Cohesion: 0.19
Nodes (16): DEFAULT_STORAGE, SettingsAboutSection(), SettingsAppearanceSection(), SettingsAppearanceSectionProps, SettingsCatalogSection(), SettingsCatalogSectionProps, SettingsLanguageSection(), SettingsLanguageSectionProps (+8 more)

### Community 86 - "compare-anime-client.tsx"
Cohesion: 0.14
Nodes (16): CompareAnimeClient(), CompareAnimeClientProps, PRESET_COMPARISONS, Side, CompareAnimeCard(), CompareAnimeCardProps, CompareGenreAnalysis(), CompareGenreAnalysisProps (+8 more)

### Community 87 - "download-extras-panel.tsx"
Cohesion: 0.26
Nodes (17): BatchDownloadTools(), BatchDownloadToolsProps, calculateTime(), copiedButtonClass(), DownloadExtrasPanel(), DownloadExtrasPanelProps, buildAria2(), buildCurlSh() (+9 more)

### Community 88 - "logger.ts"
Cohesion: 0.18
Nodes (16): dynamic, GET(), currentLevel(), LEVEL_ORDER, logJson(), LogLevel, redact(), rotateIfNeeded() (+8 more)

### Community 89 - "redis.ts"
Cohesion: 0.20
Nodes (15): dynamic, GET(), incrementMetric(), ensureSubscriber(), getRedis(), handleInvalidateMessage(), INSTANCE_ID, makeClient() (+7 more)

### Community 90 - "use-collection-data.ts"
Cohesion: 0.27
Nodes (14): BookmarkListRow(), BookmarkListRowProps, BookmarksDayList(), BookmarksDayListProps, BookmarksGridViewProps, CollectionTab, SERVER_BOOKMARKS, SERVER_HISTORY (+6 more)

### Community 91 - "metrics.ts"
Cohesion: 0.24
Nodes (13): CIRCUIT_VALUE, dynamic, GET(), counters, getEventLoopLagMs(), getHistogramQuantile(), getHistograms(), getMetrics() (+5 more)

### Community 92 - "anime.ts"
Cohesion: 0.16
Nodes (12): chipColors, GenreTags(), WatchOrderTimeline(), WatchOrderTimelineProps, GenresExplorerProps, AnimeDetail, AnimePage, DownloadOption (+4 more)

### Community 93 - "command-palette.tsx"
Cohesion: 0.24
Nodes (12): CommandPalette(), clientSearchCache, useCommandPalette(), UseCommandPaletteResult, fuzzyScore(), HighlightSegment, highlightSegments(), clearRecentSearches() (+4 more)

### Community 94 - "history.ts"
Cohesion: 0.30
Nodes (12): BookmarksPage(), EMPTY_HISTORY, EMPTY_PROGRESS, HomeHistoryStrip(), clearAllHistory(), EMPTY_HISTORY, getHistory(), getStorage() (+4 more)

### Community 95 - "sanitize.ts"
Cohesion: 0.34
Nodes (9): parseAnimeDetail(), parseDownloads(), getDownloadLinks(), normalizeUrl(), parseBytes(), parseGenres(), normalizeSeasonName(), parseSeason() (+1 more)

### Community 96 - "animeSlug"
Cohesion: 0.22
Nodes (10): DetailHero(), compute(), getBlurDataUrl(), memory, FeaturedHero(), FeaturedHeroProps, HomeHeroSection(), HomeLatestSection() (+2 more)

### Community 97 - "interfaces/index.ts"
Cohesion: 0.26
Nodes (5): DownloadGuideModal(), DownloadSection(), parseEpisodeRange(), listEpisodeNumbers(), anime

### Community 98 - "audit-meta.mjs"
Cohesion: 0.15
Nodes (11): args, base, baseArg, limit, limitArg, problems, seenDescriptions, seenTitles (+3 more)

### Community 99 - "use-admin-console.ts"
Cohesion: 0.22
Nodes (9): metadata, AdminDashboard(), FeatureFlagView, PRESET_PATHS, AdminLogEntry, adminRequest(), AdminRequestResult, useAdminConsole() (+1 more)

### Community 100 - "search.ts"
Cohesion: 0.31
Nodes (9): mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias(), SEARCH_ALIASES, searchLocalIndex(), fetchSearchPage(), mergeWithLocal(), searchAnime() (+1 more)

### Community 101 - "🚑 RUNBOOK — Kokunime Operations"
Cohesion: 0.17
Nodes (11): 10. Incident checklist (5 menit pertama), 1. Deploy normal, 2. Canary bertahap (opsional), 3. Rollback, 4. Backup & restore, 5. Monitoring & alert, 6. Load & chaos, 7. Feature flags (+3 more)

### Community 102 - "download-group.tsx"
Cohesion: 0.30
Nodes (9): DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), EpisodeWatchedToggle(), EpisodeWatchedToggleProps, isEpisodeWatched(), toggleEpisodeWatched(), subscribeSettings() (+1 more)

### Community 103 - "storage-keys.ts"
Cohesion: 0.33
Nodes (4): getRecent(), SearchHistoryChips(), writeRecent(), STORAGE_KEYS

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
Cohesion: 0.36
Nodes (6): cleanFirstTitle(), dynamic, GET(), probe(), UpstreamErrorLike, SCRAPE_BASE_URL

### Community 108 - "anime-image.tsx"
Cohesion: 0.32
Nodes (5): AnimeImage(), AnimeImageProps, AnimeSearchField(), AnimeSearchFieldProps, isGif()

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

### Community 128 - "anime-detail.ts"
Cohesion: 0.60
Nodes (3): getAnimeDetailWithMeta(), extractWithFallback(), FallbackExtractResult

## Knowledge Gaps
- **574 isolated node(s):** `🏗️ Prinsip Arsitektur (Ponytail Ultra)`, `🚀 Setup Lingkungan Pengembangan`, `🧪 Pengujian & Standar Kualitas`, `📝 Konvensi Commit`, `📁 Struktur Direktori Utama` (+569 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `main-layout.tsx`, `app/layout.tsx`, `use-admin-console.ts`, `[season]/page.tsx`, `site.ts`, `[slug]/page.tsx`, `roulette-content.tsx`, `sitemap-entries.ts`, `status/route.ts`, `wrapped-content.tsx`, `ignore`, `vitals-reporter.ts`, `seasons/page.tsx`, `app/page.tsx`, `update/page.tsx`, `detail-metadata.ts`, `safeJsonLd`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `.next/**`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `🏗️ Prinsip Arsitektur (Ponytail Ultra)`, `🚀 Setup Lingkungan Pengembangan`, `🧪 Pengujian & Standar Kualitas` to the rest of the system?**
  _574 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `main-layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.053763440860215055 - nodes in this community are weakly interconnected._
- **Should `icons/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05010351966873706 - nodes in this community are weakly interconnected._