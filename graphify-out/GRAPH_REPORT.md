# Graph Report - kokunime  (2026-10-20)

## Corpus Check
- 603 files · ~206,686 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2635 nodes · 6338 edges · 180 communities (164 shown, 16 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 81 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e8d3ad16`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- backup.ts
- tags.ts
- useTranslation
- icons/index.ts
- download-extras-panel.tsx
- scripts
- episode-watched-toggle.tsx
- sleep
- style
- site.ts
- devDependencies
- use-sync-link.ts
- anime-listing.tsx
- endpoint-slug.ts
- compilerOptions
- [slug]/page.tsx
- qr.ts
- formatter
- storage-keys.ts
- find-unused-exports.mjs
- diagnostics.ts
- ignore
- page-skeleton.tsx
- devDependencies
- biome.json
- next.config.mjs
- genres.ts
- offline-saved.ts
- format-date.ts
- [season]/page.tsx
- rules
- safeJsonLd
- reports.ts
- endpointSlug
- showToast
- dependencies
- bundle-budget.mjs
- a11y
- status/page.tsx
- suspicious
- postcss.config.js
- sw.js
- backup-cache.mjs
- e2e-smoke.mjs
- load-test.mjs
- complexity
- main-layout.tsx
- watch-queue.ts
- vitest.config.ts
- [year]/opengraph-image.tsx
- use-command-palette.ts
- post-commit
- post-checkout
- [genre]/opengraph-image.tsx
- update/page.tsx
- ADR 0001 — Three-tier cache with stale-while-revalidate
- package.json
- skeleton-primitives.tsx
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
- denyAdmin
- section-detail.tsx
- saved-searches.ts
- qr-reference.py
- progress.ts
- scraper/index.ts
- search-index.ts
- [letter]/page.tsx
- metrics.ts
- toast.ts
- checkRateLimit
- lib/link-health.ts
- no-third-party.mjs
- .next/**
- Kokunime
- audit-meta.mjs
- interfaces/index.ts
- bookmarks.ts
- 🚑 RUNBOOK — Kokunime Operations
- slow-log.ts
- local-catalog.ts
- 🚀 API Quickstart
- Arsitektur
- scan-secrets.mjs
- renderOgCard
- Security Policy
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
- catalog-snapshot.ts
- [page]/opengraph-image.tsx
- roulette/opengraph-image.tsx
- app/page.tsx
- logger.ts
- stats/opengraph-image.tsx
- update/opengraph-image.tsx
- css-usage-report.mjs
- wrapped/opengraph-image.tsx
- check-link-health.mjs
- footer/index.tsx
- vitals-reporter.ts
- detail-hero.tsx
- search-history-chips.tsx
- sanitize.ts
- [slug]/loading.tsx
- revalidate/route.ts
- problemResponse
- ics.ts
- stats-content.tsx
- settings.ts
- escapeXml
- anime.ts
- scraper/constants.ts
- cache-codec.ts
- anime-detail.ts
- search.ts
- download-group.tsx
- [season]/opengraph-image.tsx
- admin-dashboard.tsx
- share-card.ts
- PULL_REQUEST_TEMPLATE.md
- trending.ts
- og-card.tsx
- backup-crypto.ts
- cache.ts
- graphql/route.ts
- dictionary.ts
- continue-watching.tsx
- grid-skeleton.tsx
- duplicate-detector.ts
- parse.ts
- animeSlug

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 69 edges
2. `showToast()` - 68 edges
3. `getBookmarks()` - 44 edges
4. `SITE_URL` - 38 edges
5. `scripts` - 37 edges
6. `animeSlug()` - 36 edges
7. `problemResponse()` - 35 edges
8. `.next/**` - 33 edges
9. `getRequestId()` - 32 edges
10. `safeJsonLd()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `SeasonYearGroup()` --calls--> `endpointSlug()`  [EXTRACTED]
  src/sections/season-year-group.tsx → src/utils/endpoint-slug.ts
- `TagIndexPage()` --indirect_call--> `getCatalogSnapshot()`  [INFERRED]
  src/app/tag/page.tsx → src/utils/local-catalog.ts
- `TagDetailPage()` --indirect_call--> `getCatalogSnapshot()`  [INFERRED]
  src/app/tag/[tag]/page.tsx → src/utils/local-catalog.ts
- `SearchLocalPanel()` --indirect_call--> `subscribeCatalog()`  [INFERRED]
  src/components/search-local-panel.tsx → src/utils/local-catalog.ts
- `RecommendForYou()` --indirect_call--> `getBookmarks()`  [INFERRED]
  src/components/recommend-for-you.tsx → src/utils/bookmarks.ts

## Import Cycles
- None detected.

## Communities (180 total, 16 thin omitted)

### Community 0 - "backup.ts"
Cohesion: 0.16
Nodes (22): COLLECTION_LABELS, SettingsStorageSection(), SettingsStorageSectionProps, UseBackupToolsResult, BackupCollection, BackupImportMode, BackupPayload, BackupPreview (+14 more)

### Community 1 - "tags.ts"
Cohesion: 0.23
Nodes (25): NO_SNAPSHOT, TagIndexPage(), NO_SNAPSHOT, TagDetailPage(), AnimeTagsEditor(), subscribeCatalog(), addTag(), clearTags() (+17 more)

### Community 2 - "useTranslation"
Cohesion: 0.10
Nodes (25): DetailToc(), SECTIONS, CompareSelector(), CompareSelectorProps, Pane, PRESET_COMPARISONS, Side, CompareEmptyState() (+17 more)

### Community 3 - "icons/index.ts"
Cohesion: 0.05
Nodes (27): ChevronLeftIcon(), ChevronRightIcon(), SearchIcon(), IconProps, Input(), BeforeInstallPromptEvent, SearchFormProps, PaginationInfo (+19 more)

### Community 4 - "download-extras-panel.tsx"
Cohesion: 0.26
Nodes (17): BatchDownloadTools(), BatchDownloadToolsProps, calculateTime(), copiedButtonClass(), DownloadExtrasPanel(), DownloadExtrasPanelProps, buildAria2(), buildCurlSh() (+9 more)

### Community 5 - "scripts"
Cohesion: 0.05
Nodes (37): scripts, a11y:targets, a11y:v2, audit:client, audit:meta, backup:cache, build, bundle:budget (+29 more)

### Community 6 - "episode-watched-toggle.tsx"
Cohesion: 0.22
Nodes (15): EpisodeWatchedToggle(), EpisodeWatchedToggleProps, COMPLETED_FOLDER, maybeAutoArchive(), countMarksSince(), EMPTY_MARKS, EpisodeMark, getEpisodeMarks() (+7 more)

### Community 7 - "sleep"
Cohesion: 0.09
Nodes (40): CANDIDATES, CdpClient, evaluate(), findBrowser(), launchBrowser(), navigate(), runAxe(), screenshot() (+32 more)

### Community 8 - "style"
Cohesion: 0.22
Nodes (9): style, noNonNullAssertion, noUnusedTemplateLiteral, useConst, useImportType, useNodejsImportProtocol, useNumberNamespace, useSelfClosingElements (+1 more)

### Community 9 - "site.ts"
Cohesion: 0.09
Nodes (20): RFC-9116, dynamic, dynamic, metadata, SECTIONS, metadata, dynamic, GET() (+12 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): axe-core, @biomejs/biome, jsdom, lint-staged, devDependencies, axe-core, @biomejs/biome, jsdom (+17 more)

### Community 11 - "use-sync-link.ts"
Cohesion: 0.17
Nodes (24): BookmarksFolderBar(), BookmarksFolderBarProps, folderChipClass(), useSyncLink(), UseSyncLinkResult, getFolderOrder(), mergeFolderOrder(), setFolderOrder() (+16 more)

### Community 12 - "anime-listing.tsx"
Cohesion: 0.14
Nodes (19): useUrlState(), AnimeListing(), AnimeListingProps, LISTING_SCHEMA, SORT_LABELS, SORT_MODES, SortMode, VIEW_MODES (+11 more)

### Community 13 - "endpoint-slug.ts"
Cohesion: 0.22
Nodes (16): GET(), GET(), GET(), GET(), dynamic, GET(), GET(), dynamic (+8 more)

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

### Community 18 - "storage-keys.ts"
Cohesion: 0.19
Nodes (22): chipClass(), EMPTY, InboxBell(), ReleaseWatcher(), ReleaseWatcherProps, cachedInbox, cachedUnread, getInboxReleases() (+14 more)

### Community 19 - "find-unused-exports.mjs"
Cohesion: 0.18
Nodes (11): corpus, exportsByFile, files, ROOT, SCAN_DIRS, SKIP_EXPORTS, SRC_DIRS, textCache (+3 more)

### Community 20 - "diagnostics.ts"
Cohesion: 0.06
Nodes (34): Suggestion, DeviceDiagnostics(), NO_ENTRIES, timeFormat, TYPE_LABEL, TYPE_ORDER, ErrorCard(), ErrorCardProps (+26 more)

### Community 21 - "ignore"
Cohesion: 0.22
Nodes (9): files, ignore, ignoreUnknown, node_modules/**, coverage/**, dist/**, graphify-out/**, pnpm-lock.yaml (+1 more)

### Community 22 - "page-skeleton.tsx"
Cohesion: 0.10
Nodes (3): SkeletonPage(), SkeletonPageProps, SectionHeaderSkeleton()

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
Cohesion: 0.23
Nodes (17): cached(), CacheTier, TTL, fetchSingleGenrePage(), getAnimeByGenres(), getGenres(), getGenresWithMeta(), parseSimplePagination() (+9 more)

### Community 27 - "offline-saved.ts"
Cohesion: 0.17
Nodes (26): formatAge(), OfflinePage(), readPosterUrl(), registerRefreshSync(), SaveOfflineButton(), SaveOfflineButtonProps, askServiceWorker(), clearRollingCache() (+18 more)

### Community 29 - "[season]/page.tsx"
Cohesion: 0.14
Nodes (17): dynamic, generateMetadata(), GenrePage(), dynamic, generateMetadata(), SeasonPage(), Breadcrumbs(), Crumb (+9 more)

### Community 30 - "rules"
Cohesion: 0.20
Nodes (10): noUnusedVariables, useExhaustiveDependencies, useJsxKeyInIterable, linter, enabled, rules, correctness, recommended (+2 more)

### Community 31 - "safeJsonLd"
Cohesion: 0.08
Nodes (26): ApiDocsPage(), ENDPOINTS, metadata, ComparePage(), ComparePageProps, dynamic, metadata, GenresPage() (+18 more)

### Community 32 - "reports.ts"
Cohesion: 0.16
Nodes (20): KIND_LABELS, SubmitState, REPORT_KINDS, ReportKind, ReportRecord, ReportStatus, redisHGetAll(), redisHSet() (+12 more)

### Community 33 - "endpointSlug"
Cohesion: 0.09
Nodes (19): dynamic, GET(), revalidate, YearPage(), DetailMeta(), MetaItemProps, chipColors, GenreTags() (+11 more)

### Community 34 - "showToast"
Cohesion: 0.21
Nodes (19): BookmarksPage(), SERVER_EMPTY_QUEUE, BookmarkMetaDialog(), BookmarksBulkBarProps, EmptyStateProps, exportBookmarksJson(), updateBookmarkUserMeta(), addBookmarksToQueue() (+11 more)

### Community 35 - "dependencies"
Cohesion: 0.13
Nodes (15): cheerio, husky, next, dependencies, cheerio, husky, next, react (+7 more)

### Community 36 - "bundle-budget.mjs"
Cohesion: 0.27
Nodes (8): baseline, collect(), current, formatKb(), report(), statSize(), THRESHOLD, walk()

### Community 37 - "a11y"
Cohesion: 0.25
Nodes (8): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, a11y

### Community 38 - "status/page.tsx"
Cohesion: 0.15
Nodes (18): dynamic, GET(), dynamic, GET(), renderBadge(), dotClass(), metadata, revalidate (+10 more)

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

### Community 49 - "main-layout.tsx"
Cohesion: 0.16
Nodes (4): DeferredPwaInstallBanner, HoneypotTrap(), BeforeInstallPromptEvent, MainLayout()

### Community 51 - "watch-queue.ts"
Cohesion: 0.33
Nodes (16): BookmarksQueueView(), SERVER_EMPTY, addToQueue(), clearQueue(), EMPTY_QUEUE, getQueue(), getStorage(), isQueued() (+8 more)

### Community 57 - "[year]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 58 - "use-command-palette.ts"
Cohesion: 0.15
Nodes (21): CommandPalette(), CommandPalette, clientSearchCache, mergePaletteResults(), toPaletteAnime(), useCommandPalette(), UseCommandPaletteResult, fuzzyScore() (+13 more)

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
Cohesion: 0.22
Nodes (9): BUCKET_META, metadata, revalidate, UpdatePage(), UpdateIcsButton(), AgeBucket, NUMBER_WORDS, parseRelativeAge() (+1 more)

### Community 63 - "ADR 0001 — Three-tier cache with stale-while-revalidate"
Cohesion: 0.40
Nodes (4): ADR 0001 — Three-tier cache with stale-while-revalidate, Consequences, Context, Decision

### Community 64 - "package.json"
Cohesion: 0.20
Nodes (9): author, lint-staged, **/*.{js,jsx,ts,tsx,json,css}, name, packageManager, private, type, version (+1 more)

### Community 65 - "skeleton-primitives.tsx"
Cohesion: 0.14
Nodes (6): BreadcrumbSkeleton(), ProseSkeleton(), SectionHeaderSkeletonProps, HomeSkeleton(), ListingSkeleton(), ListingSkeletonProps

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
Nodes (27): cleanFirstTitle(), dynamic, GET(), probe(), bodyKey(), DEFAULT_HEADERS, doFetch(), request() (+19 more)

### Community 81 - "reveal.tsx"
Cohesion: 0.13
Nodes (9): NewSeriesSkeleton(), ReadingFocusModeProps, Reveal(), RevealProps, Season, SeasonYearGroup(), SeasonYearGroupProps, TaxonomyCard() (+1 more)

### Community 82 - "use-collection-data.ts"
Cohesion: 0.15
Nodes (22): BookmarkMetaDialogProps, BookmarkListRow(), BookmarkListRowProps, BookmarksDayList(), BookmarksDayListProps, BookmarksGridViewProps, BookmarksToolbar(), BookmarksToolbarProps (+14 more)

### Community 83 - "denyAdmin"
Cohesion: 0.14
Nodes (21): dynamic, GET(), POST(), dynamic, GET(), POST(), clientIp(), denyAdmin() (+13 more)

### Community 84 - "section-detail.tsx"
Cohesion: 0.21
Nodes (13): DataProvenance(), formatFetchedAt(), DownloadGuideModal(), DownloadSection(), ReportProblem(), SectionDetail(), parseEpisodeRange(), analyzeEpisodeCoverage() (+5 more)

### Community 85 - "saved-searches.ts"
Cohesion: 0.22
Nodes (19): NO_SNAPSHOT, SearchLocalPanel(), SearchLocalPanelProps, queryUsesLocalOnlyFilters(), cache, checkSavedSearches(), emit(), ensureStorageListener() (+11 more)

### Community 87 - "progress.ts"
Cohesion: 0.25
Nodes (16): HistoryTracker(), HistoryTrackerProps, clearAllProgress(), EMPTY_PROGRESS, getProgress(), getProgressList(), getStorage(), getWatchedCount() (+8 more)

### Community 88 - "scraper/index.ts"
Cohesion: 0.12
Nodes (17): BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), POST_DEPRECATION_HEADERS, resolveBulk() (+9 more)

### Community 89 - "search-index.ts"
Cohesion: 0.23
Nodes (13): getIndexDump(), getIndexSnapshot(), IndexedAnime, rankIndexItems(), searchLocalIndex(), suggestLocal(), SimilarAnime(), ParsedQuery (+5 more)

### Community 90 - "[letter]/page.tsx"
Cohesion: 0.21
Nodes (19): dynamic, generateMetadata(), letterLabel(), LetterPage(), dynamic, formatFetchedAt(), IndexPage(), metadata (+11 more)

### Community 91 - "metrics.ts"
Cohesion: 0.17
Nodes (20): CIRCUIT_VALUE, dynamic, GET(), dynamic, GET(), COMMIT, dynamic, GET() (+12 more)

### Community 92 - "toast.ts"
Cohesion: 0.20
Nodes (16): EMPTY_TOASTS, Toaster(), clearToasts(), dismissToast(), emit(), getToasts(), lastShownAt, listeners (+8 more)

### Community 93 - "checkRateLimit"
Cohesion: 0.12
Nodes (30): dynamic, dynamic, EMPTY, GET(), dynamic, handleCspReport(), POST(), dynamic (+22 more)

### Community 94 - "lib/link-health.ts"
Cohesion: 0.09
Nodes (32): dynamic, GET(), parseSlug(), POST(), summarize(), CopyButtonProps, DownloadGroupProps, DownloadPlatform() (+24 more)

### Community 95 - "no-third-party.mjs"
Cohesion: 0.20
Nodes (13): add(), CONTENT_HOSTS, findings, hostOf(), isContentHost(), isSelfHost(), RESOURCE_RELS, ROOT (+5 more)

### Community 96 - ".next/**"
Cohesion: 0.13
Nodes (8): .next/**, metadata, metadata, revalidate, generateMetadata(), SearchAnime(), buildSearchMetadata(), decodeQuery()

### Community 97 - "Kokunime"
Cohesion: 0.22
Nodes (9): Arsitektur singkat, Batasan yang disengaja, Dokumentasi, Environment, Fitur, Kokunime, Menjalankan, Struktur penting (+1 more)

### Community 98 - "audit-meta.mjs"
Cohesion: 0.13
Nodes (14): args, base, baseArg, checkJsonLd(), checkNode(), limit, limitArg, problems (+6 more)

### Community 99 - "interfaces/index.ts"
Cohesion: 0.10
Nodes (33): CompareAnimeClient(), CompareAnimeClientProps, Side, CompareAnimeCard(), CompareAnimeCardProps, SIDE_DETAIL_LABELS, SIDE_LABELS, CompareGenreAnalysis() (+25 more)

### Community 100 - "bookmarks.ts"
Cohesion: 0.19
Nodes (25): BookmarkButton(), BookmarkButtonProps, BookmarksStatusFilters(), BookmarksStatusFiltersProps, chipClass(), CollectionCheckerDialog(), LinkResult, parseAniListJson() (+17 more)

### Community 101 - "🚑 RUNBOOK — Kokunime Operations"
Cohesion: 0.17
Nodes (12): 10. Release & tag, 11. Incident checklist (5 menit pertama), 1. Deploy normal, 2. Canary bertahap (opsional), 3. Rollback, 4. Backup & restore, 5. Monitoring & alert, 6. Load & chaos (+4 more)

### Community 102 - "slow-log.ts"
Cohesion: 0.36
Nodes (6): dynamic, GET(), entries, getSlowRequests(), SLOW_REQUEST_MS, SlowRequestEntry

### Community 103 - "local-catalog.ts"
Cohesion: 0.15
Nodes (28): CatalogEntry, CatalogFacet, clearCatalog(), countFacet(), ensureServerIndexMerged(), ensureStorageListener(), entries, getCatalogMeta() (+20 more)

### Community 104 - "🚀 API Quickstart"
Cohesion: 0.22
Nodes (9): 1. Cari anime, 2. Detail, episode, link download, 3. Jelajah katalog, 4. GraphQL (pengganti resmi `/api/anime/bulk`), 5. Bulk (deprecated — tetap hidup sampai 16 Apr 2027), 6. Laporan data, 7. Endpoint ops (tanpa auth), 🚀 API Quickstart (+1 more)

### Community 105 - "Arsitektur"
Cohesion: 0.29
Nodes (7): Alur request, Arsitektur, Aturan data, Deploy & rilis, Dokumen terkait, Observability, Resiliensi upstream

### Community 106 - "scan-secrets.mjs"
Cohesion: 0.25
Nodes (6): findings, PATTERNS, pending, SCAN_EXTENSIONS, SKIP_DIRS, SKIP_FILES

### Community 107 - "renderOgCard"
Cohesion: 0.33
Nodes (6): alt, contentType, Image(), runtime, size, renderOgCard()

### Community 108 - "Security Policy"
Cohesion: 0.29
Nodes (6): Operator checklist, Reporting a vulnerability, Scope, Security defaults, Security Policy, Supported versions

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

### Community 135 - "catalog-snapshot.ts"
Cohesion: 0.21
Nodes (16): buildSnapshot(), CatalogItem, CatalogSnapshot, CatalogState, getCatalogSnapshot(), globalCatalog, isCatalogItem(), isCatalogSlug() (+8 more)

### Community 136 - "[page]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 137 - "roulette/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 138 - "app/page.tsx"
Cohesion: 0.15
Nodes (6): dynamic, FirstVisitTips(), HomeHeroSection(), HomeLatestSection(), HomeSectionProps, HeroSkeleton()

### Community 139 - "logger.ts"
Cohesion: 0.27
Nodes (10): currentLevel(), LEVEL_ORDER, logJson(), LogLevel, redact(), rotateIfNeeded(), writeLine(), currentRequestId() (+2 more)

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

### Community 144 - "check-link-health.mjs"
Cohesion: 0.22
Nodes (7): base, discoverSlugs(), fetchText(), maxSlugs, slugs, token, totals

### Community 145 - "footer/index.tsx"
Cohesion: 0.29
Nodes (4): footerDevLinks, footerNavLinks, footerTags, Footer()

### Community 146 - "vitals-reporter.ts"
Cohesion: 0.08
Nodes (33): dynamic, GET(), WebVitals(), EnvIssue, isHttpUrl(), isRedisUrl(), validateEnv(), onRequestError() (+25 more)

### Community 147 - "detail-hero.tsx"
Cohesion: 0.14
Nodes (10): DetailHero(), DetailHeroProps, DetailHeroViewProps, ShareButtonProps, TrailerButtonProps, VerticalJapaneseTitle(), VerticalJapaneseTitleProps, compute() (+2 more)

### Community 148 - "search-history-chips.tsx"
Cohesion: 0.36
Nodes (3): getRecent(), SearchHistoryChips(), writeRecent()

### Community 149 - "sanitize.ts"
Cohesion: 0.34
Nodes (9): parseAnimeDetail(), parseDownloads(), getDownloadLinks(), normalizeUrl(), parseBytes(), parseGenres(), normalizeSeasonName(), parseSeason() (+1 more)

### Community 151 - "revalidate/route.ts"
Cohesion: 0.33
Nodes (6): dynamic, POST(), MAX_REVALIDATE_PATHS, sanitizeRevalidatePaths(), IndexNowResult, submitToIndexNow()

### Community 152 - "problemResponse"
Cohesion: 0.18
Nodes (16): RFC-9457, dynamic, GET(), POST(), EpisodeGroup, EpisodeMirror, GET(), GET() (+8 more)

### Community 153 - "ics.ts"
Cohesion: 0.26
Nodes (13): dynamic, GET(), buildCalendarFeed(), buildWeeklyReminderIcs(), CalendarEvent, CalendarFeedEvent, djb2(), escapeIcs() (+5 more)

### Community 154 - "stats-content.tsx"
Cohesion: 0.10
Nodes (31): metadata, metadata, EMPTY_HISTORY, EMPTY_PROGRESS, HomeHistoryStrip(), MiniBarChartProps, MiniBarDatum, RecommendForYou() (+23 more)

### Community 155 - "settings.ts"
Cohesion: 0.10
Nodes (40): DEFAULT_STORAGE, formatQuota(), SettingsPageContent(), SettingsAppearanceSection(), SettingsAppearanceSectionProps, THEME_OPTIONS, SettingsCatalogSection(), SettingsCatalogSectionProps (+32 more)

### Community 156 - "escapeXml"
Cohesion: 0.19
Nodes (14): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+6 more)

### Community 157 - "anime.ts"
Cohesion: 0.33
Nodes (6): AnimeDetail, AnimePage, DownloadOption, DownloadResolution, DownloadTarget, Genre

### Community 158 - "scraper/constants.ts"
Cohesion: 0.17
Nodes (12): Recommendation, RecommendedAnime(), UPSTREAM_URL, bestImage(), ImgLike, resolveAssetUrl(), formatAnimeData(), getRecommendations() (+4 more)

### Community 160 - "cache-codec.ts"
Cohesion: 0.52
Nodes (5): CACHE_CODEC, decodeCacheValue(), encodeCacheValue(), gunzipAsync, gzipAsync

### Community 161 - "anime-detail.ts"
Cohesion: 0.18
Nodes (10): alt, contentType, Image(), runtime, size, getAnimeDetail(), getAnimeDetailWithMeta(), extractWithFallback() (+2 more)

### Community 162 - "search.ts"
Cohesion: 0.33
Nodes (8): mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias(), SEARCH_ALIASES, fetchSearchPage(), mergeWithLocal(), searchAnime(), searchAnimeWithMeta()

### Community 163 - "download-group.tsx"
Cohesion: 0.23
Nodes (9): DownloadGroup(), renderResolutionBadge(), episodeAnchors(), KeyboardNavigation(), nearestEpisodeAnchor(), SHORTCUTS, toggleEpisodeWatched(), subscribeSettings() (+1 more)

### Community 164 - "[season]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 165 - "admin-dashboard.tsx"
Cohesion: 0.20
Nodes (10): metadata, AdminDashboard(), FeatureFlagView, PRESET_PATHS, REPORT_LABELS, AdminLogEntry, adminRequest(), AdminRequestResult (+2 more)

### Community 166 - "share-card.ts"
Cohesion: 0.43
Nodes (6): canvasToBlob(), exportShareCard(), renderShareCard(), ShareCardData, ShareCardRow, wrapText()

### Community 167 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.40
Nodes (4): Catatan operasional, Dampak, Ringkasan, Verifikasi

### Community 168 - "trending.ts"
Cohesion: 0.53
Nodes (5): getIndexedBySlugs(), dayKey(), getTrending(), recordTrendingView(), TrendingItem

### Community 171 - "backup-crypto.ts"
Cohesion: 0.47
Nodes (7): bufferOf(), decryptBackup(), deriveKey(), encryptBackup(), EncryptedEnvelope, fromBase64(), toBase64()

### Community 172 - "cache.ts"
Cohesion: 0.13
Nodes (30): incrementMetric(), observeHistogram(), ensureSubscriber(), getRedis(), handleInvalidateMessage(), INSTANCE_ID, makeClient(), onCacheInvalidate() (+22 more)

### Community 173 - "graphql/route.ts"
Cohesion: 0.33
Nodes (8): apqMemory, POST(), sha256(), analyzeQuery(), GRAPHQL_MAX_COMPLEXITY, GRAPHQL_MAX_DEPTH, QueryAnalysis, RESERVED

### Community 174 - "dictionary.ts"
Cohesion: 0.47
Nodes (3): DICTIONARY, DICTIONARY_EN, DICTIONARY_ID

### Community 177 - "continue-watching.tsx"
Cohesion: 0.33
Nodes (6): ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), EpisodeNavigator(), EpisodeNavigatorProps, nextUnwatchedEpisode()

### Community 179 - "duplicate-detector.ts"
Cohesion: 0.53
Nodes (4): DuplicateGroup, findDuplicateGroups(), NOISE_WORDS, normalizeTitle()

### Community 181 - "parse.ts"
Cohesion: 0.33
Nodes (5): Anime, NewSeriesAnime(), fetchSinglePage(), getAnimePerPage(), parsePagination()

### Community 182 - "animeSlug"
Cohesion: 0.09
Nodes (22): AnimeGrid(), AnimeGridProps, AnimeImage(), AnimeImageProps, CatalogRecorder(), CatalogRecorderProps, AnimeSearchFieldProps, GenreOption (+14 more)

## Knowledge Gaps
- **794 isolated node(s):** `Alur request`, `Aturan data`, `Resiliensi upstream`, `Observability`, `Deploy & rilis` (+789 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `endpointSlug`, `admin-dashboard.tsx`, `status/page.tsx`, `stats-content.tsx`, `site.ts`, `app/page.tsx`, `[slug]/page.tsx`, `vitals-reporter.ts`, `ignore`, `[letter]/page.tsx`, `[season]/page.tsx`, `update/page.tsx`, `safeJsonLd`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `.next/**`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getBookmarks()` (e.g. with `RecommendForYou()` and `StatsContent()`) actually correct?**
  _`getBookmarks()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Alur request`, `Aturan data`, `Resiliensi upstream` to the rest of the system?**
  _794 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useTranslation` be split into smaller, more focused modules?**
  _Cohesion score 0.10160427807486631 - nodes in this community are weakly interconnected._