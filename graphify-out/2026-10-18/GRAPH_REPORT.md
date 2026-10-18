# Graph Report - kokunime  (2026-10-18)

## Corpus Check
- 466 files · ~139,256 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1862 nodes · 4143 edges · 137 communities (126 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `62066d28`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sanitize.ts
- main-layout.tsx
- redis.ts
- icons/index.ts
- reveal.tsx
- scripts
- useTranslation
- settings-catalog-section.tsx
- style
- site.ts
- devDependencies
- download-group.tsx
- progress.ts
- scraper/index.ts
- compilerOptions
- seo.ts
- save-offline-button.tsx
- formatter
- release-inbox.ts
- find-unused-exports.mjs
- route-error.tsx
- ignore
- vitals-reporter.ts
- footer/index.tsx
- biome.json
- next.config.mjs
- [page]/page.tsx
- detail-hero.tsx
- format-date.ts
- endpointSlug
- rules
- safeJsonLd
- settings-page-content.tsx
- anime.ts
- app/layout.tsx
- dependencies
- bundle-budget.mjs
- a11y
- [year]/page.tsx
- suspicious
- postcss.config.js
- sw.js
- backup-cache.mjs
- e2e-smoke.mjs
- load-test.mjs
- complexity
- toast.ts
- download-extras-panel.tsx
- vitest.config.ts
- compare/opengraph-image.tsx
- subscribeProgress
- post-commit
- post-checkout
- interfaces/index.ts
- anime-image.tsx
- ADR 0001 — Three-tier cache with stale-while-revalidate
- package.json
- denyAdmin
- Deployment
- new-series-anime.tsx
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
- toTitle
- bookmarks/page.tsx
- status/route.ts
- section-detail.tsx
- health/route.ts
- cache.ts
- renderOgCard
- logger.ts
- roulette/opengraph-image.tsx
- api/page.tsx
- metrics.ts
- search-results.tsx
- search-index.ts
- roulette-content.tsx
- home-content.tsx
- detail-skeleton.tsx
- stats/opengraph-image.tsx
- audit-meta.mjs
- compare-anime-client.tsx
- og-card.tsx
- 🚑 RUNBOOK — Kokunime Operations
- wrapped/opengraph-image.tsx
- navbar.tsx
- 🚀 API Quickstart
- Arsitektur
- scan-secrets.mjs
- update/page.tsx
- [year]/opengraph-image.tsx
- download-platform.tsx
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
- animeSlug
- rollback.sh
- commit-msg
- check-commit-msg.mjs
- lint-staged-chunk.mjs
- .next/**
- offline-indicator.tsx

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 50 edges
2. `.next/**` - 29 edges
3. `animeSlug()` - 28 edges
4. `SITE_URL` - 28 edges
5. `checkEtagMatch()` - 27 edges
6. `generateEtag()` - 27 edges
7. `endpointSlug()` - 25 edges
8. `checkRateLimit()` - 25 edges
9. `safeJsonLd()` - 25 edges
10. `scripts` - 25 edges

## Surprising Connections (you probably didn't know these)
- `SeasonYearGroupProps` --references--> `Season`  [EXTRACTED]
  src/sections/season-year-group.tsx → src/interfaces/reference.ts
- `SettingsCatalogSectionProps` --references--> `AppSettings`  [EXTRACTED]
  src/components/settings/settings-catalog-section.tsx → src/utils/settings.ts
- `Image()` --calls--> `renderOgCard()`  [EXTRACTED]
  src/app/update/opengraph-image.tsx → src/lib/og-card.tsx
- `Image()` --calls--> `renderOgCard()`  [EXTRACTED]
  src/app/wrapped/opengraph-image.tsx → src/lib/og-card.tsx
- `MobileMenu()` --calls--> `useTranslation()`  [EXTRACTED]
  src/components/mobile-menu.tsx → src/utils/i18n.ts

## Import Cycles
- None detected.

## Communities (137 total, 11 thin omitted)

### Community 0 - "sanitize.ts"
Cohesion: 0.07
Nodes (46): alt, contentType, Image(), runtime, size, cached(), CacheTier, TTL (+38 more)

### Community 1 - "main-layout.tsx"
Cohesion: 0.14
Nodes (5): FloatingTopButton(), HoneypotTrap(), ScrollToTop(), MainLayout(), ListingSkeleton()

### Community 2 - "redis.ts"
Cohesion: 0.15
Nodes (17): POST(), sha256(), FEATURE_FLAG_REGISTRY, FeatureFlag, FeatureFlagKey, FlagOverrides, memoryOverrides, readOverrides() (+9 more)

### Community 3 - "icons/index.ts"
Cohesion: 0.07
Nodes (28): ArrowUpRightIcon(), ChevronLeftIcon(), ChevronRightIcon(), DownloadIcon(), SearchIcon(), IconProps, Input(), BeforeInstallPromptEvent (+20 more)

### Community 4 - "reveal.tsx"
Cohesion: 0.20
Nodes (7): Reveal(), RevealProps, LatestGridProps, SeasonYearGroup(), SeasonYearGroupProps, TaxonomyCard(), TaxonomyCardProps

### Community 5 - "scripts"
Cohesion: 0.08
Nodes (25): scripts, audit:client, audit:meta, backup:cache, build, bundle:budget, changelog, dev (+17 more)

### Community 6 - "useTranslation"
Cohesion: 0.15
Nodes (15): DetailToc(), SECTIONS, CompareGenreAnalysis(), CompareGenreAnalysisProps, CompareSpecsTable(), CompareSpecsTableProps, SettingsPreviewCard(), SettingsPreviewCardProps (+7 more)

### Community 7 - "settings-catalog-section.tsx"
Cohesion: 0.23
Nodes (8): SettingsAboutSection(), SettingsCatalogSection(), SettingsCatalogSectionProps, SettingsSectionHeader(), SettingsSectionHeaderProps, SettingsStorageSection(), SettingsStorageSectionProps, StorageBreakdown

### Community 8 - "style"
Cohesion: 0.22
Nodes (9): style, noNonNullAssertion, noUnusedTemplateLiteral, useConst, useImportType, useNodejsImportProtocol, useNumberNamespace, useSelfClosingElements (+1 more)

### Community 9 - "site.ts"
Cohesion: 0.10
Nodes (17): RFC-9116, dynamic, POST(), dynamic, dynamic, metadata, MAX_REVALIDATE_PATHS, sanitizeRevalidatePaths() (+9 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): axe-core, @biomejs/biome, jsdom, lint-staged, devDependencies, axe-core, @biomejs/biome, jsdom (+17 more)

### Community 11 - "download-group.tsx"
Cohesion: 0.21
Nodes (13): DownloadGroup(), DownloadGroupProps, renderResolutionBadge(), EpisodeWatchedToggle(), EpisodeWatchedToggleProps, episodeAnchors(), KeyboardNavigation(), nearestEpisodeAnchor() (+5 more)

### Community 12 - "progress.ts"
Cohesion: 0.26
Nodes (15): HistoryTracker(), HistoryTrackerProps, clearAllProgress(), EMPTY_PROGRESS, getProgress(), getProgressList(), getStorage(), getWatchedCount() (+7 more)

### Community 13 - "scraper/index.ts"
Cohesion: 0.06
Nodes (77): RFC-9457, BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), POST_DEPRECATION_HEADERS (+69 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts (+24 more)

### Community 15 - "seo.ts"
Cohesion: 0.21
Nodes (9): Anime(), generateMetadata(), revalidate, buildDetailMetadata(), buildAnimeJsonLd(), buildBreadcrumbJsonLd(), buildFaqJsonLd(), truncate() (+1 more)

### Community 16 - "save-offline-button.tsx"
Cohesion: 0.33
Nodes (13): OfflinePage(), registerRefreshSync(), SaveOfflineButton(), SaveOfflineButtonProps, askServiceWorker(), listSavedOffline(), readMetaDirect(), removeOfflineEntry() (+5 more)

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

### Community 23 - "footer/index.tsx"
Cohesion: 0.27
Nodes (7): AboutBlock(), BottomBar(), BrandBlock(), footerDevLinks, footerNavLinks, footerTags, Footer()

### Community 24 - "biome.json"
Cohesion: 0.22
Nodes (8): organizeImports, enabled, overrides, $schema, vcs, clientKind, enabled, useIgnoreFile

### Community 25 - "next.config.mjs"
Cohesion: 0.50
Nodes (3): immutableCacheControl, nextConfig, securityHeaders

### Community 26 - "[page]/page.tsx"
Cohesion: 0.16
Nodes (6): revalidate, CardSkeleton(), GridSkeleton(), GridSkeletonProps, RecommendedSkeleton(), HomeSkeleton()

### Community 27 - "detail-hero.tsx"
Cohesion: 0.18
Nodes (6): DetailHeroProps, DetailHeroViewProps, ShareButtonProps, TrailerButtonProps, VerticalJapaneseTitle(), VerticalJapaneseTitleProps

### Community 28 - "format-date.ts"
Cohesion: 0.50
Nodes (3): formatLocalizedDate(), MONTHS_EN, MONTHS_ID

### Community 29 - "endpointSlug"
Cohesion: 0.07
Nodes (32): dynamic, GET(), dynamic, GET(), dynamic, GET(), GET(), GET() (+24 more)

### Community 30 - "rules"
Cohesion: 0.20
Nodes (10): noUnusedVariables, useExhaustiveDependencies, useJsxKeyInIterable, linter, enabled, rules, correctness, recommended (+2 more)

### Community 31 - "safeJsonLd"
Cohesion: 0.12
Nodes (22): ComparePage(), ComparePageProps, dynamic, metadata, dynamic, GenrePage(), GenresPage(), SeasonsPage() (+14 more)

### Community 32 - "settings-page-content.tsx"
Cohesion: 0.15
Nodes (26): DEFAULT_STORAGE, formatQuota(), SettingsPageContent(), SettingsAppearanceSection(), SettingsAppearanceSectionProps, SettingsLanguageSection(), SettingsLanguageSectionProps, SettingsTypographySectionProps (+18 more)

### Community 33 - "anime.ts"
Cohesion: 0.15
Nodes (10): ReadingFocusMode(), ReadingFocusModeProps, WatchOrderTimeline(), WatchOrderTimelineProps, AnimeDetail, AnimePage, DownloadOption, DownloadResolution (+2 more)

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

### Community 38 - "[year]/page.tsx"
Cohesion: 0.16
Nodes (11): dynamic, SeasonPage(), collectYearAnime(), revalidate, YearPage(), Breadcrumbs(), Crumb, getSeasonWindow() (+3 more)

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
Cohesion: 0.12
Nodes (25): EMPTY_TOASTS, Toaster(), UpdateIcsButton(), buildWeeklyReminderIcs(), CalendarEvent, djb2(), escapeIcs(), foldLine() (+17 more)

### Community 51 - "download-extras-panel.tsx"
Cohesion: 0.26
Nodes (17): BatchDownloadTools(), BatchDownloadToolsProps, calculateTime(), copiedButtonClass(), DownloadExtrasPanel(), DownloadExtrasPanelProps, buildAria2(), buildCurlSh() (+9 more)

### Community 57 - "compare/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 58 - "subscribeProgress"
Cohesion: 0.35
Nodes (7): ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), EpisodeNavigator(), EpisodeNavigatorProps, nextUnwatchedEpisode(), subscribeProgress()

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 61 - "interfaces/index.ts"
Cohesion: 0.26
Nodes (5): DownloadGuideModal(), DownloadSection(), parseEpisodeRange(), listEpisodeNumbers(), anime

### Community 62 - "anime-image.tsx"
Cohesion: 0.29
Nodes (6): AnimeImage(), AnimeImageProps, CardAnime(), AnimeSearchField(), AnimeSearchFieldProps, isGif()

### Community 63 - "ADR 0001 — Three-tier cache with stale-while-revalidate"
Cohesion: 0.40
Nodes (4): ADR 0001 — Three-tier cache with stale-while-revalidate, Consequences, Context, Decision

### Community 64 - "package.json"
Cohesion: 0.20
Nodes (9): author, lint-staged, **/*.{js,jsx,ts,tsx,json,css}, name, packageManager, private, type, version (+1 more)

### Community 65 - "denyAdmin"
Cohesion: 0.23
Nodes (12): dynamic, GET(), POST(), dynamic, GET(), POST(), clientIp(), denyAdmin() (+4 more)

### Community 66 - "Deployment"
Cohesion: 0.33
Nodes (5): Deployment, Manual deploy / rollback, Repository configuration, SEO ping, Server prerequisites

### Community 67 - "new-series-anime.tsx"
Cohesion: 0.29
Nodes (5): dynamic, GET(), NewSeriesSkeleton(), NewSeriesAnime(), getAnimePerPage()

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
Cohesion: 0.14
Nodes (25): dynamic, GET(), bodyKey(), DEFAULT_HEADERS, doFetch(), request(), retryDelay(), sha1() (+17 more)

### Community 81 - "toTitle"
Cohesion: 0.15
Nodes (13): alt, contentType, Image(), runtime, size, generateMetadata(), alt, contentType (+5 more)

### Community 82 - "bookmarks/page.tsx"
Cohesion: 0.05
Nodes (85): BookmarksPage(), metadata, metadata, BookmarkButton(), BookmarkButtonProps, BookmarkMetaDialog(), BookmarkMetaDialogProps, BookmarkListRow() (+77 more)

### Community 83 - "status/route.ts"
Cohesion: 0.18
Nodes (17): dynamic, GET(), dynamic, GET(), renderBadge(), COMMIT, dynamic, GET() (+9 more)

### Community 84 - "section-detail.tsx"
Cohesion: 0.24
Nodes (6): EpisodeGallery(), EpisodeGalleryProps, SectionDetail(), ThemeSongsPlayer(), ThemeSongsPlayerProps, parseTotalEpisodes()

### Community 85 - "health/route.ts"
Cohesion: 0.33
Nodes (7): cleanFirstTitle(), dynamic, GET(), probe(), upstream, UpstreamErrorLike, SCRAPE_BASE_URL

### Community 86 - "cache.ts"
Cohesion: 0.20
Nodes (15): onCacheInvalidate(), CachedResult, cachedWithMeta(), ensureInvalidation(), getFromMemoryCache(), getStale(), inFlight, memoryCache (+7 more)

### Community 87 - "renderOgCard"
Cohesion: 0.33
Nodes (6): alt, contentType, Image(), runtime, size, renderOgCard()

### Community 88 - "logger.ts"
Cohesion: 0.18
Nodes (16): dynamic, GET(), currentLevel(), LEVEL_ORDER, logJson(), LogLevel, redact(), rotateIfNeeded() (+8 more)

### Community 89 - "roulette/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 90 - "api/page.tsx"
Cohesion: 0.25
Nodes (6): ApiDocsPage(), ENDPOINTS, metadata, ApiEndpoint, ApiTesterProps, CodeLang

### Community 91 - "metrics.ts"
Cohesion: 0.24
Nodes (13): CIRCUIT_VALUE, dynamic, GET(), counters, getEventLoopLagMs(), getHistogramQuantile(), getHistograms(), getMetrics() (+5 more)

### Community 92 - "search-results.tsx"
Cohesion: 0.28
Nodes (6): EmptyState(), AnimeGrid(), AnimeGridProps, Anime, SearchResultsProps, SortOrder

### Community 93 - "search-index.ts"
Cohesion: 0.08
Nodes (37): CommandPalette(), mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias(), SEARCH_ALIASES, clientSearchCache, useCommandPalette(), UseCommandPaletteResult (+29 more)

### Community 94 - "roulette-content.tsx"
Cohesion: 0.31
Nodes (7): GenreOption, readSpinHistory(), RouletteContent(), RouletteSpin, writeSpinHistory(), ViewTransitionLink(), ViewTransitionLinkProps

### Community 95 - "home-content.tsx"
Cohesion: 0.14
Nodes (12): dynamic, DetailHero(), TrendingEntry, TrendingRail(), compute(), getBlurDataUrl(), memory, HomeHeroSection() (+4 more)

### Community 96 - "detail-skeleton.tsx"
Cohesion: 0.36
Nodes (3): DetailDownloadSkeleton(), DetailHeroSkeleton(), DetailSkeleton()

### Community 97 - "stats/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 98 - "audit-meta.mjs"
Cohesion: 0.15
Nodes (11): args, base, baseArg, limit, limitArg, problems, seenDescriptions, seenTitles (+3 more)

### Community 99 - "compare-anime-client.tsx"
Cohesion: 0.17
Nodes (14): CompareAnimeClient(), CompareAnimeClientProps, PRESET_COMPARISONS, Side, CompareAnimeCard(), CompareAnimeCardProps, searchCache, useAnimeSearch() (+6 more)

### Community 100 - "og-card.tsx"
Cohesion: 0.25
Nodes (6): alt, contentType, Image(), runtime, size, OgCardOptions

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

### Community 109 - "download-platform.tsx"
Cohesion: 0.43
Nodes (5): CopyButton(), CopyButtonProps, DownloadPlatform(), getPlatformStyle(), requiresLogin()

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

### Community 128 - "animeSlug"
Cohesion: 0.43
Nodes (5): FeaturedHero(), FeaturedHeroProps, RecommendedAnime(), getRecommendations(), animeSlug()

### Community 135 - ".next/**"
Cohesion: 0.14
Nodes (8): .next/**, metadata, metadata, SECTIONS, dotClass(), metadata, revalidate, StatusPage()

### Community 136 - "offline-indicator.tsx"
Cohesion: 0.60
Nodes (5): getCacheServedSnapshot(), getOnlineSnapshot(), OfflineIndicator(), subscribeCacheServed(), subscribeOnline()

## Knowledge Gaps
- **581 isolated node(s):** `revalidate`, `NAV_KEY_MAP`, `TICKER_ITEMS`, `TrendingEntry`, `FallbackExtractResult` (+576 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `app/layout.tsx`, `[page]/page.tsx`, `[year]/page.tsx`, `site.ts`, `update/page.tsx`, `seo.ts`, `release-inbox.ts`, `bookmarks/page.tsx`, `ignore`, `vitals-reporter.ts`, `api/page.tsx`, `endpointSlug`, `home-content.tsx`, `safeJsonLd`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `.next/**`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `revalidate`, `NAV_KEY_MAP`, `TICKER_ITEMS` to the rest of the system?**
  _581 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sanitize.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07074504442925496 - nodes in this community are weakly interconnected._
- **Should `main-layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._