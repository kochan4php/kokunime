# Graph Report - kokunime  (2026-10-18)

## Corpus Check
- 525 files · ~171,166 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2198 nodes · 5116 edges · 137 communities (120 shown, 17 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 57 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fe2e294e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sanitize.ts
- main-layout.tsx
- useTranslation
- icons/index.ts
- download-extras-panel.tsx
- scripts
- stats-content.tsx
- launchBrowser
- style
- site.ts
- devDependencies
- interfaces/index.ts
- anime-listing.tsx
- scraper/index.ts
- compilerOptions
- seo.ts
- qr.ts
- formatter
- watch-queue.ts
- find-unused-exports.mjs
- ics.ts
- ignore
- vitals-reporter.ts
- app/layout.tsx
- biome.json
- next.config.mjs
- .next/**
- detail-hero.tsx
- format-date.ts
- escapeXml
- rules
- safeJsonLd
- home-skeleton.tsx
- endpoint-slug.ts
- wrapped-content.tsx
- dependencies
- bundle-budget.mjs
- a11y
- circuit-breaker.ts
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
- bookmarks/page.tsx
- post-commit
- post-checkout
- [season]/page.tsx
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
- status/page.tsx
- footer/index.tsx
- [page]/page.tsx
- qr-reference.py
- cache.ts
- listing-skeleton.tsx
- metrics.ts
- grid-skeleton.tsx
- search-index.ts
- bookmarks.ts
- [year]/page.tsx
- audit-meta.mjs
- compare-anime-client.tsx
- 🚑 RUNBOOK — Kokunime Operations
- graphql/route.ts
- 🚀 API Quickstart
- Arsitektur
- scan-secrets.mjs
- update/page.tsx
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
- section-header.tsx
- logger.ts
- app/page.tsx
- use-sync-link.ts
- sitemap-entries.ts
- css-usage-report.mjs
- indeks/page.tsx
- duplicate-detector.ts
- [slug]/loading.tsx
- share-card.ts
- offline-indicator.tsx

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 59 edges
2. `showToast()` - 52 edges
3. `getBookmarks()` - 44 edges
4. `SITE_URL` - 36 edges
5. `.next/**` - 32 edges
6. `scripts` - 31 edges
7. `animeSlug()` - 30 edges
8. `endpointSlug()` - 28 edges
9. `checkEtagMatch()` - 27 edges
10. `generateEtag()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `BookmarksPage()` --indirect_call--> `getQueue()`  [INFERRED]
  src/app/bookmarks/page.tsx → src/utils/watch-queue.ts
- `BookmarksPage()` --indirect_call--> `subscribeQueue()`  [INFERRED]
  src/app/bookmarks/page.tsx → src/utils/watch-queue.ts
- `useCollectionData()` --indirect_call--> `getBookmarks()`  [INFERRED]
  src/hooks/use-collection-data.ts → src/utils/bookmarks.ts
- `useCollectionData()` --indirect_call--> `subscribeBookmarks()`  [INFERRED]
  src/hooks/use-collection-data.ts → src/utils/bookmarks.ts
- `useCollectionData()` --indirect_call--> `getCollections()`  [INFERRED]
  src/hooks/use-collection-data.ts → src/utils/collections.ts

## Import Cycles
- None detected.

## Communities (137 total, 17 thin omitted)

### Community 0 - "sanitize.ts"
Cohesion: 0.06
Nodes (57): alt, contentType, Image(), runtime, size, CACHE_TTL_SECONDS, mergeSearchResults(), normalizeSearchTerm() (+49 more)

### Community 1 - "main-layout.tsx"
Cohesion: 0.12
Nodes (3): DeferredPwaInstallBanner, HoneypotTrap(), StaleDataBanner()

### Community 2 - "useTranslation"
Cohesion: 0.05
Nodes (65): DetailToc(), SECTIONS, MobileMenu(), MobileMenuProps, NAV_KEY_MAP, NAV_KEY_MAP, Navbar(), BeforeInstallPromptEvent (+57 more)

### Community 3 - "icons/index.ts"
Cohesion: 0.06
Nodes (25): ChevronLeftIcon(), ChevronRightIcon(), SearchIcon(), IconProps, Input(), SearchFormProps, PaginationInfo, AnimeCardProps (+17 more)

### Community 4 - "download-extras-panel.tsx"
Cohesion: 0.26
Nodes (17): BatchDownloadTools(), BatchDownloadToolsProps, calculateTime(), copiedButtonClass(), DownloadExtrasPanel(), DownloadExtrasPanelProps, buildAria2(), buildCurlSh() (+9 more)

### Community 5 - "scripts"
Cohesion: 0.06
Nodes (31): scripts, a11y:targets, audit:client, audit:meta, backup:cache, build, bundle:budget, changelog (+23 more)

### Community 6 - "stats-content.tsx"
Cohesion: 0.14
Nodes (21): metadata, EpisodeWatchedToggle(), EpisodeWatchedToggleProps, MiniBarChartProps, MiniBarDatum, dayKey(), formatWatchTime(), MONTHS_SHORT (+13 more)

### Community 7 - "launchBrowser"
Cohesion: 0.12
Nodes (32): CANDIDATES, CdpClient, evaluate(), findBrowser(), launchBrowser(), navigate(), runAxe(), screenshot() (+24 more)

### Community 8 - "style"
Cohesion: 0.22
Nodes (9): style, noNonNullAssertion, noUnusedTemplateLiteral, useConst, useImportType, useNodejsImportProtocol, useNumberNamespace, useSelfClosingElements (+1 more)

### Community 9 - "site.ts"
Cohesion: 0.10
Nodes (16): RFC-9116, dynamic, POST(), dynamic, dynamic, metadata, MAX_REVALIDATE_PATHS, sanitizeRevalidatePaths() (+8 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): axe-core, @biomejs/biome, jsdom, lint-staged, devDependencies, axe-core, @biomejs/biome, jsdom (+17 more)

### Community 11 - "interfaces/index.ts"
Cohesion: 0.16
Nodes (11): AnimeDetail, AnimePage, DownloadOption, DownloadResolution, DownloadTarget, Genre, Season, SeasonYearGroup() (+3 more)

### Community 12 - "anime-listing.tsx"
Cohesion: 0.08
Nodes (36): CommandPalette(), CommandPalette, clientSearchCache, useCommandPalette(), UseCommandPaletteResult, useUrlState(), AnimeListing(), AnimeListingProps (+28 more)

### Community 13 - "scraper/index.ts"
Cohesion: 0.06
Nodes (72): RFC-9457, BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), POST_DEPRECATION_HEADERS (+64 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts (+24 more)

### Community 15 - "seo.ts"
Cohesion: 0.20
Nodes (10): Anime(), generateMetadata(), revalidate, buildDetailMetadata(), buildAnimeJsonLd(), buildBreadcrumbJsonLd(), buildFaqJsonLd(), buildItemListJsonLd() (+2 more)

### Community 16 - "qr.ts"
Cohesion: 0.14
Nodes (25): PrintQrCard(), PrintQrCardProps, addEccAndInterleave(), applyMask(), buildMatrix(), dataCodewords(), drawCodewords(), drawFormatBits() (+17 more)

### Community 17 - "formatter"
Cohesion: 0.40
Nodes (5): quoteStyle, semicolons, trailingCommas, javascript, formatter

### Community 18 - "watch-queue.ts"
Cohesion: 0.07
Nodes (50): metadata, AdminDashboard(), FeatureFlagView, PRESET_PATHS, BookmarksQueueView(), SERVER_EMPTY, chipClass(), EMPTY (+42 more)

### Community 19 - "find-unused-exports.mjs"
Cohesion: 0.18
Nodes (11): corpus, exportsByFile, files, ROOT, SCAN_DIRS, SKIP_EXPORTS, SRC_DIRS, textCache (+3 more)

### Community 20 - "ics.ts"
Cohesion: 0.08
Nodes (19): Suggestion, dynamic, GET(), ErrorCard(), ErrorCardProps, RouteError(), RouteErrorProps, UpdateIcsButton() (+11 more)

### Community 21 - "ignore"
Cohesion: 0.22
Nodes (9): files, ignore, ignoreUnknown, node_modules/**, coverage/**, dist/**, graphify-out/**, pnpm-lock.yaml (+1 more)

### Community 22 - "vitals-reporter.ts"
Cohesion: 0.07
Nodes (36): dynamic, GET(), EnvIssue, isHttpUrl(), isRedisUrl(), validateEnv(), onRequestError(), register() (+28 more)

### Community 23 - "app/layout.tsx"
Cohesion: 0.15
Nodes (9): jetBrainsMono, plusJakartaSans, RootLayout(), viewport, RouteAnnouncer(), rules, ServiceWorkerRegister(), metadata (+1 more)

### Community 24 - "biome.json"
Cohesion: 0.22
Nodes (8): organizeImports, enabled, overrides, $schema, vcs, clientKind, enabled, useIgnoreFile

### Community 25 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - ".next/**"
Cohesion: 0.14
Nodes (9): .next/**, metadata, metadata, metadata, SECTIONS, generateMetadata(), SearchAnime(), buildSearchMetadata() (+1 more)

### Community 27 - "detail-hero.tsx"
Cohesion: 0.10
Nodes (27): formatAge(), OfflinePage(), CopyButtonProps, DetailHero(), DetailHeroProps, DetailHeroViewProps, readPosterUrl(), registerRefreshSync() (+19 more)

### Community 28 - "format-date.ts"
Cohesion: 0.50
Nodes (3): formatLocalizedDate(), MONTHS_EN, MONTHS_ID

### Community 29 - "escapeXml"
Cohesion: 0.19
Nodes (14): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+6 more)

### Community 30 - "rules"
Cohesion: 0.20
Nodes (10): noUnusedVariables, useExhaustiveDependencies, useJsxKeyInIterable, linter, enabled, rules, correctness, recommended (+2 more)

### Community 31 - "safeJsonLd"
Cohesion: 0.11
Nodes (22): ApiDocsPage(), ENDPOINTS, metadata, ComparePage(), ComparePageProps, dynamic, metadata, GenresPage() (+14 more)

### Community 33 - "endpoint-slug.ts"
Cohesion: 0.13
Nodes (17): DetailMeta(), MetaItemProps, chipColors, GenreTags(), GENRE_DICTIONARY, GenreMeta, GenresExplorer(), GenresExplorerProps (+9 more)

### Community 34 - "wrapped-content.tsx"
Cohesion: 0.14
Nodes (24): metadata, EMPTY_HISTORY, EMPTY_PROGRESS, HomeHistoryStrip(), RecommendForYou(), RecommendItem, RecommendResponse, SERVER_BOOKMARKS (+16 more)

### Community 35 - "dependencies"
Cohesion: 0.13
Nodes (15): cheerio, husky, next, dependencies, cheerio, husky, next, react (+7 more)

### Community 36 - "bundle-budget.mjs"
Cohesion: 0.27
Nodes (8): baseline, collect(), current, formatKb(), report(), statSize(), THRESHOLD, walk()

### Community 37 - "a11y"
Cohesion: 0.25
Nodes (8): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, a11y

### Community 38 - "circuit-breaker.ts"
Cohesion: 0.23
Nodes (12): dynamic, GET(), BreakerEntry, breakers, canRequest(), CircuitState, entryFor(), getCircuitState() (+4 more)

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

### Community 49 - "toast.ts"
Cohesion: 0.20
Nodes (16): EMPTY_TOASTS, Toaster(), clearToasts(), dismissToast(), emit(), getToasts(), lastShownAt, listeners (+8 more)

### Community 51 - "progress.ts"
Cohesion: 0.06
Nodes (46): ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), DownloadGuideModal(), DownloadPlatform() (+38 more)

### Community 57 - "renderOgCard"
Cohesion: 0.05
Nodes (42): alt, contentType, Image(), runtime, size, alt, contentType, Image() (+34 more)

### Community 58 - "bookmarks/page.tsx"
Cohesion: 0.19
Nodes (21): BookmarksPage(), SERVER_EMPTY_QUEUE, BookmarkMetaDialog(), BookmarkMetaDialogProps, BookmarksBulkBarProps, EmptyStateProps, clearAllBookmarks(), exportBookmarksJson() (+13 more)

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 61 - "[season]/page.tsx"
Cohesion: 0.10
Nodes (24): alt, contentType, Image(), runtime, size, dynamic, generateMetadata(), GenrePage() (+16 more)

### Community 62 - "animeSlug"
Cohesion: 0.08
Nodes (26): AnimeGrid(), AnimeGridProps, AnimeImage(), AnimeImageProps, AnimeSearchFieldProps, GenreOption, polarPoint(), readSpinHistory() (+18 more)

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
Cohesion: 0.16
Nodes (19): cleanFirstTitle(), dynamic, GET(), probe(), bodyKey(), DEFAULT_HEADERS, doFetch(), request() (+11 more)

### Community 81 - "compare-selector.tsx"
Cohesion: 0.22
Nodes (8): CompareSelector(), CompareSelectorProps, Pane, PRESET_COMPARISONS, Side, searchCache, useAnimeSearch(), UseAnimeSearchResult

### Community 82 - "use-collection-data.ts"
Cohesion: 0.14
Nodes (23): BookmarkListRow(), BookmarkListRowProps, BookmarksDayList(), BookmarksDayListProps, BookmarksGridViewProps, BookmarksStatusFilters(), BookmarksStatusFiltersProps, chipClass() (+15 more)

### Community 83 - "status/page.tsx"
Cohesion: 0.17
Nodes (16): dynamic, GET(), dotClass(), metadata, revalidate, StatusPage(), redisCounterValue(), redisRateLimit() (+8 more)

### Community 84 - "footer/index.tsx"
Cohesion: 0.29
Nodes (4): footerDevLinks, footerNavLinks, footerTags, Footer()

### Community 88 - "cache.ts"
Cohesion: 0.16
Nodes (21): incrementMetric(), ensureSubscriber(), handleInvalidateMessage(), INSTANCE_ID, onCacheInvalidate(), publishCacheInvalidate(), RedisClient, CachedResult (+13 more)

### Community 91 - "metrics.ts"
Cohesion: 0.15
Nodes (20): dynamic, GET(), renderBadge(), CIRCUIT_VALUE, dynamic, GET(), COMMIT, dynamic (+12 more)

### Community 93 - "search-index.ts"
Cohesion: 0.19
Nodes (17): getRedis(), makeClient(), compact(), getIndexedBySlugs(), getIndexSnapshot(), IndexedAnime, rankIndexItems(), searchLocalIndex() (+9 more)

### Community 94 - "bookmarks.ts"
Cohesion: 0.20
Nodes (22): BookmarkButton(), BookmarkButtonProps, CollectionCheckerDialog(), LinkResult, COMPLETED_FOLDER, maybeAutoArchive(), parseAniListJson(), parseMalXml() (+14 more)

### Community 95 - "[year]/page.tsx"
Cohesion: 0.29
Nodes (5): dynamic, GET(), revalidate, YearPage(), collectYearAnime()

### Community 98 - "audit-meta.mjs"
Cohesion: 0.13
Nodes (14): args, base, baseArg, checkJsonLd(), checkNode(), limit, limitArg, problems (+6 more)

### Community 99 - "compare-anime-client.tsx"
Cohesion: 0.11
Nodes (32): CompareAnimeClient(), CompareAnimeClientProps, Side, CompareAnimeCard(), CompareAnimeCardProps, SIDE_DETAIL_LABELS, SIDE_LABELS, CompareGenreAnalysis() (+24 more)

### Community 101 - "🚑 RUNBOOK — Kokunime Operations"
Cohesion: 0.17
Nodes (11): 10. Incident checklist (5 menit pertama), 1. Deploy normal, 2. Canary bertahap (opsional), 3. Rollback, 4. Backup & restore, 5. Monitoring & alert, 6. Load & chaos, 7. Feature flags (+3 more)

### Community 103 - "graphql/route.ts"
Cohesion: 0.26
Nodes (10): apqMemory, POST(), sha256(), analyzeQuery(), GRAPHQL_MAX_COMPLEXITY, GRAPHQL_MAX_DEPTH, QueryAnalysis, RESERVED (+2 more)

### Community 104 - "🚀 API Quickstart"
Cohesion: 0.22
Nodes (8): 1. Cari anime, 2. Detail, episode, link download, 3. Jelajah katalog, 4. GraphQL (pengganti resmi `/api/anime/bulk`), 5. Bulk (deprecated — tetap hidup sampai 16 Apr 2027), 6. Endpoint ops (tanpa auth), 🚀 API Quickstart, Etika pemakaian

### Community 105 - "Arsitektur"
Cohesion: 0.25
Nodes (7): Alur request, Arsitektur, Aturan data, Deploy & rilis, Dokumen terkait, Observability, Resiliensi upstream

### Community 106 - "scan-secrets.mjs"
Cohesion: 0.25
Nodes (6): findings, PATTERNS, pending, SCAN_EXTENSIONS, SKIP_DIRS, SKIP_FILES

### Community 107 - "update/page.tsx"
Cohesion: 0.25
Nodes (8): BUCKET_META, metadata, revalidate, UpdatePage(), AgeBucket, NUMBER_WORDS, parseRelativeAge(), RelativeAge

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

### Community 135 - "section-header.tsx"
Cohesion: 0.18
Nodes (8): SeasonsPage(), SectionHeader(), SectionHeaderProps, SectionTone, TONE_CLASS, LatestGridProps, groupSeasonsByYear(), orderYears()

### Community 137 - "logger.ts"
Cohesion: 0.18
Nodes (16): dynamic, GET(), currentLevel(), LEVEL_ORDER, logJson(), LogLevel, redact(), rotateIfNeeded() (+8 more)

### Community 138 - "app/page.tsx"
Cohesion: 0.21
Nodes (6): dynamic, RailSkeleton(), HomeHeroSection(), HomeLatestSection(), HomeSectionProps, HeroSkeleton()

### Community 139 - "use-sync-link.ts"
Cohesion: 0.16
Nodes (24): BookmarksFolderBar(), BookmarksFolderBarProps, folderChipClass(), useSyncLink(), UseSyncLinkResult, getFolderOrder(), mergeFolderOrder(), updateBookmarkUserMeta() (+16 more)

### Community 141 - "sitemap-entries.ts"
Cohesion: 0.42
Nodes (6): GET(), GET(), getSitemapEntries(), SITEMAP_CHUNK_SIZE, SitemapEntry, getLastUpstreamFetchAt()

### Community 142 - "css-usage-report.mjs"
Cohesion: 0.25
Nodes (6): defined, SOURCE_DIR, sourceFiles, sourceText, STYLE_DIR, unused

### Community 145 - "indeks/page.tsx"
Cohesion: 0.33
Nodes (6): IndexItem, IndexPage(), letterOf(), LETTERS, metadata, revalidate

### Community 149 - "duplicate-detector.ts"
Cohesion: 0.53
Nodes (4): DuplicateGroup, findDuplicateGroups(), NOISE_WORDS, normalizeTitle()

### Community 154 - "share-card.ts"
Cohesion: 0.43
Nodes (6): canvasToBlob(), exportShareCard(), renderShareCard(), ShareCardData, ShareCardRow, wrapText()

### Community 156 - "offline-indicator.tsx"
Cohesion: 0.60
Nodes (5): getCacheServedSnapshot(), getOnlineSnapshot(), OfflineIndicator(), subscribeCacheServed(), subscribeOnline()

## Knowledge Gaps
- **680 isolated node(s):** `name`, `version`, `private`, `author`, `packageManager` (+675 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `wrapped-content.tsx`, `stats-content.tsx`, `section-header.tsx`, `site.ts`, `app/page.tsx`, `update/page.tsx`, `sitemap-entries.ts`, `seo.ts`, `indeks/page.tsx`, `watch-queue.ts`, `status/page.tsx`, `ignore`, `[page]/page.tsx`, `app/layout.tsx`, `vitals-reporter.ts`, `[season]/page.tsx`, `[year]/page.tsx`, `safeJsonLd`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `showToast()` connect `bookmarks/page.tsx` to `wrapped-content.tsx`, `compare-anime-client.tsx`, `stats-content.tsx`, `use-sync-link.ts`, `anime-listing.tsx`, `toast.ts`, `watch-queue.ts`, `ics.ts`, `app/layout.tsx`, `animeSlug`, `detail-hero.tsx`, `bookmarks.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `.next/**`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getBookmarks()` (e.g. with `RecommendForYou()` and `StatsContent()`) actually correct?**
  _`getBookmarks()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _680 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sanitize.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05852842809364549 - nodes in this community are weakly interconnected._