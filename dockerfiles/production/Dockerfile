FROM node:lts-alpine AS base

# Build stage
FROM base AS builder
WORKDIR /app
COPY package.json .
RUN npm i --frozen-lockfile
COPY . .
RUN npm run build

# Production stage
FROM base AS production
RUN npm uninstall -g yarn
WORKDIR /usr/src/app
COPY --from=builder /app/.next /usr/src/app/.next
COPY --from=builder /app/public /usr/src/app/public
COPY --from=builder /app/next.config.mjs /usr/src/app/next.config.mjs
COPY --from=builder /app/package.json /usr/src/app/package.json
RUN npm install --omit=dev
EXPOSE 3000
ENV NODE_ENV=production
ENTRYPOINT [ "npm", "run" ]
CMD [ "start" ]
