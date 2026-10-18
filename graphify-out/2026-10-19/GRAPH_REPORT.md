# Graph Report - kokunime  (2026-10-19)

## Corpus Check
- 546 files · ~182,441 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2391 nodes · 5649 edges · 164 communities (150 shown, 14 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 76 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2fd3cd76`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scraper/constants.ts
- tags.ts
- settings.ts
- icons/index.ts
- download-extras-panel.tsx
- scripts
- stats-content.tsx
- launchBrowser
- style
- site.ts
- devDependencies
- seasons/page.tsx
- search-results.tsx
- checkRateLimit
- compilerOptions
- app/layout.tsx
- qr.ts
- formatter
- storage-keys.ts
- find-unused-exports.mjs
- diagnostics.ts
- ignore
- vitals-reporter.ts
- devDependencies
- biome.json
- next.config.mjs
- genres.ts
- detail-hero.tsx
- format-date.ts
- endpoint-slug.ts
- rules
- anime-listing.tsx
- useTranslation
- scraper/index.ts
- wrapped-content.tsx
- dependencies
- bundle-budget.mjs
- a11y
- local-catalog.ts
- suspicious
- postcss.config.js
- sw.js
- backup-cache.mjs
- e2e-smoke.mjs
- load-test.mjs
- complexity
- watch-queue.ts
- progress.ts
- vitest.config.ts
- og-card.tsx
- showToast
- post-commit
- post-checkout
- toTitle
- animeSlug
- ADR 0001 — Three-tier cache with stale-while-revalidate
- package.json
- denyAdmin
- Deployment
- contrast.test.ts
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
- compare-selector.tsx
- use-collection-data.ts
- status/route.ts
- ics.ts
- settings-appearance-section.tsx
- qr-reference.py
- download-group.tsx
- cache.ts
- reveal.tsx
- main-layout.tsx
- metrics.ts
- checkEtagMatch
- redis.ts
- bookmarks.ts
- no-third-party.mjs
- .next/**
- revalidate/route.ts
- audit-meta.mjs
- compare-anime-client.tsx
- subscribeProgress
- 🚑 RUNBOOK — Kokunime Operations
- interfaces/index.ts
- cache-codec.ts
- 🚀 API Quickstart
- Arsitektur
- scan-secrets.mjs
- renderOgCard
- toast.ts
- deps-allowlist.mjs
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
- app/opengraph-image.tsx
- rollback.sh
- commit-msg
- check-commit-msg.mjs
- lint-staged-chunk.mjs
- section-header.tsx
- [page]/opengraph-image.tsx
- roulette/opengraph-image.tsx
- app/page.tsx
- use-sync-link.ts
- stats/opengraph-image.tsx
- update/opengraph-image.tsx
- css-usage-report.mjs
- wrapped/opengraph-image.tsx
- dictionary.ts
- bookmarks-folder-bar.tsx
- bulk/route.ts
- sanitize.ts
- parse-detail.ts
- route-error.tsx
- [slug]/loading.tsx
- circuit-breaker.ts
- roulette-content.tsx
- search.ts
- share-card.ts
- graphql/route.ts
- error-card.tsx
- anime.ts
- status/page.tsx
- api/page.tsx
- [slug]/opengraph-image.tsx
- offline-indicator.tsx
- similar.ts
- keyboard-navigation.tsx

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 67 edges
2. `showToast()` - 64 edges
3. `getBookmarks()` - 44 edges
4. `SITE_URL` - 36 edges
5. `animeSlug()` - 34 edges
6. `scripts` - 33 edges
7. `.next/**` - 32 edges
8. `checkEtagMatch()` - 29 edges
9. `generateEtag()` - 29 edges
10. `checkRateLimit()` - 29 edges

## Surprising Connections (you probably didn't know these)
- `SearchLocalPanel()` --indirect_call--> `getCatalogSnapshot()`  [INFERRED]
  src/components/search-local-panel.tsx → src/utils/local-catalog.ts
- `SearchLocalPanel()` --indirect_call--> `subscribeCatalog()`  [INFERRED]
  src/components/search-local-panel.tsx → src/utils/local-catalog.ts
- `BookmarkMetaDialogProps` --references--> `BookmarkItem`  [EXTRACTED]
  src/components/bookmark-meta-dialog.tsx → src/utils/bookmarks.ts
- `EpisodeWatchedToggle()` --indirect_call--> `subscribeProgress()`  [INFERRED]
  src/components/anime/episode-watched-toggle.tsx → src/utils/progress.ts
- `HomeHistoryStrip()` --indirect_call--> `subscribeProgress()`  [INFERRED]
  src/components/home-history-strip.tsx → src/utils/progress.ts

## Import Cycles
- None detected.

## Communities (164 total, 14 thin omitted)

### Community 0 - "scraper/constants.ts"
Cohesion: 0.22
Nodes (9): UPSTREAM_URL, bestImage(), ImgLike, resolveAssetUrl(), formatAnimeData(), formatNumberIndonesian(), formatScoreIndonesian(), GENRE_TRANSLATIONS (+1 more)

### Community 1 - "tags.ts"
Cohesion: 0.23
Nodes (26): NO_SNAPSHOT, TagIndexPage(), NO_SNAPSHOT, TagDetailPage(), AnimeTagsEditor(), getCatalogSnapshot(), subscribeCatalog(), addTag() (+18 more)

### Community 2 - "settings.ts"
Cohesion: 0.13
Nodes (30): DEFAULT_STORAGE, formatQuota(), SettingsPageContent(), SettingsStorageSection(), SettingsStorageSectionProps, SettingsTypographySection(), ThemeSync(), AccentColor (+22 more)

### Community 3 - "icons/index.ts"
Cohesion: 0.05
Nodes (30): footerDevLinks, footerNavLinks, footerTags, Footer(), ChevronLeftIcon(), ChevronRightIcon(), SearchIcon(), IconProps (+22 more)

### Community 4 - "download-extras-panel.tsx"
Cohesion: 0.26
Nodes (17): BatchDownloadTools(), BatchDownloadToolsProps, calculateTime(), copiedButtonClass(), DownloadExtrasPanel(), DownloadExtrasPanelProps, buildAria2(), buildCurlSh() (+9 more)

### Community 5 - "scripts"
Cohesion: 0.06
Nodes (33): scripts, a11y:targets, audit:client, audit:meta, backup:cache, build, bundle:budget, changelog (+25 more)

### Community 6 - "stats-content.tsx"
Cohesion: 0.16
Nodes (19): metadata, MiniBarChartProps, MiniBarDatum, dayKey(), formatWatchTime(), MONTHS_SHORT, SERVER_EMPTY, StatsContent() (+11 more)

### Community 7 - "launchBrowser"
Cohesion: 0.12
Nodes (32): CANDIDATES, CdpClient, evaluate(), findBrowser(), launchBrowser(), navigate(), runAxe(), screenshot() (+24 more)

### Community 8 - "style"
Cohesion: 0.22
Nodes (9): style, noNonNullAssertion, noUnusedTemplateLiteral, useConst, useImportType, useNodejsImportProtocol, useNumberNamespace, useSelfClosingElements (+1 more)

### Community 9 - "site.ts"
Cohesion: 0.08
Nodes (32): RFC-9116, dynamic, GET(), dynamic, dynamic, GET(), dynamic, GET() (+24 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, axe-core, @biomejs/biome, jsdom, lint-staged, postcss, tailwindcss, @tailwindcss/postcss (+17 more)

### Community 11 - "seasons/page.tsx"
Cohesion: 0.24
Nodes (8): SeasonsPage(), Season, SeasonYearGroup(), SeasonYearGroupProps, TaxonomyCard(), TaxonomyCardProps, groupSeasonsByYear(), orderYears()

### Community 12 - "search-results.tsx"
Cohesion: 0.20
Nodes (12): useUrlState(), SEARCH_SCHEMA, SearchResults(), SearchResultsProps, SORT_ORDERS, SortOrder, VIEW_MODES, readUrlState() (+4 more)

### Community 13 - "checkRateLimit"
Cohesion: 0.12
Nodes (30): dynamic, GET(), dynamic, EMPTY, GET(), dynamic, POST(), VALID_NAMES (+22 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts (+24 more)

### Community 15 - "app/layout.tsx"
Cohesion: 0.17
Nodes (5): viewport, rules, ServiceWorkerRegister(), WebVitals(), metadata

### Community 16 - "qr.ts"
Cohesion: 0.14
Nodes (25): PrintQrCard(), PrintQrCardProps, addEccAndInterleave(), applyMask(), buildMatrix(), dataCodewords(), drawCodewords(), drawFormatBits() (+17 more)

### Community 17 - "formatter"
Cohesion: 0.40
Nodes (5): quoteStyle, semicolons, trailingCommas, javascript, formatter

### Community 18 - "storage-keys.ts"
Cohesion: 0.08
Nodes (36): metadata, AdminDashboard(), FeatureFlagView, PRESET_PATHS, DeferredPwaInstallBanner, chipClass(), EMPTY, InboxBell() (+28 more)

### Community 19 - "find-unused-exports.mjs"
Cohesion: 0.18
Nodes (11): corpus, exportsByFile, files, ROOT, SCAN_DIRS, SKIP_EXPORTS, SRC_DIRS, textCache (+3 more)

### Community 20 - "diagnostics.ts"
Cohesion: 0.16
Nodes (22): DeviceDiagnostics(), NO_ENTRIES, timeFormat, TYPE_LABEL, TYPE_ORDER, StaleDataBanner(), clearDiagnostics(), DiagnosticEntry (+14 more)

### Community 21 - "ignore"
Cohesion: 0.22
Nodes (9): files, ignore, ignoreUnknown, node_modules/**, coverage/**, dist/**, graphify-out/**, pnpm-lock.yaml (+1 more)

### Community 22 - "vitals-reporter.ts"
Cohesion: 0.07
Nodes (36): dynamic, GET(), EnvIssue, isHttpUrl(), isRedisUrl(), validateEnv(), onRequestError(), register() (+28 more)

### Community 23 - "devDependencies"
Cohesion: 0.05
Nodes (42): dependencies, cheerio, husky, next, react, react-dom, redis, sharp (+34 more)

### Community 24 - "biome.json"
Cohesion: 0.22
Nodes (8): organizeImports, enabled, overrides, $schema, vcs, clientKind, enabled, useIgnoreFile

### Community 25 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - "genres.ts"
Cohesion: 0.21
Nodes (16): cached(), CacheTier, TTL, fetchSingleGenrePage(), getAnimeByGenres(), getGenres(), getGenresWithMeta(), parseSimplePagination() (+8 more)

### Community 27 - "detail-hero.tsx"
Cohesion: 0.09
Nodes (28): formatAge(), OfflinePage(), CopyButtonProps, DetailHero(), DetailHeroProps, DetailHeroViewProps, readPosterUrl(), registerRefreshSync() (+20 more)

### Community 28 - "format-date.ts"
Cohesion: 0.50
Nodes (3): formatLocalizedDate(), MONTHS_EN, MONTHS_ID

### Community 29 - "endpoint-slug.ts"
Cohesion: 0.21
Nodes (15): GET(), GET(), GET(), GET(), decodeCursor(), encodeCursor(), parseFieldsParam(), projectRecord() (+7 more)

### Community 30 - "rules"
Cohesion: 0.20
Nodes (10): noUnusedVariables, useExhaustiveDependencies, useJsxKeyInIterable, linter, enabled, rules, correctness, recommended (+2 more)

### Community 31 - "anime-listing.tsx"
Cohesion: 0.07
Nodes (39): Anime(), revalidate, ApiDocsPage(), ComparePage(), ComparePageProps, dynamic, metadata, dynamic (+31 more)

### Community 32 - "useTranslation"
Cohesion: 0.14
Nodes (18): DetailToc(), SECTIONS, MobileMenu(), MobileMenuProps, NAV_KEY_MAP, NAV_KEY_MAP, Navbar(), SettingsAboutSection() (+10 more)

### Community 33 - "scraper/index.ts"
Cohesion: 0.08
Nodes (22): dynamic, DetailMeta(), MetaItemProps, chipColors, GenreTags(), GENRE_DICTIONARY, GenreMeta, GenresExplorer() (+14 more)

### Community 34 - "wrapped-content.tsx"
Cohesion: 0.14
Nodes (22): metadata, EMPTY_HISTORY, EMPTY_PROGRESS, HomeHistoryStrip(), RecommendForYou(), RecommendItem, RecommendResponse, SERVER_BOOKMARKS (+14 more)

### Community 35 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, cheerio, husky, next, react, react-dom, redis, sharp (+7 more)

### Community 36 - "bundle-budget.mjs"
Cohesion: 0.27
Nodes (8): baseline, collect(), current, formatKb(), report(), statSize(), THRESHOLD, walk()

### Community 37 - "a11y"
Cohesion: 0.25
Nodes (8): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, a11y

### Community 38 - "local-catalog.ts"
Cohesion: 0.05
Nodes (80): CatalogRecorder(), CatalogRecorderProps, CommandPalette(), CommandPalette, NO_SNAPSHOT, SearchLocalPanel(), SearchLocalPanelProps, clientSearchCache (+72 more)

### Community 39 - "suspicious"
Cohesion: 0.22
Nodes (9): suspicious, noArrayIndexKey, noAssignInExpressions, noConsoleLog, noControlCharactersInRegex, noExplicitAny, noGlobalIsNan, noMisleadingCharacterClass (+1 more)

### Community 41 - "sw.js"
Cohesion: 0.13
Nodes (19): API_SWR, broadcast(), CACHE_CAPS, DEGRADED_TIERS, enqueueRequest(), flushOutbox(), KEEP_CACHES, notifyDataState() (+11 more)

### Community 42 - "backup-cache.mjs"
Cohesion: 0.32
Nodes (11): args, backupCache(), backupDir(), exportRedis(), isDryRun, listBackups(), pruneOldBackups(), REDIS_URL (+3 more)

### Community 43 - "e2e-smoke.mjs"
Cohesion: 0.67
Nodes (3): checkRoute(), routes, runSmokeTests()

### Community 44 - "load-test.mjs"
Cohesion: 0.19
Nodes (13): args, budgetProblems(), main(), MIN_SUCCESS_RATE, mode, modeArg, MODES, P95_BUDGET_MS (+5 more)

### Community 47 - "complexity"
Cohesion: 0.40
Nodes (5): noExtraBooleanCast, noForEach, useLiteralKeys, useOptionalChain, complexity

### Community 49 - "watch-queue.ts"
Cohesion: 0.33
Nodes (16): BookmarksQueueView(), SERVER_EMPTY, addToQueue(), clearQueue(), EMPTY_QUEUE, getQueue(), getStorage(), isQueued() (+8 more)

### Community 51 - "progress.ts"
Cohesion: 0.26
Nodes (15): HistoryTracker(), HistoryTrackerProps, clearAllProgress(), EMPTY_PROGRESS, getProgress(), getProgressList(), getStorage(), getWatchedCount() (+7 more)

### Community 57 - "og-card.tsx"
Cohesion: 0.25
Nodes (6): alt, contentType, Image(), runtime, size, OgCardOptions

### Community 58 - "showToast"
Cohesion: 0.19
Nodes (19): BookmarksPage(), SERVER_EMPTY_QUEUE, BookmarkMetaDialog(), BookmarkMetaDialogProps, BookmarksBulkBarProps, EmptyStateProps, clearAllBookmarks(), exportBookmarksJson() (+11 more)

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 61 - "toTitle"
Cohesion: 0.15
Nodes (13): alt, contentType, Image(), runtime, size, generateMetadata(), alt, contentType (+5 more)

### Community 62 - "animeSlug"
Cohesion: 0.08
Nodes (22): BUCKET_META, metadata, revalidate, UpdatePage(), AnimeGrid(), AnimeGridProps, AnimeImage(), AnimeImageProps (+14 more)

### Community 63 - "ADR 0001 — Three-tier cache with stale-while-revalidate"
Cohesion: 0.40
Nodes (4): ADR 0001 — Three-tier cache with stale-while-revalidate, Consequences, Context, Decision

### Community 64 - "package.json"
Cohesion: 0.20
Nodes (9): author, lint-staged, **/*.{js,jsx,ts,tsx,json,css}, name, packageManager, private, type, version (+1 more)

### Community 65 - "denyAdmin"
Cohesion: 0.14
Nodes (21): dynamic, GET(), POST(), dynamic, GET(), POST(), clientIp(), denyAdmin() (+13 more)

### Community 66 - "Deployment"
Cohesion: 0.33
Nodes (5): Deployment, Manual deploy / rollback, Repository configuration, SEO ping, Server prerequisites

### Community 67 - "contrast.test.ts"
Cohesion: 0.21
Nodes (12): accentVariants, contrast(), css, dark, darkAccentVariants, light, parseDeclarations(), relativeLuminance() (+4 more)

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
Cohesion: 0.15
Nodes (20): cleanFirstTitle(), dynamic, GET(), probe(), bodyKey(), DEFAULT_HEADERS, doFetch(), request() (+12 more)

### Community 81 - "compare-selector.tsx"
Cohesion: 0.22
Nodes (8): CompareSelector(), CompareSelectorProps, Pane, PRESET_COMPARISONS, Side, searchCache, useAnimeSearch(), UseAnimeSearchResult

### Community 82 - "use-collection-data.ts"
Cohesion: 0.13
Nodes (25): BookmarkListRow(), BookmarkListRowProps, BookmarksDayList(), BookmarksDayListProps, BookmarksGridViewProps, BookmarksStatusFilters(), BookmarksStatusFiltersProps, chipClass() (+17 more)

### Community 83 - "status/route.ts"
Cohesion: 0.15
Nodes (18): dynamic, GET(), dynamic, GET(), renderBadge(), dynamic, GET(), COMMIT (+10 more)

### Community 84 - "ics.ts"
Cohesion: 0.26
Nodes (13): dynamic, GET(), buildCalendarFeed(), buildWeeklyReminderIcs(), CalendarEvent, CalendarFeedEvent, djb2(), escapeIcs() (+5 more)

### Community 85 - "settings-appearance-section.tsx"
Cohesion: 0.16
Nodes (14): SettingsAppearanceSection(), SettingsAppearanceSectionProps, THEME_OPTIONS, SettingsCatalogSection(), SettingsCatalogSectionProps, SettingsLanguageSection(), SettingsLanguageSectionProps, SettingsSectionHeader() (+6 more)

### Community 87 - "download-group.tsx"
Cohesion: 0.19
Nodes (12): DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), DownloadPlatform(), getPlatformStyle(), requiresLogin(), EpisodeWatchedToggle(), EpisodeWatchedToggleProps (+4 more)

### Community 88 - "cache.ts"
Cohesion: 0.09
Nodes (33): dynamic, GET(), dynamic, handleCspReport(), POST(), currentLevel(), LEVEL_ORDER, logJson() (+25 more)

### Community 89 - "reveal.tsx"
Cohesion: 0.25
Nodes (6): NewSeriesSkeleton(), Reveal(), RevealProps, Anime, NewSeriesAnime(), getAnimePerPage()

### Community 90 - "main-layout.tsx"
Cohesion: 0.07
Nodes (5): CardSkeleton(), GridSkeletonProps, HoneypotTrap(), ListingSkeleton(), ListingSkeletonProps

### Community 91 - "metrics.ts"
Cohesion: 0.22
Nodes (14): CIRCUIT_VALUE, dynamic, GET(), GET(), counters, getEventLoopLagMs(), getHistogramQuantile(), getHistograms() (+6 more)

### Community 92 - "checkEtagMatch"
Cohesion: 0.24
Nodes (15): RFC-9457, GET(), EpisodeGroup, EpisodeMirror, GET(), GET(), GET(), GET() (+7 more)

### Community 93 - "redis.ts"
Cohesion: 0.22
Nodes (14): ensureSubscriber(), getRedis(), handleInvalidateMessage(), INSTANCE_ID, makeClient(), onCacheInvalidate(), publishCacheInvalidate(), RedisClient (+6 more)

### Community 94 - "bookmarks.ts"
Cohesion: 0.19
Nodes (23): BookmarkButton(), BookmarkButtonProps, CollectionCheckerDialog(), LinkResult, parseAniListJson(), parseMalXml(), serializeMalXml(), slugifyTitle() (+15 more)

### Community 95 - "no-third-party.mjs"
Cohesion: 0.20
Nodes (13): add(), CONTENT_HOSTS, findings, hostOf(), isContentHost(), isSelfHost(), RESOURCE_RELS, ROOT (+5 more)

### Community 96 - ".next/**"
Cohesion: 0.14
Nodes (10): .next/**, generateMetadata(), metadata, metadata, generateMetadata(), SearchAnime(), buildDetailMetadata(), buildSearchMetadata() (+2 more)

### Community 97 - "revalidate/route.ts"
Cohesion: 0.33
Nodes (6): dynamic, POST(), MAX_REVALIDATE_PATHS, sanitizeRevalidatePaths(), IndexNowResult, submitToIndexNow()

### Community 98 - "audit-meta.mjs"
Cohesion: 0.13
Nodes (14): args, base, baseArg, checkJsonLd(), checkNode(), limit, limitArg, problems (+6 more)

### Community 99 - "compare-anime-client.tsx"
Cohesion: 0.12
Nodes (28): CompareAnimeClient(), CompareAnimeClientProps, Side, CompareAnimeCard(), CompareAnimeCardProps, SIDE_DETAIL_LABELS, SIDE_LABELS, CompareGenreAnalysis() (+20 more)

### Community 100 - "subscribeProgress"
Cohesion: 0.28
Nodes (8): ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), EpisodeNavigator(), EpisodeNavigatorProps, UpdateIcsButton(), nextUnwatchedEpisode(), subscribeProgress()

### Community 101 - "🚑 RUNBOOK — Kokunime Operations"
Cohesion: 0.17
Nodes (11): 10. Incident checklist (5 menit pertama), 1. Deploy normal, 2. Canary bertahap (opsional), 3. Rollback, 4. Backup & restore, 5. Monitoring & alert, 6. Load & chaos, 7. Feature flags (+3 more)

### Community 102 - "interfaces/index.ts"
Cohesion: 0.14
Nodes (8): DownloadGuideModal(), DownloadSection(), ReadingFocusModeProps, SectionDetail(), parseEpisodeRange(), listEpisodeNumbers(), parseTotalEpisodes(), anime

### Community 103 - "cache-codec.ts"
Cohesion: 0.52
Nodes (5): CACHE_CODEC, decodeCacheValue(), encodeCacheValue(), gunzipAsync, gzipAsync

### Community 104 - "🚀 API Quickstart"
Cohesion: 0.22
Nodes (8): 1. Cari anime, 2. Detail, episode, link download, 3. Jelajah katalog, 4. GraphQL (pengganti resmi `/api/anime/bulk`), 5. Bulk (deprecated — tetap hidup sampai 16 Apr 2027), 6. Endpoint ops (tanpa auth), 🚀 API Quickstart, Etika pemakaian

### Community 105 - "Arsitektur"
Cohesion: 0.25
Nodes (7): Alur request, Arsitektur, Aturan data, Deploy & rilis, Dokumen terkait, Observability, Resiliensi upstream

### Community 106 - "scan-secrets.mjs"
Cohesion: 0.25
Nodes (6): findings, PATTERNS, pending, SCAN_EXTENSIONS, SKIP_DIRS, SKIP_FILES

### Community 107 - "renderOgCard"
Cohesion: 0.33
Nodes (6): alt, contentType, Image(), runtime, size, renderOgCard()

### Community 108 - "toast.ts"
Cohesion: 0.20
Nodes (16): EMPTY_TOASTS, Toaster(), clearToasts(), dismissToast(), emit(), getToasts(), lastShownAt, listeners (+8 more)

### Community 109 - "deps-allowlist.mjs"
Cohesion: 0.33
Nodes (4): allow, pkg, problems, SECTIONS

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

### Community 128 - "app/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 135 - "section-header.tsx"
Cohesion: 0.12
Nodes (13): IndexItem, IndexPage(), letterOf(), LETTERS, metadata, revalidate, metadata, SECTIONS (+5 more)

### Community 136 - "[page]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 137 - "roulette/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 138 - "app/page.tsx"
Cohesion: 0.10
Nodes (8): dynamic, revalidate, RailSkeleton(), HomeLatestSection(), HomeSectionProps, HeroSkeleton(), HomeSkeleton(), SeasonInRail()

### Community 139 - "use-sync-link.ts"
Cohesion: 0.21
Nodes (22): useSyncLink(), UseSyncLinkResult, getFolderOrder(), mergeFolderOrder(), setFolderOrder(), updateBookmarkUserMeta(), removeCollection(), addCollection() (+14 more)

### Community 140 - "stats/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 141 - "update/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 142 - "css-usage-report.mjs"
Cohesion: 0.25
Nodes (6): defined, SOURCE_DIR, sourceFiles, sourceText, STYLE_DIR, unused

### Community 143 - "wrapped/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 144 - "dictionary.ts"
Cohesion: 0.47
Nodes (3): DICTIONARY, DICTIONARY_EN, DICTIONARY_ID

### Community 145 - "bookmarks-folder-bar.tsx"
Cohesion: 0.50
Nodes (4): BookmarksFolderBar(), BookmarksFolderBarProps, folderChipClass(), MAX_COLLECTION_NAME

### Community 146 - "bulk/route.ts"
Cohesion: 0.23
Nodes (12): BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), POST_DEPRECATION_HEADERS, resolveBulk() (+4 more)

### Community 147 - "sanitize.ts"
Cohesion: 0.25
Nodes (7): getAnimeDetailWithMeta(), fetchSinglePage(), extractWithFallback(), FallbackExtractResult, parsePagination(), stripHtmlNoise(), FIXTURES

### Community 148 - "parse-detail.ts"
Cohesion: 0.34
Nodes (9): parseAnimeDetail(), parseDownloads(), getDownloadLinks(), normalizeUrl(), parseBytes(), parseGenres(), normalizeSeasonName(), parseSeason() (+1 more)

### Community 151 - "circuit-breaker.ts"
Cohesion: 0.29
Nodes (11): BreakerEntry, breakers, canRequest(), CircuitState, entryFor(), getCircuitState(), isOpen(), recordFailure() (+3 more)

### Community 152 - "roulette-content.tsx"
Cohesion: 0.26
Nodes (9): metadata, GenreOption, polarPoint(), readSpinHistory(), RouletteContent(), RouletteSpin, SEGMENT_COLORS, segmentPath() (+1 more)

### Community 153 - "search.ts"
Cohesion: 0.33
Nodes (8): mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias(), SEARCH_ALIASES, fetchSearchPage(), mergeWithLocal(), searchAnime(), searchAnimeWithMeta()

### Community 154 - "share-card.ts"
Cohesion: 0.43
Nodes (6): canvasToBlob(), exportShareCard(), renderShareCard(), ShareCardData, ShareCardRow, wrapText()

### Community 155 - "graphql/route.ts"
Cohesion: 0.33
Nodes (8): apqMemory, POST(), sha256(), analyzeQuery(), GRAPHQL_MAX_COMPLEXITY, GRAPHQL_MAX_DEPTH, QueryAnalysis, RESERVED

### Community 156 - "error-card.tsx"
Cohesion: 0.24
Nodes (3): Suggestion, ErrorCard(), ErrorCardProps

### Community 157 - "anime.ts"
Cohesion: 0.29
Nodes (7): AnimeDetail, AnimePage, DownloadOption, DownloadResolution, DownloadTarget, Genre, Recommendation

### Community 158 - "status/page.tsx"
Cohesion: 0.33
Nodes (6): dotClass(), metadata, revalidate, StatusPage(), buildSparklinePath(), SparklineOptions

### Community 159 - "api/page.tsx"
Cohesion: 0.29
Nodes (5): ENDPOINTS, metadata, ApiEndpoint, ApiTesterProps, CodeLang

### Community 160 - "[slug]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (6): alt, contentType, Image(), runtime, size, getAnimeDetail()

### Community 161 - "offline-indicator.tsx"
Cohesion: 0.60
Nodes (5): getCacheServedSnapshot(), getOnlineSnapshot(), OfflineIndicator(), subscribeCacheServed(), subscribeOnline()

### Community 162 - "similar.ts"
Cohesion: 0.53
Nodes (4): genreSet(), numeric(), SimilarInput, similarityScore()

### Community 163 - "keyboard-navigation.tsx"
Cohesion: 0.60
Nodes (4): episodeAnchors(), KeyboardNavigation(), nearestEpisodeAnchor(), SHORTCUTS

## Knowledge Gaps
- **738 isolated node(s):** `revalidate`, `metadata`, `ENDPOINTS`, `dynamic`, `NO_SNAPSHOT` (+733 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `wrapped-content.tsx`, `stats-content.tsx`, `section-header.tsx`, `site.ts`, `app/page.tsx`, `seasons/page.tsx`, `app/layout.tsx`, `storage-keys.ts`, `ignore`, `vitals-reporter.ts`, `roulette-content.tsx`, `animeSlug`, `anime-listing.tsx`, `status/page.tsx`, `api/page.tsx`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `.next/**`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getBookmarks()` (e.g. with `RecommendForYou()` and `StatsContent()`) actually correct?**
  _`getBookmarks()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `revalidate`, `metadata`, `ENDPOINTS` to the rest of the system?**
  _738 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `settings.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13174603174603175 - nodes in this community are weakly interconnected._