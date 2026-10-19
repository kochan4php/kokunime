# Graph Report - kokunime  (2026-10-19)

## Corpus Check
- 547 files · ~184,677 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2406 nodes · 5689 edges · 171 communities (151 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 76 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `58da6495`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scraper/constants.ts
- tags.ts
- settings.ts
- pagination/index.tsx
- download-extras-panel.tsx
- scripts
- episode-log.ts
- launchBrowser
- style
- site.ts
- devDependencies
- seasons/page.tsx
- [query]/page.tsx
- checkRateLimit
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
- genres.ts
- offline-saved.ts
- format-date.ts
- search/route.ts
- rules
- .next/**
- useTranslation
- endpoint-slug.ts
- stats-content.tsx
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
- toast.ts
- use-sync-link.ts
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
- compare-selector.tsx
- use-collection-data.ts
- status/page.tsx
- ics.ts
- saved-searches.ts
- qr-reference.py
- progress.ts
- cache.ts
- use-command-palette.ts
- main-layout.tsx
- metrics.ts
- checkEtagMatch
- redis.ts
- bookmarks.ts
- no-third-party.mjs
- offline/layout.tsx
- revalidate/route.ts
- audit-meta.mjs
- compare-anime-client.tsx
- denyAdmin
- 🚑 RUNBOOK — Kokunime Operations
- interfaces/index.ts
- search-index.ts
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
- collections.ts
- stats/opengraph-image.tsx
- update/opengraph-image.tsx
- css-usage-report.mjs
- wrapped/opengraph-image.tsx
- dictionary.ts
- footer/index.tsx
- scraper/index.ts
- parse.ts
- parse-detail.ts
- admin-dashboard.tsx
- [slug]/loading.tsx
- redisHealth
- trending.ts
- sanitize.ts
- share-card.ts
- graphql-guard.ts
- bar.tsx
- anime.ts
- icons/index.ts
- search-form.tsx
- [slug]/opengraph-image.tsx
- ready/route.ts
- recommend/route.ts
- download-platform.tsx
- [season]/opengraph-image.tsx
- duplicate-detector.ts
- parser-benchmark.test.ts
- bookmarks-bulk-bar.tsx
- components/empty-state.tsx
- pwa-install-button.tsx
- og-card.tsx

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 67 edges
2. `showToast()` - 64 edges
3. `getBookmarks()` - 44 edges
4. `SITE_URL` - 36 edges
5. `animeSlug()` - 34 edges
6. `scripts` - 33 edges
7. `.next/**` - 32 edges
8. `checkRateLimit()` - 29 edges
9. `checkEtagMatch()` - 29 edges
10. `generateEtag()` - 29 edges

## Surprising Connections (you probably didn't know these)
- `CollectionCheckerDialogProps` --references--> `BookmarkItem`  [EXTRACTED]
  src/components/bookmarks/collection-checker-dialog.tsx → src/utils/bookmarks.ts
- `TagIndexPage()` --indirect_call--> `getCatalogSnapshot()`  [INFERRED]
  src/app/tag/page.tsx → src/utils/local-catalog.ts
- `TagDetailPage()` --indirect_call--> `getCatalogSnapshot()`  [INFERRED]
  src/app/tag/[tag]/page.tsx → src/utils/local-catalog.ts
- `SearchLocalPanel()` --indirect_call--> `getCatalogSnapshot()`  [INFERRED]
  src/components/search-local-panel.tsx → src/utils/local-catalog.ts
- `SearchLocalPanel()` --indirect_call--> `subscribeCatalog()`  [INFERRED]
  src/components/search-local-panel.tsx → src/utils/local-catalog.ts

## Import Cycles
- None detected.

## Communities (171 total, 20 thin omitted)

### Community 0 - "scraper/constants.ts"
Cohesion: 0.20
Nodes (11): upstream, Recommendation, RecommendedAnime(), UPSTREAM_URL, bestImage(), ImgLike, resolveAssetUrl(), formatAnimeData() (+3 more)

### Community 1 - "tags.ts"
Cohesion: 0.23
Nodes (25): NO_SNAPSHOT, TagIndexPage(), NO_SNAPSHOT, TagDetailPage(), AnimeTagsEditor(), subscribeCatalog(), addTag(), clearTags() (+17 more)

### Community 2 - "settings.ts"
Cohesion: 0.09
Nodes (42): DEFAULT_STORAGE, formatQuota(), SettingsPageContent(), SettingsAppearanceSection(), SettingsAppearanceSectionProps, THEME_OPTIONS, SettingsCatalogSection(), SettingsCatalogSectionProps (+34 more)

### Community 3 - "pagination/index.tsx"
Cohesion: 0.29
Nodes (10): Pagination(), PaginationProps, PageNumbers(), PageNumbersProps, PageJump(), buildPageHref(), buildPaginationInfo(), getPages() (+2 more)

### Community 4 - "download-extras-panel.tsx"
Cohesion: 0.26
Nodes (17): BatchDownloadTools(), BatchDownloadToolsProps, calculateTime(), copiedButtonClass(), DownloadExtrasPanel(), DownloadExtrasPanelProps, buildAria2(), buildCurlSh() (+9 more)

### Community 5 - "scripts"
Cohesion: 0.06
Nodes (33): scripts, a11y:targets, audit:client, audit:meta, backup:cache, build, bundle:budget, changelog (+25 more)

### Community 6 - "episode-log.ts"
Cohesion: 0.33
Nodes (11): countMarksSince(), EMPTY_MARKS, EpisodeMark, getEpisodeMarks(), getStorage(), persist(), recordEpisodeMark(), removeEpisodeMark() (+3 more)

### Community 7 - "launchBrowser"
Cohesion: 0.12
Nodes (32): CANDIDATES, CdpClient, evaluate(), findBrowser(), launchBrowser(), navigate(), runAxe(), screenshot() (+24 more)

### Community 8 - "style"
Cohesion: 0.22
Nodes (9): style, noNonNullAssertion, noUnusedTemplateLiteral, useConst, useImportType, useNodejsImportProtocol, useNumberNamespace, useSelfClosingElements (+1 more)

### Community 9 - "site.ts"
Cohesion: 0.07
Nodes (33): RFC-9116, dynamic, GET(), dynamic, dynamic, GET(), dynamic, GET() (+25 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): devDependencies, axe-core, @biomejs/biome, jsdom, lint-staged, postcss, tailwindcss, @tailwindcss/postcss (+17 more)

### Community 11 - "seasons/page.tsx"
Cohesion: 0.24
Nodes (8): SeasonsPage(), Season, SeasonYearGroup(), SeasonYearGroupProps, TaxonomyCard(), TaxonomyCardProps, groupSeasonsByYear(), orderYears()

### Community 12 - "[query]/page.tsx"
Cohesion: 0.15
Nodes (16): generateMetadata(), SearchAnime(), useUrlState(), buildSearchMetadata(), decodeQuery(), SEARCH_SCHEMA, SearchResults(), SearchResultsProps (+8 more)

### Community 13 - "checkRateLimit"
Cohesion: 0.15
Nodes (26): dynamic, GET(), apqMemory, POST(), sha256(), dynamic, handleCspReport(), POST() (+18 more)

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

### Community 22 - "vitals-reporter.ts"
Cohesion: 0.07
Nodes (35): dynamic, GET(), WebVitals(), EnvIssue, isHttpUrl(), isRedisUrl(), validateEnv(), onRequestError() (+27 more)

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
Nodes (15): cached(), CacheTier, fetchSingleGenrePage(), getAnimeByGenres(), getGenres(), getGenresWithMeta(), parseSimplePagination(), parseTaxonomy() (+7 more)

### Community 27 - "offline-saved.ts"
Cohesion: 0.08
Nodes (39): formatAge(), OfflinePage(), DetailHero(), DetailHeroProps, DetailHeroViewProps, DetailMeta(), MetaItemProps, readPosterUrl() (+31 more)

### Community 28 - "format-date.ts"
Cohesion: 0.50
Nodes (3): formatLocalizedDate(), MONTHS_EN, MONTHS_ID

### Community 29 - "search/route.ts"
Cohesion: 0.29
Nodes (9): GET(), GET(), parseFieldsParam(), projectRecord(), runWithRequestId(), storage, sanitizeQuery(), randomString() (+1 more)

### Community 30 - "rules"
Cohesion: 0.20
Nodes (10): noUnusedVariables, useExhaustiveDependencies, useJsxKeyInIterable, linter, enabled, rules, correctness, recommended (+2 more)

### Community 31 - ".next/**"
Cohesion: 0.09
Nodes (30): .next/**, ApiDocsPage(), ENDPOINTS, metadata, metadata, ComparePage(), ComparePageProps, dynamic (+22 more)

### Community 32 - "useTranslation"
Cohesion: 0.10
Nodes (23): DetailToc(), SECTIONS, EpisodeNavigator(), EpisodeNavigatorProps, CommandPalette(), CommandPalette, MobileMenu(), MobileMenuProps (+15 more)

### Community 33 - "endpoint-slug.ts"
Cohesion: 0.09
Nodes (24): dynamic, GET(), revalidate, chipColors, GenreTags(), GENRE_DICTIONARY, GenreMeta, GenresExplorer() (+16 more)

### Community 34 - "stats-content.tsx"
Cohesion: 0.10
Nodes (34): metadata, metadata, EMPTY_HISTORY, EMPTY_PROGRESS, HomeHistoryStrip(), MiniBarChartProps, MiniBarDatum, RecommendForYou() (+26 more)

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
Cohesion: 0.14
Nodes (28): CatalogRecorder(), CatalogRecorderProps, CatalogEntry, CatalogFacet, clearCatalog(), countFacet(), ensureServerIndexMerged(), ensureStorageListener() (+20 more)

### Community 39 - "suspicious"
Cohesion: 0.22
Nodes (9): suspicious, noArrayIndexKey, noAssignInExpressions, noConsoleLog, noControlCharactersInRegex, noExplicitAny, noGlobalIsNan, noMisleadingCharacterClass (+1 more)

### Community 41 - "sw.js"
Cohesion: 0.12
Nodes (21): API_SWR, broadcast(), CACHE_CAPS, capSavedEntries(), DEGRADED_TIERS, enqueueRequest(), flushOutbox(), KEEP_CACHES (+13 more)

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
Cohesion: 0.07
Nodes (47): BookmarksQueueView(), SERVER_EMPTY, AnimeImage(), AnimeImageProps, AnimeSearchFieldProps, GenreOption, polarPoint(), readSpinHistory() (+39 more)

### Community 51 - "use-sync-link.ts"
Cohesion: 0.29
Nodes (8): UseSyncLinkResult, mergeProgressEntries(), sanitizeEntry(), decodeSyncPayload(), encodeSyncPayload(), fromBase64Url(), SyncPayload, toBase64Url()

### Community 57 - "[year]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 58 - "showToast"
Cohesion: 0.22
Nodes (31): BookmarksPage(), SERVER_EMPTY_QUEUE, BookmarkMetaDialog(), CollectionCheckerDialog(), CollectionCheckerDialogProps, LinkResult, useSyncLink(), clearAllBookmarks() (+23 more)

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
Cohesion: 0.27
Nodes (7): BUCKET_META, metadata, revalidate, AgeBucket, NUMBER_WORDS, parseRelativeAge(), RelativeAge

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
Cohesion: 0.17
Nodes (20): bodyKey(), DEFAULT_HEADERS, doFetch(), request(), retryDelay(), sha1(), toHeaderRecord(), UpstreamRequestConfig (+12 more)

### Community 81 - "compare-selector.tsx"
Cohesion: 0.22
Nodes (8): CompareSelector(), CompareSelectorProps, Pane, PRESET_COMPARISONS, Side, searchCache, useAnimeSearch(), UseAnimeSearchResult

### Community 82 - "use-collection-data.ts"
Cohesion: 0.16
Nodes (20): BookmarkMetaDialogProps, BookmarkListRow(), BookmarkListRowProps, BookmarksDayList(), BookmarksDayListProps, BookmarksGridViewProps, BookmarksToolbar(), BookmarksToolbarProps (+12 more)

### Community 83 - "status/page.tsx"
Cohesion: 0.19
Nodes (14): dynamic, GET(), dotClass(), metadata, revalidate, StatusPage(), redisCounterValue(), dayKey() (+6 more)

### Community 84 - "ics.ts"
Cohesion: 0.26
Nodes (13): dynamic, GET(), buildCalendarFeed(), buildWeeklyReminderIcs(), CalendarEvent, CalendarFeedEvent, djb2(), escapeIcs() (+5 more)

### Community 85 - "saved-searches.ts"
Cohesion: 0.23
Nodes (19): NO_SNAPSHOT, SearchLocalPanel(), SearchLocalPanelProps, searchLocalCatalog(), cache, checkSavedSearches(), emit(), ensureStorageListener() (+11 more)

### Community 87 - "progress.ts"
Cohesion: 0.12
Nodes (26): DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), EpisodeWatchedToggle(), EpisodeWatchedToggleProps, HistoryTracker(), HistoryTrackerProps, episodeAnchors() (+18 more)

### Community 88 - "cache.ts"
Cohesion: 0.12
Nodes (26): currentLevel(), LEVEL_ORDER, logJson(), LogLevel, redact(), rotateIfNeeded(), writeLine(), redisGet() (+18 more)

### Community 89 - "use-command-palette.ts"
Cohesion: 0.19
Nodes (17): clientSearchCache, mergePaletteResults(), toPaletteAnime(), useCommandPalette(), UseCommandPaletteResult, fuzzyScore(), HighlightSegment, highlightSegments() (+9 more)

### Community 90 - "main-layout.tsx"
Cohesion: 0.07
Nodes (5): CardSkeleton(), GridSkeletonProps, HoneypotTrap(), ListingSkeleton(), ListingSkeletonProps

### Community 91 - "metrics.ts"
Cohesion: 0.18
Nodes (18): CIRCUIT_VALUE, dynamic, GET(), COMMIT, dynamic, GET(), getCircuitState(), counters (+10 more)

### Community 92 - "checkEtagMatch"
Cohesion: 0.23
Nodes (20): RFC-9457, GET(), EpisodeGroup, EpisodeMirror, GET(), GET(), GET(), GET() (+12 more)

### Community 93 - "redis.ts"
Cohesion: 0.22
Nodes (15): CACHE_CODEC, decodeCacheValue(), encodeCacheValue(), gunzipAsync, gzipAsync, incrementMetric(), ensureSubscriber(), getRedis() (+7 more)

### Community 94 - "bookmarks.ts"
Cohesion: 0.21
Nodes (16): BookmarkButton(), BookmarkButtonProps, BookmarksStatusFilters(), BookmarksStatusFiltersProps, chipClass(), parseAniListJson(), parseMalXml(), serializeMalXml() (+8 more)

### Community 95 - "no-third-party.mjs"
Cohesion: 0.20
Nodes (13): add(), CONTENT_HOSTS, findings, hostOf(), isContentHost(), isSelfHost(), RESOURCE_RELS, ROOT (+5 more)

### Community 97 - "revalidate/route.ts"
Cohesion: 0.33
Nodes (6): dynamic, POST(), MAX_REVALIDATE_PATHS, sanitizeRevalidatePaths(), IndexNowResult, submitToIndexNow()

### Community 98 - "audit-meta.mjs"
Cohesion: 0.13
Nodes (14): args, base, baseArg, checkJsonLd(), checkNode(), limit, limitArg, problems (+6 more)

### Community 99 - "compare-anime-client.tsx"
Cohesion: 0.11
Nodes (32): CompareAnimeClient(), CompareAnimeClientProps, Side, CompareAnimeCard(), CompareAnimeCardProps, SIDE_DETAIL_LABELS, SIDE_LABELS, CompareGenreAnalysis() (+24 more)

### Community 100 - "denyAdmin"
Cohesion: 0.17
Nodes (15): dynamic, GET(), POST(), dynamic, GET(), clientIp(), denyAdmin(), isRedisConfigured() (+7 more)

### Community 101 - "🚑 RUNBOOK — Kokunime Operations"
Cohesion: 0.17
Nodes (11): 10. Incident checklist (5 menit pertama), 1. Deploy normal, 2. Canary bertahap (opsional), 3. Rollback, 4. Backup & restore, 5. Monitoring & alert, 6. Load & chaos, 7. Feature flags (+3 more)

### Community 102 - "interfaces/index.ts"
Cohesion: 0.10
Nodes (15): ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), DownloadGuideModal(), DownloadSection(), NewSeriesSkeleton(), ReadingFocusModeProps, SectionDetail() (+7 more)

### Community 103 - "search-index.ts"
Cohesion: 0.21
Nodes (15): getIndexDump(), getIndexSnapshot(), IndexedAnime, rankIndexItems(), searchLocalIndex(), suggestLocal(), SimilarAnime(), ParsedQuery (+7 more)

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
Cohesion: 0.21
Nodes (6): DeferredPwaInstallBanner, BeforeInstallPromptEvent, getRecent(), SearchHistoryChips(), writeRecent(), STORAGE_KEYS

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

### Community 135 - "animeSlug"
Cohesion: 0.08
Nodes (24): IndexItem, IndexPage(), letterOf(), LETTERS, metadata, revalidate, metadata, SECTIONS (+16 more)

### Community 136 - "[page]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 137 - "roulette/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 138 - "app/page.tsx"
Cohesion: 0.10
Nodes (7): dynamic, revalidate, RailSkeleton(), HomeLatestSection(), HomeSectionProps, HeroSkeleton(), HomeSkeleton()

### Community 139 - "collections.ts"
Cohesion: 0.28
Nodes (14): BookmarksFolderBar(), BookmarksFolderBarProps, folderChipClass(), addCollection(), EMPTY_COLLECTIONS, getCollections(), getStorage(), MAX_COLLECTION_NAME (+6 more)

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

### Community 146 - "scraper/index.ts"
Cohesion: 0.14
Nodes (14): BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), POST_DEPRECATION_HEADERS, resolveBulk() (+6 more)

### Community 147 - "parse.ts"
Cohesion: 0.24
Nodes (6): Anime, NewSeriesAnime(), fetchSinglePage(), getAnimePerPage(), parsePagination(), FIXTURES

### Community 148 - "parse-detail.ts"
Cohesion: 0.34
Nodes (9): parseAnimeDetail(), parseDownloads(), getDownloadLinks(), normalizeUrl(), parseBytes(), parseGenres(), normalizeSeasonName(), parseSeason() (+1 more)

### Community 149 - "admin-dashboard.tsx"
Cohesion: 0.22
Nodes (9): metadata, AdminDashboard(), FeatureFlagView, PRESET_PATHS, AdminLogEntry, adminRequest(), AdminRequestResult, useAdminConsole() (+1 more)

### Community 151 - "redisHealth"
Cohesion: 0.23
Nodes (10): dynamic, GET(), renderBadge(), cleanFirstTitle(), dynamic, GET(), probe(), UpstreamErrorLike (+2 more)

### Community 152 - "trending.ts"
Cohesion: 0.27
Nodes (9): dynamic, POST(), dynamic, GET(), getIndexedBySlugs(), dayKey(), getTrending(), recordTrendingView() (+1 more)

### Community 153 - "sanitize.ts"
Cohesion: 0.20
Nodes (13): mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias(), SEARCH_ALIASES, TTL, getAnimeDetailWithMeta(), extractWithFallback(), FallbackExtractResult (+5 more)

### Community 154 - "share-card.ts"
Cohesion: 0.43
Nodes (6): canvasToBlob(), exportShareCard(), renderShareCard(), ShareCardData, ShareCardRow, wrapText()

### Community 155 - "graphql-guard.ts"
Cohesion: 0.43
Nodes (5): analyzeQuery(), GRAPHQL_MAX_COMPLEXITY, GRAPHQL_MAX_DEPTH, QueryAnalysis, RESERVED

### Community 156 - "bar.tsx"
Cohesion: 0.21
Nodes (8): ChevronLeftIcon(), ChevronRightIcon(), PaginationInfo, PaginationBar(), PaginationBarProps, PaginationButton(), PaginationButtonProps, MobilePaginationProps

### Community 157 - "anime.ts"
Cohesion: 0.33
Nodes (6): AnimeDetail, AnimePage, DownloadOption, DownloadResolution, DownloadTarget, Genre

### Community 159 - "search-form.tsx"
Cohesion: 0.22
Nodes (6): SearchIcon(), Input(), SearchFormProps, AnimeCardProps, ChildrenProps, InputProps

### Community 160 - "[slug]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (6): alt, contentType, Image(), runtime, size, getAnimeDetail()

### Community 161 - "ready/route.ts"
Cohesion: 0.33
Nodes (5): dynamic, GET(), UPSTREAM_CIRCUIT_KEY, isShuttingDown(), resetLifecycle()

### Community 162 - "recommend/route.ts"
Cohesion: 0.32
Nodes (6): dynamic, EMPTY, CACHE_TTL_SECONDS, RecommendationItem, RecommendationPayload, scoreRecommendations()

### Community 163 - "download-platform.tsx"
Cohesion: 0.38
Nodes (4): CopyButtonProps, DownloadPlatform(), getPlatformStyle(), requiresLogin()

### Community 164 - "[season]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 165 - "duplicate-detector.ts"
Cohesion: 0.53
Nodes (4): DuplicateGroup, findDuplicateGroups(), NOISE_WORDS, normalizeTitle()

## Knowledge Gaps
- **741 isolated node(s):** `KEEP_CACHES`, `CACHE_CAPS`, `PRECACHE_URLS`, `OFFLINE_PAGES`, `API_SWR` (+736 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `offline/layout.tsx`, `endpoint-slug.ts`, `stats-content.tsx`, `animeSlug`, `site.ts`, `app/page.tsx`, `seasons/page.tsx`, `[query]/page.tsx`, `[slug]/page.tsx`, `status/page.tsx`, `ignore`, `admin-dashboard.tsx`, `vitals-reporter.ts`, `update/page.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `toTitle()` connect `.next/**` to `stats-content.tsx`, `[season]/opengraph-image.tsx`, `[genre]/opengraph-image.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `renderOgCard()` connect `renderOgCard` to `app/opengraph-image.tsx`, `[season]/opengraph-image.tsx`, `[page]/opengraph-image.tsx`, `roulette/opengraph-image.tsx`, `og-card.tsx`, `stats/opengraph-image.tsx`, `update/opengraph-image.tsx`, `wrapped/opengraph-image.tsx`, `[year]/opengraph-image.tsx`, `[genre]/opengraph-image.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getBookmarks()` (e.g. with `RecommendForYou()` and `StatsContent()`) actually correct?**
  _`getBookmarks()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `KEEP_CACHES`, `CACHE_CAPS`, `PRECACHE_URLS` to the rest of the system?**
  _741 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `settings.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09125188536953242 - nodes in this community are weakly interconnected._