FROM node:lts-alpine AS base

# Build stage
FROM base AS builder
RUN npm i -g pnpm
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm i --frozen-lockfile
COPY . .
RUN pnpm build

# Production stage
FROM base AS production
RUN npm i -g pnpm
WORKDIR /app
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/next.config.mjs /app/next.config.mjs
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-lock.yaml
RUN pnpm i --prod --frozen-lockfile
EXPOSE 3000
ENV NODE_ENV production
ENTRYPOINT [ "pnpm", "run" ]
CMD [ "start" ]
