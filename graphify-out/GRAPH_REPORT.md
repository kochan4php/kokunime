# Graph Report - kokunime  (2026-10-18)

## Corpus Check
- 500 files · ~154,058 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2045 nodes · 4714 edges · 163 communities (143 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 54 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a6bc365f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sanitize.ts
- main-layout.tsx
- settings.ts
- icons/index.ts
- download-extras-panel.tsx
- scripts
- useTranslation
- visual-smoke.mjs
- style
- site.ts
- devDependencies
- anime.ts
- use-command-palette.ts
- scraper/index.ts
- compilerOptions
- seo.ts
- settings-appearance-section.tsx
- formatter
- watch-queue.ts
- find-unused-exports.mjs
- route-error.tsx
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
- [page]/page.tsx
- endpoint-slug.ts
- stats-content.tsx
- dependencies
- bundle-budget.mjs
- a11y
- genres.ts
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
- [genre]/opengraph-image.tsx
- animeSlug
- ADR 0001 — Three-tier cache with stale-while-revalidate
- package.json
- denyAdmin
- Deployment
- navbar.tsx
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
- parse.ts
- use-collection-data.ts
- uptime.ts
- season-year-group.tsx
- health/route.ts
- anime-listing.tsx
- app/opengraph-image.tsx
- cache.ts
- roulette/opengraph-image.tsx
- listing-skeleton.tsx
- metrics.ts
- grid-skeleton.tsx
- search-index.ts
- bookmarks.ts
- [year]/page.tsx
- error-reporter.ts
- stats/opengraph-image.tsx
- audit-meta.mjs
- interfaces/index.ts
- update/opengraph-image.tsx
- 🚑 RUNBOOK — Kokunime Operations
- wrapped/opengraph-image.tsx
- redis.ts
- 🚀 API Quickstart
- Arsitektur
- scan-secrets.mjs
- update/page.tsx
- [year]/opengraph-image.tsx
- buildWeeklyReminderIcs
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
- search.ts
- rollback.sh
- commit-msg
- check-commit-msg.mjs
- lint-staged-chunk.mjs
- section-header.tsx
- revalidate/route.ts
- logger.ts
- home-content.tsx
- use-sync-link.ts
- webhook-dispatcher.ts
- sitemap-entries.ts
- css-usage-report.mjs
- slow-log.ts
- anime-detail.ts
- indeks/page.tsx
- roulette-content.tsx
- [page]/opengraph-image.tsx
- env.ts
- duplicate-detector.ts
- [slug]/loading.tsx
- lifecycle.ts
- parser-benchmark.test.ts
- command-palette.tsx
- share-card.ts
- [season]/opengraph-image.tsx
- offline-indicator.tsx
- season-window.ts
- pwa-install-banner.tsx
- parse-download.ts
- bookmarks-folder-bar.tsx
- components/empty-state.tsx
- og-card.tsx

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 55 edges
2. `showToast()` - 45 edges
3. `getBookmarks()` - 40 edges
4. `SITE_URL` - 33 edges
5. `.next/**` - 31 edges
6. `animeSlug()` - 30 edges
7. `scripts` - 29 edges
8. `checkEtagMatch()` - 27 edges
9. `generateEtag()` - 27 edges
10. `checkRateLimit()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `SettingsTypographySectionProps` --references--> `AppSettings`  [EXTRACTED]
  src/components/settings/settings-typography-section.tsx → src/utils/settings.ts
- `Image()` --calls--> `renderOgCard()`  [EXTRACTED]
  src/app/update/opengraph-image.tsx → src/lib/og-card.tsx
- `Image()` --calls--> `renderOgCard()`  [EXTRACTED]
  src/app/wrapped/opengraph-image.tsx → src/lib/og-card.tsx
- `Image()` --calls--> `renderOgCard()`  [EXTRACTED]
  src/app/years/[year]/opengraph-image.tsx → src/lib/og-card.tsx
- `StatsContent()` --indirect_call--> `getBookmarks()`  [INFERRED]
  src/components/stats-content.tsx → src/utils/bookmarks.ts

## Import Cycles
- None detected.

## Communities (163 total, 20 thin omitted)

### Community 0 - "sanitize.ts"
Cohesion: 0.19
Nodes (14): UPSTREAM_URL, parseAnimeDetail(), parseDownloads(), parseGenres(), bestImage(), ImgLike, resolveAssetUrl(), formatAnimeData() (+6 more)

### Community 2 - "settings.ts"
Cohesion: 0.14
Nodes (28): DEFAULT_STORAGE, formatQuota(), SettingsPageContent(), SettingsStorageSection(), SettingsStorageSectionProps, SettingsTypographySection(), SettingsTypographySectionProps, ACCENT_PRESETS (+20 more)

### Community 3 - "icons/index.ts"
Cohesion: 0.05
Nodes (31): AboutBlock(), BottomBar(), BrandBlock(), footerDevLinks, footerNavLinks, footerTags, ChevronLeftIcon(), ChevronRightIcon() (+23 more)

### Community 4 - "download-extras-panel.tsx"
Cohesion: 0.26
Nodes (17): BatchDownloadTools(), BatchDownloadToolsProps, calculateTime(), copiedButtonClass(), DownloadExtrasPanel(), DownloadExtrasPanelProps, buildAria2(), buildCurlSh() (+9 more)

### Community 5 - "scripts"
Cohesion: 0.07
Nodes (29): scripts, audit:client, audit:meta, backup:cache, build, bundle:budget, changelog, css:report (+21 more)

### Community 6 - "useTranslation"
Cohesion: 0.13
Nodes (18): DetailToc(), SECTIONS, CompareAnimeCard(), CompareAnimeCardProps, CompareSpecsTable(), CompareSpecsTableProps, CompareEmptyState(), CompareLoadingCard() (+10 more)

### Community 7 - "visual-smoke.mjs"
Cohesion: 0.16
Nodes (20): CANDIDATES, CdpClient, evaluate(), findBrowser(), launchBrowser(), navigate(), runAxe(), screenshot() (+12 more)

### Community 8 - "style"
Cohesion: 0.22
Nodes (9): style, noNonNullAssertion, noUnusedTemplateLiteral, useConst, useImportType, useNodejsImportProtocol, useNumberNamespace, useSelfClosingElements (+1 more)

### Community 9 - "site.ts"
Cohesion: 0.10
Nodes (16): RFC-9116, ENDPOINTS, metadata, dynamic, dynamic, metadata, ApiEndpoint, ApiTester() (+8 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): axe-core, @biomejs/biome, jsdom, lint-staged, devDependencies, axe-core, @biomejs/biome, jsdom (+17 more)

### Community 11 - "anime.ts"
Cohesion: 0.25
Nodes (8): Anime, AnimeDetail, AnimePage, DownloadOption, DownloadResolution, DownloadTarget, Genre, Recommendation

### Community 12 - "use-command-palette.ts"
Cohesion: 0.26
Nodes (13): clientSearchCache, useCommandPalette(), UseCommandPaletteResult, fuzzyScore(), buildPaletteActions(), isActionQuery(), PALETTE_ACTIONS, PaletteAction (+5 more)

### Community 13 - "scraper/index.ts"
Cohesion: 0.06
Nodes (81): RFC-9457, BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), POST_DEPRECATION_HEADERS (+73 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts (+24 more)

### Community 15 - "seo.ts"
Cohesion: 0.20
Nodes (10): Anime(), generateMetadata(), revalidate, buildDetailMetadata(), buildAnimeJsonLd(), buildBreadcrumbJsonLd(), buildFaqJsonLd(), buildItemListJsonLd() (+2 more)

### Community 16 - "settings-appearance-section.tsx"
Cohesion: 0.23
Nodes (10): SettingsAppearanceSection(), SettingsAppearanceSectionProps, SettingsCatalogSection(), SettingsCatalogSectionProps, SettingsLanguageSection(), SettingsLanguageSectionProps, SettingsSectionHeader(), SettingsSectionHeaderProps (+2 more)

### Community 17 - "formatter"
Cohesion: 0.40
Nodes (5): quoteStyle, semicolons, trailingCommas, javascript, formatter

### Community 18 - "watch-queue.ts"
Cohesion: 0.08
Nodes (45): metadata, AdminDashboard(), FeatureFlagView, PRESET_PATHS, BookmarksQueueView(), SERVER_EMPTY, EMPTY, InboxBell() (+37 more)

### Community 19 - "find-unused-exports.mjs"
Cohesion: 0.18
Nodes (11): corpus, exportsByFile, files, ROOT, SCAN_DIRS, SKIP_EXPORTS, SRC_DIRS, textCache (+3 more)

### Community 20 - "route-error.tsx"
Cohesion: 0.11
Nodes (5): Suggestion, ErrorCard(), ErrorCardProps, RouteError(), RouteErrorProps

### Community 21 - "ignore"
Cohesion: 0.22
Nodes (9): files, ignore, ignoreUnknown, node_modules/**, coverage/**, dist/**, graphify-out/**, pnpm-lock.yaml (+1 more)

### Community 22 - "vitals-reporter.ts"
Cohesion: 0.18
Nodes (14): dynamic, GET(), WebVitals(), getVitalsSummary(), lastSent, percentile(), recordSample(), reportVitals() (+6 more)

### Community 23 - "app/layout.tsx"
Cohesion: 0.18
Nodes (9): jetBrainsMono, plusJakartaSans, RootLayout(), viewport, RouteAnnouncer(), rules, SpeculationRules(), metadata (+1 more)

### Community 24 - "biome.json"
Cohesion: 0.22
Nodes (8): organizeImports, enabled, overrides, $schema, vcs, clientKind, enabled, useIgnoreFile

### Community 25 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - ".next/**"
Cohesion: 0.17
Nodes (8): .next/**, metadata, metadata, SECTIONS, generateMetadata(), SearchAnime(), buildSearchMetadata(), decodeQuery()

### Community 27 - "detail-hero.tsx"
Cohesion: 0.10
Nodes (27): OfflinePage(), CopyButton(), CopyButtonProps, DetailHero(), DetailHeroProps, DetailHeroViewProps, DownloadPlatform(), getPlatformStyle() (+19 more)

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
Cohesion: 0.12
Nodes (23): ApiDocsPage(), ComparePage(), dynamic, generateMetadata(), GenrePage(), GenresPage(), dynamic, generateMetadata() (+15 more)

### Community 33 - "endpoint-slug.ts"
Cohesion: 0.13
Nodes (16): DetailMeta(), MetaItemProps, chipColors, GenreTags(), GENRE_DICTIONARY, GenreMeta, GenresExplorer(), GenresExplorerProps (+8 more)

### Community 34 - "stats-content.tsx"
Cohesion: 0.10
Nodes (33): metadata, metadata, EMPTY_HISTORY, EMPTY_PROGRESS, HomeHistoryStrip(), MiniBarChartProps, MiniBarDatum, RecommendForYou() (+25 more)

### Community 35 - "dependencies"
Cohesion: 0.13
Nodes (15): cheerio, husky, next, dependencies, cheerio, husky, next, react (+7 more)

### Community 36 - "bundle-budget.mjs"
Cohesion: 0.27
Nodes (8): baseline, collect(), current, formatKb(), report(), statSize(), THRESHOLD, walk()

### Community 37 - "a11y"
Cohesion: 0.25
Nodes (8): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, a11y

### Community 38 - "genres.ts"
Cohesion: 0.23
Nodes (17): cached(), CacheTier, TTL, fetchSingleGenrePage(), getAnimeByGenres(), getGenres(), getGenresWithMeta(), parseSimplePagination() (+9 more)

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
Cohesion: 0.19
Nodes (13): args, budgetProblems(), main(), MIN_SUCCESS_RATE, mode, modeArg, MODES, P95_BUDGET_MS (+5 more)

### Community 47 - "complexity"
Cohesion: 0.40
Nodes (5): noExtraBooleanCast, noForEach, useLiteralKeys, useOptionalChain, complexity

### Community 49 - "toast.ts"
Cohesion: 0.20
Nodes (16): EMPTY_TOASTS, Toaster(), clearToasts(), dismissToast(), emit(), getToasts(), lastShownAt, listeners (+8 more)

### Community 51 - "progress.ts"
Cohesion: 0.05
Nodes (57): ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), DownloadGuideModal(), DownloadSection() (+49 more)

### Community 57 - "renderOgCard"
Cohesion: 0.33
Nodes (6): alt, contentType, Image(), runtime, size, renderOgCard()

### Community 58 - "bookmarks/page.tsx"
Cohesion: 0.21
Nodes (27): BookmarksPage(), SERVER_EMPTY_QUEUE, BookmarksBulkBar(), BookmarksBulkBarProps, CollectionCheckerDialog(), LinkResult, ServiceWorkerRegister(), clearAllBookmarks() (+19 more)

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 61 - "[genre]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 62 - "animeSlug"
Cohesion: 0.16
Nodes (11): AnimeImage(), AnimeImageProps, TrendingEntry, ViewTransitionLink(), ViewTransitionLinkProps, FeaturedHero(), FeaturedHeroProps, NewSeriesAnime() (+3 more)

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

### Community 67 - "navbar.tsx"
Cohesion: 0.21
Nodes (10): MobileMenu(), MobileMenuProps, NAV_KEY_MAP, NAV_KEY_MAP, Navbar(), BeforeInstallPromptEvent, PwaInstallButton(), SiteLink (+2 more)

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
Nodes (21): bodyKey(), DEFAULT_HEADERS, doFetch(), request(), retryDelay(), sha1(), toHeaderRecord(), UpstreamRequestConfig (+13 more)

### Community 81 - "parse.ts"
Cohesion: 0.33
Nodes (5): dynamic, GET(), fetchSinglePage(), getAnimePerPage(), parsePagination()

### Community 82 - "use-collection-data.ts"
Cohesion: 0.16
Nodes (22): BookmarkMetaDialogProps, BookmarkListRow(), BookmarkListRowProps, BookmarksDayList(), BookmarksDayListProps, BookmarksGridView(), BookmarksGridViewProps, BookmarksToolbar() (+14 more)

### Community 83 - "uptime.ts"
Cohesion: 0.18
Nodes (16): dynamic, GET(), dynamic, GET(), renderBadge(), dotClass(), metadata, revalidate (+8 more)

### Community 84 - "season-year-group.tsx"
Cohesion: 0.38
Nodes (5): Season, SeasonYearGroup(), SeasonYearGroupProps, TaxonomyCard(), TaxonomyCardProps

### Community 85 - "health/route.ts"
Cohesion: 0.33
Nodes (7): cleanFirstTitle(), dynamic, GET(), probe(), upstream, UpstreamErrorLike, SCRAPE_BASE_URL

### Community 86 - "anime-listing.tsx"
Cohesion: 0.18
Nodes (7): AnimeGrid(), AnimeGridProps, AnimeListingProps, SORT_LABELS, SortMode, SearchResultsProps, SortOrder

### Community 87 - "app/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 88 - "cache.ts"
Cohesion: 0.21
Nodes (14): CachedResult, cachedWithMeta(), ensureInvalidation(), getFromMemoryCache(), getStale(), inFlight, memoryCache, MemoryCacheEntry (+6 more)

### Community 89 - "roulette/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 91 - "metrics.ts"
Cohesion: 0.16
Nodes (21): CIRCUIT_VALUE, dynamic, GET(), dynamic, GET(), COMMIT, dynamic, GET() (+13 more)

### Community 93 - "search-index.ts"
Cohesion: 0.31
Nodes (10): compact(), getIndexSnapshot(), IndexedAnime, rankIndexItems(), searchLocalIndex(), suggestLocal(), SimilarAnime(), ParsedQuery (+2 more)

### Community 94 - "bookmarks.ts"
Cohesion: 0.21
Nodes (16): BookmarkButton(), BookmarkButtonProps, BookmarksStatusFilters(), BookmarksStatusFiltersProps, chipClass(), parseAniListJson(), parseMalXml(), serializeMalXml() (+8 more)

### Community 95 - "[year]/page.tsx"
Cohesion: 0.31
Nodes (4): dynamic, GET(), revalidate, collectYearAnime()

### Community 96 - "error-reporter.ts"
Cohesion: 0.26
Nodes (10): onRequestError(), register(), ErrorReport, lastSent, reportError(), scrubMessage(), suppressed, truncate() (+2 more)

### Community 97 - "stats/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 98 - "audit-meta.mjs"
Cohesion: 0.15
Nodes (11): args, base, baseArg, limit, limitArg, problems, seenDescriptions, seenTitles (+3 more)

### Community 99 - "interfaces/index.ts"
Cohesion: 0.11
Nodes (23): CompareAnimeClient(), CompareAnimeClientProps, PRESET_COMPARISONS, Side, AnimeSearchField(), AnimeSearchFieldProps, CompareGenreAnalysis(), CompareGenreAnalysisProps (+15 more)

### Community 100 - "update/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 101 - "🚑 RUNBOOK — Kokunime Operations"
Cohesion: 0.17
Nodes (11): 10. Incident checklist (5 menit pertama), 1. Deploy normal, 2. Canary bertahap (opsional), 3. Rollback, 4. Backup & restore, 5. Monitoring & alert, 6. Load & chaos, 7. Feature flags (+3 more)

### Community 102 - "wrapped/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 103 - "redis.ts"
Cohesion: 0.19
Nodes (16): ensureSubscriber(), getRedis(), handleInvalidateMessage(), INSTANCE_ID, makeClient(), onCacheInvalidate(), publishCacheInvalidate(), RedisClient (+8 more)

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
Cohesion: 0.27
Nodes (7): BUCKET_META, metadata, revalidate, AgeBucket, NUMBER_WORDS, parseRelativeAge(), RelativeAge

### Community 108 - "[year]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 109 - "buildWeeklyReminderIcs"
Cohesion: 0.25
Nodes (10): BookmarkMetaDialog(), UpdateIcsButton(), buildWeeklyReminderIcs(), CalendarEvent, djb2(), escapeIcs(), foldLine(), formatUtc() (+2 more)

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

### Community 128 - "search.ts"
Cohesion: 0.33
Nodes (8): mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias(), SEARCH_ALIASES, fetchSearchPage(), mergeWithLocal(), searchAnime(), searchAnimeWithMeta()

### Community 135 - "section-header.tsx"
Cohesion: 0.14
Nodes (12): ComparePageProps, dynamic, metadata, SeasonsPage(), SectionHeader(), SectionHeaderProps, SectionTone, TONE_CLASS (+4 more)

### Community 136 - "revalidate/route.ts"
Cohesion: 0.33
Nodes (6): dynamic, POST(), MAX_REVALIDATE_PATHS, sanitizeRevalidatePaths(), IndexNowResult, submitToIndexNow()

### Community 137 - "logger.ts"
Cohesion: 0.31
Nodes (10): currentLevel(), LEVEL_ORDER, logJson(), LogLevel, redact(), rotateIfNeeded(), writeLine(), currentRequestId() (+2 more)

### Community 138 - "home-content.tsx"
Cohesion: 0.20
Nodes (8): dynamic, compute(), getBlurDataUrl(), memory, HomeHeroSection(), HomeLatestSection(), HomeSectionProps, HeroSkeleton()

### Community 139 - "use-sync-link.ts"
Cohesion: 0.38
Nodes (7): useSyncLink(), UseSyncLinkResult, decodeSyncPayload(), encodeSyncPayload(), fromBase64Url(), SyncPayload, toBase64Url()

### Community 140 - "webhook-dispatcher.ts"
Cohesion: 0.36
Nodes (6): detectIpFamily(), fetchWithRedirectGuard(), isPublicHttpUrl(), PRIVATE_V4, dispatchDiscordWebhook(), WebhookPayload

### Community 141 - "sitemap-entries.ts"
Cohesion: 0.42
Nodes (6): GET(), GET(), getSitemapEntries(), SITEMAP_CHUNK_SIZE, SitemapEntry, getLastUpstreamFetchAt()

### Community 142 - "css-usage-report.mjs"
Cohesion: 0.25
Nodes (6): defined, SOURCE_DIR, sourceFiles, sourceText, STYLE_DIR, unused

### Community 143 - "slow-log.ts"
Cohesion: 0.36
Nodes (6): dynamic, GET(), entries, getSlowRequests(), SLOW_REQUEST_MS, SlowRequestEntry

### Community 144 - "anime-detail.ts"
Cohesion: 0.23
Nodes (9): alt, contentType, Image(), runtime, size, getAnimeDetail(), getAnimeDetailWithMeta(), extractWithFallback() (+1 more)

### Community 145 - "indeks/page.tsx"
Cohesion: 0.33
Nodes (6): IndexItem, IndexPage(), letterOf(), LETTERS, metadata, revalidate

### Community 146 - "roulette-content.tsx"
Cohesion: 0.36
Nodes (8): GenreOption, polarPoint(), readSpinHistory(), RouletteContent(), RouletteSpin, SEGMENT_COLORS, segmentPath(), writeSpinHistory()

### Community 147 - "[page]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 148 - "env.ts"
Cohesion: 0.53
Nodes (4): EnvIssue, isHttpUrl(), isRedisUrl(), validateEnv()

### Community 149 - "duplicate-detector.ts"
Cohesion: 0.53
Nodes (4): DuplicateGroup, findDuplicateGroups(), NOISE_WORDS, normalizeTitle()

### Community 151 - "lifecycle.ts"
Cohesion: 0.70
Nodes (3): beginShutdown(), isShuttingDown(), resetLifecycle()

### Community 153 - "command-palette.tsx"
Cohesion: 0.39
Nodes (4): CommandPalette(), CommandPalette, HighlightSegment, highlightSegments()

### Community 154 - "share-card.ts"
Cohesion: 0.43
Nodes (6): canvasToBlob(), exportShareCard(), renderShareCard(), ShareCardData, ShareCardRow, wrapText()

### Community 155 - "[season]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 156 - "offline-indicator.tsx"
Cohesion: 0.60
Nodes (5): getCacheServedSnapshot(), getOnlineSnapshot(), OfflineIndicator(), subscribeCacheServed(), subscribeOnline()

### Community 157 - "season-window.ts"
Cohesion: 0.53
Nodes (4): getSeasonWindow(), parseSeasonSlug(), SEASON_RANGES, SeasonWindow

### Community 159 - "parse-download.ts"
Cohesion: 0.70
Nodes (3): getDownloadLinks(), normalizeUrl(), parseBytes()

### Community 160 - "bookmarks-folder-bar.tsx"
Cohesion: 0.67
Nodes (3): BookmarksFolderBar(), BookmarksFolderBarProps, folderChipClass()

## Knowledge Gaps
- **635 isolated node(s):** `dynamic`, `ListingSkeletonProps`, `ImgLike`, `GridSkeletonProps`, `TrendingEntry` (+630 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `[page]/page.tsx`, `error-reporter.ts`, `stats-content.tsx`, `section-header.tsx`, `site.ts`, `home-content.tsx`, `update/page.tsx`, `sitemap-entries.ts`, `seo.ts`, `indeks/page.tsx`, `watch-queue.ts`, `uptime.ts`, `ignore`, `app/layout.tsx`, `[year]/page.tsx`, `safeJsonLd`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `.next/**`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `getBookmarks()` (e.g. with `RecommendForYou()` and `StatsContent()`) actually correct?**
  _`getBookmarks()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamic`, `ListingSkeletonProps`, `ImgLike` to the rest of the system?**
  _635 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `main-layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._