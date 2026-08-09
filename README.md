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

## API

Every page pulls data from the internal API:

- `GET /api/anime?page=N` — anime list + pagination
- `GET /api/anime/[slug]` — anime detail
- `GET /api/search?q=` — search anime
- `GET /api/recommendations` — recommendations
- `GET /api/genres` — genre list
- `GET /api/genres/[genre]?page=N` — anime by genre
- `GET /api/seasons` — season list
- `GET /api/seasons/[season]?page=N` — anime by season

## Scripts

- `pnpm dev` — dev server
- `pnpm build` — production build
- `pnpm start` — run the production build
- `pnpm lint` — ESLint
- `pnpm prettier:fix` — format everything
- `pnpm docker:up` / `pnpm docker:down` — start / stop the container
