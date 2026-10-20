# Graph Report - kokunime  (2026-10-20)

## Corpus Check
- 586 files · ~198,998 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2539 nodes · 6056 edges · 186 communities (165 shown, 21 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 79 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `668066b3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- backup.ts
- tags.ts
- settings.ts
- pagination/index.tsx
- download-extras-panel.tsx
- scripts
- episode-watched-toggle.tsx
- sleep
- style
- site.ts
- devDependencies
- use-collection-data.ts
- animeSlug
- endpoint-slug.ts
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
- main-layout.tsx
- useTranslation
- endpointSlug
- stats-content.tsx
- dependencies
- bundle-budget.mjs
- a11y
- status/route.ts
- suspicious
- postcss.config.js
- sw.js
- backup-cache.mjs
- e2e-smoke.mjs
- load-test.mjs
- complexity
- listing-skeleton.tsx
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
- circuit-breaker.ts
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
- BookmarkItem
- denyAdmin
- interfaces/index.ts
- bar.tsx
- qr-reference.py
- progress.ts
- bulk/route.ts
- search-form.tsx
- scraper/index.ts
- metrics.ts
- sitemap-entries.ts
- checkRateLimit
- lib/link-health.ts
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
- anime-image.tsx
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
- storage-keys.ts
- sanitize.ts
- [slug]/loading.tsx
- compare-selector.tsx
- cache.ts
- ics.ts
- share-card.ts
- settings-page-content.tsx
- escapeXml
- anime.ts
- scraper/constants.ts
- toast.ts
- anime-detail.ts
- search.ts
- download-group.tsx
- [season]/opengraph-image.tsx
- admin-dashboard.tsx
- search/route.ts
- PULL_REQUEST_TEMPLATE.md
- roulette-content.tsx
- og-card.tsx
- use-backup-tools.ts
- redis.ts
- graphql/route.ts
- use-sync-link.ts
- pwa-install-button.tsx
- latest-grid.tsx
- continue-watching.tsx
- grid-skeleton.tsx
- status/page.tsx
- settings-storage-section.tsx
- parse.ts
- card-anime.tsx
- trending.ts
- link-health/route.ts
- parser-benchmark.test.ts

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 69 edges
2. `showToast()` - 68 edges
3. `getBookmarks()` - 44 edges
4. `scripts` - 36 edges
5. `SITE_URL` - 36 edges
6. `animeSlug()` - 34 edges
7. `.next/**` - 32 edges
8. `problemResponse()` - 31 edges
9. `checkEtagMatch()` - 29 edges
10. `generateEtag()` - 29 edges

## Surprising Connections (you probably didn't know these)
- `SettingsTypographySectionProps` --references--> `AppSettings`  [EXTRACTED]
  src/components/settings/settings-typography-section.tsx → src/utils/settings.ts
- `TagIndexPage()` --indirect_call--> `getCatalogSnapshot()`  [INFERRED]
  src/app/tag/page.tsx → src/utils/local-catalog.ts
- `TagDetailPage()` --indirect_call--> `getCatalogSnapshot()`  [INFERRED]
  src/app/tag/[tag]/page.tsx → src/utils/local-catalog.ts
- `SearchLocalPanel()` --indirect_call--> `subscribeCatalog()`  [INFERRED]
  src/components/search-local-panel.tsx → src/utils/local-catalog.ts
- `StatsContent()` --indirect_call--> `getBookmarks()`  [INFERRED]
  src/components/stats-content.tsx → src/utils/bookmarks.ts

## Import Cycles
- None detected.

## Communities (186 total, 21 thin omitted)

### Community 0 - "backup.ts"
Cohesion: 0.22
Nodes (17): BackupPayload, BackupPreviewResult, BackupPreviewRow, COLLECTION_STORAGE, exportAllAppData(), identity(), importAllAppData(), markIdentity() (+9 more)

### Community 1 - "tags.ts"
Cohesion: 0.23
Nodes (25): NO_SNAPSHOT, TagIndexPage(), NO_SNAPSHOT, TagDetailPage(), AnimeTagsEditor(), subscribeCatalog(), addTag(), clearTags() (+17 more)

### Community 2 - "settings.ts"
Cohesion: 0.18
Nodes (16): SettingsTypographySection(), SettingsTypographySectionProps, ThemeSync(), AccentColor, applySettingsToDom(), applyTheme(), CardDensity, darkQuery() (+8 more)

### Community 3 - "pagination/index.tsx"
Cohesion: 0.29
Nodes (10): Pagination(), PaginationProps, PageNumbers(), PageNumbersProps, PageJump(), buildPageHref(), buildPaginationInfo(), getPages() (+2 more)

### Community 4 - "download-extras-panel.tsx"
Cohesion: 0.26
Nodes (17): BatchDownloadTools(), BatchDownloadToolsProps, calculateTime(), copiedButtonClass(), DownloadExtrasPanel(), DownloadExtrasPanelProps, buildAria2(), buildCurlSh() (+9 more)

### Community 5 - "scripts"
Cohesion: 0.06
Nodes (36): scripts, a11y:targets, a11y:v2, audit:client, audit:meta, backup:cache, build, bundle:budget (+28 more)

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
Cohesion: 0.08
Nodes (21): RFC-9116, dynamic, POST(), ENDPOINTS, metadata, dynamic, dynamic, dynamic (+13 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): axe-core, @biomejs/biome, jsdom, lint-staged, devDependencies, axe-core, @biomejs/biome, jsdom (+17 more)

### Community 11 - "use-collection-data.ts"
Cohesion: 0.18
Nodes (19): BookmarksFolderBar(), BookmarksFolderBarProps, folderChipClass(), SERVER_BOOKMARKS, SERVER_COLLECTIONS, SERVER_HISTORY, SERVER_PROGRESS, useCollectionData() (+11 more)

### Community 12 - "animeSlug"
Cohesion: 0.12
Nodes (22): AnimeGrid(), AnimeGridProps, useUrlState(), AnimeListing(), AnimeListingProps, LISTING_SCHEMA, SORT_LABELS, SORT_MODES (+14 more)

### Community 13 - "endpoint-slug.ts"
Cohesion: 0.17
Nodes (25): RFC-9457, GET(), EpisodeGroup, EpisodeMirror, GET(), GET(), GET(), GET() (+17 more)

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
Cohesion: 0.06
Nodes (34): Suggestion, DeviceDiagnostics(), NO_ENTRIES, timeFormat, TYPE_LABEL, TYPE_ORDER, ErrorCard(), ErrorCardProps (+26 more)

### Community 21 - "ignore"
Cohesion: 0.22
Nodes (9): files, ignore, ignoreUnknown, node_modules/**, coverage/**, dist/**, graphify-out/**, pnpm-lock.yaml (+1 more)

### Community 22 - "skeleton-primitives.tsx"
Cohesion: 0.11
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
Cohesion: 0.26
Nodes (8): dynamic, generateMetadata(), dynamic, generateMetadata(), SeasonPage(), Breadcrumbs(), Crumb, toTitle()

### Community 30 - "rules"
Cohesion: 0.20
Nodes (10): noUnusedVariables, useExhaustiveDependencies, useJsxKeyInIterable, linter, enabled, rules, correctness, recommended (+2 more)

### Community 31 - "main-layout.tsx"
Cohesion: 0.08
Nodes (24): ApiDocsPage(), ComparePage(), ComparePageProps, dynamic, metadata, GenrePage(), GenresPage(), SeasonsPage() (+16 more)

### Community 32 - "useTranslation"
Cohesion: 0.14
Nodes (18): DetailToc(), SECTIONS, FirstVisitTips(), MobileMenu(), MobileMenuProps, NAV_KEY_MAP, NAV_KEY_MAP, Navbar() (+10 more)

### Community 33 - "endpointSlug"
Cohesion: 0.11
Nodes (20): chipColors, GenreTags(), GENRE_DICTIONARY, GenreMeta, GenresExplorer(), GenresExplorerProps, getGenreMeta(), getSeasonInfo() (+12 more)

### Community 34 - "stats-content.tsx"
Cohesion: 0.12
Nodes (28): metadata, metadata, EMPTY_HISTORY, EMPTY_PROGRESS, HomeHistoryStrip(), MiniBarChartProps, MiniBarDatum, dayKey() (+20 more)

### Community 35 - "dependencies"
Cohesion: 0.13
Nodes (15): cheerio, husky, next, dependencies, cheerio, husky, next, react (+7 more)

### Community 36 - "bundle-budget.mjs"
Cohesion: 0.27
Nodes (8): baseline, collect(), current, formatKb(), report(), statSize(), THRESHOLD, walk()

### Community 37 - "a11y"
Cohesion: 0.25
Nodes (8): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, a11y

### Community 38 - "status/route.ts"
Cohesion: 0.17
Nodes (18): dynamic, GET(), dynamic, GET(), renderBadge(), COMMIT, dynamic, GET() (+10 more)

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

### Community 49 - "listing-skeleton.tsx"
Cohesion: 0.16
Nodes (3): HomeSkeleton(), ListingSkeleton(), ListingSkeletonProps

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
Cohesion: 0.22
Nodes (9): BUCKET_META, metadata, revalidate, UpdatePage(), UpdateIcsButton(), AgeBucket, NUMBER_WORDS, parseRelativeAge() (+1 more)

### Community 63 - "ADR 0001 — Three-tier cache with stale-while-revalidate"
Cohesion: 0.40
Nodes (4): ADR 0001 — Three-tier cache with stale-while-revalidate, Consequences, Context, Decision

### Community 64 - "package.json"
Cohesion: 0.20
Nodes (9): author, lint-staged, **/*.{js,jsx,ts,tsx,json,css}, name, packageManager, private, type, version (+1 more)

### Community 65 - "circuit-breaker.ts"
Cohesion: 0.23
Nodes (12): dynamic, GET(), BreakerEntry, breakers, canRequest(), CircuitState, entryFor(), getCircuitState() (+4 more)

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
Cohesion: 0.16
Nodes (19): cleanFirstTitle(), dynamic, GET(), probe(), bodyKey(), DEFAULT_HEADERS, doFetch(), request() (+11 more)

### Community 81 - "reveal.tsx"
Cohesion: 0.12
Nodes (11): NewSeriesSkeleton(), ReadingFocusModeProps, Reveal(), RevealProps, Season, SeasonYearGroup(), SeasonYearGroupProps, TaxonomyCard() (+3 more)

### Community 82 - "BookmarkItem"
Cohesion: 0.15
Nodes (20): BookmarkMetaDialogProps, BookmarkListRow(), BookmarkListRowProps, BookmarksDayList(), BookmarksDayListProps, BookmarksGridViewProps, BookmarksStatusFilters(), BookmarksStatusFiltersProps (+12 more)

### Community 83 - "denyAdmin"
Cohesion: 0.14
Nodes (21): dynamic, GET(), POST(), dynamic, GET(), POST(), clientIp(), denyAdmin() (+13 more)

### Community 84 - "interfaces/index.ts"
Cohesion: 0.17
Nodes (10): DownloadGuideModal(), DownloadSection(), DownloadWithHealth(), SectionDetail(), getAnimeLinkHealth(), isSnapshot(), parseEpisodeRange(), listEpisodeNumbers() (+2 more)

### Community 85 - "bar.tsx"
Cohesion: 0.21
Nodes (8): ChevronLeftIcon(), ChevronRightIcon(), PaginationInfo, PaginationBar(), PaginationBarProps, PaginationButton(), PaginationButtonProps, MobilePaginationProps

### Community 87 - "progress.ts"
Cohesion: 0.18
Nodes (20): HistoryTracker(), HistoryTrackerProps, episodeAnchors(), KeyboardNavigation(), nearestEpisodeAnchor(), SHORTCUTS, clearAllProgress(), EMPTY_PROGRESS (+12 more)

### Community 88 - "bulk/route.ts"
Cohesion: 0.25
Nodes (11): BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), POST_DEPRECATION_HEADERS, resolveBulk() (+3 more)

### Community 89 - "search-form.tsx"
Cohesion: 0.22
Nodes (6): SearchIcon(), Input(), SearchFormProps, AnimeCardProps, ChildrenProps, InputProps

### Community 90 - "scraper/index.ts"
Cohesion: 0.13
Nodes (8): dynamic, IndexItem, IndexPage(), letterOf(), LETTERS, metadata, revalidate, revalidate

### Community 91 - "metrics.ts"
Cohesion: 0.25
Nodes (12): CIRCUIT_VALUE, dynamic, GET(), counters, getEventLoopLagMs(), getHistogramQuantile(), getHistograms(), getMetrics() (+4 more)

### Community 92 - "sitemap-entries.ts"
Cohesion: 0.42
Nodes (6): GET(), GET(), getSitemapEntries(), SITEMAP_CHUNK_SIZE, SitemapEntry, getLastUpstreamFetchAt()

### Community 93 - "checkRateLimit"
Cohesion: 0.14
Nodes (27): dynamic, GET(), dynamic, handleCspReport(), POST(), dynamic, POST(), VALID_NAMES (+19 more)

### Community 94 - "lib/link-health.ts"
Cohesion: 0.21
Nodes (15): DownloadGroupProps, LinkHealthSnapshot, checkAnimeLinkHealth(), checkLink(), classifyLinkStatus(), extractDownloadUrls(), memory, MemoryEntry (+7 more)

### Community 95 - "no-third-party.mjs"
Cohesion: 0.20
Nodes (13): add(), CONTENT_HOSTS, findings, hostOf(), isContentHost(), isSelfHost(), RESOURCE_RELS, ROOT (+5 more)

### Community 96 - ".next/**"
Cohesion: 0.14
Nodes (9): .next/**, metadata, metadata, metadata, SECTIONS, generateMetadata(), SearchAnime(), buildSearchMetadata() (+1 more)

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
Cohesion: 0.14
Nodes (29): BookmarkButton(), BookmarkButtonProps, CollectionCheckerDialog(), LinkResult, RecommendForYou(), RecommendItem, RecommendResponse, SERVER_BOOKMARKS (+21 more)

### Community 101 - "🚑 RUNBOOK — Kokunime Operations"
Cohesion: 0.18
Nodes (11): 10. Incident checklist (5 menit pertama), 1. Deploy normal, 2. Canary bertahap (opsional), 3. Rollback, 4. Backup & restore, 5. Monitoring & alert, 6. Load & chaos, 7. Feature flags (+3 more)

### Community 103 - "local-catalog.ts"
Cohesion: 0.05
Nodes (81): CatalogRecorder(), CatalogRecorderProps, CommandPalette(), CommandPalette, NO_SNAPSHOT, SearchLocalPanel(), SearchLocalPanelProps, clientSearchCache (+73 more)

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

### Community 135 - "anime-image.tsx"
Cohesion: 0.18
Nodes (8): AnimeImage(), AnimeImageProps, AnimeSearchFieldProps, TrendingEntry, Anime, NewSeriesAnime(), getAnimePerPage(), isGif()

### Community 136 - "[page]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 137 - "roulette/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 138 - "app/page.tsx"
Cohesion: 0.13
Nodes (9): dynamic, DetailHero(), compute(), getBlurDataUrl(), memory, HomeHeroSection(), HomeLatestSection(), HomeSectionProps (+1 more)

### Community 139 - "showToast"
Cohesion: 0.21
Nodes (22): BookmarksPage(), SERVER_EMPTY_QUEUE, BookmarkMetaDialog(), EmptyStateProps, SettingsAboutSection(), clearAllBookmarks(), exportBookmarksJson(), getFolderOrder() (+14 more)

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
Cohesion: 0.08
Nodes (33): dynamic, GET(), WebVitals(), EnvIssue, isHttpUrl(), isRedisUrl(), validateEnv(), onRequestError() (+25 more)

### Community 147 - "detail-hero.tsx"
Cohesion: 0.13
Nodes (8): DetailHeroProps, DetailHeroViewProps, DetailMeta(), MetaItemProps, ShareButtonProps, TrailerButtonProps, VerticalJapaneseTitle(), VerticalJapaneseTitleProps

### Community 148 - "storage-keys.ts"
Cohesion: 0.21
Nodes (6): DeferredPwaInstallBanner, BeforeInstallPromptEvent, getRecent(), SearchHistoryChips(), writeRecent(), STORAGE_KEYS

### Community 149 - "sanitize.ts"
Cohesion: 0.34
Nodes (9): parseAnimeDetail(), parseDownloads(), getDownloadLinks(), normalizeUrl(), parseBytes(), parseGenres(), normalizeSeasonName(), parseSeason() (+1 more)

### Community 151 - "compare-selector.tsx"
Cohesion: 0.22
Nodes (8): CompareSelector(), CompareSelectorProps, Pane, PRESET_COMPARISONS, Side, searchCache, useAnimeSearch(), UseAnimeSearchResult

### Community 152 - "cache.ts"
Cohesion: 0.09
Nodes (31): dynamic, GET(), dynamic, EMPTY, CACHE_TTL_SECONDS, currentLevel(), LEVEL_ORDER, logJson() (+23 more)

### Community 153 - "ics.ts"
Cohesion: 0.29
Nodes (12): GET(), buildCalendarFeed(), buildWeeklyReminderIcs(), CalendarEvent, CalendarFeedEvent, djb2(), escapeIcs(), foldLine() (+4 more)

### Community 154 - "share-card.ts"
Cohesion: 0.43
Nodes (6): canvasToBlob(), exportShareCard(), renderShareCard(), ShareCardData, ShareCardRow, wrapText()

### Community 155 - "settings-page-content.tsx"
Cohesion: 0.16
Nodes (19): DEFAULT_STORAGE, formatQuota(), SettingsPageContent(), SettingsAppearanceSection(), SettingsAppearanceSectionProps, THEME_OPTIONS, SettingsCatalogSection(), SettingsCatalogSectionProps (+11 more)

### Community 156 - "escapeXml"
Cohesion: 0.15
Nodes (17): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+9 more)

### Community 157 - "anime.ts"
Cohesion: 0.33
Nodes (6): AnimeDetail, AnimePage, DownloadOption, DownloadResolution, DownloadTarget, Genre

### Community 158 - "scraper/constants.ts"
Cohesion: 0.22
Nodes (10): Recommendation, RecommendedAnime(), UPSTREAM_URL, bestImage(), ImgLike, resolveAssetUrl(), formatAnimeData(), getRecommendations() (+2 more)

### Community 160 - "toast.ts"
Cohesion: 0.20
Nodes (16): EMPTY_TOASTS, Toaster(), clearToasts(), dismissToast(), emit(), getToasts(), lastShownAt, listeners (+8 more)

### Community 161 - "anime-detail.ts"
Cohesion: 0.23
Nodes (9): alt, contentType, Image(), runtime, size, getAnimeDetail(), getAnimeDetailWithMeta(), extractWithFallback() (+1 more)

### Community 162 - "search.ts"
Cohesion: 0.31
Nodes (9): mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias(), SEARCH_ALIASES, searchLocalIndex(), fetchSearchPage(), mergeWithLocal(), searchAnime() (+1 more)

### Community 163 - "download-group.tsx"
Cohesion: 0.15
Nodes (13): CopyButtonProps, DownloadGroup(), renderResolutionBadge(), DownloadPlatform(), getPlatformStyle(), requiresLogin(), checkedOn(), LinkHealthBadge() (+5 more)

### Community 164 - "[season]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 165 - "admin-dashboard.tsx"
Cohesion: 0.22
Nodes (9): metadata, AdminDashboard(), FeatureFlagView, PRESET_PATHS, AdminLogEntry, adminRequest(), AdminRequestResult, useAdminConsole() (+1 more)

### Community 166 - "search/route.ts"
Cohesion: 0.36
Nodes (6): GET(), parseFieldsParam(), projectRecord(), sanitizeQuery(), randomString(), rng

### Community 167 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.40
Nodes (4): Catatan operasional, Dampak, Ringkasan, Verifikasi

### Community 168 - "roulette-content.tsx"
Cohesion: 0.26
Nodes (9): metadata, GenreOption, polarPoint(), readSpinHistory(), RouletteContent(), RouletteSpin, SEGMENT_COLORS, segmentPath() (+1 more)

### Community 171 - "use-backup-tools.ts"
Cohesion: 0.38
Nodes (9): useBackupTools(), bufferOf(), decryptBackup(), deriveKey(), encryptBackup(), EncryptedEnvelope, fromBase64(), toBase64() (+1 more)

### Community 172 - "redis.ts"
Cohesion: 0.16
Nodes (21): CACHE_CODEC, decodeCacheValue(), encodeCacheValue(), gunzipAsync, gzipAsync, incrementMetric(), ensureSubscriber(), getRedis() (+13 more)

### Community 173 - "graphql/route.ts"
Cohesion: 0.33
Nodes (8): apqMemory, POST(), sha256(), analyzeQuery(), GRAPHQL_MAX_COMPLEXITY, GRAPHQL_MAX_DEPTH, QueryAnalysis, RESERVED

### Community 174 - "use-sync-link.ts"
Cohesion: 0.35
Nodes (8): useSyncLink(), UseSyncLinkResult, mergeFolderOrder(), decodeSyncPayload(), encodeSyncPayload(), fromBase64Url(), SyncPayload, toBase64Url()

### Community 177 - "continue-watching.tsx"
Cohesion: 0.33
Nodes (6): ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), EpisodeNavigator(), EpisodeNavigatorProps, nextUnwatchedEpisode()

### Community 179 - "status/page.tsx"
Cohesion: 0.33
Nodes (6): dotClass(), metadata, revalidate, StatusPage(), buildSparklinePath(), SparklineOptions

### Community 180 - "settings-storage-section.tsx"
Cohesion: 0.33
Nodes (8): COLLECTION_LABELS, SettingsStorageSection(), SettingsStorageSectionProps, UseBackupToolsResult, BackupCollection, BackupImportMode, BackupPreview, StorageBreakdown

### Community 181 - "parse.ts"
Cohesion: 0.36
Nodes (3): fetchSinglePage(), parsePagination(), FIXTURES

### Community 182 - "card-anime.tsx"
Cohesion: 0.29
Nodes (4): ViewTransitionLink(), ViewTransitionLinkProps, FeaturedHero(), FeaturedHeroProps

### Community 183 - "trending.ts"
Cohesion: 0.43
Nodes (6): POST(), getIndexedBySlugs(), dayKey(), getTrending(), recordTrendingView(), TrendingItem

### Community 184 - "link-health/route.ts"
Cohesion: 0.60
Nodes (5): dynamic, GET(), parseSlug(), POST(), summarize()

## Knowledge Gaps
- **770 isolated node(s):** `dynamic`, `metadata`, `ENDPOINTS`, `PRESET_PATHS`, `FeatureFlagView` (+765 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `stats-content.tsx`, `admin-dashboard.tsx`, `roulette-content.tsx`, `site.ts`, `app/page.tsx`, `[slug]/page.tsx`, `vitals-reporter.ts`, `status/page.tsx`, `ignore`, `scraper/index.ts`, `sitemap-entries.ts`, `[season]/page.tsx`, `update/page.tsx`, `main-layout.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `renderOgCard()` connect `renderOgCard` to `app/opengraph-image.tsx`, `[season]/opengraph-image.tsx`, `[page]/opengraph-image.tsx`, `roulette/opengraph-image.tsx`, `og-card.tsx`, `stats/opengraph-image.tsx`, `update/opengraph-image.tsx`, `wrapped/opengraph-image.tsx`, `[year]/opengraph-image.tsx`, `[genre]/opengraph-image.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `toTitle()` connect `[season]/page.tsx` to `bookmarks.ts`, `[season]/opengraph-image.tsx`, `[genre]/opengraph-image.tsx`, `main-layout.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getBookmarks()` (e.g. with `RecommendForYou()` and `StatsContent()`) actually correct?**
  _`getBookmarks()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamic`, `metadata`, `ENDPOINTS` to the rest of the system?**
  _770 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._