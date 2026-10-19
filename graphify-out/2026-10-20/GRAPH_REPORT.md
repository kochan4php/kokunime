# Graph Report - kokunime  (2026-10-19)

## Corpus Check
- 564 files · ~193,974 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2455 nodes · 5829 edges · 166 communities (145 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 79 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `10851355`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- backup.ts
- toast.ts
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
- vitals-reporter.ts
- devDependencies
- biome.json
- next.config.mjs
- sanitize.ts
- offline-saved.ts
- format-date.ts
- [season]/page.tsx
- rules
- safeJsonLd
- useTranslation
- endpointSlug
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
- anime-image.tsx
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
- bookmarks.ts
- status/page.tsx
- ics.ts
- listing-skeleton.tsx
- qr-reference.py
- progress.ts
- cache.ts
- grid-skeleton.tsx
- main-layout.tsx
- metrics.ts
- sitemap-entries.ts
- redis.ts
- indeks/page.tsx
- no-third-party.mjs
- .next/**
- revalidate/route.ts
- audit-meta.mjs
- compare-anime-client.tsx
- denyAdmin
- 🚑 RUNBOOK — Kokunime Operations
- interfaces/index.ts
- keyboard-navigation.tsx
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
- home-skeleton.tsx
- use-sync-link.ts
- stats/opengraph-image.tsx
- update/opengraph-image.tsx
- css-usage-report.mjs
- wrapped/opengraph-image.tsx
- dictionary.ts
- footer/index.tsx
- error-reporter.ts
- detail-hero.tsx
- app/page.tsx
- admin-dashboard.tsx
- [slug]/loading.tsx
- route-error.tsx
- error-card.tsx
- webhook-dispatcher.ts
- share-card.ts
- offline-indicator.tsx
- env.ts
- anime.ts
- synopsis.tsx
- download-group.tsx
- [season]/opengraph-image.tsx
- duplicate-detector.ts
- bookmarks-bulk-bar.tsx
- components/empty-state.tsx
- og-card.tsx

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
- `CollectionCheckerDialogProps` --references--> `BookmarkItem`  [EXTRACTED]
  src/components/bookmarks/collection-checker-dialog.tsx → src/utils/bookmarks.ts
- `TagIndexPage()` --indirect_call--> `getCatalogSnapshot()`  [INFERRED]
  src/app/tag/page.tsx → src/utils/local-catalog.ts
- `TagDetailPage()` --indirect_call--> `getCatalogSnapshot()`  [INFERRED]
  src/app/tag/[tag]/page.tsx → src/utils/local-catalog.ts
- `SearchLocalPanel()` --indirect_call--> `subscribeCatalog()`  [INFERRED]
  src/components/search-local-panel.tsx → src/utils/local-catalog.ts
- `ContinueWatching()` --indirect_call--> `subscribeProgress()`  [INFERRED]
  src/components/anime/continue-watching.tsx → src/utils/progress.ts

## Import Cycles
- None detected.

## Communities (166 total, 21 thin omitted)

### Community 0 - "backup.ts"
Cohesion: 0.12
Nodes (31): COLLECTION_LABELS, SettingsStorageSection(), SettingsStorageSectionProps, useBackupTools(), UseBackupToolsResult, BackupCollection, BackupImportMode, BackupPayload (+23 more)

### Community 1 - "toast.ts"
Cohesion: 0.12
Nodes (41): NO_SNAPSHOT, TagIndexPage(), NO_SNAPSHOT, TagDetailPage(), AnimeTagsEditor(), EMPTY_TOASTS, Toaster(), subscribeCatalog() (+33 more)

### Community 2 - "settings.ts"
Cohesion: 0.10
Nodes (38): DEFAULT_STORAGE, formatQuota(), SettingsPageContent(), SettingsAppearanceSection(), SettingsAppearanceSectionProps, THEME_OPTIONS, SettingsCatalogSection(), SettingsCatalogSectionProps (+30 more)

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
Cohesion: 0.16
Nodes (19): metadata, MiniBarChartProps, MiniBarDatum, dayKey(), formatWatchTime(), MONTHS_SHORT, SERVER_EMPTY, StatsContent() (+11 more)

### Community 7 - "sleep"
Cohesion: 0.09
Nodes (40): CANDIDATES, CdpClient, evaluate(), findBrowser(), launchBrowser(), navigate(), runAxe(), screenshot() (+32 more)

### Community 8 - "style"
Cohesion: 0.22
Nodes (9): style, noNonNullAssertion, noUnusedTemplateLiteral, useConst, useImportType, useNodejsImportProtocol, useNumberNamespace, useSelfClosingElements (+1 more)

### Community 9 - "site.ts"
Cohesion: 0.09
Nodes (26): RFC-9116, dynamic, GET(), dynamic, dynamic, GET(), dynamic, GET() (+18 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): axe-core, @biomejs/biome, jsdom, lint-staged, devDependencies, axe-core, @biomejs/biome, jsdom (+17 more)

### Community 11 - "section-header.tsx"
Cohesion: 0.16
Nodes (9): metadata, SECTIONS, SeasonsPage(), SectionHeader(), SectionHeaderProps, SectionTone, TONE_CLASS, groupSeasonsByYear() (+1 more)

### Community 12 - "anime-listing.tsx"
Cohesion: 0.14
Nodes (19): useUrlState(), AnimeListing(), AnimeListingProps, LISTING_SCHEMA, SORT_LABELS, SORT_MODES, SortMode, VIEW_MODES (+11 more)

### Community 13 - "scraper/index.ts"
Cohesion: 0.06
Nodes (86): RFC-9457, BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), POST_DEPRECATION_HEADERS (+78 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts (+24 more)

### Community 15 - "[slug]/page.tsx"
Cohesion: 0.11
Nodes (15): Anime(), generateMetadata(), revalidate, RootLayout(), viewport, rules, buildDetailMetadata(), metadata (+7 more)

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
Cohesion: 0.14
Nodes (23): DeviceDiagnostics(), NO_ENTRIES, timeFormat, TYPE_LABEL, TYPE_ORDER, StaleDataBanner(), registerPeriodicSync(), ServiceWorkerRegister() (+15 more)

### Community 21 - "ignore"
Cohesion: 0.22
Nodes (9): files, ignore, ignoreUnknown, node_modules/**, coverage/**, dist/**, graphify-out/**, pnpm-lock.yaml (+1 more)

### Community 22 - "vitals-reporter.ts"
Cohesion: 0.18
Nodes (14): dynamic, GET(), WebVitals(), getVitalsSummary(), lastSent, percentile(), recordSample(), reportVitals() (+6 more)

### Community 23 - "devDependencies"
Cohesion: 0.05
Nodes (42): dependencies, cheerio, husky, next, react, react-dom, redis, sharp (+34 more)

### Community 24 - "biome.json"
Cohesion: 0.22
Nodes (8): organizeImports, enabled, overrides, $schema, vcs, clientKind, enabled, useIgnoreFile

### Community 25 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - "sanitize.ts"
Cohesion: 0.06
Nodes (57): alt, contentType, Image(), runtime, size, mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias() (+49 more)

### Community 27 - "offline-saved.ts"
Cohesion: 0.17
Nodes (26): formatAge(), OfflinePage(), readPosterUrl(), registerRefreshSync(), SaveOfflineButton(), SaveOfflineButtonProps, askServiceWorker(), clearRollingCache() (+18 more)

### Community 29 - "[season]/page.tsx"
Cohesion: 0.15
Nodes (16): dynamic, generateMetadata(), GenrePage(), dynamic, generateMetadata(), SeasonPage(), Breadcrumbs(), Crumb (+8 more)

### Community 30 - "rules"
Cohesion: 0.20
Nodes (10): noUnusedVariables, useExhaustiveDependencies, useJsxKeyInIterable, linter, enabled, rules, correctness, recommended (+2 more)

### Community 31 - "safeJsonLd"
Cohesion: 0.12
Nodes (19): ApiDocsPage(), ENDPOINTS, metadata, ComparePage(), ComparePageProps, dynamic, metadata, GenresPage() (+11 more)

### Community 32 - "useTranslation"
Cohesion: 0.10
Nodes (25): DetailToc(), SECTIONS, CompareSelector(), CompareSelectorProps, Pane, PRESET_COMPARISONS, Side, CompareEmptyState() (+17 more)

### Community 33 - "endpointSlug"
Cohesion: 0.10
Nodes (17): revalidate, YearPage(), DetailMeta(), MetaItemProps, chipColors, GenreTags(), GENRE_DICTIONARY, GenreMeta (+9 more)

### Community 34 - "wrapped-content.tsx"
Cohesion: 0.12
Nodes (27): metadata, HistoryTracker(), HistoryTrackerProps, EMPTY_HISTORY, EMPTY_PROGRESS, HomeHistoryStrip(), RecommendForYou(), RecommendItem (+19 more)

### Community 35 - "dependencies"
Cohesion: 0.13
Nodes (15): cheerio, husky, next, dependencies, cheerio, husky, next, react (+7 more)

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

### Community 49 - "anime-image.tsx"
Cohesion: 0.19
Nodes (7): AnimeImage(), AnimeImageProps, AnimeSearchFieldProps, TrendingEntry, Recommendation, RecommendedAnime(), isGif()

### Community 51 - "watch-queue.ts"
Cohesion: 0.33
Nodes (16): BookmarksQueueView(), SERVER_EMPTY, addToQueue(), clearQueue(), EMPTY_QUEUE, getQueue(), getStorage(), isQueued() (+8 more)

### Community 57 - "[year]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 58 - "showToast"
Cohesion: 0.20
Nodes (32): BookmarksPage(), SERVER_EMPTY_QUEUE, BookmarkButton(), BookmarkButtonProps, BookmarkMetaDialog(), CollectionCheckerDialog(), CollectionCheckerDialogProps, LinkResult (+24 more)

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
Cohesion: 0.19
Nodes (14): dynamic, GET(), POST(), FEATURE_FLAG_REGISTRY, FeatureFlag, FeatureFlagKey, FlagOverrides, getFeatureFlags() (+6 more)

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
Nodes (27): cleanFirstTitle(), dynamic, GET(), probe(), bodyKey(), DEFAULT_HEADERS, doFetch(), request() (+19 more)

### Community 81 - "reveal.tsx"
Cohesion: 0.16
Nodes (11): NewSeriesSkeleton(), Reveal(), RevealProps, Anime, Season, NewSeriesAnime(), SeasonYearGroup(), SeasonYearGroupProps (+3 more)

### Community 82 - "bookmarks.ts"
Cohesion: 0.11
Nodes (31): BookmarkMetaDialogProps, BookmarkListRow(), BookmarkListRowProps, BookmarksDayList(), BookmarksDayListProps, BookmarksGridViewProps, BookmarksStatusFilters(), BookmarksStatusFiltersProps (+23 more)

### Community 83 - "status/page.tsx"
Cohesion: 0.14
Nodes (19): dynamic, GET(), dynamic, GET(), renderBadge(), dotClass(), metadata, revalidate (+11 more)

### Community 84 - "ics.ts"
Cohesion: 0.24
Nodes (14): dynamic, GET(), UpdateIcsButton(), buildCalendarFeed(), buildWeeklyReminderIcs(), CalendarEvent, CalendarFeedEvent, djb2() (+6 more)

### Community 87 - "progress.ts"
Cohesion: 0.17
Nodes (22): EpisodeNavigator(), EpisodeNavigatorProps, EpisodeWatchedToggle(), EpisodeWatchedToggleProps, COMPLETED_FOLDER, maybeAutoArchive(), clearAllProgress(), EMPTY_PROGRESS (+14 more)

### Community 88 - "cache.ts"
Cohesion: 0.10
Nodes (31): dynamic, GET(), currentLevel(), LEVEL_ORDER, logJson(), LogLevel, redact(), rotateIfNeeded() (+23 more)

### Community 90 - "main-layout.tsx"
Cohesion: 0.10
Nodes (3): DeferredPwaInstallBanner, HoneypotTrap(), BeforeInstallPromptEvent

### Community 91 - "metrics.ts"
Cohesion: 0.16
Nodes (22): CIRCUIT_VALUE, dynamic, GET(), dynamic, GET(), COMMIT, dynamic, GET() (+14 more)

### Community 92 - "sitemap-entries.ts"
Cohesion: 0.42
Nodes (6): GET(), GET(), getSitemapEntries(), SITEMAP_CHUNK_SIZE, SitemapEntry, getLastUpstreamFetchAt()

### Community 93 - "redis.ts"
Cohesion: 0.18
Nodes (17): CACHE_CODEC, decodeCacheValue(), encodeCacheValue(), gunzipAsync, gzipAsync, ensureSubscriber(), getRedis(), handleInvalidateMessage() (+9 more)

### Community 94 - "indeks/page.tsx"
Cohesion: 0.33
Nodes (6): IndexItem, IndexPage(), letterOf(), LETTERS, metadata, revalidate

### Community 95 - "no-third-party.mjs"
Cohesion: 0.20
Nodes (13): add(), CONTENT_HOSTS, findings, hostOf(), isContentHost(), isSelfHost(), RESOURCE_RELS, ROOT (+5 more)

### Community 96 - ".next/**"
Cohesion: 0.13
Nodes (8): .next/**, metadata, metadata, revalidate, generateMetadata(), SearchAnime(), buildSearchMetadata(), decodeQuery()

### Community 97 - "revalidate/route.ts"
Cohesion: 0.31
Nodes (7): dynamic, POST(), MAX_REVALIDATE_PATHS, sanitizeRevalidatePaths(), IndexNowResult, submitToIndexNow(), publishCacheInvalidate()

### Community 98 - "audit-meta.mjs"
Cohesion: 0.13
Nodes (14): args, base, baseArg, checkJsonLd(), checkNode(), limit, limitArg, problems (+6 more)

### Community 99 - "compare-anime-client.tsx"
Cohesion: 0.10
Nodes (33): CompareAnimeClient(), CompareAnimeClientProps, Side, CompareAnimeCard(), CompareAnimeCardProps, SIDE_DETAIL_LABELS, SIDE_LABELS, CompareGenreAnalysis() (+25 more)

### Community 100 - "denyAdmin"
Cohesion: 0.29
Nodes (9): dynamic, GET(), POST(), clientIp(), denyAdmin(), isRedisConfigured(), safeCompare(), getIndexSize() (+1 more)

### Community 101 - "🚑 RUNBOOK — Kokunime Operations"
Cohesion: 0.17
Nodes (11): 10. Incident checklist (5 menit pertama), 1. Deploy normal, 2. Canary bertahap (opsional), 3. Rollback, 4. Backup & restore, 5. Monitoring & alert, 6. Load & chaos, 7. Feature flags (+3 more)

### Community 102 - "interfaces/index.ts"
Cohesion: 0.17
Nodes (11): ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), DownloadGuideModal(), DownloadSection(), SectionDetail(), parseEpisodeRange(), listEpisodeNumbers() (+3 more)

### Community 103 - "keyboard-navigation.tsx"
Cohesion: 0.60
Nodes (4): episodeAnchors(), KeyboardNavigation(), nearestEpisodeAnchor(), SHORTCUTS

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
Cohesion: 0.27
Nodes (5): FirstVisitTips(), getRecent(), SearchHistoryChips(), writeRecent(), STORAGE_KEYS

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
Cohesion: 0.15
Nodes (15): AnimeGrid(), AnimeGridProps, GenreOption, polarPoint(), readSpinHistory(), RouletteContent(), RouletteSpin, SEGMENT_COLORS (+7 more)

### Community 136 - "[page]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 137 - "roulette/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 139 - "use-sync-link.ts"
Cohesion: 0.17
Nodes (23): BookmarksFolderBar(), BookmarksFolderBarProps, folderChipClass(), useSyncLink(), UseSyncLinkResult, getFolderOrder(), mergeFolderOrder(), addCollection() (+15 more)

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

### Community 146 - "error-reporter.ts"
Cohesion: 0.20
Nodes (13): onRequestError(), register(), ErrorReport, lastSent, reportError(), scrubMessage(), suppressed, truncate() (+5 more)

### Community 147 - "detail-hero.tsx"
Cohesion: 0.14
Nodes (7): CopyButtonProps, DetailHeroProps, DetailHeroViewProps, ShareButtonProps, TrailerButtonProps, VerticalJapaneseTitle(), VerticalJapaneseTitleProps

### Community 148 - "app/page.tsx"
Cohesion: 0.18
Nodes (9): dynamic, DetailHero(), compute(), getBlurDataUrl(), memory, HomeHeroSection(), HomeLatestSection(), HomeSectionProps (+1 more)

### Community 149 - "admin-dashboard.tsx"
Cohesion: 0.22
Nodes (9): metadata, AdminDashboard(), FeatureFlagView, PRESET_PATHS, AdminLogEntry, adminRequest(), AdminRequestResult, useAdminConsole() (+1 more)

### Community 151 - "route-error.tsx"
Cohesion: 0.21
Nodes (3): RouteError(), RouteErrorProps, formatDiagnostics()

### Community 152 - "error-card.tsx"
Cohesion: 0.24
Nodes (3): Suggestion, ErrorCard(), ErrorCardProps

### Community 153 - "webhook-dispatcher.ts"
Cohesion: 0.36
Nodes (6): detectIpFamily(), fetchWithRedirectGuard(), isPublicHttpUrl(), PRIVATE_V4, dispatchDiscordWebhook(), WebhookPayload

### Community 154 - "share-card.ts"
Cohesion: 0.43
Nodes (6): canvasToBlob(), exportShareCard(), renderShareCard(), ShareCardData, ShareCardRow, wrapText()

### Community 155 - "offline-indicator.tsx"
Cohesion: 0.60
Nodes (5): getCacheServedSnapshot(), getOnlineSnapshot(), OfflineIndicator(), subscribeCacheServed(), subscribeOnline()

### Community 156 - "env.ts"
Cohesion: 0.53
Nodes (4): EnvIssue, isHttpUrl(), isRedisUrl(), validateEnv()

### Community 157 - "anime.ts"
Cohesion: 0.33
Nodes (6): AnimeDetail, AnimePage, DownloadOption, DownloadResolution, DownloadTarget, Genre

### Community 163 - "download-group.tsx"
Cohesion: 0.24
Nodes (8): DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), DownloadPlatform(), getPlatformStyle(), requiresLogin(), subscribeSettings(), useSettings()

### Community 164 - "[season]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 165 - "duplicate-detector.ts"
Cohesion: 0.53
Nodes (4): DuplicateGroup, findDuplicateGroups(), NOISE_WORDS, normalizeTitle()

## Knowledge Gaps
- **748 isolated node(s):** `KEEP_CACHES`, `CACHE_CAPS`, `PRECACHE_URLS`, `OFFLINE_PAGES`, `API_SWR` (+743 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `endpointSlug`, `wrapped-content.tsx`, `stats-content.tsx`, `site.ts`, `section-header.tsx`, `[slug]/page.tsx`, `error-reporter.ts`, `status/page.tsx`, `app/page.tsx`, `ignore`, `admin-dashboard.tsx`, `update/page.tsx`, `sitemap-entries.ts`, `[season]/page.tsx`, `indeks/page.tsx`, `safeJsonLd`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `.next/**`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getBookmarks()` (e.g. with `RecommendForYou()` and `StatsContent()`) actually correct?**
  _`getBookmarks()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `KEEP_CACHES`, `CACHE_CAPS`, `PRECACHE_URLS` to the rest of the system?**
  _748 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12162162162162163 - nodes in this community are weakly interconnected._