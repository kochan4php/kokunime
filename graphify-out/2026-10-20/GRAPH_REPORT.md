# Graph Report - kokunime  (2026-10-20)

## Corpus Check
- 586 files · ~198,998 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2511 nodes · 5957 edges · 177 communities (157 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 79 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `668066b3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- backup.ts
- tags.ts
- applyTheme
- pagination/index.tsx
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
- seo.ts
- qr.ts
- formatter
- storage-keys.ts
- find-unused-exports.mjs
- diagnostics.ts
- ignore
- skeleton-primitives.tsx
- devDependencies
- biome.json
- next.config.mjs
- interfaces/index.ts
- offline-saved.ts
- format-date.ts
- [season]/page.tsx
- rules
- safeJsonLd
- useTranslation
- endpoint-slug.ts
- use-sync-link.ts
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
- error-reporter.ts
- watch-queue.ts
- vitest.config.ts
- [year]/opengraph-image.tsx
- bookmarks-bulk-bar.tsx
- post-commit
- post-checkout
- [genre]/opengraph-image.tsx
- update/page.tsx
- ADR 0001 — Three-tier cache with stale-while-revalidate
- package.json
- route-error.tsx
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
- bar.tsx
- qr-reference.py
- progress.ts
- [slug]/page.tsx
- search-form.tsx
- main-layout.tsx
- metrics.ts
- sitemap-entries.ts
- search-index.ts
- webhook-dispatcher.ts
- no-third-party.mjs
- .next/**
- Kokunime
- audit-meta.mjs
- compare-anime-client.tsx
- bookmarks.ts
- 🚑 RUNBOOK — Kokunime Operations
- icons/index.ts
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
- animeSlug
- [page]/opengraph-image.tsx
- roulette/opengraph-image.tsx
- app/page.tsx
- showToast
- stats/opengraph-image.tsx
- update/opengraph-image.tsx
- css-usage-report.mjs
- wrapped/opengraph-image.tsx
- dictionary.ts
- footer/index.tsx
- vitals-reporter.ts
- detail-hero.tsx
- offline-indicator.tsx
- env.ts
- [slug]/loading.tsx
- compare-selector.tsx
- cache.ts
- saved-searches.ts
- wrapped-content.tsx
- settings.ts
- escapeXml
- anime.ts
- sanitize.ts
- toast.ts
- [slug]/opengraph-image.tsx
- search.ts
- download-platform.tsx
- [season]/opengraph-image.tsx
- duplicate-detector.ts
- [year]/page.tsx
- PULL_REQUEST_TEMPLATE.md
- roulette-content.tsx
- og-card.tsx
- backup-crypto.ts
- redis.ts
- season-in-rail.tsx
- components/empty-state.tsx
- pwa-install-button.tsx
- latest-grid.tsx

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
- `BookmarkMetaDialogProps` --references--> `BookmarkItem`  [EXTRACTED]
  src/components/bookmark-meta-dialog.tsx → src/utils/bookmarks.ts
- `TagIndexPage()` --indirect_call--> `getCatalogSnapshot()`  [INFERRED]
  src/app/tag/page.tsx → src/utils/local-catalog.ts
- `TagDetailPage()` --indirect_call--> `getCatalogSnapshot()`  [INFERRED]
  src/app/tag/[tag]/page.tsx → src/utils/local-catalog.ts
- `SearchLocalPanel()` --indirect_call--> `subscribeCatalog()`  [INFERRED]
  src/components/search-local-panel.tsx → src/utils/local-catalog.ts
- `BookmarkButton()` --indirect_call--> `subscribeBookmarks()`  [INFERRED]
  src/components/anime/bookmark-button.tsx → src/utils/bookmarks.ts

## Import Cycles
- None detected.

## Communities (177 total, 20 thin omitted)

### Community 0 - "backup.ts"
Cohesion: 0.14
Nodes (29): COLLECTION_LABELS, SettingsStorageSection(), SettingsStorageSectionProps, useBackupTools(), UseBackupToolsResult, BackupCollection, BackupImportMode, BackupPayload (+21 more)

### Community 1 - "tags.ts"
Cohesion: 0.23
Nodes (25): NO_SNAPSHOT, TagIndexPage(), NO_SNAPSHOT, TagDetailPage(), AnimeTagsEditor(), subscribeCatalog(), addTag(), clearTags() (+17 more)

### Community 2 - "applyTheme"
Cohesion: 0.50
Nodes (4): ThemeSync(), applyTheme(), darkQuery(), syncThemeColorMeta()

### Community 3 - "pagination/index.tsx"
Cohesion: 0.26
Nodes (11): PaginationBar(), Pagination(), PaginationProps, PageNumbers(), PageNumbersProps, PageJump(), buildPageHref(), buildPaginationInfo() (+3 more)

### Community 4 - "download-extras-panel.tsx"
Cohesion: 0.26
Nodes (17): BatchDownloadTools(), BatchDownloadToolsProps, calculateTime(), copiedButtonClass(), DownloadExtrasPanel(), DownloadExtrasPanelProps, buildAria2(), buildCurlSh() (+9 more)

### Community 5 - "scripts"
Cohesion: 0.06
Nodes (36): scripts, a11y:targets, a11y:v2, audit:client, audit:meta, backup:cache, build, bundle:budget (+28 more)

### Community 6 - "stats-content.tsx"
Cohesion: 0.12
Nodes (28): metadata, EpisodeWatchedToggle(), EpisodeWatchedToggleProps, RecommendForYou(), RecommendItem, RecommendResponse, SERVER_BOOKMARKS, SERVER_HISTORY (+20 more)

### Community 7 - "sleep"
Cohesion: 0.09
Nodes (40): CANDIDATES, CdpClient, evaluate(), findBrowser(), launchBrowser(), navigate(), runAxe(), screenshot() (+32 more)

### Community 8 - "style"
Cohesion: 0.22
Nodes (9): style, noNonNullAssertion, noUnusedTemplateLiteral, useConst, useImportType, useNodejsImportProtocol, useNumberNamespace, useSelfClosingElements (+1 more)

### Community 9 - "site.ts"
Cohesion: 0.10
Nodes (15): RFC-9116, dynamic, dynamic, metadata, SECTIONS, ApiEndpoint, ApiTesterProps, CodeLang (+7 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): axe-core, @biomejs/biome, jsdom, lint-staged, devDependencies, axe-core, @biomejs/biome, jsdom (+17 more)

### Community 11 - "section-header.tsx"
Cohesion: 0.23
Nodes (9): SeasonsPage(), SectionHeader(), SectionHeaderProps, SectionTone, TONE_CLASS, Season, SeasonYearGroupProps, groupSeasonsByYear() (+1 more)

### Community 12 - "anime-listing.tsx"
Cohesion: 0.14
Nodes (19): useUrlState(), AnimeListing(), AnimeListingProps, LISTING_SCHEMA, SORT_LABELS, SORT_MODES, SortMode, VIEW_MODES (+11 more)

### Community 13 - "scraper/index.ts"
Cohesion: 0.05
Nodes (93): RFC-9457, BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), POST_DEPRECATION_HEADERS (+85 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts (+24 more)

### Community 15 - "seo.ts"
Cohesion: 0.15
Nodes (11): Anime(), RootLayout(), viewport, rules, metadata, buildAnimeJsonLd(), buildBreadcrumbJsonLd(), buildFaqJsonLd() (+3 more)

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
Cohesion: 0.14
Nodes (23): DeviceDiagnostics(), NO_ENTRIES, timeFormat, TYPE_LABEL, TYPE_ORDER, StaleDataBanner(), registerPeriodicSync(), ServiceWorkerRegister() (+15 more)

### Community 21 - "ignore"
Cohesion: 0.22
Nodes (9): files, ignore, ignoreUnknown, node_modules/**, coverage/**, dist/**, graphify-out/**, pnpm-lock.yaml (+1 more)

### Community 22 - "skeleton-primitives.tsx"
Cohesion: 0.06
Nodes (11): CardSkeleton(), GridSkeletonProps, SkeletonPage(), SkeletonPageProps, BreadcrumbSkeleton(), ProseSkeleton(), SectionHeaderSkeleton(), SectionHeaderSkeletonProps (+3 more)

### Community 23 - "devDependencies"
Cohesion: 0.05
Nodes (42): dependencies, cheerio, husky, next, react, react-dom, redis, sharp (+34 more)

### Community 24 - "biome.json"
Cohesion: 0.22
Nodes (8): organizeImports, enabled, overrides, $schema, vcs, clientKind, enabled, useIgnoreFile

### Community 25 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - "interfaces/index.ts"
Cohesion: 0.12
Nodes (26): CACHE_TTL_SECONDS, indexAnimeItems(), cached(), CacheTier, TTL, getAnimeDetailWithMeta(), fetchSinglePage(), getAnimePerPage() (+18 more)

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
Cohesion: 0.15
Nodes (17): ApiDocsPage(), ENDPOINTS, metadata, ComparePage(), ComparePageProps, dynamic, metadata, GenresPage() (+9 more)

### Community 32 - "useTranslation"
Cohesion: 0.14
Nodes (18): DetailToc(), SECTIONS, MobileMenu(), MobileMenuProps, NAV_KEY_MAP, NAV_KEY_MAP, Navbar(), SettingsAboutSection() (+10 more)

### Community 33 - "endpoint-slug.ts"
Cohesion: 0.12
Nodes (18): dynamic, POST(), DetailMeta(), MetaItemProps, chipColors, GenreTags(), GENRE_DICTIONARY, GenreMeta (+10 more)

### Community 34 - "use-sync-link.ts"
Cohesion: 0.17
Nodes (20): EMPTY_HISTORY, EMPTY_PROGRESS, HomeHistoryStrip(), useSyncLink(), UseSyncLinkResult, mergeFolderOrder(), removeHistoryDay(), clearAllHistory() (+12 more)

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
Cohesion: 0.15
Nodes (21): CommandPalette(), CommandPalette, clientSearchCache, mergePaletteResults(), toPaletteAnime(), useCommandPalette(), UseCommandPaletteResult, fuzzyScore() (+13 more)

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

### Community 49 - "error-reporter.ts"
Cohesion: 0.25
Nodes (11): onRequestError(), register(), ErrorReport, lastSent, reportError(), scrubMessage(), suppressed, truncate() (+3 more)

### Community 51 - "watch-queue.ts"
Cohesion: 0.33
Nodes (16): BookmarksQueueView(), SERVER_EMPTY, addToQueue(), clearQueue(), EMPTY_QUEUE, getQueue(), getStorage(), isQueued() (+8 more)

### Community 57 - "[year]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

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

### Community 65 - "route-error.tsx"
Cohesion: 0.21
Nodes (3): RouteError(), RouteErrorProps, formatDiagnostics()

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
Nodes (30): cleanFirstTitle(), dynamic, GET(), probe(), bodyKey(), DEFAULT_HEADERS, doFetch(), request() (+22 more)

### Community 81 - "reveal.tsx"
Cohesion: 0.32
Nodes (5): Reveal(), RevealProps, SeasonYearGroup(), TaxonomyCard(), TaxonomyCardProps

### Community 82 - "use-collection-data.ts"
Cohesion: 0.17
Nodes (19): BookmarkListRow(), BookmarkListRowProps, BookmarksDayList(), BookmarksDayListProps, BookmarksGridViewProps, BookmarksToolbar(), BookmarksToolbarProps, CollectionCheckerDialogProps (+11 more)

### Community 83 - "denyAdmin"
Cohesion: 0.06
Nodes (46): dynamic, GET(), POST(), GET(), dynamic, POST(), dynamic, GET() (+38 more)

### Community 84 - "section-detail.tsx"
Cohesion: 0.06
Nodes (32): Suggestion, dynamic, GET(), ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), DownloadGuideModal(), DownloadSection() (+24 more)

### Community 85 - "bar.tsx"
Cohesion: 0.24
Nodes (7): ChevronLeftIcon(), ChevronRightIcon(), PaginationInfo, PaginationBarProps, PaginationButton(), PaginationButtonProps, MobilePaginationProps

### Community 87 - "progress.ts"
Cohesion: 0.14
Nodes (24): DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), HistoryTracker(), HistoryTrackerProps, episodeAnchors(), KeyboardNavigation(), nearestEpisodeAnchor() (+16 more)

### Community 88 - "[slug]/page.tsx"
Cohesion: 0.29
Nodes (4): generateMetadata(), revalidate, buildDetailMetadata(), truncate()

### Community 89 - "search-form.tsx"
Cohesion: 0.22
Nodes (6): SearchIcon(), Input(), SearchFormProps, AnimeCardProps, ChildrenProps, InputProps

### Community 90 - "main-layout.tsx"
Cohesion: 0.12
Nodes (8): IndexItem, IndexPage(), letterOf(), LETTERS, metadata, revalidate, revalidate, HoneypotTrap()

### Community 91 - "metrics.ts"
Cohesion: 0.14
Nodes (23): CIRCUIT_VALUE, dynamic, GET(), dynamic, GET(), COMMIT, dynamic, GET() (+15 more)

### Community 92 - "sitemap-entries.ts"
Cohesion: 0.42
Nodes (6): GET(), GET(), getSitemapEntries(), SITEMAP_CHUNK_SIZE, SitemapEntry, getLastUpstreamFetchAt()

### Community 93 - "search-index.ts"
Cohesion: 0.20
Nodes (16): getIndexDump(), getIndexSize(), getIndexSnapshot(), IndexedAnime, rankIndexItems(), searchLocalIndex(), suggestLocal(), SimilarAnime() (+8 more)

### Community 94 - "webhook-dispatcher.ts"
Cohesion: 0.36
Nodes (6): detectIpFamily(), fetchWithRedirectGuard(), isPublicHttpUrl(), PRIVATE_V4, dispatchDiscordWebhook(), WebhookPayload

### Community 95 - "no-third-party.mjs"
Cohesion: 0.20
Nodes (13): add(), CONTENT_HOSTS, findings, hostOf(), isContentHost(), isSelfHost(), RESOURCE_RELS, ROOT (+5 more)

### Community 96 - ".next/**"
Cohesion: 0.19
Nodes (7): .next/**, metadata, metadata, generateMetadata(), SearchAnime(), buildSearchMetadata(), decodeQuery()

### Community 97 - "Kokunime"
Cohesion: 0.22
Nodes (9): Arsitektur singkat, Batasan yang disengaja, Dokumentasi, Environment, Fitur, Kokunime, Menjalankan, Struktur penting (+1 more)

### Community 98 - "audit-meta.mjs"
Cohesion: 0.13
Nodes (14): args, base, baseArg, checkJsonLd(), checkNode(), limit, limitArg, problems (+6 more)

### Community 99 - "compare-anime-client.tsx"
Cohesion: 0.11
Nodes (32): CompareAnimeClient(), CompareAnimeClientProps, Side, CompareAnimeCard(), CompareAnimeCardProps, SIDE_DETAIL_LABELS, SIDE_LABELS, CompareGenreAnalysis() (+24 more)

### Community 100 - "bookmarks.ts"
Cohesion: 0.17
Nodes (26): BookmarkButton(), BookmarkButtonProps, BookmarksStatusFilters(), BookmarksStatusFiltersProps, chipClass(), CollectionCheckerDialog(), LinkResult, COMPLETED_FOLDER (+18 more)

### Community 101 - "🚑 RUNBOOK — Kokunime Operations"
Cohesion: 0.18
Nodes (11): 10. Incident checklist (5 menit pertama), 1. Deploy normal, 2. Canary bertahap (opsional), 3. Rollback, 4. Backup & restore, 5. Monitoring & alert, 6. Load & chaos, 7. Feature flags (+3 more)

### Community 103 - "local-catalog.ts"
Cohesion: 0.12
Nodes (30): AnimeGrid(), AnimeGridProps, CatalogRecorder(), CatalogRecorderProps, CatalogEntry, CatalogFacet, clearCatalog(), countFacet() (+22 more)

### Community 104 - "🚀 API Quickstart"
Cohesion: 0.25
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

### Community 108 - "Security Policy"
Cohesion: 0.33
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

### Community 135 - "animeSlug"
Cohesion: 0.11
Nodes (13): NewSeriesSkeleton(), AnimeImage(), AnimeImageProps, AnimeSearchFieldProps, TrendingEntry, ViewTransitionLink(), ViewTransitionLinkProps, FeaturedHero() (+5 more)

### Community 136 - "[page]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 137 - "roulette/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 138 - "app/page.tsx"
Cohesion: 0.14
Nodes (6): dynamic, FirstVisitTips(), HomeHeroSection(), HomeLatestSection(), HomeSectionProps, HeroSkeleton()

### Community 139 - "showToast"
Cohesion: 0.16
Nodes (35): BookmarksPage(), SERVER_EMPTY_QUEUE, BookmarkMetaDialog(), BookmarkMetaDialogProps, BookmarksFolderBar(), BookmarksFolderBarProps, folderChipClass(), clearAllBookmarks() (+27 more)

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
Cohesion: 0.19
Nodes (4): footerDevLinks, footerNavLinks, footerTags, Footer()

### Community 146 - "vitals-reporter.ts"
Cohesion: 0.18
Nodes (14): dynamic, GET(), WebVitals(), getVitalsSummary(), lastSent, percentile(), recordSample(), reportVitals() (+6 more)

### Community 147 - "detail-hero.tsx"
Cohesion: 0.18
Nodes (9): DetailHero(), DetailHeroProps, DetailHeroViewProps, TrailerButtonProps, VerticalJapaneseTitle(), VerticalJapaneseTitleProps, compute(), getBlurDataUrl() (+1 more)

### Community 148 - "offline-indicator.tsx"
Cohesion: 0.60
Nodes (5): getCacheServedSnapshot(), getOnlineSnapshot(), OfflineIndicator(), subscribeCacheServed(), subscribeOnline()

### Community 149 - "env.ts"
Cohesion: 0.53
Nodes (4): EnvIssue, isHttpUrl(), isRedisUrl(), validateEnv()

### Community 151 - "compare-selector.tsx"
Cohesion: 0.22
Nodes (8): CompareSelector(), CompareSelectorProps, Pane, PRESET_COMPARISONS, Side, searchCache, useAnimeSearch(), UseAnimeSearchResult

### Community 152 - "cache.ts"
Cohesion: 0.19
Nodes (16): onCacheInvalidate(), publishCacheInvalidate(), CachedResult, cachedWithMeta(), ensureInvalidation(), getFromMemoryCache(), getStale(), inFlight (+8 more)

### Community 153 - "saved-searches.ts"
Cohesion: 0.23
Nodes (19): NO_SNAPSHOT, SearchLocalPanel(), SearchLocalPanelProps, searchLocalCatalog(), cache, checkSavedSearches(), emit(), ensureStorageListener() (+11 more)

### Community 154 - "wrapped-content.tsx"
Cohesion: 0.16
Nodes (12): metadata, MiniBarChartProps, MiniBarDatum, MONTHS_SHORT, SERVER_EMPTY, WrappedContent(), canvasToBlob(), exportShareCard() (+4 more)

### Community 155 - "settings.ts"
Cohesion: 0.11
Nodes (31): DEFAULT_STORAGE, formatQuota(), SettingsPageContent(), SettingsAppearanceSection(), SettingsAppearanceSectionProps, THEME_OPTIONS, SettingsCatalogSection(), SettingsCatalogSectionProps (+23 more)

### Community 156 - "escapeXml"
Cohesion: 0.19
Nodes (14): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+6 more)

### Community 157 - "anime.ts"
Cohesion: 0.25
Nodes (8): Anime, AnimeDetail, AnimePage, DownloadOption, DownloadResolution, DownloadTarget, Genre, Recommendation

### Community 158 - "sanitize.ts"
Cohesion: 0.15
Nodes (19): UPSTREAM_URL, parseAnimeDetail(), parseDownloads(), getDownloadLinks(), normalizeUrl(), parseBytes(), parseGenres(), bestImage() (+11 more)

### Community 160 - "toast.ts"
Cohesion: 0.20
Nodes (16): EMPTY_TOASTS, Toaster(), clearToasts(), dismissToast(), emit(), getToasts(), lastShownAt, listeners (+8 more)

### Community 161 - "[slug]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (6): alt, contentType, Image(), runtime, size, getAnimeDetail()

### Community 162 - "search.ts"
Cohesion: 0.33
Nodes (8): mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias(), SEARCH_ALIASES, fetchSearchPage(), mergeWithLocal(), searchAnime(), searchAnimeWithMeta()

### Community 163 - "download-platform.tsx"
Cohesion: 0.38
Nodes (4): CopyButtonProps, DownloadPlatform(), getPlatformStyle(), requiresLogin()

### Community 164 - "[season]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 165 - "duplicate-detector.ts"
Cohesion: 0.53
Nodes (4): DuplicateGroup, findDuplicateGroups(), NOISE_WORDS, normalizeTitle()

### Community 166 - "[year]/page.tsx"
Cohesion: 0.29
Nodes (5): dynamic, GET(), revalidate, YearPage(), collectYearAnime()

### Community 167 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.40
Nodes (4): Catatan operasional, Dampak, Ringkasan, Verifikasi

### Community 168 - "roulette-content.tsx"
Cohesion: 0.26
Nodes (9): metadata, GenreOption, polarPoint(), readSpinHistory(), RouletteContent(), RouletteSpin, SEGMENT_COLORS, segmentPath() (+1 more)

### Community 171 - "backup-crypto.ts"
Cohesion: 0.47
Nodes (7): bufferOf(), decryptBackup(), deriveKey(), encryptBackup(), EncryptedEnvelope, fromBase64(), toBase64()

### Community 172 - "redis.ts"
Cohesion: 0.18
Nodes (17): CACHE_CODEC, decodeCacheValue(), encodeCacheValue(), gunzipAsync, gzipAsync, ensureSubscriber(), getRedis(), handleInvalidateMessage() (+9 more)

### Community 173 - "season-in-rail.tsx"
Cohesion: 0.42
Nodes (6): SeasonInRail(), getSeasonWindow(), parseSeasonSlug(), pickCurrentSeason(), SEASON_RANGES, SeasonWindow

## Knowledge Gaps
- **767 isolated node(s):** `Ringkasan`, `Dampak`, `Verifikasi`, `Catatan operasional`, `Fitur` (+762 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `stats-content.tsx`, `wrapped-content.tsx`, `roulette-content.tsx`, `site.ts`, `app/page.tsx`, `section-header.tsx`, `[year]/page.tsx`, `seo.ts`, `error-reporter.ts`, `storage-keys.ts`, `denyAdmin`, `ignore`, `[slug]/page.tsx`, `main-layout.tsx`, `sitemap-entries.ts`, `[season]/page.tsx`, `update/page.tsx`, `safeJsonLd`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `.next/**`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `showToast()` connect `showToast` to `useTranslation`, `tags.ts`, `use-sync-link.ts`, `compare-anime-client.tsx`, `bookmarks.ts`, `toast.ts`, `stats-content.tsx`, `use-command-palette.ts`, `roulette-content.tsx`, `settings.ts`, `storage-keys.ts`, `watch-queue.ts`, `diagnostics.ts`, `section-detail.tsx`, `saved-searches.ts`, `wrapped-content.tsx`, `offline-saved.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getBookmarks()` (e.g. with `RecommendForYou()` and `StatsContent()`) actually correct?**
  _`getBookmarks()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Ringkasan`, `Dampak`, `Verifikasi` to the rest of the system?**
  _767 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `backup.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1408199643493761 - nodes in this community are weakly interconnected._