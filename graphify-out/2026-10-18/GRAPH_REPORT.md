# Graph Report - kokunime  (2026-10-18)

## Corpus Check
- 466 files · ~138,995 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1861 nodes · 4154 edges · 135 communities (123 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `32aaf73d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sanitize.ts
- main-layout.tsx
- new-series-anime.tsx
- icons/index.ts
- reveal.tsx
- scripts
- useTranslation
- settings-page-content.tsx
- style
- site.ts
- devDependencies
- anime-image.tsx
- progress.ts
- scraper/index.ts
- compilerOptions
- [slug]/page.tsx
- roulette-content.tsx
- formatter
- release-inbox.ts
- find-unused-exports.mjs
- route-error.tsx
- ignore
- vitals-reporter.ts
- seasons/page.tsx
- biome.json
- next.config.mjs
- .next/**
- detail-hero.tsx
- format-date.ts
- sitemap-entries.ts
- rules
- safeJsonLd
- download-group.tsx
- command-palette.tsx
- app/layout.tsx
- dependencies
- bundle-budget.mjs
- a11y
- [season]/page.tsx
- suspicious
- postcss.config.js
- sw.js
- backup-cache.mjs
- e2e-smoke.mjs
- load-test.mjs
- complexity
- toast.ts
- interfaces/index.ts
- vitest.config.ts
- renderOgCard
- bookmarks/page.tsx
- post-commit
- post-checkout
- download-section.tsx
- detail-metadata.ts
- ADR 0001 — Three-tier cache with stale-while-revalidate
- package.json
- denyAdmin
- Deployment
- a11y.test.ts
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
- [genre]/opengraph-image.tsx
- bookmarks.ts
- status/route.ts
- revalidate/route.ts
- anime-grid.tsx
- cache.ts
- app/opengraph-image.tsx
- logger.ts
- roulette/opengraph-image.tsx
- wrapped-content.tsx
- metrics.ts
- use-collection-data.ts
- search-index.ts
- history.ts
- animeSlug
- app/page.tsx
- stats/opengraph-image.tsx
- audit-meta.mjs
- CompareAnimeClient
- update/opengraph-image.tsx
- 🚑 RUNBOOK — Kokunime Operations
- wrapped/opengraph-image.tsx
- navbar.tsx
- 🚀 API Quickstart
- Arsitektur
- scan-secrets.mjs
- update/page.tsx
- [year]/opengraph-image.tsx
- [season]/opengraph-image.tsx
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
- og-card.tsx
- rollback.sh
- commit-msg
- check-commit-msg.mjs
- lint-staged-chunk.mjs

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 50 edges
2. `.next/**` - 29 edges
3. `animeSlug()` - 28 edges
4. `SITE_URL` - 28 edges
5. `checkEtagMatch()` - 27 edges
6. `generateEtag()` - 27 edges
7. `checkRateLimit()` - 25 edges
8. `safeJsonLd()` - 25 edges
9. `endpointSlug()` - 25 edges
10. `scripts` - 25 edges

## Surprising Connections (you probably didn't know these)
- `BookmarkMetaDialogProps` --references--> `BookmarkItem`  [EXTRACTED]
  src/components/bookmark-meta-dialog.tsx → src/utils/bookmarks.ts
- `Image()` --calls--> `renderOgCard()`  [EXTRACTED]
  src/app/update/opengraph-image.tsx → src/lib/og-card.tsx
- `Image()` --calls--> `renderOgCard()`  [EXTRACTED]
  src/app/wrapped/opengraph-image.tsx → src/lib/og-card.tsx
- `Image()` --calls--> `renderOgCard()`  [EXTRACTED]
  src/app/years/[year]/opengraph-image.tsx → src/lib/og-card.tsx
- `HomeHistoryStrip()` --indirect_call--> `getProgressList()`  [INFERRED]
  src/components/home-history-strip.tsx → src/utils/progress.ts

## Import Cycles
- None detected.

## Communities (135 total, 12 thin omitted)

### Community 0 - "sanitize.ts"
Cohesion: 0.07
Nodes (49): mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias(), SEARCH_ALIASES, cached(), CacheTier, TTL, getAnimeDetailWithMeta() (+41 more)

### Community 1 - "main-layout.tsx"
Cohesion: 0.05
Nodes (26): DetailDownloadSkeleton(), DetailHeroSkeleton(), DetailSkeleton(), CardSkeleton(), GridSkeleton(), GridSkeletonProps, RecommendedSkeleton(), FloatingTopButton() (+18 more)

### Community 2 - "new-series-anime.tsx"
Cohesion: 0.29
Nodes (5): dynamic, GET(), NewSeriesSkeleton(), NewSeriesAnime(), getAnimePerPage()

### Community 3 - "icons/index.ts"
Cohesion: 0.06
Nodes (30): BackToTop(), ArrowDownIcon(), ArrowUpRightIcon(), ChevronLeftIcon(), ChevronRightIcon(), DownloadIcon(), SearchIcon(), IconProps (+22 more)

### Community 4 - "reveal.tsx"
Cohesion: 0.32
Nodes (4): ReadingFocusMode(), ReadingFocusModeProps, Reveal(), RevealProps

### Community 5 - "scripts"
Cohesion: 0.08
Nodes (25): scripts, audit:client, audit:meta, backup:cache, build, bundle:budget, changelog, dev (+17 more)

### Community 6 - "useTranslation"
Cohesion: 0.13
Nodes (19): DetailToc(), SECTIONS, CompareAnimeClientProps, PRESET_COMPARISONS, Side, CompareAnimeCard(), CompareAnimeCardProps, CompareGenreAnalysis() (+11 more)

### Community 7 - "settings-page-content.tsx"
Cohesion: 0.11
Nodes (35): DEFAULT_STORAGE, formatQuota(), SettingsPageContent(), SettingsAboutSection(), SettingsAppearanceSection(), SettingsAppearanceSectionProps, SettingsCatalogSection(), SettingsCatalogSectionProps (+27 more)

### Community 8 - "style"
Cohesion: 0.22
Nodes (9): style, noNonNullAssertion, noUnusedTemplateLiteral, useConst, useImportType, useNodejsImportProtocol, useNumberNamespace, useSelfClosingElements (+1 more)

### Community 9 - "site.ts"
Cohesion: 0.10
Nodes (15): RFC-9116, ENDPOINTS, metadata, dynamic, dynamic, metadata, ApiEndpoint, ApiTesterProps (+7 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): axe-core, @biomejs/biome, jsdom, lint-staged, devDependencies, axe-core, @biomejs/biome, jsdom (+17 more)

### Community 11 - "anime-image.tsx"
Cohesion: 0.25
Nodes (7): AnimeImage(), AnimeImageProps, AnimeSearchField(), AnimeSearchFieldProps, RecommendedAnime(), getRecommendations(), isGif()

### Community 12 - "progress.ts"
Cohesion: 0.16
Nodes (21): EpisodeGallery(), EpisodeGalleryProps, HistoryTracker(), HistoryTrackerProps, SectionDetail(), ThemeSongsPlayer(), ThemeSongsPlayerProps, clearAllProgress() (+13 more)

### Community 13 - "scraper/index.ts"
Cohesion: 0.06
Nodes (78): RFC-9457, BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), POST_DEPRECATION_HEADERS (+70 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts (+24 more)

### Community 15 - "[slug]/page.tsx"
Cohesion: 0.23
Nodes (10): Anime(), revalidate, ViewTracker(), buildAnimeJsonLd(), buildBreadcrumbJsonLd(), buildFaqJsonLd(), buildItemListJsonLd(), AnimeListing() (+2 more)

### Community 16 - "roulette-content.tsx"
Cohesion: 0.25
Nodes (8): CardAnime(), GenreOption, readSpinHistory(), RouletteContent(), RouletteSpin, writeSpinHistory(), ViewTransitionLink(), ViewTransitionLinkProps

### Community 17 - "formatter"
Cohesion: 0.40
Nodes (5): quoteStyle, semicolons, trailingCommas, javascript, formatter

### Community 18 - "release-inbox.ts"
Cohesion: 0.07
Nodes (35): metadata, generateMetadata(), SearchAnime(), AdminDashboard(), FeatureFlagView, PRESET_PATHS, EMPTY, InboxBell() (+27 more)

### Community 19 - "find-unused-exports.mjs"
Cohesion: 0.18
Nodes (11): corpus, exportsByFile, files, ROOT, SCAN_DIRS, SKIP_EXPORTS, SRC_DIRS, textCache (+3 more)

### Community 20 - "route-error.tsx"
Cohesion: 0.12
Nodes (5): Suggestion, ErrorCard(), ErrorCardProps, RouteError(), RouteErrorProps

### Community 21 - "ignore"
Cohesion: 0.22
Nodes (9): files, ignore, ignoreUnknown, node_modules/**, coverage/**, dist/**, graphify-out/**, pnpm-lock.yaml (+1 more)

### Community 22 - "vitals-reporter.ts"
Cohesion: 0.07
Nodes (37): dynamic, GET(), WebVitals(), EnvIssue, isHttpUrl(), isRedisUrl(), validateEnv(), onRequestError() (+29 more)

### Community 23 - "seasons/page.tsx"
Cohesion: 0.57
Nodes (3): SeasonsPage(), groupSeasonsByYear(), orderYears()

### Community 24 - "biome.json"
Cohesion: 0.22
Nodes (8): organizeImports, enabled, overrides, $schema, vcs, clientKind, enabled, useIgnoreFile

### Community 25 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - ".next/**"
Cohesion: 0.13
Nodes (5): .next/**, metadata, revalidate, metadata, SECTIONS

### Community 27 - "detail-hero.tsx"
Cohesion: 0.10
Nodes (25): OfflinePage(), CopyButton(), CopyButtonProps, DetailHeroProps, DetailHeroViewProps, DownloadPlatform(), getPlatformStyle(), requiresLogin() (+17 more)

### Community 28 - "format-date.ts"
Cohesion: 0.50
Nodes (3): formatLocalizedDate(), MONTHS_EN, MONTHS_ID

### Community 29 - "sitemap-entries.ts"
Cohesion: 0.18
Nodes (15): dynamic, GET(), dynamic, GET(), dynamic, GET(), GET(), GET() (+7 more)

### Community 30 - "rules"
Cohesion: 0.20
Nodes (10): noUnusedVariables, useExhaustiveDependencies, useJsxKeyInIterable, linter, enabled, rules, correctness, recommended (+2 more)

### Community 31 - "safeJsonLd"
Cohesion: 0.16
Nodes (14): ApiDocsPage(), ComparePage(), ComparePageProps, dynamic, metadata, GenrePage(), GenresPage(), metadata (+6 more)

### Community 32 - "download-group.tsx"
Cohesion: 0.30
Nodes (9): DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), EpisodeWatchedToggle(), EpisodeWatchedToggleProps, isEpisodeWatched(), toggleEpisodeWatched(), subscribeSettings() (+1 more)

### Community 33 - "command-palette.tsx"
Cohesion: 0.24
Nodes (12): CommandPalette(), clientSearchCache, useCommandPalette(), UseCommandPaletteResult, fuzzyScore(), HighlightSegment, highlightSegments(), clearRecentSearches() (+4 more)

### Community 34 - "app/layout.tsx"
Cohesion: 0.16
Nodes (10): jetBrainsMono, plusJakartaSans, RootLayout(), viewport, RouteAnnouncer(), rules, SpeculationRules(), ServiceWorkerRegister() (+2 more)

### Community 35 - "dependencies"
Cohesion: 0.13
Nodes (15): cheerio, husky, dependencies, cheerio, husky, next, react, react-dom (+7 more)

### Community 36 - "bundle-budget.mjs"
Cohesion: 0.27
Nodes (8): baseline, collect(), current, formatKb(), report(), statSize(), THRESHOLD, walk()

### Community 37 - "a11y"
Cohesion: 0.25
Nodes (8): noSvgWithoutTitle, useAnchorContent, useButtonType, useKeyWithClickEvents, useMediaCaption, useSemanticElements, useValidAnchor, a11y

### Community 38 - "[season]/page.tsx"
Cohesion: 0.19
Nodes (12): dynamic, generateMetadata(), dynamic, generateMetadata(), SeasonPage(), Breadcrumbs(), Crumb, getSeasonWindow() (+4 more)

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
Cohesion: 0.21
Nodes (12): args, budgetProblems(), main(), MIN_SUCCESS_RATE, mode, modeArg, MODES, P95_BUDGET_MS (+4 more)

### Community 47 - "complexity"
Cohesion: 0.40
Nodes (5): noExtraBooleanCast, noForEach, useLiteralKeys, useOptionalChain, complexity

### Community 49 - "toast.ts"
Cohesion: 0.20
Nodes (16): EMPTY_TOASTS, Toaster(), clearToasts(), dismissToast(), emit(), getToasts(), lastShownAt, listeners (+8 more)

### Community 51 - "interfaces/index.ts"
Cohesion: 0.06
Nodes (47): BatchDownloadTools(), BatchDownloadToolsProps, DetailMeta(), MetaItemProps, calculateTime(), copiedButtonClass(), DownloadExtrasPanel(), DownloadExtrasPanelProps (+39 more)

### Community 57 - "renderOgCard"
Cohesion: 0.33
Nodes (6): alt, contentType, Image(), runtime, size, renderOgCard()

### Community 58 - "bookmarks/page.tsx"
Cohesion: 0.13
Nodes (18): BookmarksBulkBar(), BookmarksBulkBarProps, BookmarksFolderBar(), BookmarksFolderBarProps, folderChipClass(), BookmarksGridView(), BookmarksStatusFilters(), BookmarksStatusFiltersProps (+10 more)

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 61 - "download-section.tsx"
Cohesion: 0.20
Nodes (10): ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), DownloadGuideModal(), DownloadSection(), EpisodeNavigator(), EpisodeNavigatorProps, listEpisodeNumbers() (+2 more)

### Community 62 - "detail-metadata.ts"
Cohesion: 0.23
Nodes (9): alt, contentType, Image(), runtime, size, generateMetadata(), buildDetailMetadata(), getAnimeDetail() (+1 more)

### Community 63 - "ADR 0001 — Three-tier cache with stale-while-revalidate"
Cohesion: 0.40
Nodes (4): ADR 0001 — Three-tier cache with stale-while-revalidate, Consequences, Context, Decision

### Community 64 - "package.json"
Cohesion: 0.20
Nodes (9): author, lint-staged, **/*.{js,jsx,ts,tsx,json,css}, name, packageManager, private, type, version (+1 more)

### Community 65 - "denyAdmin"
Cohesion: 0.13
Nodes (23): dynamic, GET(), POST(), dynamic, GET(), POST(), clientIp(), denyAdmin() (+15 more)

### Community 66 - "Deployment"
Cohesion: 0.33
Nodes (5): Deployment, Manual deploy / rollback, Repository configuration, SEO ping, Server prerequisites

### Community 67 - "a11y.test.ts"
Cohesion: 0.24
Nodes (9): UpdateIcsButton(), buildWeeklyReminderIcs(), CalendarEvent, djb2(), escapeIcs(), foldLine(), formatUtc(), RFC-5545 (+1 more)

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

### Community 81 - "[genre]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 82 - "bookmarks.ts"
Cohesion: 0.21
Nodes (22): BookmarkButton(), BookmarkButtonProps, BookmarkMetaDialog(), BookmarkMetaDialogProps, parseAniListJson(), parseMalXml(), serializeMalXml(), slugifyTitle() (+14 more)

### Community 83 - "status/route.ts"
Cohesion: 0.15
Nodes (21): dynamic, GET(), dynamic, GET(), renderBadge(), COMMIT, dynamic, GET() (+13 more)

### Community 84 - "revalidate/route.ts"
Cohesion: 0.33
Nodes (6): dynamic, POST(), MAX_REVALIDATE_PATHS, sanitizeRevalidatePaths(), IndexNowResult, submitToIndexNow()

### Community 85 - "anime-grid.tsx"
Cohesion: 0.31
Nodes (6): EmptyState(), AnimeGrid(), AnimeGridProps, Anime, SearchResultsProps, SortOrder

### Community 86 - "cache.ts"
Cohesion: 0.15
Nodes (23): incrementMetric(), ensureSubscriber(), handleInvalidateMessage(), INSTANCE_ID, makeClient(), onCacheInvalidate(), publishCacheInvalidate(), RedisClient (+15 more)

### Community 87 - "app/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 88 - "logger.ts"
Cohesion: 0.18
Nodes (16): dynamic, GET(), currentLevel(), LEVEL_ORDER, logJson(), LogLevel, redact(), rotateIfNeeded() (+8 more)

### Community 89 - "roulette/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 90 - "wrapped-content.tsx"
Cohesion: 0.15
Nodes (17): metadata, metadata, MiniBarChart(), MiniBarChartProps, MiniBarDatum, dayKey(), formatWatchTime(), MONTHS_SHORT (+9 more)

### Community 91 - "metrics.ts"
Cohesion: 0.24
Nodes (13): CIRCUIT_VALUE, dynamic, GET(), counters, getEventLoopLagMs(), getHistogramQuantile(), getHistograms(), getMetrics() (+5 more)

### Community 92 - "use-collection-data.ts"
Cohesion: 0.21
Nodes (17): BookmarkListRow(), BookmarkListRowProps, BookmarksDayList(), BookmarksDayListProps, BookmarksGridViewProps, BookmarksToolbar(), BookmarksToolbarProps, CollectionTab (+9 more)

### Community 93 - "search-index.ts"
Cohesion: 0.20
Nodes (16): getRedis(), compact(), getIndexedBySlugs(), getIndexSnapshot(), IndexedAnime, rankIndexItems(), searchLocalIndex(), suggestLocal() (+8 more)

### Community 94 - "history.ts"
Cohesion: 0.30
Nodes (12): BookmarksPage(), EMPTY_HISTORY, EMPTY_PROGRESS, HomeHistoryStrip(), clearAllHistory(), EMPTY_HISTORY, getHistory(), getStorage() (+4 more)

### Community 95 - "animeSlug"
Cohesion: 0.22
Nodes (10): DetailHero(), compute(), getBlurDataUrl(), memory, FeaturedHero(), FeaturedHeroProps, HomeHeroSection(), HomeLatestSection() (+2 more)

### Community 96 - "app/page.tsx"
Cohesion: 0.15
Nodes (9): dynamic, SectionHeader(), SectionHeaderProps, SectionTone, TONE_CLASS, TrendingEntry, TrendingRail(), LatestGrid() (+1 more)

### Community 97 - "stats/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 98 - "audit-meta.mjs"
Cohesion: 0.15
Nodes (11): args, base, baseArg, limit, limitArg, problems, seenDescriptions, seenTitles (+3 more)

### Community 99 - "CompareAnimeClient"
Cohesion: 0.24
Nodes (9): CompareAnimeClient(), searchCache, useAnimeSearch(), UseAnimeSearchResult, extractYear(), genreSet(), numeric(), SimilarInput (+1 more)

### Community 100 - "update/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 101 - "🚑 RUNBOOK — Kokunime Operations"
Cohesion: 0.17
Nodes (11): 10. Incident checklist (5 menit pertama), 1. Deploy normal, 2. Canary bertahap (opsional), 3. Rollback, 4. Backup & restore, 5. Monitoring & alert, 6. Load & chaos, 7. Feature flags (+3 more)

### Community 102 - "wrapped/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 103 - "navbar.tsx"
Cohesion: 0.23
Nodes (9): MobileMenu(), MobileMenuProps, NAV_KEY_MAP, NAV_KEY_MAP, Navbar(), TICKER_ITEMS, SiteLink, siteLinks (+1 more)

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

### Community 108 - "[year]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 109 - "[season]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

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

## Knowledge Gaps
- **580 isolated node(s):** `NAV_KEY_MAP`, `TICKER_ITEMS`, `SectionTone`, `SectionHeaderProps`, `TONE_CLASS` (+575 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `app/page.tsx`, `app/layout.tsx`, `[season]/page.tsx`, `site.ts`, `update/page.tsx`, `[slug]/page.tsx`, `release-inbox.ts`, `status/route.ts`, `ignore`, `vitals-reporter.ts`, `seasons/page.tsx`, `wrapped-content.tsx`, `sitemap-entries.ts`, `detail-metadata.ts`, `safeJsonLd`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `.next/**`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `renderOgCard()` connect `renderOgCard` to `og-card.tsx`, `stats/opengraph-image.tsx`, `update/opengraph-image.tsx`, `wrapped/opengraph-image.tsx`, `[year]/opengraph-image.tsx`, `[season]/opengraph-image.tsx`, `[genre]/opengraph-image.tsx`, `app/opengraph-image.tsx`, `roulette/opengraph-image.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `NAV_KEY_MAP`, `TICKER_ITEMS`, `SectionTone` to the rest of the system?**
  _580 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sanitize.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06729356450191008 - nodes in this community are weakly interconnected._
- **Should `main-layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05110809588421529 - nodes in this community are weakly interconnected._