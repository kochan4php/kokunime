# Graph Report - kokunime  (2026-10-20)

## Corpus Check
- 579 files · ~196,153 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2489 nodes · 5932 edges · 176 communities (160 shown, 16 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 79 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `270e6fa8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- backup.ts
- tags.ts
- settings.ts
- icons/index.ts
- download-extras-panel.tsx
- scripts
- stats-content.tsx
- sleep
- style
- site.ts
- devDependencies
- section-header.tsx
- anime-listing.tsx
- scraper/index.ts
- compilerOptions
- [slug]/page.tsx
- qr.ts
- formatter
- release-inbox.ts
- find-unused-exports.mjs
- diagnostics.ts
- ignore
- skeleton-primitives.tsx
- devDependencies
- biome.json
- next.config.mjs
- genres.ts
- offline-saved.ts
- format-date.ts
- [season]/page.tsx
- rules
- safeJsonLd
- useTranslation
- endpointSlug
- history.ts
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
- scraper/constants.ts
- watch-queue.ts
- vitest.config.ts
- [year]/opengraph-image.tsx
- showToast
- post-commit
- post-checkout
- [genre]/opengraph-image.tsx
- update/page.tsx
- ADR 0001 — Three-tier cache with stale-while-revalidate
- package.json
- feature-flags.ts
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
- reveal.tsx
- use-collection-data.ts
- status/page.tsx
- ics.ts
- listing-skeleton.tsx
- qr-reference.py
- progress.ts
- logger.ts
- grid-skeleton.tsx
- main-layout.tsx
- metrics.ts
- sitemap-entries.ts
- search-index.ts
- indeks/page.tsx
- no-third-party.mjs
- .next/**
- denyAdmin
- audit-meta.mjs
- compare.ts
- bookmarks.ts
- 🚑 RUNBOOK — Kokunime Operations
- interfaces/index.ts
- local-catalog.ts
- 🚀 API Quickstart
- Arsitektur
- scan-secrets.mjs
- renderOgCard
- storage-keys.ts
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
- animeSlug
- [page]/opengraph-image.tsx
- roulette/opengraph-image.tsx
- app/page.tsx
- use-sync-link.ts
- stats/opengraph-image.tsx
- update/opengraph-image.tsx
- css-usage-report.mjs
- wrapped/opengraph-image.tsx
- dictionary.ts
- footer/index.tsx
- vitals-reporter.ts
- detail-hero.tsx
- home-content.tsx
- admin-dashboard.tsx
- [slug]/loading.tsx
- compare-anime-client.tsx
- cache.ts
- saved-searches.ts
- wrapped-content.tsx
- settings-page-content.tsx
- escapeXml
- anime.ts
- sanitize.ts
- toast.ts
- anime-detail.ts
- search.ts
- download-group.tsx
- [season]/opengraph-image.tsx
- duplicate-detector.ts
- [year]/page.tsx
- parse.ts
- roulette-content.tsx
- query-syntax.ts
- og-card.tsx
- backup-crypto.ts
- cache-codec.ts
- season-window.ts
- genres-explorer.tsx
- seasons-explorer.tsx

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 69 edges
2. `showToast()` - 68 edges
3. `getBookmarks()` - 44 edges
4. `scripts` - 36 edges
5. `SITE_URL` - 36 edges
6. `animeSlug()` - 34 edges
7. `.next/**` - 32 edges
8. `checkEtagMatch()` - 29 edges
9. `generateEtag()` - 29 edges
10. `checkRateLimit()` - 29 edges

## Surprising Connections (you probably didn't know these)
- `SettingsTypographySectionProps` --references--> `AppSettings`  [EXTRACTED]
  src/components/settings/settings-typography-section.tsx → src/utils/settings.ts
- `CollectionCheckerDialogProps` --references--> `BookmarkItem`  [EXTRACTED]
  src/components/bookmarks/collection-checker-dialog.tsx → src/utils/bookmarks.ts
- `BookmarkMetaDialogProps` --references--> `BookmarkItem`  [EXTRACTED]
  src/components/bookmark-meta-dialog.tsx → src/utils/bookmarks.ts
- `TagIndexPage()` --indirect_call--> `getCatalogSnapshot()`  [INFERRED]
  src/app/tag/page.tsx → src/utils/local-catalog.ts
- `TagDetailPage()` --indirect_call--> `getCatalogSnapshot()`  [INFERRED]
  src/app/tag/[tag]/page.tsx → src/utils/local-catalog.ts

## Import Cycles
- None detected.

## Communities (176 total, 16 thin omitted)

### Community 0 - "backup.ts"
Cohesion: 0.16
Nodes (24): COLLECTION_LABELS, SettingsStorageSection(), SettingsStorageSectionProps, useBackupTools(), UseBackupToolsResult, BackupCollection, BackupImportMode, BackupPayload (+16 more)

### Community 1 - "tags.ts"
Cohesion: 0.23
Nodes (25): NO_SNAPSHOT, TagIndexPage(), NO_SNAPSHOT, TagDetailPage(), AnimeTagsEditor(), subscribeCatalog(), addTag(), clearTags() (+17 more)

### Community 2 - "settings.ts"
Cohesion: 0.15
Nodes (22): formatQuota(), SettingsPageContent(), SettingsTypographySection(), SettingsTypographySectionProps, ThemeSync(), AccentColor, applySettingsToDom(), applyTheme() (+14 more)

### Community 3 - "icons/index.ts"
Cohesion: 0.06
Nodes (27): ChevronLeftIcon(), ChevronRightIcon(), SearchIcon(), IconProps, Input(), BeforeInstallPromptEvent, SearchFormProps, PaginationInfo (+19 more)

### Community 4 - "download-extras-panel.tsx"
Cohesion: 0.26
Nodes (17): BatchDownloadTools(), BatchDownloadToolsProps, calculateTime(), copiedButtonClass(), DownloadExtrasPanel(), DownloadExtrasPanelProps, buildAria2(), buildCurlSh() (+9 more)

### Community 5 - "scripts"
Cohesion: 0.06
Nodes (36): scripts, a11y:targets, a11y:v2, audit:client, audit:meta, backup:cache, build, bundle:budget (+28 more)

### Community 6 - "stats-content.tsx"
Cohesion: 0.18
Nodes (19): metadata, EpisodeWatchedToggle(), EpisodeWatchedToggleProps, dayKey(), formatWatchTime(), MONTHS_SHORT, SERVER_EMPTY, StatsContent() (+11 more)

### Community 7 - "sleep"
Cohesion: 0.09
Nodes (40): CANDIDATES, CdpClient, evaluate(), findBrowser(), launchBrowser(), navigate(), runAxe(), screenshot() (+32 more)

### Community 8 - "style"
Cohesion: 0.22
Nodes (9): style, noNonNullAssertion, noUnusedTemplateLiteral, useConst, useImportType, useNodejsImportProtocol, useNumberNamespace, useSelfClosingElements (+1 more)

### Community 9 - "site.ts"
Cohesion: 0.09
Nodes (13): RFC-9116, dynamic, dynamic, revalidate, metadata, SECTIONS, metadata, openGraph (+5 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): axe-core, @biomejs/biome, jsdom, lint-staged, devDependencies, axe-core, @biomejs/biome, jsdom (+17 more)

### Community 11 - "section-header.tsx"
Cohesion: 0.23
Nodes (7): SeasonsPage(), SectionHeader(), SectionHeaderProps, SectionTone, TONE_CLASS, groupSeasonsByYear(), orderYears()

### Community 12 - "anime-listing.tsx"
Cohesion: 0.14
Nodes (19): useUrlState(), AnimeListing(), AnimeListingProps, LISTING_SCHEMA, SORT_LABELS, SORT_MODES, SortMode, VIEW_MODES (+11 more)

### Community 13 - "scraper/index.ts"
Cohesion: 0.06
Nodes (84): RFC-9457, BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), POST_DEPRECATION_HEADERS (+76 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts (+24 more)

### Community 15 - "[slug]/page.tsx"
Cohesion: 0.10
Nodes (16): Anime(), generateMetadata(), revalidate, RootLayout(), viewport, rules, WebVitals(), buildDetailMetadata() (+8 more)

### Community 16 - "qr.ts"
Cohesion: 0.14
Nodes (25): PrintQrCard(), PrintQrCardProps, addEccAndInterleave(), applyMask(), buildMatrix(), dataCodewords(), drawCodewords(), drawFormatBits() (+17 more)

### Community 17 - "formatter"
Cohesion: 0.40
Nodes (5): quoteStyle, semicolons, trailingCommas, javascript, formatter

### Community 18 - "release-inbox.ts"
Cohesion: 0.21
Nodes (21): chipClass(), EMPTY, InboxBell(), ReleaseWatcher(), ReleaseWatcherProps, cachedInbox, cachedUnread, getInboxReleases() (+13 more)

### Community 19 - "find-unused-exports.mjs"
Cohesion: 0.18
Nodes (11): corpus, exportsByFile, files, ROOT, SCAN_DIRS, SKIP_EXPORTS, SRC_DIRS, textCache (+3 more)

### Community 20 - "diagnostics.ts"
Cohesion: 0.08
Nodes (31): DeviceDiagnostics(), NO_ENTRIES, timeFormat, TYPE_LABEL, TYPE_ORDER, getCacheServedSnapshot(), getOnlineSnapshot(), OfflineIndicator() (+23 more)

### Community 21 - "ignore"
Cohesion: 0.22
Nodes (9): files, ignore, ignoreUnknown, node_modules/**, coverage/**, dist/**, graphify-out/**, pnpm-lock.yaml (+1 more)

### Community 22 - "skeleton-primitives.tsx"
Cohesion: 0.10
Nodes (6): SkeletonPage(), SkeletonPageProps, BreadcrumbSkeleton(), ProseSkeleton(), SectionHeaderSkeleton(), SectionHeaderSkeletonProps

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
Cohesion: 0.22
Nodes (17): cached(), CacheTier, TTL, fetchSingleGenrePage(), getAnimeByGenres(), getGenres(), getGenresWithMeta(), parseSimplePagination() (+9 more)

### Community 27 - "offline-saved.ts"
Cohesion: 0.17
Nodes (26): formatAge(), OfflinePage(), readPosterUrl(), registerRefreshSync(), SaveOfflineButton(), SaveOfflineButtonProps, askServiceWorker(), clearRollingCache() (+18 more)

### Community 29 - "[season]/page.tsx"
Cohesion: 0.24
Nodes (9): dynamic, generateMetadata(), GenrePage(), dynamic, generateMetadata(), SeasonPage(), Breadcrumbs(), Crumb (+1 more)

### Community 30 - "rules"
Cohesion: 0.20
Nodes (10): noUnusedVariables, useExhaustiveDependencies, useJsxKeyInIterable, linter, enabled, rules, correctness, recommended (+2 more)

### Community 31 - "safeJsonLd"
Cohesion: 0.12
Nodes (19): ApiDocsPage(), ENDPOINTS, metadata, ComparePage(), ComparePageProps, dynamic, metadata, GenresPage() (+11 more)

### Community 32 - "useTranslation"
Cohesion: 0.11
Nodes (23): DetailToc(), SECTIONS, CompareAnimeCard(), CompareAnimeCardProps, SIDE_DETAIL_LABELS, SIDE_LABELS, CompareSynopsis(), MobileMenu() (+15 more)

### Community 33 - "endpointSlug"
Cohesion: 0.21
Nodes (8): DetailMeta(), MetaItemProps, chipColors, GenreTags(), SeasonInRail(), SeasonRail(), SeasonRailProps, endpointSlug()

### Community 34 - "history.ts"
Cohesion: 0.18
Nodes (18): HistoryTracker(), HistoryTrackerProps, EMPTY_HISTORY, EMPTY_PROGRESS, HomeHistoryStrip(), RecommendItem, RecommendResponse, SERVER_BOOKMARKS (+10 more)

### Community 35 - "dependencies"
Cohesion: 0.13
Nodes (15): cheerio, husky, next, dependencies, cheerio, husky, next, react (+7 more)

### Community 36 - "bundle-budget.mjs"
Cohesion: 0.27
Nodes (8): baseline, collect(), current, formatKb(), report(), statSize(), THRESHOLD, walk()

### Community 37 - "a11y"
Cohesion: 0.25
Nodes (8): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, a11y

### Community 38 - "use-command-palette.ts"
Cohesion: 0.13
Nodes (24): CommandPalette(), CommandPalette, clientSearchCache, mergePaletteResults(), toPaletteAnime(), useCommandPalette(), UseCommandPaletteResult, fuzzyScore() (+16 more)

### Community 39 - "suspicious"
Cohesion: 0.22
Nodes (9): suspicious, noArrayIndexKey, noAssignInExpressions, noConsoleLog, noControlCharactersInRegex, noExplicitAny, noGlobalIsNan, noMisleadingCharacterClass (+1 more)

### Community 41 - "sw.js"
Cohesion: 0.14
Nodes (18): API_SWR, broadcast(), CACHE_CAPS, capSavedEntries(), DEGRADED_TIERS, KEEP_CACHES, notifyDataState(), notifyServedFromCache() (+10 more)

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

### Community 49 - "scraper/constants.ts"
Cohesion: 0.22
Nodes (10): Recommendation, RecommendedAnime(), UPSTREAM_URL, bestImage(), ImgLike, resolveAssetUrl(), formatAnimeData(), getRecommendations() (+2 more)

### Community 51 - "watch-queue.ts"
Cohesion: 0.17
Nodes (21): BookmarksQueueView(), SERVER_EMPTY, AnimeImage(), AnimeImageProps, AnimeSearchFieldProps, TrendingEntry, isGif(), addToQueue() (+13 more)

### Community 57 - "[year]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 58 - "showToast"
Cohesion: 0.19
Nodes (19): BookmarksPage(), SERVER_EMPTY_QUEUE, BookmarkMetaDialog(), BookmarkMetaDialogProps, BookmarksBulkBarProps, EmptyStateProps, clearAllBookmarks(), exportBookmarksJson() (+11 more)

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 61 - "[genre]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 62 - "update/page.tsx"
Cohesion: 0.25
Nodes (8): BUCKET_META, metadata, revalidate, UpdatePage(), AgeBucket, NUMBER_WORDS, parseRelativeAge(), RelativeAge

### Community 63 - "ADR 0001 — Three-tier cache with stale-while-revalidate"
Cohesion: 0.40
Nodes (4): ADR 0001 — Three-tier cache with stale-while-revalidate, Consequences, Context, Decision

### Community 64 - "package.json"
Cohesion: 0.20
Nodes (9): author, lint-staged, **/*.{js,jsx,ts,tsx,json,css}, name, packageManager, private, type, version (+1 more)

### Community 65 - "feature-flags.ts"
Cohesion: 0.21
Nodes (13): dynamic, GET(), POST(), FEATURE_FLAG_REGISTRY, FeatureFlag, FeatureFlagKey, FlagOverrides, getFeatureFlags() (+5 more)

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
Cohesion: 0.11
Nodes (31): cleanFirstTitle(), dynamic, GET(), probe(), dynamic, GET(), bodyKey(), DEFAULT_HEADERS (+23 more)

### Community 81 - "reveal.tsx"
Cohesion: 0.20
Nodes (8): NewSeriesSkeleton(), Reveal(), RevealProps, Season, SeasonYearGroup(), SeasonYearGroupProps, TaxonomyCard(), TaxonomyCardProps

### Community 82 - "use-collection-data.ts"
Cohesion: 0.13
Nodes (25): BookmarkListRow(), BookmarkListRowProps, BookmarksDayList(), BookmarksDayListProps, BookmarksGridViewProps, BookmarksStatusFilters(), BookmarksStatusFiltersProps, chipClass() (+17 more)

### Community 83 - "status/page.tsx"
Cohesion: 0.14
Nodes (19): dynamic, GET(), dynamic, GET(), renderBadge(), dotClass(), metadata, revalidate (+11 more)

### Community 84 - "ics.ts"
Cohesion: 0.12
Nodes (17): Suggestion, dynamic, GET(), ErrorCard(), ErrorCardProps, UpdateIcsButton(), buildCalendarFeed(), buildWeeklyReminderIcs() (+9 more)

### Community 85 - "listing-skeleton.tsx"
Cohesion: 0.18
Nodes (3): HomeSkeleton(), ListingSkeleton(), ListingSkeletonProps

### Community 87 - "progress.ts"
Cohesion: 0.19
Nodes (21): EpisodeNavigator(), EpisodeNavigatorProps, episodeAnchors(), KeyboardNavigation(), nearestEpisodeAnchor(), SHORTCUTS, clearAllProgress(), EMPTY_PROGRESS (+13 more)

### Community 88 - "logger.ts"
Cohesion: 0.18
Nodes (16): dynamic, GET(), currentLevel(), LEVEL_ORDER, logJson(), LogLevel, redact(), rotateIfNeeded() (+8 more)

### Community 90 - "main-layout.tsx"
Cohesion: 0.16
Nodes (4): DeferredPwaInstallBanner, HoneypotTrap(), BeforeInstallPromptEvent, MainLayout()

### Community 91 - "metrics.ts"
Cohesion: 0.18
Nodes (17): CIRCUIT_VALUE, dynamic, GET(), COMMIT, dynamic, GET(), UPSTREAM_CIRCUIT_KEY, counters (+9 more)

### Community 92 - "sitemap-entries.ts"
Cohesion: 0.42
Nodes (6): GET(), GET(), getSitemapEntries(), SITEMAP_CHUNK_SIZE, SitemapEntry, getLastUpstreamFetchAt()

### Community 93 - "search-index.ts"
Cohesion: 0.18
Nodes (19): dynamic, GET(), POST(), getRedis(), isRedisConfigured(), makeClient(), getIndexDump(), getIndexedBySlugs() (+11 more)

### Community 94 - "indeks/page.tsx"
Cohesion: 0.33
Nodes (6): IndexItem, IndexPage(), letterOf(), LETTERS, metadata, revalidate

### Community 95 - "no-third-party.mjs"
Cohesion: 0.20
Nodes (13): add(), CONTENT_HOSTS, findings, hostOf(), isContentHost(), isSelfHost(), RESOURCE_RELS, ROOT (+5 more)

### Community 96 - ".next/**"
Cohesion: 0.19
Nodes (7): .next/**, metadata, metadata, generateMetadata(), SearchAnime(), buildSearchMetadata(), decodeQuery()

### Community 97 - "denyAdmin"
Cohesion: 0.23
Nodes (9): dynamic, POST(), clientIp(), denyAdmin(), MAX_REVALIDATE_PATHS, sanitizeRevalidatePaths(), IndexNowResult, submitToIndexNow() (+1 more)

### Community 98 - "audit-meta.mjs"
Cohesion: 0.13
Nodes (14): args, base, baseArg, checkJsonLd(), checkNode(), limit, limitArg, problems (+6 more)

### Community 99 - "compare.ts"
Cohesion: 0.18
Nodes (17): CompareGenreAnalysis(), CompareGenreAnalysisProps, axisPoint(), CompareRadar(), CompareRadarProps, polygonPoints(), CompareSpecsTable(), CompareSpecsTableProps (+9 more)

### Community 100 - "bookmarks.ts"
Cohesion: 0.18
Nodes (25): BookmarkButton(), BookmarkButtonProps, CollectionCheckerDialog(), CollectionCheckerDialogProps, LinkResult, RecommendForYou(), WrappedContent(), COMPLETED_FOLDER (+17 more)

### Community 101 - "🚑 RUNBOOK — Kokunime Operations"
Cohesion: 0.17
Nodes (11): 10. Incident checklist (5 menit pertama), 1. Deploy normal, 2. Canary bertahap (opsional), 3. Rollback, 4. Backup & restore, 5. Monitoring & alert, 6. Load & chaos, 7. Feature flags (+3 more)

### Community 102 - "interfaces/index.ts"
Cohesion: 0.13
Nodes (11): ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), DownloadGuideModal(), DownloadSection(), ReadingFocusModeProps, SectionDetail(), listEpisodeNumbers() (+3 more)

### Community 103 - "local-catalog.ts"
Cohesion: 0.15
Nodes (26): CatalogEntry, CatalogFacet, clearCatalog(), countFacet(), ensureServerIndexMerged(), ensureStorageListener(), entries, getCatalogMeta() (+18 more)

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

### Community 108 - "storage-keys.ts"
Cohesion: 0.33
Nodes (4): getRecent(), SearchHistoryChips(), writeRecent(), STORAGE_KEYS

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
Cohesion: 0.33
Nodes (5): files, IGNORED_DIRS, limitFor(), over, sorted

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

### Community 135 - "animeSlug"
Cohesion: 0.18
Nodes (9): AnimeGrid(), AnimeGridProps, CatalogRecorder(), CatalogRecorderProps, ViewTransitionLink(), ViewTransitionLinkProps, FeaturedHero(), FeaturedHeroProps (+1 more)

### Community 136 - "[page]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 137 - "roulette/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 138 - "app/page.tsx"
Cohesion: 0.20
Nodes (3): dynamic, FirstVisitTips(), HeroSkeleton()

### Community 139 - "use-sync-link.ts"
Cohesion: 0.16
Nodes (26): BookmarksFolderBar(), BookmarksFolderBarProps, folderChipClass(), useSyncLink(), UseSyncLinkResult, getFolderOrder(), mergeFolderOrder(), setFolderOrder() (+18 more)

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

### Community 145 - "footer/index.tsx"
Cohesion: 0.29
Nodes (4): footerDevLinks, footerNavLinks, footerTags, Footer()

### Community 146 - "vitals-reporter.ts"
Cohesion: 0.07
Nodes (36): dynamic, GET(), EnvIssue, isHttpUrl(), isRedisUrl(), validateEnv(), onRequestError(), register() (+28 more)

### Community 147 - "detail-hero.tsx"
Cohesion: 0.14
Nodes (7): CopyButtonProps, DetailHeroProps, DetailHeroViewProps, ShareButtonProps, TrailerButtonProps, VerticalJapaneseTitle(), VerticalJapaneseTitleProps

### Community 148 - "home-content.tsx"
Cohesion: 0.27
Nodes (7): DetailHero(), compute(), getBlurDataUrl(), memory, HomeHeroSection(), HomeLatestSection(), HomeSectionProps

### Community 149 - "admin-dashboard.tsx"
Cohesion: 0.22
Nodes (9): metadata, AdminDashboard(), FeatureFlagView, PRESET_PATHS, AdminLogEntry, adminRequest(), AdminRequestResult, useAdminConsole() (+1 more)

### Community 151 - "compare-anime-client.tsx"
Cohesion: 0.14
Nodes (18): CompareAnimeClient(), CompareAnimeClientProps, Side, CompareSelector(), CompareSelectorProps, Pane, PRESET_COMPARISONS, Side (+10 more)

### Community 152 - "cache.ts"
Cohesion: 0.16
Nodes (22): incrementMetric(), ensureSubscriber(), handleInvalidateMessage(), INSTANCE_ID, onCacheInvalidate(), publishCacheInvalidate(), RedisClient, redisSet() (+14 more)

### Community 153 - "saved-searches.ts"
Cohesion: 0.23
Nodes (19): NO_SNAPSHOT, SearchLocalPanel(), SearchLocalPanelProps, searchLocalCatalog(), cache, checkSavedSearches(), emit(), ensureStorageListener() (+11 more)

### Community 154 - "wrapped-content.tsx"
Cohesion: 0.14
Nodes (12): metadata, MiniBarChartProps, MiniBarDatum, MONTHS_SHORT, SERVER_EMPTY, ProgressEntry, canvasToBlob(), exportShareCard() (+4 more)

### Community 155 - "settings-page-content.tsx"
Cohesion: 0.18
Nodes (16): DEFAULT_STORAGE, SettingsAppearanceSection(), SettingsAppearanceSectionProps, THEME_OPTIONS, SettingsCatalogSection(), SettingsCatalogSectionProps, SettingsLanguageSection(), SettingsLanguageSectionProps (+8 more)

### Community 156 - "escapeXml"
Cohesion: 0.19
Nodes (14): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+6 more)

### Community 157 - "anime.ts"
Cohesion: 0.33
Nodes (6): AnimeDetail, AnimePage, DownloadOption, DownloadResolution, DownloadTarget, Genre

### Community 158 - "sanitize.ts"
Cohesion: 0.25
Nodes (12): parseAnimeDetail(), parseDownloads(), getDownloadLinks(), normalizeUrl(), parseBytes(), parseGenres(), normalizeSeasonName(), parseSeason() (+4 more)

### Community 160 - "toast.ts"
Cohesion: 0.20
Nodes (16): EMPTY_TOASTS, Toaster(), clearToasts(), dismissToast(), emit(), getToasts(), lastShownAt, listeners (+8 more)

### Community 161 - "anime-detail.ts"
Cohesion: 0.18
Nodes (10): alt, contentType, Image(), runtime, size, getAnimeDetail(), getAnimeDetailWithMeta(), extractWithFallback() (+2 more)

### Community 162 - "search.ts"
Cohesion: 0.33
Nodes (8): mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias(), SEARCH_ALIASES, fetchSearchPage(), mergeWithLocal(), searchAnime(), searchAnimeWithMeta()

### Community 163 - "download-group.tsx"
Cohesion: 0.24
Nodes (8): DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), DownloadPlatform(), getPlatformStyle(), requiresLogin(), subscribeSettings(), useSettings()

### Community 164 - "[season]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 165 - "duplicate-detector.ts"
Cohesion: 0.53
Nodes (4): DuplicateGroup, findDuplicateGroups(), NOISE_WORDS, normalizeTitle()

### Community 166 - "[year]/page.tsx"
Cohesion: 0.29
Nodes (5): dynamic, GET(), revalidate, YearPage(), collectYearAnime()

### Community 167 - "parse.ts"
Cohesion: 0.33
Nodes (5): Anime, NewSeriesAnime(), fetchSinglePage(), getAnimePerPage(), parsePagination()

### Community 168 - "roulette-content.tsx"
Cohesion: 0.36
Nodes (8): GenreOption, polarPoint(), readSpinHistory(), RouletteContent(), RouletteSpin, SEGMENT_COLORS, segmentPath(), writeSpinHistory()

### Community 169 - "query-syntax.ts"
Cohesion: 0.36
Nodes (6): IndexedAnime, ParsedQuery, parseQuerySyntax(), queryUsesLocalOnlyFilters(), splitList(), records

### Community 171 - "backup-crypto.ts"
Cohesion: 0.47
Nodes (7): bufferOf(), decryptBackup(), deriveKey(), encryptBackup(), EncryptedEnvelope, fromBase64(), toBase64()

### Community 172 - "cache-codec.ts"
Cohesion: 0.52
Nodes (5): CACHE_CODEC, decodeCacheValue(), encodeCacheValue(), gunzipAsync, gzipAsync

### Community 173 - "season-window.ts"
Cohesion: 0.52
Nodes (5): getSeasonWindow(), parseSeasonSlug(), pickCurrentSeason(), SEASON_RANGES, SeasonWindow

### Community 174 - "genres-explorer.tsx"
Cohesion: 0.40
Nodes (5): GENRE_DICTIONARY, GenreMeta, GenresExplorer(), GenresExplorerProps, getGenreMeta()

### Community 175 - "seasons-explorer.tsx"
Cohesion: 0.50
Nodes (4): getSeasonInfo(), SEASON_META, SeasonsExplorer(), SeasonsExplorerProps

## Knowledge Gaps
- **750 isolated node(s):** `SkeletonPageProps`, `SectionHeaderSkeletonProps`, `ListingSkeletonProps`, `BackupPayload`, `BackupPreviewResult` (+745 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `stats-content.tsx`, `[year]/page.tsx`, `site.ts`, `app/page.tsx`, `section-header.tsx`, `[slug]/page.tsx`, `vitals-reporter.ts`, `status/page.tsx`, `ignore`, `admin-dashboard.tsx`, `update/page.tsx`, `wrapped-content.tsx`, `sitemap-entries.ts`, `[season]/page.tsx`, `indeks/page.tsx`, `safeJsonLd`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `.next/**`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getBookmarks()` (e.g. with `RecommendForYou()` and `StatsContent()`) actually correct?**
  _`getBookmarks()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `SkeletonPageProps`, `SectionHeaderSkeletonProps`, `ListingSkeletonProps` to the rest of the system?**
  _750 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `icons/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05747126436781609 - nodes in this community are weakly interconnected._