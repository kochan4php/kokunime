# Graph Report - kokunime  (2026-10-18)

## Corpus Check
- 466 files · ~138,871 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1861 nodes · 4132 edges · 137 communities (125 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `98665132`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sanitize.ts
- main-layout.tsx
- redis.ts
- icons/index.ts
- season-year-group.tsx
- scripts
- useTranslation
- settings-typography-section.tsx
- style
- site.ts
- devDependencies
- endpointSlug
- stats-content.tsx
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
- sitemap-entries.ts
- rules
- safeJsonLd
- settings.ts
- genres-explorer.tsx
- history.ts
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
- sync-codec.ts
- post-commit
- post-checkout
- [season]/opengraph-image.tsx
- animeSlug
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
- [genre]/opengraph-image.tsx
- bookmarks/page.tsx
- uptime.ts
- [year]/page.tsx
- health/route.ts
- showToast
- app/opengraph-image.tsx
- cache.ts
- roulette/opengraph-image.tsx
- api/page.tsx
- metrics.ts
- search-results.tsx
- search-index.ts
- bookmarks.ts
- home-content.tsx
- detail-skeleton.tsx
- stats/opengraph-image.tsx
- audit-meta.mjs
- compare-anime-client.tsx
- update/opengraph-image.tsx
- 🚑 RUNBOOK — Kokunime Operations
- wrapped/opengraph-image.tsx
- navbar.tsx
- 🚀 API Quickstart
- Arsitektur
- scan-secrets.mjs
- update/page.tsx
- [year]/opengraph-image.tsx
- bookmarks-status-filters.tsx
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
- bookmarks-folder-bar.tsx
- rollback.sh
- commit-msg
- check-commit-msg.mjs
- lint-staged-chunk.mjs
- .next/**
- og-card.tsx

## God Nodes (most connected - your core abstractions)
1. `useTranslation()` - 50 edges
2. `.next/**` - 29 edges
3. `animeSlug()` - 28 edges
4. `SITE_URL` - 28 edges
5. `checkEtagMatch()` - 27 edges
6. `generateEtag()` - 27 edges
7. `checkRateLimit()` - 25 edges
8. `endpointSlug()` - 25 edges
9. `safeJsonLd()` - 25 edges
10. `scripts` - 25 edges

## Surprising Connections (you probably didn't know these)
- `WrappedContent()` --indirect_call--> `getBookmarks()`  [INFERRED]
  src/components/wrapped-content.tsx → src/utils/bookmarks.ts
- `WrappedContent()` --indirect_call--> `getHistory()`  [INFERRED]
  src/components/wrapped-content.tsx → src/utils/history.ts
- `BookmarkMetaDialogProps` --references--> `BookmarkItem`  [EXTRACTED]
  src/components/bookmark-meta-dialog.tsx → src/utils/bookmarks.ts
- `Image()` --calls--> `renderOgCard()`  [EXTRACTED]
  src/app/update/opengraph-image.tsx → src/lib/og-card.tsx
- `Image()` --calls--> `renderOgCard()`  [EXTRACTED]
  src/app/wrapped/opengraph-image.tsx → src/lib/og-card.tsx

## Import Cycles
- None detected.

## Communities (137 total, 12 thin omitted)

### Community 0 - "sanitize.ts"
Cohesion: 0.06
Nodes (54): alt, contentType, Image(), runtime, size, mergeSearchResults(), normalizeSearchTerm(), resolveSearchAlias() (+46 more)

### Community 1 - "main-layout.tsx"
Cohesion: 0.10
Nodes (13): CardSkeleton(), GridSkeleton(), GridSkeletonProps, FloatingTopButton(), HoneypotTrap(), getCacheServedSnapshot(), getOnlineSnapshot(), OfflineIndicator() (+5 more)

### Community 2 - "redis.ts"
Cohesion: 0.25
Nodes (13): ensureSubscriber(), getRedis(), handleInvalidateMessage(), INSTANCE_ID, makeClient(), onCacheInvalidate(), publishCacheInvalidate(), RedisClient (+5 more)

### Community 3 - "icons/index.ts"
Cohesion: 0.07
Nodes (28): ArrowUpRightIcon(), ChevronLeftIcon(), ChevronRightIcon(), DownloadIcon(), SearchIcon(), IconProps, Input(), BeforeInstallPromptEvent (+20 more)

### Community 4 - "season-year-group.tsx"
Cohesion: 0.28
Nodes (6): Recommendation, Season, SeasonYearGroup(), SeasonYearGroupProps, TaxonomyCard(), TaxonomyCardProps

### Community 5 - "scripts"
Cohesion: 0.08
Nodes (25): scripts, audit:client, audit:meta, backup:cache, build, bundle:budget, changelog, dev (+17 more)

### Community 6 - "useTranslation"
Cohesion: 0.14
Nodes (16): DetailToc(), SECTIONS, CompareAnimeCard(), CompareAnimeCardProps, CompareGenreAnalysis(), CompareGenreAnalysisProps, CompareSpecsTable(), CompareSpecsTableProps (+8 more)

### Community 7 - "settings-typography-section.tsx"
Cohesion: 0.14
Nodes (17): SettingsAboutSection(), SettingsAppearanceSection(), SettingsAppearanceSectionProps, SettingsCatalogSection(), SettingsCatalogSectionProps, SettingsLanguageSection(), SettingsLanguageSectionProps, SettingsSectionHeader() (+9 more)

### Community 8 - "style"
Cohesion: 0.22
Nodes (9): style, noNonNullAssertion, noUnusedTemplateLiteral, useConst, useImportType, useNodejsImportProtocol, useNumberNamespace, useSelfClosingElements (+1 more)

### Community 9 - "site.ts"
Cohesion: 0.10
Nodes (16): RFC-9116, dynamic, POST(), dynamic, dynamic, metadata, MAX_REVALIDATE_PATHS, sanitizeRevalidatePaths() (+8 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (25): axe-core, @biomejs/biome, jsdom, lint-staged, devDependencies, axe-core, @biomejs/biome, jsdom (+17 more)

### Community 11 - "endpointSlug"
Cohesion: 0.15
Nodes (11): DetailMeta(), MetaItemProps, chipColors, GenreTags(), getSeasonInfo(), SEASON_META, SeasonsExplorer(), SeasonsExplorerProps (+3 more)

### Community 12 - "stats-content.tsx"
Cohesion: 0.13
Nodes (21): metadata, metadata, MiniBarChartProps, MiniBarDatum, dayKey(), formatWatchTime(), MONTHS_SHORT, SERVER_EMPTY (+13 more)

### Community 13 - "scraper/index.ts"
Cohesion: 0.06
Nodes (78): RFC-9457, BulkResult, cleanSlugs(), DETAIL_FIELDS, GET(), guardRequest(), POST(), POST_DEPRECATION_HEADERS (+70 more)

### Community 14 - "compilerOptions"
Cohesion: 0.06
Nodes (32): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, tailwind.config.js, **/*.ts (+24 more)

### Community 15 - "seo.ts"
Cohesion: 0.17
Nodes (12): Anime(), generateMetadata(), revalidate, buildDetailMetadata(), buildAnimeJsonLd(), buildBreadcrumbJsonLd(), buildFaqJsonLd(), buildItemListJsonLd() (+4 more)

### Community 16 - "save-offline-button.tsx"
Cohesion: 0.33
Nodes (13): OfflinePage(), registerRefreshSync(), SaveOfflineButton(), SaveOfflineButtonProps, askServiceWorker(), listSavedOffline(), readMetaDirect(), removeOfflineEntry() (+5 more)

### Community 17 - "formatter"
Cohesion: 0.40
Nodes (5): quoteStyle, semicolons, trailingCommas, javascript, formatter

### Community 18 - "release-inbox.ts"
Cohesion: 0.06
Nodes (43): metadata, AdminDashboard(), FeatureFlagView, PRESET_PATHS, CommandPalette(), EMPTY, InboxBell(), BeforeInstallPromptEvent (+35 more)

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
Cohesion: 0.22
Nodes (3): revalidate, RecommendedSkeleton(), HomeSkeleton()

### Community 27 - "detail-hero.tsx"
Cohesion: 0.18
Nodes (6): DetailHeroProps, DetailHeroViewProps, ShareButtonProps, TrailerButtonProps, VerticalJapaneseTitle(), VerticalJapaneseTitleProps

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
Cohesion: 0.12
Nodes (20): ApiDocsPage(), ComparePage(), ComparePageProps, dynamic, metadata, GenresPage(), SeasonsPage(), SeasonPage() (+12 more)

### Community 32 - "settings.ts"
Cohesion: 0.19
Nodes (20): DEFAULT_STORAGE, formatQuota(), SettingsPageContent(), SettingsStorageSection(), SettingsStorageSectionProps, ACCENT_PRESETS, AccentColor, applySettingsToDom() (+12 more)

### Community 33 - "genres-explorer.tsx"
Cohesion: 0.16
Nodes (13): WatchOrderTimeline(), WatchOrderTimelineProps, GENRE_DICTIONARY, GenreMeta, GenresExplorer(), GenresExplorerProps, getGenreMeta(), AnimeDetail (+5 more)

### Community 34 - "history.ts"
Cohesion: 0.33
Nodes (11): BookmarksPage(), EMPTY_HISTORY, EMPTY_PROGRESS, HomeHistoryStrip(), clearAllHistory(), EMPTY_HISTORY, getHistory(), getStorage() (+3 more)

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
Cohesion: 0.18
Nodes (12): dynamic, generateMetadata(), GenrePage(), dynamic, generateMetadata(), Breadcrumbs(), Crumb, getSeasonWindow() (+4 more)

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
Cohesion: 0.07
Nodes (35): jetBrainsMono, plusJakartaSans, RootLayout(), viewport, RouteAnnouncer(), rules, SpeculationRules(), ServiceWorkerRegister() (+27 more)

### Community 51 - "interfaces/index.ts"
Cohesion: 0.05
Nodes (61): BatchDownloadTools(), BatchDownloadToolsProps, ContinueWatching(), ContinueWatchingProps, jumpToEpisode(), CopyButton(), CopyButtonProps, calculateTime() (+53 more)

### Community 57 - "renderOgCard"
Cohesion: 0.33
Nodes (6): alt, contentType, Image(), runtime, size, renderOgCard()

### Community 58 - "sync-codec.ts"
Cohesion: 0.18
Nodes (7): BookmarksBulkBarProps, EmptyStateProps, decodeSyncPayload(), encodeSyncPayload(), fromBase64Url(), SyncPayload, toBase64Url()

### Community 59 - "post-commit"
Cohesion: 0.40
Nodes (4): post-commit script, GRAPHIFY_CHANGED, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 60 - "post-checkout"
Cohesion: 0.50
Nodes (3): post-checkout script, GRAPHIFY_REBUILD_LOG, PYTHONHASHSEED

### Community 61 - "[season]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 62 - "animeSlug"
Cohesion: 0.15
Nodes (15): AnimeImage(), AnimeImageProps, AnimeSearchField(), AnimeSearchFieldProps, GenreOption, readSpinHistory(), RouletteContent(), RouletteSpin (+7 more)

### Community 63 - "ADR 0001 — Three-tier cache with stale-while-revalidate"
Cohesion: 0.40
Nodes (4): ADR 0001 — Three-tier cache with stale-while-revalidate, Consequences, Context, Decision

### Community 64 - "package.json"
Cohesion: 0.20
Nodes (9): author, lint-staged, **/*.{js,jsx,ts,tsx,json,css}, name, packageManager, private, type, version (+1 more)

### Community 65 - "denyAdmin"
Cohesion: 0.14
Nodes (22): dynamic, GET(), POST(), dynamic, GET(), POST(), clientIp(), denyAdmin() (+14 more)

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
Cohesion: 0.15
Nodes (23): bodyKey(), DEFAULT_HEADERS, doFetch(), request(), retryDelay(), sha1(), toHeaderRecord(), UpstreamRequestConfig (+15 more)

### Community 81 - "[genre]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 82 - "bookmarks/page.tsx"
Cohesion: 0.22
Nodes (16): BookmarkListRow(), BookmarkListRowProps, BookmarksDayList(), BookmarksDayListProps, BookmarksGridViewProps, BookmarksToolbarProps, CollectionTab, SERVER_BOOKMARKS (+8 more)

### Community 83 - "uptime.ts"
Cohesion: 0.17
Nodes (17): dynamic, GET(), dynamic, GET(), renderBadge(), dotClass(), metadata, revalidate (+9 more)

### Community 84 - "[year]/page.tsx"
Cohesion: 0.40
Nodes (3): collectYearAnime(), revalidate, YearPage()

### Community 85 - "health/route.ts"
Cohesion: 0.33
Nodes (7): cleanFirstTitle(), dynamic, GET(), probe(), upstream, UpstreamErrorLike, SCRAPE_BASE_URL

### Community 86 - "showToast"
Cohesion: 0.60
Nodes (4): BookmarkMetaDialog(), BookmarkMetaDialogProps, updateBookmarkUserMeta(), showToast()

### Community 87 - "app/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 88 - "cache.ts"
Cohesion: 0.10
Nodes (30): dynamic, GET(), currentLevel(), LEVEL_ORDER, logJson(), LogLevel, redact(), rotateIfNeeded() (+22 more)

### Community 89 - "roulette/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 90 - "api/page.tsx"
Cohesion: 0.29
Nodes (5): ENDPOINTS, metadata, ApiEndpoint, ApiTesterProps, CodeLang

### Community 91 - "metrics.ts"
Cohesion: 0.16
Nodes (21): CIRCUIT_VALUE, dynamic, GET(), dynamic, GET(), COMMIT, dynamic, GET() (+13 more)

### Community 92 - "search-results.tsx"
Cohesion: 0.15
Nodes (10): EmptyState(), ReadingFocusMode(), ReadingFocusModeProps, AnimeGrid(), AnimeGridProps, Reveal(), RevealProps, Anime (+2 more)

### Community 93 - "search-index.ts"
Cohesion: 0.31
Nodes (10): compact(), getIndexSnapshot(), IndexedAnime, rankIndexItems(), searchLocalIndex(), suggestLocal(), SimilarAnime(), ParsedQuery (+2 more)

### Community 94 - "bookmarks.ts"
Cohesion: 0.19
Nodes (22): BookmarkButton(), BookmarkButtonProps, CardAnime(), ViewTransitionLink(), ViewTransitionLinkProps, parseAniListJson(), parseMalXml(), serializeMalXml() (+14 more)

### Community 95 - "home-content.tsx"
Cohesion: 0.15
Nodes (11): dynamic, DetailHero(), TrendingEntry, TrendingRail(), compute(), getBlurDataUrl(), memory, HomeHeroSection() (+3 more)

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
Cohesion: 0.21
Nodes (12): CompareAnimeClient(), CompareAnimeClientProps, PRESET_COMPARISONS, Side, searchCache, useAnimeSearch(), UseAnimeSearchResult, extractYear() (+4 more)

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
Cohesion: 0.27
Nodes (7): BUCKET_META, metadata, revalidate, AgeBucket, NUMBER_WORDS, parseRelativeAge(), RelativeAge

### Community 108 - "[year]/opengraph-image.tsx"
Cohesion: 0.33
Nodes (5): alt, contentType, Image(), runtime, size

### Community 109 - "bookmarks-status-filters.tsx"
Cohesion: 0.60
Nodes (4): BookmarksStatusFilters(), BookmarksStatusFiltersProps, chipClass(), BookmarkStatus

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

### Community 128 - "bookmarks-folder-bar.tsx"
Cohesion: 0.67
Nodes (3): BookmarksFolderBar(), BookmarksFolderBarProps, folderChipClass()

### Community 135 - ".next/**"
Cohesion: 0.17
Nodes (8): .next/**, metadata, metadata, SECTIONS, generateMetadata(), SearchAnime(), buildSearchMetadata(), decodeQuery()

## Knowledge Gaps
- **580 isolated node(s):** `revalidate`, `metadata`, `ENDPOINTS`, `metadata`, `SECTIONS` (+575 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `[page]/page.tsx`, `[season]/page.tsx`, `site.ts`, `update/page.tsx`, `stats-content.tsx`, `seo.ts`, `toast.ts`, `release-inbox.ts`, `uptime.ts`, `[year]/page.tsx`, `ignore`, `vitals-reporter.ts`, `api/page.tsx`, `sitemap-entries.ts`, `home-content.tsx`, `safeJsonLd`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `ignore` connect `ignore` to `.next/**`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `files` connect `ignore` to `biome.json`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `useTranslation()` (e.g. with `getStoredLanguage()` and `setStoredLanguage()`) actually correct?**
  _`useTranslation()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `revalidate`, `metadata`, `ENDPOINTS` to the rest of the system?**
  _580 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sanitize.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06001021450459653 - nodes in this community are weakly interconnected._
- **Should `main-layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0953058321479374 - nodes in this community are weakly interconnected._