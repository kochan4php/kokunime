# Kokunime

Download anime batches and episodes, all with Indonesian subtitles.

This site is just a collection of download links — there's no streaming player here. You get an anime list, details, per-resolution download links, plus search and recommendations.

## Getting started

You'll need Node.js and pnpm.

```bash
git clone https://github.com/kochan4php/kokunime.git
cd kokunime

npm i -g pnpm   # if you don't have it
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker

```bash
pnpm docker:up     # build and start the container
pnpm docker:down   # stop the container
```

The production image is built with pnpm multi-stage + Next.js standalone output, so it stays slim. The compose file ships with a healthcheck and resource limits.

## Env

| Variable               | What it's for                  | Default                        |
| ---------------------- | ------------------------------ | ------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | canonical, sitemap, Open Graph | `https://kokunime.netlify.app` |

## Architecture

This is a scraper site: server components pull data from [kusonime.com](https://kusonime.com) through the scraper in `src/services/scraper/`, parse it with cheerio, and cache it with `unstable_cache` (15–60 min TTL). The home page is ISR (15 min); anime detail pages are ISR (15 min) too. There are no public API routes — the frontend never calls `/api/*`.

Key perf/SEO choices:

- `next/image` optimization enabled (remote images resized/compressed server-side)
- JSON-LD: `WebSite` + `SearchAction` (layout), `TVSeries` + `BreadcrumbList` (detail pages)
- Detail pages return 404 when the upstream scrape fails, instead of rendering empty junk
- Search pages are `noindex`

## Scripts

- `pnpm dev` — dev server
- `pnpm build` — production build
- `pnpm start` — run the production build
- `pnpm lint` — ESLint
- `pnpm prettier:fix` — format everything
- `pnpm docker:up` / `pnpm docker:down` — start / stop the container
