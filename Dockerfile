FROM node:lts-alpine3.18 AS base

# Install dependencies only
FROM base AS deps
RUN apk add --no-cache libc6-compat
RUN npm i -g pnpm
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm i --prod --frozen-lockfile

# Rebuild the source code
FROM base AS builder
RUN npm i -g pnpm
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY . /app/
RUN pnpm build

# Production Image
FROM base AS runner
RUN npm i -g pnpm
WORKDIR /app
COPY --from=builder /app/. /app/.
EXPOSE 3000
ENV NODE_ENV production
ENTRYPOINT [ "pnpm", "run" ]
CMD [ "start" ]
