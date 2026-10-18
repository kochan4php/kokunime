# Graph Report - kokunime  (2026-10-18)

## Corpus Check
- 533 files · ~173,877 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2292 nodes · 5270 edges · 149 communities (136 shown, 13 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 60 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9064741f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sanitize.ts
- main-layout.tsx
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
- anime-listing.tsx
- scraper/index.ts
- compilerOptions
- interfaces/index.ts
- qr.ts
- formatter
- release-inbox.ts
- find-unused-exports.mjs
- diagnostics.ts
- ignore
- vitals-reporter.ts
- devDependencies
- biome.json
- next.config.mjs
- genres.ts
- toast.ts
- format-date.ts
- [year]/page.tsx
- rules
- safeJsonLd
- useTranslation
- endpointSlug
- collection-actions.ts
- dependencies
- bundle-budget.mjs
- a11y
- use-command-palette.ts
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
- bookmarks/page.tsx
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
- uptime.ts
- ics.ts
- settings-appearance-section.tsx
- qr-reference.py
- download-group.tsx
- cache.ts
- section-detail.tsx
- grid-skeleton.tsx
- metrics.ts
- storage-keys.ts
- search-index.ts
- bookmarks.ts
- no-third-party.mjs
- admin-dashboard.tsx
- revalidate/route.ts
- audit-meta.mjs
- compare-anime-client.tsx
- subscribeProgress
- 🚑 RUNBOOK — Kokunime Operations
- download-section.tsx
- redis.ts
- 🚀 API Quickstart
- Arsitektur
- scan-secrets.mjs
- renderOgCard
- episode-watched-toggle.tsx
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
- duplicate-detector.ts
- [slug]/loading.tsx
- wrapped-content.tsx

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 59 edges
2. `showToast()` - 56 edges
3. `getBookmarks()` - 44 edges
4. `SITE_URL` - 36 edges
5. `scripts` - 33 edges
6. `.next/**` - 32 edges
7. `animeSlug()` - 30 edges
8. `endpointSlug()` - 28 edges
9. `checkEtagMatch()` - 27 edges
10. `generateEtag()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `SeasonYearGroup()` --calls--> `endpointSlug()`  [EXTRACTED]
  src/sections/season-year-group.tsx → src/utils/endpoint-slug.ts
- `useCollectionData()` --indirect_call--> `getCollections()`  [INFERRED]
  src/hooks/use-collection-data.ts → src/utils/collections.ts
- `useCollectionData()` --indirect_call--> `subscribeCollections()`  [INFERRED]
  src/hooks/use-collection-data.ts → src/utils/collections.ts
- `BookmarksPage()` --indirect_call--> `getQueue()`  [INFERRED]
  src/app/bookmarks/page.tsx → src/utils/watch-queue.ts
- `BookmarksPage()` --indirect_call--> `subscribeQueue()`  [INFERRED]
  src/app/bookmarks/page.tsx → src/utils/watch-queue.ts

## Import Cycles
- None detected.

## Communities (149 total, 13 thin omitted)

### Community 0 - "sanitize.ts"
Cohesion: 0.06
Nodes (42): alt, contentType, Image(), runtime, size, Anime, AnimeDetail, AnimePage (+34 more)

### Community 1 - "main-layout.tsx"
Cohesion: 0.09
Nodes (8): IndexItem, IndexPage(), letterOf(), LETTERS, metadata, revalidate, HoneypotTrap(), MainLayout()

### Community 2 - "settings.ts"
Cohesion: 0.14
Nodes (28): DEFAULT_STORAGE, formatQuota(), SettingsPageContent(), SettingsStorageSection(), SettingsStorageSectionProps, SettingsTypographySection(), ThemeSync(), AccentColor (+20 more)

### Community 3 - "icons/index.ts"
Cohesion: 0.05
Nodes (29): footerDevLinks, footerNavLinks, footerTags, Footer(), ChevronLeftIcon(), ChevronRightIcon(), SearchIcon(), IconProps (+21 more)

### Community 4 - "download-extras-panel.tsx"
Cohesion: 0.26
Nodes (17): BatchDownloadTools(), BatchDownloadToolsProps, calculateTime(), copiedButtonClass(), DownloadExtrasPanel(), DownloadExtrasPanelProps, buildAria2(), buildCurlSh() (+9 more)

### Community 5 - "scripts"
Cohesion: 0.06
Nodes (33): scripts, a11y:targets, audit:client, audit:meta, backup:cache, build, bundle:budget, changelog (+25 more)

### Community 6 - "stats-content.tsx"
Cohesion: 0.14
Nodes (21): metadata, MiniBarChartProps, MiniBarDatum, dayKey(), formatWatchTime(), MONTHS_SHORT, SERVER_EMPTY, StatsContent() (+13 more)

### Community 7 - "launchBrowser"
Cohesion: 0.12
Nodes (32): CANDIDATES, CdpClient, evaluate(), findBrowser(), launchBrowser(), navigate(), runAxe(), screenshot() (+24 more)

### Community 8 - "style"
Cohesion: 0.22
Nodes (9): style, noNonNullAssertion, noUnusedTemplateLiteral, useConst, useImportType, useNodejsImportProtocol, useNumberNamespace, useSelfClosingElements (+1 more)

### Community 9 - "site.ts"
Cohesion: 0.06
Nodes (28): RFC-9116, .next/**, metadata, dynamic, metadata, dynamic, metadata, SECTIONS (+20 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, axe-core, @biomejs/biome, jsdom, lint-staged, postcss, tailwindcss, @tailwindcss/postcss (+17 more)

### Community 11 - "seasons/page.tsx"
Cohesion: 0.24
Nodes (8): SeasonsPage(), Season, SeasonYearGroup(), SeasonYearGroupProps, TaxonomyCard(), TaxonomyCardProps, groupSeasonsByYear(), orderYears()

### Community 12 - "anime-listing.tsx"
Cohesion: 0.14
Nodes (19): useUrlState(), AnimeListing(), AnimeListingProps, LISTING_SCHEMA, SORT_LABELS, SORT_MODES, SortMode, VIEW_MODES (+11 more)

### Community 13 - "scraper/index.ts"
Cohesion: 0.05
Nodes (88): RFC-9457, BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), POST_DEPRECATION_HEADERS (+80 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts (+24 more)

### Community 15 - "interfaces/index.ts"
Cohesion: 0.10
Nodes (14): Anime(), generateMetadata(), revalidate, RootLayout(), viewport, rules, buildDetailMetadata(), buildAnimeJsonLd() (+6 more)

### Community 16 - "qr.ts"
Cohesion: 0.14
Nodes (25): PrintQrCard(), PrintQrCardProps, addEccAndInterleave(), applyMask(), buildMatrix(), dataCodewords(), drawCodewords(), drawFormatBits() (+17 more)

### Community 17 - "formatter"
Cohesion: 0.40
Nodes (5): quoteStyle, semicolons, trailingCommas, javascript, formatter

### Community 18 - "release-inbox.ts"
Cohesion: 0.21
Nodes (20): chipClass(), EMPTY, InboxBell(), ReleaseWatcher(), ReleaseWatcherProps, cachedInbox, cachedUnread, getInboxReleases() (+12 more)

### Community 19 - "find-unused-exports.mjs"
Cohesion: 0.18
Nodes (11): corpus, exportsByFile, files, ROOT, SCAN_DIRS, SKIP_EXPORTS, SRC_DIRS, textCache (+3 more)

### Community 20 - "diagnostics.ts"
Cohesion: 0.06
Nodes (33): Suggestion, DeviceDiagnostics(), NO_ENTRIES, timeFormat, TYPE_LABEL, TYPE_ORDER, ErrorCard(), ErrorCardProps (+25 more)

### Community 21 - "ignore"
Cohesion: 0.22
Nodes (9): files, ignore, ignoreUnknown, node_modules/**, coverage/**, dist/**, graphify-out/**, pnpm-lock.yaml (+1 more)

### Community 22 - "vitals-reporter.ts"
Cohesion: 0.07
Nodes (37): dynamic, GET(), WebVitals(), EnvIssue, isHttpUrl(), isRedisUrl(), validateEnv(), onRequestError() (+29 more)

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
Cohesion: 0.13
Nodes (26): CACHE_TTL_SECONDS, mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias(), SEARCH_ALIASES, cached(), CacheTier, TTL (+18 more)

### Community 27 - "toast.ts"
Cohesion: 0.07
Nodes (39): formatAge(), OfflinePage(), CopyButtonProps, DetailHeroProps, DetailHeroViewProps, readPosterUrl(), registerRefreshSync(), SaveOfflineButton() (+31 more)

### Community 28 - "format-date.ts"
Cohesion: 0.50
Nodes (3): formatLocalizedDate(), MONTHS_EN, MONTHS_ID

### Community 29 - "[year]/page.tsx"
Cohesion: 0.12
Nodes (19): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+11 more)

### Community 30 - "rules"
Cohesion: 0.20
Nodes (10): noUnusedVariables, useExhaustiveDependencies, useJsxKeyInIterable, linter, enabled, rules, correctness, recommended (+2 more)

### Community 31 - "safeJsonLd"
Cohesion: 0.10
Nodes (24): ApiDocsPage(), ENDPOINTS, metadata, ComparePage(), ComparePageProps, dynamic, metadata, dynamic (+16 more)

### Community 32 - "useTranslation"
Cohesion: 0.11
Nodes (22): DetailToc(), SECTIONS, CompareEmptyState(), CompareLoadingCard(), MobileMenu(), MobileMenuProps, NAV_KEY_MAP, NAV_KEY_MAP (+14 more)

### Community 33 - "endpointSlug"
Cohesion: 0.09
Nodes (24): dynamic, SeasonPage(), DetailMeta(), MetaItemProps, chipColors, GenreTags(), GENRE_DICTIONARY, GenreMeta (+16 more)

### Community 34 - "collection-actions.ts"
Cohesion: 0.30
Nodes (14): EMPTY_HISTORY, EMPTY_PROGRESS, HomeHistoryStrip(), clearCollectionTab(), removeCollectionItem(), removeHistoryDay(), clearAllHistory(), EMPTY_HISTORY (+6 more)

### Community 35 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, cheerio, husky, next, react, react-dom, redis, sharp (+7 more)

### Community 36 - "bundle-budget.mjs"
Cohesion: 0.27
Nodes (8): baseline, collect(), current, formatKb(), report(), statSize(), THRESHOLD, walk()

### Community 37 - "a11y"
Cohesion: 0.25
Nodes (8): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, a11y

### Community 38 - "use-command-palette.ts"
Cohesion: 0.18
Nodes (17): CommandPalette(), CommandPalette, clientSearchCache, useCommandPalette(), UseCommandPaletteResult, fuzzyScore(), HighlightSegment, highlightSegments() (+9 more)

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
Cohesion: 0.24
Nodes (15): HistoryTracker(), HistoryTrackerProps, clearAllProgress(), EMPTY_PROGRESS, getProgress(), getStorage(), getWatchedCount(), isEpisodeWatched() (+7 more)

### Community 57 - "og-card.tsx"
Cohesion: 0.25
Nodes (6): alt, contentType, Image(), runtime, size, OgCardOptions

### Community 58 - "bookmarks/page.tsx"
Cohesion: 0.15
Nodes (19): BookmarksPage(), SERVER_EMPTY_QUEUE, BookmarkMetaDialog(), BookmarksBulkBarProps, BookmarksToolbar(), BookmarksToolbarProps, EmptyStateProps, CollectionTab (+11 more)

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
Cohesion: 0.07
Nodes (28): BUCKET_META, metadata, revalidate, UpdatePage(), AnimeGrid(), AnimeGridProps, AnimeImage(), AnimeImageProps (+20 more)

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
Cohesion: 0.12
Nodes (28): cleanFirstTitle(), dynamic, GET(), probe(), bodyKey(), DEFAULT_HEADERS, doFetch(), request() (+20 more)

### Community 81 - "compare-selector.tsx"
Cohesion: 0.22
Nodes (7): CompareSelector(), CompareSelectorProps, Pane, PRESET_COMPARISONS, Side, searchCache, UseAnimeSearchResult

### Community 82 - "use-collection-data.ts"
Cohesion: 0.14
Nodes (22): BookmarkMetaDialogProps, BookmarkListRow(), BookmarkListRowProps, BookmarksDayList(), BookmarksDayListProps, BookmarksGridViewProps, BookmarksStatusFilters(), BookmarksStatusFiltersProps (+14 more)

### Community 83 - "uptime.ts"
Cohesion: 0.22
Nodes (13): dynamic, GET(), dynamic, GET(), renderBadge(), redisCounterValue(), redisRateLimit(), dayKey() (+5 more)

### Community 84 - "ics.ts"
Cohesion: 0.24
Nodes (14): dynamic, GET(), UpdateIcsButton(), buildCalendarFeed(), buildWeeklyReminderIcs(), CalendarEvent, CalendarFeedEvent, djb2() (+6 more)

### Community 85 - "settings-appearance-section.tsx"
Cohesion: 0.16
Nodes (14): SettingsAppearanceSection(), SettingsAppearanceSectionProps, THEME_OPTIONS, SettingsCatalogSection(), SettingsCatalogSectionProps, SettingsLanguageSection(), SettingsLanguageSectionProps, SettingsSectionHeader() (+6 more)

### Community 87 - "download-group.tsx"
Cohesion: 0.19
Nodes (11): DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), DownloadPlatform(), getPlatformStyle(), requiresLogin(), episodeAnchors(), KeyboardNavigation() (+3 more)

### Community 88 - "cache.ts"
Cohesion: 0.13
Nodes (22): dynamic, GET(), onCacheInvalidate(), entries, getSlowRequests(), SLOW_REQUEST_MS, SlowRequestEntry, CachedResult (+14 more)

### Community 89 - "section-detail.tsx"
Cohesion: 0.19
Nodes (7): NewSeriesSkeleton(), ReadingFocusModeProps, SectionDetail(), Synopsis(), Reveal(), RevealProps, parseTotalEpisodes()

### Community 90 - "grid-skeleton.tsx"
Cohesion: 0.13
Nodes (4): CardSkeleton(), GridSkeletonProps, ListingSkeleton(), ListingSkeletonProps

### Community 91 - "metrics.ts"
Cohesion: 0.16
Nodes (21): CIRCUIT_VALUE, dynamic, GET(), dynamic, GET(), COMMIT, dynamic, GET() (+13 more)

### Community 92 - "storage-keys.ts"
Cohesion: 0.21
Nodes (6): DeferredPwaInstallBanner, BeforeInstallPromptEvent, getRecent(), SearchHistoryChips(), writeRecent(), STORAGE_KEYS

### Community 93 - "search-index.ts"
Cohesion: 0.19
Nodes (17): getRedis(), makeClient(), compact(), getIndexedBySlugs(), getIndexSnapshot(), IndexedAnime, rankIndexItems(), searchLocalIndex() (+9 more)

### Community 94 - "bookmarks.ts"
Cohesion: 0.17
Nodes (27): BookmarkButton(), BookmarkButtonProps, CollectionCheckerDialog(), LinkResult, RecommendForYou(), RecommendItem, RecommendResponse, SERVER_BOOKMARKS (+19 more)

### Community 95 - "no-third-party.mjs"
Cohesion: 0.20
Nodes (13): add(), CONTENT_HOSTS, findings, hostOf(), isContentHost(), isSelfHost(), RESOURCE_RELS, ROOT (+5 more)

### Community 96 - "admin-dashboard.tsx"
Cohesion: 0.22
Nodes (9): metadata, AdminDashboard(), FeatureFlagView, PRESET_PATHS, AdminLogEntry, adminRequest(), AdminRequestResult, useAdminConsole() (+1 more)

### Community 97 - "revalidate/route.ts"
Cohesion: 0.31
Nodes (7): dynamic, POST(), MAX_REVALIDATE_PATHS, sanitizeRevalidatePaths(), IndexNowResult, submitToIndexNow(), publishCacheInvalidate()

### Community 98 - "audit-meta.mjs"
Cohesion: 0.13
Nodes (14): args, base, baseArg, checkJsonLd(), checkNode(), limit, limitArg, problems (+6 more)

### Community 99 - "compare-anime-client.tsx"
Cohesion: 0.11
Nodes (31): CompareAnimeClient(), CompareAnimeClientProps, Side, CompareAnimeCard(), CompareAnimeCardProps, SIDE_DETAIL_LABELS, SIDE_LABELS, CompareGenreAnalysis() (+23 more)

### Community 100 - "subscribeProgress"
Cohesion: 0.35
Nodes (7): ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), EpisodeNavigator(), EpisodeNavigatorProps, nextUnwatchedEpisode(), subscribeProgress()

### Community 101 - "🚑 RUNBOOK — Kokunime Operations"
Cohesion: 0.17
Nodes (11): 10. Incident checklist (5 menit pertama), 1. Deploy normal, 2. Canary bertahap (opsional), 3. Rollback, 4. Backup & restore, 5. Monitoring & alert, 6. Load & chaos, 7. Feature flags (+3 more)

### Community 102 - "download-section.tsx"
Cohesion: 0.33
Nodes (5): DownloadGuideModal(), DownloadSection(), parseEpisodeRange(), listEpisodeNumbers(), anime

### Community 103 - "redis.ts"
Cohesion: 0.21
Nodes (13): POST(), sha256(), CACHE_CODEC, decodeCacheValue(), encodeCacheValue(), gunzipAsync, gzipAsync, ensureSubscriber() (+5 more)

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

### Community 108 - "episode-watched-toggle.tsx"
Cohesion: 0.48
Nodes (4): EpisodeWatchedToggle(), EpisodeWatchedToggleProps, COMPLETED_FOLDER, maybeAutoArchive()

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
Cohesion: 0.18
Nodes (9): generateMetadata(), SearchAnime(), SectionHeader(), SectionHeaderProps, SectionTone, TONE_CLASS, buildSearchMetadata(), decodeQuery() (+1 more)

### Community 136 - "[page]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 137 - "roulette/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 138 - "app/page.tsx"
Cohesion: 0.09
Nodes (12): dynamic, revalidate, DetailHero(), RailSkeleton(), compute(), getBlurDataUrl(), memory, HomeHeroSection() (+4 more)

### Community 139 - "use-sync-link.ts"
Cohesion: 0.20
Nodes (22): useSyncLink(), UseSyncLinkResult, getFolderOrder(), mergeFolderOrder(), setFolderOrder(), removeCollection(), addCollection(), EMPTY_COLLECTIONS (+14 more)

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

### Community 149 - "duplicate-detector.ts"
Cohesion: 0.53
Nodes (4): DuplicateGroup, findDuplicateGroups(), NOISE_WORDS, normalizeTitle()

### Community 154 - "wrapped-content.tsx"
Cohesion: 0.19
Nodes (10): metadata, MONTHS_SHORT, SERVER_EMPTY, ProgressEntry, canvasToBlob(), exportShareCard(), renderShareCard(), ShareCardData (+2 more)

## Knowledge Gaps
- **720 isolated node(s):** `cheerio`, `husky`, `next`, `react`, `react-dom` (+715 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `site.ts` to `admin-dashboard.tsx`, `main-layout.tsx`, `endpointSlug`, `stats-content.tsx`, `section-header.tsx`, `app/page.tsx`, `seasons/page.tsx`, `interfaces/index.ts`, `ignore`, `vitals-reporter.ts`, `wrapped-content.tsx`, `[year]/page.tsx`, `animeSlug`, `safeJsonLd`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `site.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getBookmarks()` (e.g. with `RecommendForYou()` and `StatsContent()`) actually correct?**
  _`getBookmarks()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `cheerio`, `husky`, `next` to the rest of the system?**
  _720 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sanitize.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06438631790744467 - nodes in this community are weakly interconnected._