FROM node:lts-alpine AS base

FROM base AS builder
WORKDIR /usr/src/app
COPY . .
RUN npm i --frozen-lockfile
RUN npm uninstall -g yarn
ENV NEXT_PUBLIC_KUSONIME_API=https://brick-red-cricket-gown.cyclic.app/api
EXPOSE 3000
ENTRYPOINT [ "npm", "run" ]
CMD [ "dev" ]
